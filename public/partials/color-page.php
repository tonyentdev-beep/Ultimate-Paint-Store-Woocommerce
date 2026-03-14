<?php
/**
 * Template for displaying a dedicated color page.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header(); ?>

<div class="ps-color-page-container" style="max-width: 99vw; margin: 0 auto; padding: 0 20px;">
	<?php echo do_shortcode( '[paint_store_builder]' ); ?>
</div>

<?php
get_footer();
