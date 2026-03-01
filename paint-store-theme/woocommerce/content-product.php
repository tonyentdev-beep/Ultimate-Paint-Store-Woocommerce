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
$image        = $product->get_image( 'woocommerce_thumbnail', array( 'class' => 'ps-card-img' ) );
$rating_count = $product->get_rating_count();
$average      = $product->get_average_rating();
$short_desc   = $product->get_short_description();

// Get sheens for this product
$sheens = wp_get_post_terms( $product->get_id(), 'pa_paint_sheen', array( 'fields' => 'names' ) );
if ( is_wp_error( $sheens ) ) $sheens = array();

// Parse features from short description <li> elements
$features = array();
if ( ! empty( $short_desc ) ) {
	preg_match_all( '/<li[^>]*>(.*?)<\/li>/si', $short_desc, $matches );
	if ( ! empty( $matches[1] ) ) {
		$features = array_map( 'wp_strip_all_tags', $matches[1] );
	} else {
		$plain = wp_strip_all_tags( $short_desc );
		$features = array_filter( array_map( 'trim', preg_split( '/[\n\r]+/', $plain ) ) );
	}
}
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
		<div class="ps-card-rating">
			<?php if ( $rating_count > 0 ) :
				$full = floor( $average );
				$half = ( $average - $full >= 0.5 ) ? 1 : 0;
				$empty = 5 - $full - $half;
				for ( $i = 0; $i < $full; $i++ ) echo '<span class="ps-star ps-star-full">★</span>';
				if ( $half ) echo '<span class="ps-star ps-star-half">★</span>';
				for ( $i = 0; $i < $empty; $i++ ) echo '<span class="ps-star ps-star-empty">★</span>';
			?>
				<span class="ps-rating-num"><?php echo number_format( $average, 1 ); ?></span>
			<?php else : ?>
				<span class="ps-no-rating">No reviews yet</span>
			<?php endif; ?>
		</div>

		<!-- Feature Bullets -->
		<?php if ( ! empty( $features ) ) : ?>
		<ul class="ps-card-features">
			<?php foreach ( array_slice( $features, 0, 4 ) as $feature ) : ?>
			<li><?php echo esc_html( $feature ); ?></li>
			<?php endforeach; ?>
		</ul>
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
