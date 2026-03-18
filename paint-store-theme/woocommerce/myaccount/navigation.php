<?php
/**
 * My Account navigation
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/myaccount/navigation.php.
 *
 * @see     https://woo.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 2.6.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

do_action( 'woocommerce_before_account_navigation' );
?>

<nav class="woocommerce-MyAccount-navigation bg-white rounded-xl shadow-sm border border-gray-100 p-2 md:p-3 mb-6 md:mb-8">
	<ul class="flex flex-row flex-wrap gap-2 md:gap-3 !pl-0 !m-0 !list-none items-center justify-start">
		<?php foreach ( wc_get_account_menu_items() as $endpoint => $label ) : ?>
			<?php
				$is_active = wc_get_account_menu_item_classes( $endpoint );
				// wc_get_account_menu_item_classes returns a string containing 'is-active' if true.
				$active_class = strpos( $is_active, 'is-active' ) !== false 
					? 'bg-[#0b1d3a] text-white font-medium shadow-sm hover:bg-blue-900' 
					: 'text-gray-600 hover:bg-gray-50 hover:text-[#0b1d3a]';
			?>
			<li class="<?php echo esc_attr( wc_get_account_menu_item_classes( $endpoint ) ); ?> !mb-0 text-red-500">
				<a href="<?php echo esc_url( wc_get_account_endpoint_url( $endpoint ) ); ?>" 
				   class="block px-4 py-2.5 rounded-lg transition-all duration-200 <?php echo esc_attr( $active_class ); ?> no-underline text-sm md:text-base whitespace-nowrap">
					<?php echo esc_html( $label ); ?>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
</nav>

<?php do_action( 'woocommerce_after_account_navigation' ); ?>
