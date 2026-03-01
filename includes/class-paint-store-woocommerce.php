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
	 * Customize WooCommerce Product Loop (PLP Cards)
	 * Removes default price and add-to-cart, adds short description, stars, and custom buttons.
	 */
	public function customize_product_loop() {
		// Remove default price from loop
		remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
		// Remove default add to cart button
		remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );

		// Add star rating after title
		add_action( 'woocommerce_after_shop_loop_item_title', array( $this, 'loop_product_rating' ), 5 );
		// Add short description after rating
		add_action( 'woocommerce_after_shop_loop_item_title', array( $this, 'loop_short_description' ), 15 );
		// Add custom buttons (View Details + Buy Now)
		add_action( 'woocommerce_after_shop_loop_item', array( $this, 'loop_custom_buttons' ), 10 );
	}

	/**
	 * Display star rating in product loop
	 */
	public function loop_product_rating() {
		global $product;
		if ( ! $product ) return;

		$rating_count = $product->get_rating_count();
		$average      = $product->get_average_rating();

		if ( $rating_count > 0 ) {
			echo '<div class="ps-loop-rating">';
			echo wc_get_rating_html( $average, $rating_count );
			echo '<span class="ps-rating-count">(' . $rating_count . ')</span>';
			echo '</div>';
		} else {
			echo '<div class="ps-loop-rating ps-no-reviews">';
			echo '<span class="ps-rating-count">No reviews yet</span>';
			echo '</div>';
		}
	}

	/**
	 * Display short description in product loop
	 */
	public function loop_short_description() {
		global $product;
		if ( ! $product ) return;

		$short_desc = $product->get_short_description();
		if ( ! empty( $short_desc ) ) {
			// Limit to 120 chars for card
			$trimmed = wp_trim_words( wp_strip_all_tags( $short_desc ), 18, '...' );
			echo '<div class="ps-loop-short-desc">' . esc_html( $trimmed ) . '</div>';
		}
	}

	/**
	 * Display custom buttons in product loop
	 */
	public function loop_custom_buttons() {
		global $product;
		if ( ! $product ) return;

		$link = get_permalink( $product->get_id() );
		echo '<div class="ps-loop-buttons">';
		echo '<a href="' . esc_url( $link ) . '" class="ps-btn ps-btn-details">View Details</a>';
		echo '<a href="' . esc_url( $link ) . '" class="ps-btn ps-btn-buy">Buy Now</a>';
		echo '</div>';
	}

	/**
	 * Enqueue PLP card styles
	 */
	public function enqueue_plp_styles() {
		if ( is_shop() || is_product_category() || is_product_taxonomy() ) {
			wp_add_inline_style( 'woocommerce-general', $this->get_plp_css() );
		}
	}

	/**
	 * PLP card CSS
	 */
	private function get_plp_css() {
		return '
		/* Paint Store PLP Card Styles */
		.woocommerce ul.products li.product {
			border: 1px solid #e8e8e8;
			border-radius: 12px;
			padding: 16px;
			transition: box-shadow 0.3s ease, transform 0.2s ease;
			background: #fff;
		}
		.woocommerce ul.products li.product:hover {
			box-shadow: 0 8px 25px rgba(0,0,0,0.1);
			transform: translateY(-3px);
		}
		.woocommerce ul.products li.product a img {
			border-radius: 8px;
			margin-bottom: 12px;
		}
		.woocommerce ul.products li.product .woocommerce-loop-product__title {
			font-size: 16px;
			font-weight: 700;
			color: #1a1a1a;
			padding: 0;
			margin: 0 0 6px;
		}
		.ps-loop-rating {
			margin-bottom: 8px;
			display: flex;
			align-items: center;
			gap: 5px;
		}
		.ps-loop-rating .star-rating {
			font-size: 13px;
			margin: 0;
		}
		.ps-rating-count {
			font-size: 12px;
			color: #888;
		}
		.ps-no-reviews .ps-rating-count {
			font-style: italic;
			color: #aaa;
			font-size: 12px;
		}
		.ps-loop-short-desc {
			font-size: 13px;
			color: #555;
			line-height: 1.5;
			margin-bottom: 14px;
			min-height: 40px;
		}
		.ps-loop-buttons {
			display: flex;
			gap: 8px;
			margin-top: auto;
		}
		.ps-btn {
			flex: 1;
			text-align: center;
			padding: 10px 14px;
			border-radius: 6px;
			font-size: 13px;
			font-weight: 600;
			text-decoration: none;
			transition: all 0.2s ease;
			cursor: pointer;
			display: inline-block;
		}
		.ps-btn-details {
			background: #f5f5f5;
			color: #333;
			border: 1px solid #ddd;
		}
		.ps-btn-details:hover {
			background: #e8e8e8;
			color: #111;
		}
		.ps-btn-buy {
			background: #2c6e49;
			color: #fff;
			border: 1px solid #2c6e49;
		}
		.ps-btn-buy:hover {
			background: #1e5235;
			color: #fff;
		}
		';
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
