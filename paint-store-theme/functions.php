<?php
/**
 * Paint Store Theme - functions.php
 */

// ==========================================
// THEME SETUP
// ==========================================

function paint_store_theme_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption' ) );

	add_theme_support( 'custom-logo', array(
		'height'      => 80,
		'width'       => 250,
		'flex-height' => true,
		'flex-width'  => true,
	) );

	register_nav_menus( array(
		'primary' => 'Primary Menu',
		'footer'  => 'Footer Menu',
	) );
}
add_action( 'after_setup_theme', 'paint_store_theme_setup' );

// ==========================================
// ENQUEUE STYLES
// ==========================================

function paint_store_theme_styles() {
	wp_enqueue_style( 'paint-store-theme', get_stylesheet_uri(), array(), '1.0.0' );
	
	// Google Fonts
	wp_enqueue_style( 'paint-store-fonts', 'https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600;700&display=swap', array(), null );
}
add_action( 'wp_enqueue_scripts', 'paint_store_theme_styles' );

// ==========================================
// WOOCOMMERCE: REMOVE DEFAULT STUFF ON PLP
// ==========================================

function paint_store_woo_plp_hooks() {
	// Remove sorting and result count
	remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );
	remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );

	// Remove default loop elements (we render our own card)
	remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
	remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
	remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5 );
	remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_template_loop_product_thumbnail', 10 );
	remove_action( 'woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title', 10 );
	remove_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10 );
	remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5 );

	// Remove WooCommerce breadcrumb (we can add our own later)
	remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
}
add_action( 'wp', 'paint_store_woo_plp_hooks' );

// ==========================================
// PLP FILTER: pre_get_posts
// ==========================================

function paint_store_filter_plp_query( $query ) {
	if ( is_admin() || ! $query->is_main_query() ) return;
	
	// Only run our custom logic if it's a WooCommerce product query
	if ( ! ( is_shop() || is_product_category() || is_product_taxonomy() ) ) return;
	
	// If it's explicitly the Shop page and no filters are set, we just want to ensure it shows products.
	// We'll proceed to look for $_GET filters, but if there are none, we just let the default query run.

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
add_action( 'pre_get_posts', 'paint_store_filter_plp_query' );

// ==========================================
// HELPER: Get context product IDs for filters
// ==========================================

function paint_store_get_context_product_ids() {
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

function paint_store_get_relevant_terms( $product_ids, $taxonomy ) {
	if ( empty( $product_ids ) ) return array();
	$terms = wp_get_object_terms( $product_ids, $taxonomy, array( 'orderby' => 'name', 'order' => 'ASC' ) );
	if ( is_wp_error( $terms ) ) return array();
	$unique = array();
	foreach ( $terms as $t ) {
		if ( ! isset( $unique[ $t->term_id ] ) ) $unique[ $t->term_id ] = $t;
	}
	return array_values( $unique );
}
