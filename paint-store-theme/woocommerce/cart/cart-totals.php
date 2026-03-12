<?php
defined( 'ABSPATH' ) || exit;
?>
<div class="cart_totals ps-order-summary <?php echo ( WC()->customer->has_calculated_shipping() ) ? 'calculated_shipping' : ''; ?>">

	<?php do_action( 'woocommerce_before_cart_totals' ); ?>

	<h2>Order Summary</h2>

	<div class="ps-order-summary-body">
		<div class="ps-summary-row ps-row-subtotal">
			<span class="ps-label">Item Subtotal (<?php echo WC()->cart->get_cart_contents_count(); ?>)</span>
			<span class="ps-value"><?php wc_cart_totals_subtotal_html(); ?></span>
		</div>

		<?php foreach ( WC()->cart->get_coupons() as $code => $coupon ) : ?>
			<div class="ps-summary-row cart-discount coupon-<?php echo esc_attr( sanitize_title( $code ) ); ?>">
				<span class="ps-label"><?php wc_cart_totals_coupon_label( $coupon ); ?></span>
				<span class="ps-value" data-title="<?php echo esc_attr( wc_cart_totals_coupon_label( $coupon, false ) ); ?>"><?php wc_cart_totals_coupon_html( $coupon ); ?></span>
			</div>
		<?php endforeach; ?>

		<?php foreach ( WC()->cart->get_fees() as $fee ) : ?>
			<div class="ps-summary-row fee ps-row-fees">
				<span class="ps-label">Special Fees <button type="button" class="ps-tooltip-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></button> <span class="ps-chevron">⌄</span></span>
				<span class="ps-value" data-title="<?php echo esc_attr( $fee->name ); ?>"><?php wc_cart_totals_fee_html( $fee ); ?></span>
			</div>
		<?php endforeach; ?>

		<div class="ps-summary-row ps-row-tax">
			<span class="ps-label">Estimated Tax</span>
			<span class="ps-value ps-text-muted">
				<?php 
					if ( wc_tax_enabled() && 'excl' === get_option( 'woocommerce_tax_display_cart' ) ) {
						echo wp_kses_post( wc_cart_totals_taxes_total_html() );
					} else {
						echo 'Calculated in Checkout';
					}
				?>
			</span>
		</div>
	</div>

	<div class="ps-promo-code-toggle">
		<a href="#">Promo Code <span class="ps-chevron-blue">⌄</span></a>
	</div>

	<div class="ps-summary-total">
		<span class="ps-total-label">Estimated Total</span>
		<span class="ps-total-value"><?php wc_cart_totals_order_total_html(); ?></span>
	</div>

	<div class="wc-proceed-to-checkout ps-checkout-actions">
		<a href="<?php echo esc_url( wc_get_checkout_url() ); ?>" class="checkout-button button alt wc-forward ps-start-checkout-btn">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Start Secure Checkout
		</a>
		
		<div class="ps-checkout-divider"><span>Or</span></div>

		<button type="button" class="ps-apple-pay-btn">Buy with <strong>Pay</strong></button>
		<button type="button" class="ps-paypal-btn"><em>PayPal</em> Checkout</button>

		<p class="ps-terms-text">
			By placing an order, I agree to Lowe's <a href="#">Terms</a><br> and <a href="#">Privacy Statement</a>
		</p>
	</div>

	<?php do_action( 'woocommerce_after_cart_totals' ); ?>

</div>
