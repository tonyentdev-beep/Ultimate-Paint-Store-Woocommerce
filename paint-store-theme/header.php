<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
	<div class="header-inner">
		<div class="site-logo">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<?php bloginfo( 'name' ); ?>
			</a>
		</div>
		<nav class="site-nav">
			<?php
			wp_nav_menu( array(
				'theme_location' => 'primary',
				'container'      => false,
				'depth'          => 1,
				'fallback_cb'    => function() {
					echo '<ul>';
					echo '<li><a href="' . esc_url( home_url( '/shop/' ) ) . '">Shop</a></li>';
					echo '<li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li>';
					echo '</ul>';
				},
			) );
			?>
		</nav>
	</div>
</header>
