<?php
/**
 * WooCommerce Content Product Template
 * Renders a single product card in Valspar horizontal list-view style.
 */

defined( 'ABSPATH' ) || exit;

global $product;
if ( ! is_a( $product, 'WC_Product' ) ) return;

$link         = get_permalink( $product->get_id() );
$title        = $product->get_name();
$image        = $product->get_image( 'full', array( 'class' => 'ps-card-img' ) );
$short_desc   = $product->get_short_description();

// Look up the product family linked to this WooCommerce product, then query custom reviews
global $wpdb;
$family_id = $wpdb->get_var( $wpdb->prepare(
	"SELECT id FROM {$wpdb->prefix}ps_product_families WHERE wc_product_id = %d LIMIT 1",
	$product->get_id()
) );

$rating_count = 0;
$average      = 0;

if ( $family_id ) {
	$review_stats = $wpdb->get_row( $wpdb->prepare(
		"SELECT COUNT(*) as total, COALESCE(AVG(rating), 0) as avg_rating FROM {$wpdb->prefix}ps_reviews WHERE family_id = %d",
		$family_id
	) );
	if ( $review_stats ) {
		$rating_count = intval( $review_stats->total );
		$average      = floatval( $review_stats->avg_rating );
	}
}

// DEBUG: Temporary debug output — remove after fixing
echo '<!-- DEBUG: WC Product ID=' . $product->get_id() . ' | Family ID=' . ($family_id ?: 'NULL') . ' | Rating Count=' . $rating_count . ' | Average=' . $average . ' -->';

// Get sheens for this product
$sheens = wp_get_post_terms( $product->get_id(), 'pa_paint_sheen', array( 'fields' => 'names' ) );
if ( is_wp_error( $sheens ) ) $sheens = array();
?>

<div class="ps-product-card">
	<!-- Image -->
	<div class="ps-card-image-col">
		<a href="<?php echo esc_url( $link ); ?>"><?php echo $image; ?></a>
	</div>

	<!-- Content -->
	<div class="ps-card-content-col">
		<h3 class="ps-card-title">
			<a href="<?php echo esc_url( $link ); ?>"><?php echo esc_html( $title ); ?></a>
		</h3>

		<!-- Star Rating -->
		<div class="ps-card-rating" style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px;">
			<?php if ( $rating_count > 0 ) :
				$full = floor( $average );
				$half = ( $average - $full >= 0.5 ) ? 1 : 0;
				$empty = 5 - $full - $half;
				
				echo '<div style="display: flex; color: #ffc107; font-size: 16px;">';
				for ( $i = 0; $i < $full; $i++ ) echo '<span>★</span>';
				if ( $half ) echo '<span>★</span>'; // We'll just use full star chars for simplicity here
				for ( $i = 0; $i < $empty; $i++ ) echo '<span>☆</span>';
				echo '</div>';
			?>
				<span class="ps-rating-num" style="font-size: 14px; font-weight: bold; color: #00598E;"><?php echo number_format( $average, 1 ); ?></span>
				<span class="ps-rating-count" style="font-size: 13px; color: #666;">(<?php echo esc_html( $rating_count ); ?> <?php echo _n( 'Review', 'Reviews', $rating_count, 'ultimate-paint-store' ); ?>)</span>
			<?php else : ?>
				<div style="display: flex; color: #ddd; font-size: 16px;">
					<span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
				</div>
				<span class="ps-no-rating" style="font-size: 13px; color: #888;">No reviews yet</span>
			<?php endif; ?>
		</div>

		<!-- Short Description (full) -->
		<?php if ( ! empty( $short_desc ) ) : ?>
		<div class="ps-card-description">
			<?php echo wp_kses_post( $short_desc ); ?>
		</div>
		<?php endif; ?>

		<!-- Available Sheens -->
		<?php if ( ! empty( $sheens ) ) : ?>
		<div class="ps-card-sheens">
			<strong>Available Sheens</strong>
			<?php echo esc_html( implode( ', ', $sheens ) ); ?>
		</div>
		<?php endif; ?>

		<!-- Buttons -->
		<div class="ps-card-buttons">
			<a href="<?php echo esc_url( $link ); ?>" class="ps-card-btn ps-btn-view">View Details</a>
			<a href="<?php echo esc_url( $link ); ?>" class="ps-card-btn ps-btn-buy">Buy Now</a>
		</div>
	</div>
</div>
