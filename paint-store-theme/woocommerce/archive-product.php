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
$relevant_cats     = paint_store_get_relevant_terms( $context_ids, 'product_cat' );
$relevant_sheens   = paint_store_get_relevant_terms( $context_ids, 'pa_paint_sheen' );
$relevant_surfaces = paint_store_get_relevant_terms( $context_ids, 'pa_surface_type' );
$active_cat        = isset( $_GET['ps_category'] ) ? sanitize_text_field( $_GET['ps_category'] ) : '';
$active_sheen      = isset( $_GET['ps_sheen'] ) ? sanitize_text_field( $_GET['ps_sheen'] ) : '';
$active_surface    = isset( $_GET['ps_surface'] ) ? sanitize_text_field( $_GET['ps_surface'] ) : '';
$has_filters       = $active_cat || $active_sheen || $active_surface;
$clear_url         = remove_query_arg( array( 'ps_category', 'ps_sheen', 'ps_surface' ) );
?>



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

		<?php if ( ! empty( $relevant_surfaces ) ) : ?>
		<div class="ps-filter-accordion ps-open">
			<button class="ps-accordion-header" onclick="this.parentElement.classList.toggle('ps-open');">
				<span>Surface Types</span>
				<span class="ps-accordion-icon"></span>
			</button>
			<div class="ps-accordion-body">
				<?php foreach ( $relevant_surfaces as $surface ) :
					$checked = ( $active_surface === $surface->slug ) ? ' checked' : '';
				?>
				<label class="ps-checkbox-label">
					<input type="checkbox" class="ps-checkbox"
						value="<?php echo esc_attr( $surface->slug ); ?>"
						<?php echo $checked; ?>
						onchange="psToggleFilter('ps_surface', this.value, this.checked);">
					<span><?php echo esc_html( $surface->name ); ?></span>
				</label>
				<?php endforeach; ?>
			</div>
		</div>
		<?php endif; ?>
	</aside>

	<!-- Product Listing -->
	<div class="ps-plp-content">
		<?php
		// Build a robust custom query to bypass staging site WooCommerce catalog visibility glitches
		$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
		
		$query_args = array(
			'post_type'      => 'product',
			'post_status'    => 'publish',
			'posts_per_page' => 24,
			'paged'          => $paged,
			'orderby'        => 'title',
			'order'          => 'ASC'
		);

		// Apply URL Filters
		$tax_query = array( 'relation' => 'AND' );
		
		if ( isset( $_GET['ps_category'] ) && ! empty( $_GET['ps_category'] ) ) {
			$tax_query[] = array(
				'taxonomy' => 'product_cat',
				'field'    => 'slug',
				'terms'    => sanitize_text_field( $_GET['ps_category'] )
			);
		}
		
		if ( isset( $_GET['ps_sheen'] ) && ! empty( $_GET['ps_sheen'] ) ) {
			$tax_query[] = array(
				'taxonomy' => 'pa_paint_sheen',
				'field'    => 'slug',
				'terms'    => sanitize_text_field( $_GET['ps_sheen'] )
			);
		}

		if ( isset( $_GET['ps_surface'] ) && ! empty( $_GET['ps_surface'] ) ) {
			$tax_query[] = array(
				'taxonomy' => 'pa_surface_type',
				'field'    => 'slug',
				'terms'    => sanitize_text_field( $_GET['ps_surface'] )
			);
		}

		if ( count( $tax_query ) > 1 ) {
			$query_args['tax_query'] = $tax_query;
		}

		$products_query = new WP_Query( $query_args );

		if ( $products_query->have_posts() ) {
			woocommerce_product_loop_start();

			while ( $products_query->have_posts() ) {
				$products_query->the_post();
				wc_get_template_part( 'content', 'product' );
			}

			woocommerce_product_loop_end();

			// Custom Pagination
			$total_pages = $products_query->max_num_pages;
			if ( $total_pages > 1 ) {
				$current_page = max( 1, get_query_var( 'paged' ) );
				echo '<div class="ps-pagination" style="margin-top: 30px; text-align: center;">';
				echo paginate_links( array(
					'base'      => get_pagenum_link( 1 ) . '%_%',
					'format'    => 'page/%#%',
					'current'   => $current_page,
					'total'     => $total_pages,
					'prev_text' => '&laquo; Prev',
					'next_text' => 'Next &raquo;',
				) );
				echo '</div>';
			}

			wp_reset_postdata();
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
	// reset pagination on filter
	url.searchParams.delete('paged');
	url.pathname = url.pathname.replace(/\/page\/[0-9]+/, '');
	window.location.href = url.href;
}
</script>

<?php get_footer( 'shop' ); ?>
