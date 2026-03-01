<?php

class Paint_Store_WooCommerce {

	private $plugin_name;
	private $version;

	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Override the single product page for our Product Families
	 */
	public function override_single_product_summary() {
		if ( ! function_exists( 'is_product' ) || ! is_product() ) {
			return;
		}

		global $post;
		global $wpdb;

		// Check if the current product is one of our Product Families
		$family = $wpdb->get_row( $wpdb->prepare( "SELECT id FROM {$wpdb->prefix}ps_product_families WHERE wc_product_id = %d", $post->ID ) );

		if ( $family ) {
			// Remove the default WooCommerce single product hooks
			remove_action( 'woocommerce_before_single_product_summary', 'woocommerce_show_product_images', 20 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_title', 5 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_rating', 10 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_sharing', 50 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
			
			// Inject our React Product Builder instead
			add_action( 'woocommerce_single_product_summary', function() use ( $family ) {
				echo do_shortcode( '[paint_store_builder family_id="' . esc_attr( $family->id ) . '"]' );
			}, 10 );
		}
	}

	/**
	 * Display custom color data in the Cart
	 */
	public function get_item_data( $item_data, $cart_item ) {
		if ( isset( $cart_item['paint_custom_color'] ) ) {
			$item_data[] = array(
				'key'     => 'Paint Color',
				'value'   => $cart_item['paint_custom_color']['name'],
				'display' => '<span style="display:inline-block;width:15px;height:15px;background-color:' . esc_attr( $cart_item['paint_custom_color']['hex'] ) . ';border:1px solid #ccc;margin-right:5px;vertical-align:middle;"></span>' . esc_html( $cart_item['paint_custom_color']['name'] ),
			);
		}
		return $item_data;
	}

	/**
	 * Save custom color data to the Order Line Items
	 */
	public function checkout_create_order_line_item( $item, $cart_item_key, $values, $order ) {
		if ( isset( $values['paint_custom_color'] ) ) {
			$item->add_meta_data( 'Paint Color', $values['paint_custom_color']['name'] );
		}
	}

}
