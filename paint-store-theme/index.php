<?php get_header(); ?>

<main class="site-container">
	<?php
	if ( have_posts() ) :
		while ( have_posts() ) : the_post();
			the_content();
		endwhile;
	else :
		echo '<p>No content found.</p>';
	endif;
	?>
</main>

<?php get_footer(); ?>
