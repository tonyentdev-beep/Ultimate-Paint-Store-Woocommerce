<?php

class Paint_Store_Public {

	private $plugin_name;
	private $version;

	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;

		// Add WooCommerce AJAX cart handlers
		add_action( 'wp_ajax_paint_store_add_to_cart', array( $this, 'ajax_add_to_cart' ) );
		add_action( 'wp_ajax_nopriv_paint_store_add_to_cart', array( $this, 'ajax_add_to_cart' ) );

		// WooCommerce Cart & Checkout Hooks
		add_action( 'woocommerce_before_calculate_totals', array( $this, 'set_custom_cart_item_prices' ), 10, 1 );
		add_action( 'woocommerce_cart_calculate_fees', array( $this, 'add_distance_delivery_fee' ), 10, 1 );
		add_action( 'woocommerce_checkout_create_order', array( $this, 'save_fulfillment_order_meta' ), 10, 2 );
	}

	public function enqueue_styles() {
		wp_enqueue_style( $this->plugin_name . '-frontend', plugin_dir_url( dirname( __FILE__ ) ) . 'build/frontend/index.css', array(), $this->version, 'all' );
	}

	public function enqueue_scripts() {
		$asset_file = plugin_dir_path( dirname( __FILE__ ) ) . 'build/frontend/index.asset.php';
		if ( file_exists( $asset_file ) ) {
			$assets = include $asset_file;
			wp_enqueue_script(
				$this->plugin_name . '-frontend',
				plugin_dir_url( dirname( __FILE__ ) ) . 'build/frontend/index.js',
				$assets['dependencies'],
				$assets['version'],
				true
			);

			// Pass Google Maps API key and fulfillment settings to the frontend
			$fulfillment_settings = get_option( 'ps_fulfillment_settings', array() );
			$google_maps_key = isset( $fulfillment_settings['google_maps_api_key'] ) ? $fulfillment_settings['google_maps_api_key'] : '';
			wp_localize_script( $this->plugin_name . '-frontend', 'paintStoreSettings', array(
				'ajaxUrl'           => admin_url( 'admin-ajax.php' ),
				'googleMapsApiKey'  => $google_maps_key,
				'storeLat'          => isset( $fulfillment_settings['store_lat'] ) ? $fulfillment_settings['store_lat'] : '',
				'storeLng'          => isset( $fulfillment_settings['store_lng'] ) ? $fulfillment_settings['store_lng'] : '',
				'deliveryRatePerKm' => isset( $fulfillment_settings['delivery_rate_per_km'] ) ? $fulfillment_settings['delivery_rate_per_km'] : '2.00',
				'currencySymbol'    => isset( $fulfillment_settings['currency_symbol'] ) ? $fulfillment_settings['currency_symbol'] : 'GHS',
			) );
		}
	}

	public function render_builder_shortcode( $atts ) {
		$atts = shortcode_atts( array(
			'family_id' => 0,
		), $atts, 'paint_store_builder' );

		// Enqueue scripts specifically when this shortcode is used if we want, 
		// but they are already enqueued globally via WP enqueue scripts hook above.
		// For performance in the future we could conditionalize enqueue_scripts on has_shortcode.

		ob_start();
		?>
		<div id="paint-store-builder-root" data-family-id="<?php echo esc_attr( $atts['family_id'] ); ?>">
			<p>Loading Product Builder...</p>
		</div>
		<?php
		return ob_get_clean();
	}

	public function ajax_add_to_cart() {
		// Verify WooCommerce is active
		if ( ! class_exists( 'WooCommerce' ) || ! isset( WC()->cart ) ) {
			wp_send_json_error( array( 'message' => 'WooCommerce cart is not available.' ) );
		}

		$product_id   = isset( $_POST['product_id'] ) ? intval( $_POST['product_id'] ) : 0;
		$variation_id = isset( $_POST['variation_id'] ) ? intval( $_POST['variation_id'] ) : 0;
		$quantity     = isset( $_POST['quantity'] ) ? intval( $_POST['quantity'] ) : 1;
		$color_hex    = isset( $_POST['color_hex'] ) ? sanitize_text_field( $_POST['color_hex'] ) : '';
		$color_name   = isset( $_POST['color_name'] ) ? sanitize_text_field( $_POST['color_name'] ) : '';

		if ( ! $product_id || ! $variation_id ) {
			wp_send_json_error( array( 'message' => 'Product ID and Variation ID are required.' ) );
		}

		$fulfillment_method = isset( $_POST['fulfillment_method'] ) ? sanitize_text_field( $_POST['fulfillment_method'] ) : '';
		$delivery_address   = isset( $_POST['delivery_address'] ) ? sanitize_text_field( $_POST['delivery_address'] ) : '';
		$delivery_fee       = isset( $_POST['delivery_fee'] ) ? floatval( $_POST['delivery_fee'] ) : 0;
		$item_price         = isset( $_POST['item_price'] ) ? floatval( $_POST['item_price'] ) : 0;

		if ( $fulfillment_method ) {
			WC()->session->set( 'ps_fulfillment_method', $fulfillment_method );
			if ( $fulfillment_method === 'delivery' ) {
				WC()->session->set( 'ps_delivery_address', $delivery_address );
				WC()->session->set( 'ps_delivery_fee', $delivery_fee );
			} else {
				WC()->session->set( 'ps_delivery_address', '' );
				WC()->session->set( 'ps_delivery_fee', 0 );
			}
		}

		$cart_item_data = array(
			'paint_custom_color' => array(
				'name' => $color_name,
				'hex'  => $color_hex
			),
			'ps_custom_price' => $item_price
		);

		// WooCommerce requires the specific attributes used for this variation
		$variation = wc_get_product( $variation_id );
		$variation_attributes = $variation ? $variation->get_variation_attributes() : array();

		// Add it to the cart
		$cart_item_key = WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation_attributes, $cart_item_data );
		
		if ( $cart_item_key ) {
			wp_send_json_success( array( 
				'cart_item_key' => $cart_item_key,
				'message' => 'Product added to cart.'
			) );
		}

		wp_send_json_error( array( 'message' => 'Failed to add item to cart.' ) );
	}

	public function set_custom_cart_item_prices( $cart ) {
		if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
			return;
		}

		if ( did_action( 'woocommerce_before_calculate_totals' ) >= 2 ) {
			// Do not return here because mini-cart refreshes can cause the price to drop if checked twice.
		}

		foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
			if ( isset( $cart_item['ps_custom_price'] ) && $cart_item['ps_custom_price'] > 0 ) {
				// Explicitly override the price with our React frontend explicitly passed metadata
				$cart_item['data']->set_price( $cart_item['ps_custom_price'] );
			}
		}
	}

	public function add_distance_delivery_fee( $cart ) {
		if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
			return;
		}

		$method = WC()->session->get( 'ps_fulfillment_method' );
		$fee    = WC()->session->get( 'ps_delivery_fee' );

		if ( $method === 'delivery' && $fee > 0 ) {
			$cart->add_fee( __( 'Distance Delivery', 'paint-store' ), $fee, false, 'standard' );
		}
	}

	public function save_fulfillment_order_meta( $order, $data ) {
		$method  = WC()->session->get( 'ps_fulfillment_method' );
		$address = WC()->session->get( 'ps_delivery_address' );

		if ( $method ) {
			$order->update_meta_data( 'Fulfillment Method', ucfirst( $method ) );
			if ( $method === 'delivery' && $address ) {
				$order->update_meta_data( 'Delivery Address', $address );
			}
		}
	}

}
