<?php
defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_cart' ); ?>

<div class="ps-cart-container">
	<div class="ps-cart-main">
		<div class="ps-cart-header">
			<h2><?php _e('Cart', 'woocommerce'); ?> (<?php echo WC()->cart->get_cart_contents_count(); ?>)</h2>
			<div class="ps-cart-header-actions">
				<a href="#">Email Cart</a> | <a href="<?php echo esc_url( wc_get_cart_url() . '?empty-cart' ); ?>">Empty Cart</a>
			</div>
		</div>

		<form class="woocommerce-cart-form ps-cart-form" action="<?php echo esc_url( wc_get_cart_url() ); ?>" method="post">
			<?php do_action( 'woocommerce_before_cart_table' ); ?>

			<div class="ps-cart-items">
				<?php do_action( 'woocommerce_before_cart_contents' ); ?>

				<?php
				// Fulfillment header - shown once above all items
				$fulfillment_method = WC()->session->get('ps_fulfillment_method');
				$delivery_address = WC()->session->get('ps_delivery_address');
				$fulfillment_title = 'Pickup at Store';
				if ( $fulfillment_method === 'delivery' ) {
					$fulfillment_title = 'Delivery to ' . esc_html( $delivery_address );
				}
				$total_items = WC()->cart->get_cart_contents_count();
				?>
				<div class="ps-cart-item-fulfillment-header">
					<strong><?php echo esc_html( $fulfillment_title ); ?> (<?php echo esc_html( $total_items ); ?>)</strong>
				</div>

				<?php
				foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
					$_product   = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
					$product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );
					$product_name = apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key );

					if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
						$product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
						
                        // Custom metadata
                        $custom_color_hex = isset( $cart_item['paint_custom_color']['hex'] ) ? $cart_item['paint_custom_color']['hex'] : '';
						$custom_color_name = isset( $cart_item['paint_custom_color']['name'] ) ? $cart_item['paint_custom_color']['name'] : '';
						$custom_width = isset( $cart_item['ps_custom_width'] ) ? $cart_item['ps_custom_width'] : '';
                        // Resolve size - handle taxonomy, variation, or raw term IDs
                        $size = '';
                        if (isset($cart_item['variation']['attribute_pa_paint_size']) && $cart_item['variation']['attribute_pa_paint_size']) {
                            $slug = $cart_item['variation']['attribute_pa_paint_size'];
                            $term = get_term_by('slug', $slug, 'pa_paint_size');
                            $size = $term ? $term->name : $slug;
                        } else {
                            $raw_size = $_product->get_attribute('pa_paint_size');
                            if ($raw_size) {
                                $parts = array_map('trim', explode('|', $raw_size));
                                $resolved = array();
                                foreach ($parts as $part) {
                                    if (is_numeric($part)) {
                                        $term = get_term((int)$part);
                                        $resolved[] = ($term && !is_wp_error($term)) ? $term->name : $part;
                                    } else {
                                        $resolved[] = $part;
                                    }
                                }
                                $size = implode(', ', $resolved);
                            }
                        }

                        // Resolve sheen
                        $sheen = '';
                        if (isset($cart_item['variation']['attribute_pa_paint_sheen']) && $cart_item['variation']['attribute_pa_paint_sheen']) {
                            $slug = $cart_item['variation']['attribute_pa_paint_sheen'];
                            $term = get_term_by('slug', $slug, 'pa_paint_sheen');
                            $sheen = $term ? $term->name : $slug;
                        } else {
                            $raw_sheen = $_product->get_attribute('pa_paint_sheen');
                            if ($raw_sheen) {
                                $parts = array_map('trim', explode('|', $raw_sheen));
                                $resolved = array();
                                foreach ($parts as $part) {
                                    if (is_numeric($part)) {
                                        $term = get_term((int)$part);
                                        $resolved[] = ($term && !is_wp_error($term)) ? $term->name : $part;
                                    } else {
                                        $resolved[] = $part;
                                    }
                                }
                                $sheen = implode(', ', $resolved);
                            }
                        }

                        $brands = wp_get_post_terms( $product_id, 'product_brand', array('fields' => 'names') );
                        $brand = !is_wp_error($brands) && !empty($brands) ? implode(', ', $brands) : '';
						?>
						<div class="ps-cart-item <?php echo esc_attr( apply_filters( 'woocommerce_cart_item_class', 'cart_item', $cart_item, $cart_item_key ) ); ?>">

							<div class="ps-cart-item-card">
								<div class="ps-cart-item-image">
                                    <div class="ps-cart-item-image-inner" <?php if($custom_color_hex) echo 'style="background-color: '.esc_attr($custom_color_hex).';"'; ?>>
                                        <?php if(!$custom_color_hex) {
                                            $thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );
                                            echo $thumbnail;
                                        } ?>
                                    </div>
                                    <div class="ps-cart-item-actions-left">
                                        <a href="#" class="ps-save-later">Save For Later</a>
                                    </div>
								</div>

								<div class="ps-cart-item-center">
									<div class="ps-cart-item-title">
										<?php
										if ( ! $product_permalink ) {
											echo wp_kses_post( $product_name . '&nbsp;' );
										} else {
											echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', sprintf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $_product->get_name() ), $cart_item, $cart_item_key ) );
										}
										?>
									</div>
                                    <div class="ps-cart-item-meta">
                                        Item #<?php echo $_product->get_id(); ?><br>
                                        Model #<?php echo $_product->get_sku(); ?>
                                    </div>

                                    <?php if($custom_color_name || $custom_width || $brand || $size || $sheen): ?>
                                    <div class="ps-cart-item-inline-meta">
                                        <?php if($custom_color_name): ?>
                                            <div class="ps-meta-row"><strong>Color:</strong> <span><?php echo esc_html($custom_color_name); ?></span></div>
                                        <?php endif; ?>
                                        <?php if($custom_width): ?>
                                            <div class="ps-meta-row"><strong>Width / Size:</strong> <span><?php echo esc_html($custom_width); ?></span></div>
                                        <?php endif; ?>
                                        <div class="ps-meta-row"><strong>Type:</strong> <span>Interior</span></div>
                                        <?php if($sheen): ?>
                                            <div class="ps-meta-row"><strong>Sheen:</strong> <span><?php echo esc_html($sheen); ?></span></div>
                                        <?php endif; ?>
                                        <?php if($brand): ?>
                                            <div class="ps-meta-row"><strong>Brand:</strong> <span><?php echo esc_html($brand); ?></span></div>
                                        <?php endif; ?>
                                        <?php if($size): ?>
                                            <div class="ps-meta-row"><strong>Size:</strong> <span><?php echo esc_html($size); ?></span></div>
                                        <?php endif; ?>
                                    </div>
                                    <?php endif; ?>

								</div>
							</div>
						</div>
						<?php
					}
				}
				?>

				<?php do_action( 'woocommerce_cart_contents' ); ?>

				<div class="ps-cart-actions" style="display:none;">
					<button type="submit" class="button" name="update_cart" value="<?php esc_attr_e( 'Update cart', 'woocommerce' ); ?>"><?php esc_html_e( 'Update cart', 'woocommerce' ); ?></button>
					<?php wp_nonce_field( 'woocommerce-cart', 'woocommerce-cart-nonce' ); ?>
				</div>

				<?php do_action( 'woocommerce_after_cart_contents' ); ?>
			</div>
			<?php do_action( 'woocommerce_after_cart_table' ); ?>
		</form>
	</div>

	<div class="ps-cart-sidebar">
		<?php
			do_action( 'woocommerce_cart_collaterals' );
		?>
	</div>
</div>

<?php do_action( 'woocommerce_after_cart' ); ?>

<style>
/* Hide Apple Pay, PayPal, and other express checkout buttons on cart */
.ps-apple-pay-btn,
.ps-paypal-btn,
.wc-stripe-payment-request-wrapper,
#wc-stripe-payment-request-button-separator,
.wc-stripe-payment-request-button-wrapper,
[id*="ppcp"],
[class*="ppcp"],
.apple-pay-button,
#apple-pay-button {
    display: none !important;
}
</style>

<script>
jQuery(document).ready(function($) {
    // Auto-update Cart on Quantity Change
    $(document).on('change', '.ps-cart-item-quantity input.qty', function() {
        $("[name='update_cart']").prop("disabled", false).trigger("click");
    });
});
</script>
