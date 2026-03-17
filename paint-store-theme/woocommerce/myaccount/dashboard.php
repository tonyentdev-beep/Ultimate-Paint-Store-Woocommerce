<?php
/**
 * My Account Dashboard
 *
 * Shows the first intro screen on the account dashboard.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/myaccount/dashboard.php.
 *
 * @see     https://woo.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 4.4.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$allowed_html = array(
	'a' => array(
		'href' => array(),
	),
);
?>

<div class="ps-dashboard-welcome mb-8">
	<h2 class="text-2xl font-bold text-gray-900 mb-2">Hello, <?php echo esc_html( $current_user->display_name ); ?>!</h2>
	<p class="text-gray-600">
		<?php
		printf(
			/* translators: 1: user display name 2: logout url */
			wp_kses( __( 'Not %1$s? <a href="%2$s" class="text-[#0b1d3a] font-medium hover:underline">Log out</a>', 'woocommerce' ), $allowed_html ),
			'<strong>' . esc_html( $current_user->display_name ) . '</strong>',
			esc_url( wc_logout_url() )
		);
		?>
	</p>
	<p class="text-gray-500 mt-2 text-sm">
		From your account dashboard you can view your <a href="<?php echo esc_url( wc_get_endpoint_url( 'orders' ) ); ?>" class="text-[#0b1d3a] hover:underline">recent orders</a>, manage your <a href="<?php echo esc_url( wc_get_endpoint_url( 'edit-address' ) ); ?>" class="text-[#0b1d3a] hover:underline">shipping and billing addresses</a>, and <a href="<?php echo esc_url( wc_get_endpoint_url( 'edit-account' ) ); ?>" class="text-[#0b1d3a] hover:underline">edit your password and account details</a>.
	</p>
</div>

<!-- Quick Links Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
	
	<!-- Orders Card -->
	<a href="<?php echo esc_url( wc_get_endpoint_url( 'orders' ) ); ?>" class="block p-6 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200 group">
		<div class="flex items-center gap-4 mb-3">
			<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0b1d3a] group-hover:bg-[#0b1d3a] group-hover:text-white transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-gray-900 m-0">Recent Orders</h3>
		</div>
		<p class="text-sm text-gray-500 m-0">Track, return, or buy things again.</p>
	</a>

	<!-- Addresses Card -->
	<a href="<?php echo esc_url( wc_get_endpoint_url( 'edit-address' ) ); ?>" class="block p-6 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200 group">
		<div class="flex items-center gap-4 mb-3">
			<div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
				  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-gray-900 m-0">Addresses</h3>
		</div>
		<p class="text-sm text-gray-500 m-0">Edit addresses for orders and gifts.</p>
	</a>

	<!-- Account Details Card -->
	<a href="<?php echo esc_url( wc_get_endpoint_url( 'edit-account' ) ); ?>" class="block p-6 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200 group">
		<div class="flex items-center gap-4 mb-3">
			<div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-gray-900 m-0">Account Details</h3>
		</div>
		<p class="text-sm text-gray-500 m-0">Update your name, email, and password.</p>
	</a>

	<!-- Downloads Card (Only shows if there are downloads in Woo, but we'll show it generically here assuming they buy digital goods or we can just leave it as standard) -->
	<a href="<?php echo esc_url( wc_get_endpoint_url( 'downloads' ) ); ?>" class="block p-6 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200 group">
		<div class="flex items-center gap-4 mb-3">
			<div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 group-hover:bg-orange-500 group-hover:text-white transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-gray-900 m-0">Downloads</h3>
		</div>
		<p class="text-sm text-gray-500 m-0">Access your digital products.</p>
	</a>

</div>

<?php
	/**
	 * My Account dashboard.
	 *
	 * @since 2.6.0
	 */
	do_action( 'woocommerce_account_dashboard' );
?>
