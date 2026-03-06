<?php
/**
 * WooCommerce Archive Product Template (PLP)
 * Renders the hero banner, sidebar filters, and product list.
 */

defined( 'ABSPATH' ) || exit;

get_header();

// Page title
$page_title = 'All Products';
$page_desc  = '';
if ( is_product_category() || is_tax() ) {
	$term = get_queried_object();
	if ( $term ) {
        $page_title = $term->name;
        $page_desc  = term_description( $term->term_id, $term->taxonomy );
    }
} elseif ( is_shop() ) {
	$page_title = woocommerce_page_title( false );
}

// Get filter data
$context_ids     = paint_store_get_context_product_ids();
$relevant_cats   = paint_store_get_relevant_terms( $context_ids, 'product_cat' );
$relevant_sheens = paint_store_get_relevant_terms( $context_ids, 'pa_paint_sheen' );
$active_cat      = isset( $_GET['ps_category'] ) ? sanitize_text_field( $_GET['ps_category'] ) : '';
$active_sheen    = isset( $_GET['ps_sheen'] ) ? sanitize_text_field( $_GET['ps_sheen'] ) : '';
$has_filters     = $active_cat || $active_sheen;
$clear_url       = remove_query_arg( array( 'ps_category', 'ps_sheen' ) );
?>

<!-- Hero Banner -->
<div class="ps-hero-banner">
    <div class="ps-hero-inner">
        <h1 class="ps-hero-title"><?php echo esc_html( strtoupper( $page_title ) ); ?></h1>
        <?php if ( $page_desc ) : ?>
            <div class="ps-hero-desc" style="max-width: 800px; margin: 15px 0 0; font-size: 1.1rem; opacity: 0.9; line-height: 1.5; font-weight: 400; text-transform: none; color: #ffffff;">
                <?php echo wp_kses_post( wpautop( $page_desc ) ); ?>
            </div>
        <?php endif; ?>
    </div>
</div>

<!-- PLP Layout: Sidebar + Products -->
<div class="ps-plp-wrapper">

	<!-- Sidebar Filters -->
	<aside class="ps-plp-sidebar">
		<div class="ps-sidebar-header">
			<span class="ps-sidebar-title">Filter By</span>
			<?php if ( $has_filters ) : ?>
				<a href="<?php echo esc_url( $clear_url ); ?>" class="ps-clear-all">Clear All</a>
			<?php endif; ?>
		</div>

		<?php if ( ! empty( $relevant_cats ) ) : ?>
		<div class="ps-filter-accordion ps-open">
			<button class="ps-accordion-header" onclick="this.parentElement.classList.toggle('ps-open');">
				<span>Product Type</span>
				<span class="ps-accordion-icon"></span>
			</button>
			<div class="ps-accordion-body">
				<?php foreach ( $relevant_cats as $cat ) :
					$checked = ( $active_cat === $cat->slug ) ? ' checked' : '';
				?>
				<label class="ps-checkbox-label">
					<input type="checkbox" class="ps-checkbox"
						value="<?php echo esc_attr( $cat->slug ); ?>"
						<?php echo $checked; ?>
						onchange="psToggleFilter('ps_category', this.value, this.checked);">
					<span><?php echo esc_html( $cat->name ); ?></span>
				</label>
				<?php endforeach; ?>
			</div>
		</div>
		<?php endif; ?>

		<?php if ( ! empty( $relevant_sheens ) ) : ?>
		<div class="ps-filter-accordion ps-open">
			<button class="ps-accordion-header" onclick="this.parentElement.classList.toggle('ps-open');">
				<span>Sheens</span>
				<span class="ps-accordion-icon"></span>
			</button>
			<div class="ps-accordion-body">
				<?php foreach ( $relevant_sheens as $sheen ) :
					$checked = ( $active_sheen === $sheen->slug ) ? ' checked' : '';
				?>
				<label class="ps-checkbox-label">
					<input type="checkbox" class="ps-checkbox"
						value="<?php echo esc_attr( $sheen->slug ); ?>"
						<?php echo $checked; ?>
						onchange="psToggleFilter('ps_sheen', this.value, this.checked);">
					<span><?php echo esc_html( $sheen->name ); ?></span>
				</label>
				<?php endforeach; ?>
			</div>
		</div>
		<?php endif; ?>
	</aside>

	<!-- Product Listing -->
	<div class="ps-plp-content">
		<?php
		if ( woocommerce_product_loop() ) {
			woocommerce_product_loop_start();

			while ( have_posts() ) {
				the_post();
				wc_get_template_part( 'content', 'product' );
			}

			woocommerce_product_loop_end();
		} else {
			do_action( 'woocommerce_no_products_found' );
		}
		?>
	</div>
</div>

<script>
function psToggleFilter(param, value, checked) {
	var url = new URL(window.location.href);
	if (checked) { url.searchParams.set(param, value); }
	else { url.searchParams.delete(param); }
	window.location.href = url.toString();
}
</script>

<?php get_footer(); ?>
