<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Tier 1: Announcement Bar -->
<div class="ps-announcement-bar" id="ps-announcement">
	<div class="ps-announcement-inner">
		<p class="ps-announcement-text">
			Welcome to <strong><?php bloginfo( 'name' ); ?></strong> — Quality Paints for Every Project!
			<a href="<?php echo esc_url( home_url( '/shop/' ) ); ?>">Shop Now</a>
		</p>
		<button class="ps-announcement-close" onclick="document.getElementById('ps-announcement').style.display='none';" aria-label="Close">&times;</button>
	</div>
</div>

<!-- Tier 2: Utility Navigation -->
<div class="ps-utility-bar">
	<div class="ps-utility-inner">
		<div class="ps-utility-left">
			<a href="<?php echo esc_url( home_url( '/shop/' ) ); ?>">Browse Products</a>
		</div>
		<div class="ps-utility-right">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Where to Buy</a>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Customer Service</a>
		</div>
	</div>
</div>

<!-- Tier 3: Main Navigation -->
<header class="ps-main-header">
	<div class="ps-header-inner">
		<!-- Logo -->
		<div class="ps-logo">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<?php bloginfo( 'name' ); ?>
			</a>
		</div>

		<!-- Primary Navigation -->
		<nav class="ps-primary-nav">
			<?php
			wp_nav_menu( array(
				'theme_location' => 'primary',
				'container'      => false,
				'depth'          => 1,
				'fallback_cb'    => function() {
					echo '<ul>';
					echo '<li><a href="' . esc_url( home_url( '/colors/' ) ) . '">Browse Colors</a></li>';
					echo '<li><a href="' . esc_url( home_url( '/shop/' ) ) . '">Products ▾</a></li>';
					if ( taxonomy_exists( 'product_brand' ) ) {
						$brands = get_terms( array( 'taxonomy' => 'product_brand', 'hide_empty' => true ) );
						if ( ! is_wp_error( $brands ) && ! empty( $brands ) ) {
							echo '<li><a href="' . esc_url( get_term_link( $brands[0] ) ) . '">Brands ▾</a></li>';
						}
					}
					$cats = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => true, 'parent' => 0 ) );
					if ( ! is_wp_error( $cats ) && ! empty( $cats ) ) {
						foreach ( array_slice( $cats, 0, 3 ) as $cat ) {
							echo '<li><a href="' . esc_url( get_term_link( $cat ) ) . '">' . esc_html( $cat->name ) . '</a></li>';
						}
					}
					echo '</ul>';
				},
			) );
			?>
		</nav>

		<!-- Search + Icons -->
		<div class="ps-header-actions">
			<!-- Search -->
			<div class="ps-header-search">
				<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
					<input type="search" class="ps-search-input" placeholder="Search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>">
					<input type="hidden" name="post_type" value="product">
					<button type="submit" class="ps-search-btn" aria-label="Search">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
					</button>
				</form>
			</div>

			<!-- Cart -->
			<?php if ( function_exists( 'WC' ) ) : ?>
			<a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="ps-header-icon" aria-label="Cart">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="9" cy="21" r="1"></circle>
					<circle cx="20" cy="21" r="1"></circle>
					<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
				</svg>
				<?php $count = WC()->cart->get_cart_contents_count(); if ( $count > 0 ) : ?>
					<span class="ps-cart-count"><?php echo esc_html( $count ); ?></span>
				<?php endif; ?>
			</a>
			<?php endif; ?>
		</div>
	</div>
</header>
