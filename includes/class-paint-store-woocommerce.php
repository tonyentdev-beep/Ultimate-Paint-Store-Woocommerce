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
		// Remove default price from loop (try multiple priorities)
		remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
		remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 15 );
		// Remove default add to cart / select options button
		remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
		// Remove rating (we add our own)
		remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5 );
		// Remove sorting dropdown
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );
		// Remove result count
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );

		// Add our filter bar above the product loop
		add_action( 'woocommerce_before_shop_loop', array( $this, 'render_filter_bar' ), 15 );

		// Add star rating after title
		add_action( 'woocommerce_after_shop_loop_item_title', array( $this, 'loop_product_rating' ), 5 );
		// Add short description after rating
		add_action( 'woocommerce_after_shop_loop_item_title', array( $this, 'loop_short_description' ), 15 );
		// Add custom buttons (View Details + Buy Now)
		add_action( 'woocommerce_after_shop_loop_item', array( $this, 'loop_custom_buttons' ), 10 );
	}

	/**
	 * Filter products via pre_get_posts based on query params
	 */
	public function filter_plp_query( $query ) {
		if ( is_admin() || ! $query->is_main_query() ) return;
		if ( ! ( is_shop() || is_product_category() || is_product_taxonomy() ) ) return;

		// Filter by product category
		$filter_cat = isset( $_GET['ps_category'] ) ? sanitize_text_field( $_GET['ps_category'] ) : '';
		if ( ! empty( $filter_cat ) ) {
			$tax_query = $query->get( 'tax_query', array() );
			$tax_query[] = array(
				'taxonomy' => 'product_cat',
				'field'    => 'slug',
				'terms'    => $filter_cat,
			);
			$query->set( 'tax_query', $tax_query );
		}

		// Filter by sheen attribute
		$filter_sheen = isset( $_GET['ps_sheen'] ) ? sanitize_text_field( $_GET['ps_sheen'] ) : '';
		if ( ! empty( $filter_sheen ) ) {
			$tax_query = $query->get( 'tax_query', array() );
			$tax_query[] = array(
				'taxonomy' => 'pa_paint_sheen',
				'field'    => 'slug',
				'terms'    => $filter_sheen,
			);
			$query->set( 'tax_query', $tax_query );
		}

		// Remove sorting - force default
		$query->set( 'orderby', 'title' );
		$query->set( 'order', 'ASC' );
	}

	/**
	 * Render the filter bar above the product grid.
	 * Only shows categories/sheens that are actually used by products in the current context.
	 */
	public function render_filter_bar() {
		$current_url = remove_query_arg( array( 'ps_category', 'ps_sheen' ) );
		$active_cat = isset( $_GET['ps_category'] ) ? sanitize_text_field( $_GET['ps_category'] ) : '';
		$active_sheen = isset( $_GET['ps_sheen'] ) ? sanitize_text_field( $_GET['ps_sheen'] ) : '';

		// Get product IDs visible in the current context (before our filters)
		$context_product_ids = $this->get_context_product_ids();

		// Get relevant categories (only those assigned to products in current context)
		$relevant_cats = $this->get_relevant_terms( $context_product_ids, 'product_cat' );
		// Get relevant sheens
		$relevant_sheens = $this->get_relevant_terms( $context_product_ids, 'pa_paint_sheen' );

		echo '<div class="ps-filter-bar">';
		
		// Category filter
		if ( ! empty( $relevant_cats ) ) {
			echo '<div class="ps-filter-group">';
			echo '<label class="ps-filter-label">Category</label>';
			echo '<select class="ps-filter-select" onchange="psApplyFilter(\'ps_category\', this.value)">';
			echo '<option value="">All Categories</option>';
			foreach ( $relevant_cats as $cat ) {
				$selected = ( $active_cat === $cat->slug ) ? ' selected' : '';
				echo '<option value="' . esc_attr( $cat->slug ) . '"' . $selected . '>' . esc_html( $cat->name ) . ' (' . $cat->count . ')</option>';
			}
			echo '</select>';
			echo '</div>';
		}

		// Sheen filter
		if ( ! empty( $relevant_sheens ) ) {
			echo '<div class="ps-filter-group">';
			echo '<label class="ps-filter-label">Sheen</label>';
			echo '<select class="ps-filter-select" onchange="psApplyFilter(\'ps_sheen\', this.value)">';
			echo '<option value="">All Sheens</option>';
			foreach ( $relevant_sheens as $sheen ) {
				$selected = ( $active_sheen === $sheen->slug ) ? ' selected' : '';
				echo '<option value="' . esc_attr( $sheen->slug ) . '"' . $selected . '>' . esc_html( $sheen->name ) . '</option>';
			}
			echo '</select>';
			echo '</div>';
		}

		// Clear filters button
		if ( $active_cat || $active_sheen ) {
			echo '<div class="ps-filter-group">';
			echo '<a href="' . esc_url( $current_url ) . '" class="ps-btn ps-btn-clear">Clear Filters</a>';
			echo '</div>';
		}

		echo '</div>';

		// JavaScript for filter application
		echo '<script>
		function psApplyFilter(param, value) {
			var url = new URL(window.location.href);
			if (value) {
				url.searchParams.set(param, value);
			} else {
				url.searchParams.delete(param);
			}
			window.location.href = url.toString();
		}
		</script>';
	}

	/**
	 * Get product IDs in the current context (brand/category/shop page) WITHOUT our custom filters
	 */
	private function get_context_product_ids() {
		$args = array(
			'post_type'      => 'product',
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'post_status'    => 'publish',
		);

		// If on a category archive, limit to that category
		if ( is_product_category() ) {
			$current_cat = get_queried_object();
			if ( $current_cat ) {
				$args['tax_query'] = array(
					array(
						'taxonomy' => 'product_cat',
						'field'    => 'term_id',
						'terms'    => $current_cat->term_id,
					),
				);
			}
		}

		// If on a brand archive
		if ( is_tax( 'product_brand' ) ) {
			$current_brand = get_queried_object();
			if ( $current_brand ) {
				$args['tax_query'] = array(
					array(
						'taxonomy' => 'product_brand',
						'field'    => 'term_id',
						'terms'    => $current_brand->term_id,
					),
				);
			}
		}

		$query = new WP_Query( $args );
		return $query->posts;
	}

	/**
	 * Get taxonomy terms that are actually assigned to the given product IDs
	 */
	private function get_relevant_terms( $product_ids, $taxonomy ) {
		if ( empty( $product_ids ) ) return array();

		$terms = wp_get_object_terms( $product_ids, $taxonomy, array(
			'orderby' => 'name',
			'order'   => 'ASC',
		) );

		if ( is_wp_error( $terms ) ) return array();

		// Deduplicate and count
		$unique = array();
		foreach ( $terms as $term ) {
			if ( ! isset( $unique[ $term->term_id ] ) ) {
				$unique[ $term->term_id ] = $term;
			}
		}

		return array_values( $unique );
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
		/* Force-hide any remaining default WooCommerce elements */
		.woocommerce ul.products li.product .price,
		.woocommerce ul.products li.product .woocommerce-Price-amount,
		.woocommerce ul.products li.product a.button,
		.woocommerce ul.products li.product a.add_to_cart_button,
		.woocommerce ul.products li.product .add_to_cart_button,
		.woocommerce .woocommerce-ordering,
		.woocommerce .woocommerce-result-count {
			display: none !important;
		}

		/* Filter Bar Styles */
		.ps-filter-bar {
			display: flex;
			align-items: flex-end;
			gap: 16px;
			flex-wrap: wrap;
			padding: 20px 24px;
			background: #f8f9fa;
			border: 1px solid #e8e8e8;
			border-radius: 10px;
			margin-bottom: 24px;
		}
		.ps-filter-group {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}
		.ps-filter-label {
			font-size: 12px;
			font-weight: 600;
			color: #555;
			text-transform: uppercase;
			letter-spacing: 0.5px;
		}
		.ps-filter-select {
			padding: 8px 32px 8px 12px;
			border: 1px solid #ddd;
			border-radius: 6px;
			font-size: 14px;
			background: #fff;
			color: #333;
			cursor: pointer;
			min-width: 180px;
			appearance: auto;
		}
		.ps-filter-select:focus {
			border-color: #2c6e49;
			outline: none;
			box-shadow: 0 0 0 2px rgba(44,110,73,0.15);
		}
		.ps-btn-clear {
			background: #fff;
			color: #d9534f;
			border: 1px solid #d9534f;
			padding: 8px 16px;
			border-radius: 6px;
			font-size: 13px;
			font-weight: 600;
			text-decoration: none;
			transition: all 0.2s ease;
			cursor: pointer;
			white-space: nowrap;
		}
		.ps-btn-clear:hover {
			background: #d9534f;
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
