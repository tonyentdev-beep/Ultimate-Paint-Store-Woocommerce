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
			remove_action( 'woocommerce_before_single_product_summary', 'woocommerce_show_product_images', 20 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_title', 5 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_rating', 10 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_sharing', 50 );
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
			
			add_action( 'woocommerce_single_product_summary', function() use ( $family ) {
				echo do_shortcode( '[paint_store_builder family_id="' . esc_attr( $family->id ) . '"]' );
			}, 10 );
		}
	}

	// ==========================================
	// PLP CUSTOMIZATION (Valspar-Style)
	// ==========================================

	public function customize_product_loop() {
		if ( ! ( is_shop() || is_product_category() || is_product_taxonomy() ) ) return;

		// Remove ALL default WooCommerce loop elements
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
		remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
		remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 15 );
		remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
		remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5 );
		remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
		remove_action( 'woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10 );
		remove_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10 );
		remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5 );

		// Add hero banner
		add_action( 'woocommerce_before_main_content', array( $this, 'render_hero_banner' ), 5 );

		// Add sidebar wrapper before the loop
		add_action( 'woocommerce_before_shop_loop', array( $this, 'render_sidebar_open' ), 5 );

		// Replace each product card with our custom layout
		add_action( 'woocommerce_before_shop_loop_item', array( $this, 'render_product_card' ), 10 );

		// Close sidebar wrapper after the loop
		add_action( 'woocommerce_after_shop_loop', array( $this, 'render_sidebar_close' ), 99 );
	}

	public function filter_plp_query( $query ) {
		if ( is_admin() || ! $query->is_main_query() ) return;
		if ( ! ( is_shop() || is_product_category() || is_product_taxonomy() ) ) return;

		$filter_cat = isset( $_GET['ps_category'] ) ? sanitize_text_field( $_GET['ps_category'] ) : '';
		if ( ! empty( $filter_cat ) ) {
			$tax_query = $query->get( 'tax_query', array() );
			$tax_query[] = array( 'taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => $filter_cat );
			$query->set( 'tax_query', $tax_query );
		}

		$filter_sheen = isset( $_GET['ps_sheen'] ) ? sanitize_text_field( $_GET['ps_sheen'] ) : '';
		if ( ! empty( $filter_sheen ) ) {
			$tax_query = $query->get( 'tax_query', array() );
			$tax_query[] = array( 'taxonomy' => 'pa_paint_sheen', 'field' => 'slug', 'terms' => $filter_sheen );
			$query->set( 'tax_query', $tax_query );
		}

		$query->set( 'orderby', 'title' );
		$query->set( 'order', 'ASC' );
	}

	// ==========================================
	// HERO BANNER
	// ==========================================

	public function render_hero_banner() {
		if ( ! ( is_shop() || is_product_category() || is_product_taxonomy() ) ) return;

		$title = 'Our Products';
		if ( is_product_category() || is_tax() ) {
			$term = get_queried_object();
			if ( $term ) $title = $term->name;
		} elseif ( is_shop() ) {
			$title = 'All Products';
		}

		echo '<div class="ps-hero-banner">';
		echo '<h1 class="ps-hero-title">' . esc_html( strtoupper( $title ) ) . '</h1>';
		echo '</div>';
	}

	// ==========================================
	// SIDEBAR + FILTER
	// ==========================================

	public function render_sidebar_open() {
		$context_ids = $this->get_context_product_ids();
		$relevant_cats = $this->get_relevant_terms( $context_ids, 'product_cat' );
		$relevant_sheens = $this->get_relevant_terms( $context_ids, 'pa_paint_sheen' );

		$active_cat = isset( $_GET['ps_category'] ) ? sanitize_text_field( $_GET['ps_category'] ) : '';
		$active_sheen = isset( $_GET['ps_sheen'] ) ? sanitize_text_field( $_GET['ps_sheen'] ) : '';
		$has_filters = $active_cat || $active_sheen;
		$clear_url = remove_query_arg( array( 'ps_category', 'ps_sheen' ) );

		echo '<div class="ps-plp-wrapper">';

		// Sidebar
		echo '<aside class="ps-plp-sidebar">';
		echo '<div class="ps-sidebar-header">';
		echo '<span class="ps-sidebar-title">Filter By</span>';
		if ( $has_filters ) {
			echo '<a href="' . esc_url( $clear_url ) . '" class="ps-clear-all">Clear All</a>';
		}
		echo '</div>';

		// Category accordion
		if ( ! empty( $relevant_cats ) ) {
			echo '<div class="ps-filter-accordion ps-open">';
			echo '<button class="ps-accordion-header" onclick="this.parentElement.classList.toggle(\'ps-open\');">';
			echo '<span>Product Category</span><span class="ps-accordion-icon"></span>';
			echo '</button>';
			echo '<div class="ps-accordion-body">';
			foreach ( $relevant_cats as $cat ) {
				$checked = ( $active_cat === $cat->slug ) ? ' checked' : '';
				echo '<label class="ps-checkbox-label">';
				echo '<input type="checkbox" class="ps-checkbox" value="' . esc_attr( $cat->slug ) . '"' . $checked . ' onchange="psToggleFilter(\'ps_category\', this.value, this.checked);">';
				echo '<span>' . esc_html( $cat->name ) . '</span>';
				echo '</label>';
			}
			echo '</div></div>';
		}

		// Sheen accordion
		if ( ! empty( $relevant_sheens ) ) {
			echo '<div class="ps-filter-accordion ps-open">';
			echo '<button class="ps-accordion-header" onclick="this.parentElement.classList.toggle(\'ps-open\');">';
			echo '<span>Sheens</span><span class="ps-accordion-icon"></span>';
			echo '</button>';
			echo '<div class="ps-accordion-body">';
			foreach ( $relevant_sheens as $sheen ) {
				$checked = ( $active_sheen === $sheen->slug ) ? ' checked' : '';
				echo '<label class="ps-checkbox-label">';
				echo '<input type="checkbox" class="ps-checkbox" value="' . esc_attr( $sheen->slug ) . '"' . $checked . ' onchange="psToggleFilter(\'ps_sheen\', this.value, this.checked);">';
				echo '<span>' . esc_html( $sheen->name ) . '</span>';
				echo '</label>';
			}
			echo '</div></div>';
		}

		echo '</aside>';

		// Main content area opens
		echo '<div class="ps-plp-content">';

		// JavaScript
		echo '<script>
		function psToggleFilter(param, value, checked) {
			var url = new URL(window.location.href);
			if (checked) { url.searchParams.set(param, value); }
			else { url.searchParams.delete(param); }
			window.location.href = url.toString();
		}
		</script>';
	}

	public function render_sidebar_close() {
		echo '</div>'; // close .ps-plp-content
		echo '</div>'; // close .ps-plp-wrapper
	}

	// ==========================================
	// PRODUCT CARD (Valspar List-View Style)
	// ==========================================

	public function render_product_card() {
		global $product;
		if ( ! $product ) return;

		$link = get_permalink( $product->get_id() );
		$image = $product->get_image( 'woocommerce_thumbnail', array( 'class' => 'ps-card-img' ) );
		$title = $product->get_name();
		$rating_count = $product->get_rating_count();
		$average = $product->get_average_rating();
		$short_desc = $product->get_short_description();

		// Get sheens for this product (from pa_paint_sheen attribute)
		$sheens = wp_get_post_terms( $product->get_id(), 'pa_paint_sheen', array( 'fields' => 'names' ) );
		if ( is_wp_error( $sheens ) ) $sheens = array();

		// Parse bullet features from short description
		$features = array();
		if ( ! empty( $short_desc ) ) {
			// Extract <li> items from the description
			preg_match_all( '/<li[^>]*>(.*?)<\/li>/si', $short_desc, $matches );
			if ( ! empty( $matches[1] ) ) {
				$features = array_map( 'wp_strip_all_tags', $matches[1] );
			} else {
				// Fallback: split by newlines or periods
				$plain = wp_strip_all_tags( $short_desc );
				$features = array_filter( array_map( 'trim', preg_split( '/[\n\r]+/', $plain ) ) );
			}
		}

		echo '<div class="ps-product-card">';

		// Image (left side)
		echo '<div class="ps-card-image-col">';
		echo '<a href="' . esc_url( $link ) . '">' . $image . '</a>';
		echo '</div>';

		// Content (right side)
		echo '<div class="ps-card-content-col">';

		// Title
		echo '<h3 class="ps-card-title"><a href="' . esc_url( $link ) . '">' . esc_html( $title ) . '</a></h3>';

		// Star rating
		echo '<div class="ps-card-rating">';
		if ( $rating_count > 0 ) {
			$full_stars = floor( $average );
			$half = ( $average - $full_stars >= 0.5 ) ? 1 : 0;
			$empty = 5 - $full_stars - $half;
			for ( $i = 0; $i < $full_stars; $i++ ) echo '<span class="ps-star ps-star-full">★</span>';
			if ( $half ) echo '<span class="ps-star ps-star-half">★</span>';
			for ( $i = 0; $i < $empty; $i++ ) echo '<span class="ps-star ps-star-empty">★</span>';
			echo '<span class="ps-rating-num">' . number_format( $average, 1 ) . '</span>';
		} else {
			echo '<span class="ps-no-rating">No reviews yet</span>';
		}
		echo '</div>';

		// Bullet features
		if ( ! empty( $features ) ) {
			echo '<ul class="ps-card-features">';
			foreach ( array_slice( $features, 0, 4 ) as $feature ) {
				echo '<li>' . esc_html( $feature ) . '</li>';
			}
			echo '</ul>';
		}

		// Available Sheens
		if ( ! empty( $sheens ) ) {
			echo '<div class="ps-card-sheens">';
			echo '<strong>Available Sheens</strong>';
			echo '<span>' . esc_html( implode( ', ', $sheens ) ) . '</span>';
			echo '</div>';
		}

		// Buttons
		echo '<div class="ps-card-buttons">';
		echo '<a href="' . esc_url( $link ) . '" class="ps-card-btn ps-btn-view">View Details</a>';
		echo '<a href="' . esc_url( $link ) . '" class="ps-card-btn ps-btn-buy">Buy Now</a>';
		echo '</div>';

		echo '</div>'; // .ps-card-content-col
		echo '</div>'; // .ps-product-card
	}

	// ==========================================
	// HELPER METHODS
	// ==========================================

	private function get_context_product_ids() {
		$args = array(
			'post_type' => 'product', 'posts_per_page' => -1,
			'fields' => 'ids', 'post_status' => 'publish',
		);
		if ( is_product_category() ) {
			$obj = get_queried_object();
			if ( $obj ) $args['tax_query'] = array( array( 'taxonomy' => 'product_cat', 'field' => 'term_id', 'terms' => $obj->term_id ) );
		}
		if ( is_tax( 'product_brand' ) ) {
			$obj = get_queried_object();
			if ( $obj ) $args['tax_query'] = array( array( 'taxonomy' => 'product_brand', 'field' => 'term_id', 'terms' => $obj->term_id ) );
		}
		return ( new WP_Query( $args ) )->posts;
	}

	private function get_relevant_terms( $product_ids, $taxonomy ) {
		if ( empty( $product_ids ) ) return array();
		$terms = wp_get_object_terms( $product_ids, $taxonomy, array( 'orderby' => 'name', 'order' => 'ASC' ) );
		if ( is_wp_error( $terms ) ) return array();
		$unique = array();
		foreach ( $terms as $t ) { if ( ! isset( $unique[ $t->term_id ] ) ) $unique[ $t->term_id ] = $t; }
		return array_values( $unique );
	}

	// ==========================================
	// PLP STYLES
	// ==========================================

	public function enqueue_plp_styles() {
		if ( ! ( is_shop() || is_product_category() || is_product_taxonomy() ) ) return;
		echo '<style type="text/css">' . $this->get_plp_css() . '</style>';
	}

	private function get_plp_css() {
		return '
		/* ======= HIDE DEFAULT WOO ELEMENTS ======= */
		.woocommerce ul.products li.product .price,
		.woocommerce ul.products li.product a.button,
		.woocommerce ul.products li.product a.add_to_cart_button,
		.woocommerce .woocommerce-ordering,
		.woocommerce .woocommerce-result-count,
		.woocommerce-products-header,
		.woocommerce ul.products li.product > a,
		.woocommerce ul.products li.product .woocommerce-loop-product__title,
		.woocommerce ul.products li.product .star-rating,
		.woocommerce ul.products li.product .woocommerce-loop-product__link {
			display: none !important;
		}

		/* ======= HERO BANNER ======= */
		.ps-hero-banner {
			background: linear-gradient(135deg, #002b49 0%, #003d6b 100%);
			padding: 50px 40px;
			margin: -20px -20px 0;
			text-align: center;
		}
		.ps-hero-title {
			color: #fff;
			font-size: 36px;
			font-weight: 800;
			letter-spacing: 3px;
			margin: 0;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
		}

		/* ======= PLP WRAPPER (Sidebar + Content) ======= */
		.ps-plp-wrapper {
			display: flex;
			gap: 30px;
			margin-top: 30px;
			align-items: flex-start;
		}

		/* ======= SIDEBAR ======= */
		.ps-plp-sidebar {
			width: 260px;
			min-width: 260px;
			background: #f5f5f5;
			border-radius: 8px;
			padding: 20px;
			position: sticky;
			top: 80px;
		}
		.ps-sidebar-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16px;
			padding-bottom: 12px;
			border-bottom: 2px solid #ddd;
		}
		.ps-sidebar-title {
			font-size: 18px;
			font-weight: 700;
			color: #002b49;
		}
		.ps-clear-all {
			font-size: 13px;
			color: #0073aa;
			text-decoration: none;
			font-weight: 600;
		}
		.ps-clear-all:hover { text-decoration: underline; }

		/* Accordion */
		.ps-filter-accordion {
			border-bottom: 1px solid #ddd;
			margin-bottom: 4px;
		}
		.ps-accordion-header {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 14px 0;
			background: none;
			border: none;
			cursor: pointer;
			font-size: 14px;
			font-weight: 700;
			color: #002b49;
			text-align: left;
		}
		.ps-accordion-header:hover { color: #0073aa; }
		.ps-accordion-icon::after { content: "+"; font-size: 18px; font-weight: 300; color: #666; }
		.ps-open .ps-accordion-icon::after { content: "−"; }
		.ps-accordion-body {
			max-height: 0;
			overflow: hidden;
			transition: max-height 0.3s ease;
			padding: 0;
		}
		.ps-open .ps-accordion-body {
			max-height: 500px;
			padding-bottom: 12px;
		}

		/* Checkboxes */
		.ps-checkbox-label {
			display: flex;
			align-items: center;
			gap: 10px;
			padding: 6px 0;
			cursor: pointer;
			font-size: 14px;
			color: #333;
		}
		.ps-checkbox-label:hover { color: #002b49; }
		.ps-checkbox {
			width: 16px;
			height: 16px;
			accent-color: #002b49;
			cursor: pointer;
		}

		/* ======= PRODUCT LIST CONTENT ======= */
		.ps-plp-content {
			flex: 1;
			min-width: 0;
		}
		.woocommerce .ps-plp-content ul.products {
			display: flex !important;
			flex-direction: column !important;
			gap: 0 !important;
		}
		.woocommerce .ps-plp-content ul.products li.product {
			width: 100% !important;
			margin: 0 !important;
			padding: 0 !important;
			float: none !important;
			border: none !important;
			border-radius: 0 !important;
			background: transparent !important;
			box-shadow: none !important;
		}
		.woocommerce .ps-plp-content ul.products li.product:hover {
			transform: none !important;
		}

		/* ======= PRODUCT CARD (Horizontal) ======= */
		.ps-product-card {
			display: flex;
			gap: 30px;
			padding: 40px 0;
			border-bottom: 1px solid #e0e0e0;
			align-items: flex-start;
		}
		.ps-product-card:first-child {
			padding-top: 0;
		}

		/* Image Column */
		.ps-card-image-col {
			width: 240px;
			min-width: 240px;
			text-align: center;
		}
		.ps-card-image-col a {
			display: block;
		}
		.ps-card-image-col img.ps-card-img,
		.ps-card-image-col img {
			width: 100%;
			max-width: 220px;
			height: auto;
			border-radius: 4px;
			object-fit: contain;
		}

		/* Content Column */
		.ps-card-content-col {
			flex: 1;
			min-width: 0;
		}
		.ps-card-title {
			margin: 0 0 8px;
			font-size: 22px;
			font-weight: 700;
			line-height: 1.3;
		}
		.ps-card-title a {
			color: #002b49;
			text-decoration: none;
		}
		.ps-card-title a:hover {
			color: #0073aa;
		}

		/* Star Rating */
		.ps-card-rating {
			display: flex;
			align-items: center;
			gap: 4px;
			margin-bottom: 14px;
		}
		.ps-star {
			font-size: 18px;
			line-height: 1;
		}
		.ps-star-full { color: #4a8c3f; }
		.ps-star-half { color: #4a8c3f; opacity: 0.6; }
		.ps-star-empty { color: #ccc; }
		.ps-rating-num {
			font-size: 14px;
			color: #555;
			margin-left: 6px;
			font-weight: 600;
		}
		.ps-no-rating {
			font-size: 13px;
			color: #999;
			font-style: italic;
		}

		/* Features List */
		.ps-card-features {
			margin: 0 0 14px;
			padding: 0 0 0 20px;
			list-style: disc;
		}
		.ps-card-features li {
			font-size: 14px;
			color: #444;
			line-height: 1.7;
			padding: 0;
			margin: 0;
		}

		/* Sheens */
		.ps-card-sheens {
			margin-bottom: 18px;
			font-size: 14px;
			color: #333;
			display: flex;
			gap: 8px;
			align-items: baseline;
		}
		.ps-card-sheens strong {
			color: #002b49;
			white-space: nowrap;
		}

		/* Buttons */
		.ps-card-buttons {
			display: flex;
			gap: 12px;
		}
		.ps-card-btn {
			display: inline-block;
			padding: 12px 28px;
			border-radius: 25px;
			font-size: 14px;
			font-weight: 700;
			text-decoration: none;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			transition: all 0.2s ease;
			text-align: center;
		}
		.ps-btn-view {
			background: #5b9bd5;
			color: #fff;
			border: 2px solid #5b9bd5;
		}
		.ps-btn-view:hover {
			background: #4a8ac4;
			border-color: #4a8ac4;
			color: #fff;
		}
		.ps-btn-buy {
			background: #002b49;
			color: #fff;
			border: 2px solid #002b49;
		}
		.ps-btn-buy:hover {
			background: #001d33;
			border-color: #001d33;
			color: #fff;
		}

		/* ======= RESPONSIVE ======= */
		@media (max-width: 768px) {
			.ps-plp-wrapper {
				flex-direction: column;
			}
			.ps-plp-sidebar {
				width: 100%;
				min-width: unset;
				position: static;
			}
			.ps-product-card {
				flex-direction: column;
				gap: 16px;
			}
			.ps-card-image-col {
				width: 100%;
				min-width: unset;
			}
			.ps-hero-banner {
				padding: 30px 20px;
			}
			.ps-hero-title {
				font-size: 24px;
				letter-spacing: 2px;
			}
		}
		';
	}

	// ==========================================
	// CART & CHECKOUT
	// ==========================================

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

	public function checkout_create_order_line_item( $item, $cart_item_key, $values, $order ) {
		if ( isset( $values['paint_custom_color'] ) ) {
			$item->add_meta_data( 'Paint Color', $values['paint_custom_color']['name'] );
		}
	}

}
