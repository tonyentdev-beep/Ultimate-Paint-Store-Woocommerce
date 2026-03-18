<?php
/**
 * My Account page
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/myaccount/my-account.php.
 *
 * @see     https://woo.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 3.5.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * My Account navigation.
 *
 * @since 2.6.0
 */
?>
<div class="ps-my-account-wrapper max-w-7xl mx-auto px-4 py-12 md:py-16">
	<!-- Page Header -->
	<header class="mb-10 border-b border-gray-200 pb-6">
		<h1 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight" style="font-family: 'Anton', sans-serif;">MY ACCOUNT</h1>
		<p class="mt-2 text-gray-500">Manage your orders, addresses, and account details.</p>
	</header>

	<!-- Main Single-Column Layout -->
	<div class="flex flex-col gap-6 w-full max-w-6xl mx-auto items-start">
		
		<!-- Top Inner Nav Bar -->
		<aside class="w-full">
			<?php do_action( 'woocommerce_account_navigation' ); ?>
		</aside>

		<!-- Main Content Area -->
		<main class="w-full">
			<div class="woocommerce-MyAccount-content bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 lg:p-10 min-h-[500px]">
				<?php
				/**
				 * My Account content.
				 *
				 * @since 2.6.0
				 */
				do_action( 'woocommerce_account_content' );
				?>
			</div>
		</main>

	</div>
</div>
