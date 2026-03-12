<?php

class Paint_Store_WooCommerce {

	private $plugin_name;
	private $version;

	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	// ==========================================
	// SINGLE PRODUCT PAGE OVERRIDE
	// ==========================================

	public function override_single_product_summary() {
		if ( ! function_exists( 'is_product' ) || ! is_product() ) return;

		global $post, $wpdb;
		$family = $wpdb->get_row( $wpdb->prepare( "SELECT id FROM {$wpdb->prefix}ps_product_families WHERE wc_product_id = %d", $post->ID ) );

		if ( $family ) {
			// Remove ALL default WooCommerce layouts and sidesbars
			remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
			remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
			remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );

			// Remove default single product components
			remove_action( 'woocommerce_before_single_product_summary', 'woocommerce_show_product_images', 20 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_title', 5 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_rating', 10 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_sharing', 50 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
			remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_product_data_tabs', 10 );
			remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_upsell_display', 15 );
			remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_related_products', 20 );

			// Inject theme's exact site-container as the wrapper
			add_action( 'woocommerce_before_main_content', function() {
				echo '<main class="site-container">';
			}, 10 );

			add_action( 'woocommerce_after_main_content', function() {
				echo '</main>';
			}, 10 );

			add_action( 'woocommerce_single_product_summary', function() use ( $family ) {
				echo '<style>
					/* Clean up residual generic woo constraints */
					.woocommerce div.product { margin-bottom: 0 !important; }
					.woocommerce #content div.product div.summary, .woocommerce div.product div.summary, .woocommerce-page #content div.product div.summary, .woocommerce-page div.product div.summary {
						width: 100% !important; float: none !important; margin: 0 !important; padding: 0 !important; max-width: none !important; clear: both !important;
					}
					.woocommerce #content div.product div.images, .woocommerce div.product div.images, .woocommerce-page #content div.product div.images, .woocommerce-page div.product div.images {
						display: none !important;
					}
				</style>';
				echo do_shortcode( '[paint_store_builder family_id="' . esc_attr( $family->id ) . '"]' );
			}, 10 );
		}
	}

	// ==========================================
	// CART & CHECKOUT META
	// ==========================================

	public function get_item_data( $item_data, $cart_item ) {
		if ( isset( $cart_item['paint_custom_color'] ) && !empty( $cart_item['paint_custom_color']['name'] ) ) {
			$item_data[] = array(
				'key'     => 'Paint Color',
				'value'   => $cart_item['paint_custom_color']['name'],
				'display' => '<span style="display:inline-block;width:15px;height:15px;background-color:' . esc_attr( $cart_item['paint_custom_color']['hex'] ) . ';border:1px solid #ccc;margin-right:5px;vertical-align:middle;"></span>' . esc_html( $cart_item['paint_custom_color']['name'] ),
			);
		}
		if ( isset( $cart_item['ps_custom_width'] ) && !empty( $cart_item['ps_custom_width'] ) ) {
			$item_data[] = array(
				'key'     => 'Width / Size',
				'value'   => $cart_item['ps_custom_width'],
			);
		}
		return $item_data;
	}

	public function checkout_create_order_line_item( $item, $cart_item_key, $values, $order ) {
		if ( isset( $values['paint_custom_color'] ) && !empty( $values['paint_custom_color']['name'] ) ) {
			$item->add_meta_data( 'Paint Color', $values['paint_custom_color']['name'] );
		}
		if ( isset( $values['ps_custom_width'] ) && !empty( $values['ps_custom_width'] ) ) {
			$item->add_meta_data( 'Width / Size', $values['ps_custom_width'] );
		}
	}

}
