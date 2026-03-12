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
				foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
					$_product   = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
					$product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );
					$product_name = apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key );

					if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
						$product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
						
                        // Custom metadata
                        $custom_color_hex = isset( $cart_item['paint_custom_color']['hex'] ) ? $cart_item['paint_custom_color']['hex'] : '';
						$custom_color_name = isset( $cart_item['paint_custom_color']['name'] ) ? $cart_item['paint_custom_color']['name'] : '';
                        $size = $_product->get_attribute('pa_paint_size');
                        $sheen = $_product->get_attribute('pa_paint_sheen');
                        $brands = wp_get_post_terms( $product_id, 'product_brand', array('fields' => 'names') );
                        $brand = !is_wp_error($brands) && !empty($brands) ? implode(', ', $brands) : '';
                        
                        // Fulfillment metadata
                        $fulfillment_method = WC()->session->get('ps_fulfillment_method');
                        $delivery_address = WC()->session->get('ps_delivery_address');
                        
                        $fulfillment_title = 'Pickup at Store';
                        if ( $fulfillment_method === 'delivery' ) {
                            $fulfillment_title = 'Delivery to ' . esc_html( $delivery_address );
                        }
						?>
						<div class="ps-cart-item <?php echo esc_attr( apply_filters( 'woocommerce_cart_item_class', 'cart_item', $cart_item, $cart_item_key ) ); ?>">
							
							<div class="ps-cart-item-fulfillment-header">
								<strong><?php echo esc_html( $fulfillment_title ); ?> (<?php echo esc_html( $cart_item['quantity'] ); ?>)</strong>
							</div>

							<div class="ps-cart-item-card">
								<div class="ps-cart-item-image">
                                    <div class="ps-cart-item-image-inner" <?php if($custom_color_hex) echo 'style="background-color: '.esc_attr($custom_color_hex).';"'; ?>>
                                        <?php if(!$custom_color_hex) {
                                            $thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );
                                            echo $thumbnail;
                                        } ?>
                                    </div>
                                    <div class="ps-cart-item-actions-left">
                                        <button type="button" class="ps-toggle-details"><span class="dashicons dashicons-visibility"></span> Details</button>
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

									<div class="ps-cart-item-quantity">
										<?php
										if ( $_product->is_sold_individually() ) {
											$min_quantity = 1;
											$max_quantity = 1;
										} else {
											$min_quantity = 0;
											$max_quantity = $_product->get_max_purchase_quantity();
										}

										$product_quantity = woocommerce_quantity_input(
											array(
												'input_name'   => "cart[{$cart_item_key}][qty]",
												'input_value'  => $cart_item['quantity'],
												'max_value'    => $max_quantity,
												'min_value'    => $min_quantity,
												'product_name' => $product_name,
											),
											$_product,
											false
										);

										echo apply_filters( 'woocommerce_cart_item_quantity', $product_quantity, $cart_item_key, $cart_item ); // PHPCS: XSS ok.
										?>
									</div>
								</div>

                                <div class="ps-cart-item-fulfillment-column">
                                    <div class="ps-cart-item-fulfillment-options">
                                        <?php if ( $fulfillment_method === 'delivery' ): ?>
                                            <div class="ps-fulfillment-option ps-fulfillment-delivery active">
                                                <input type="radio" checked disabled>
                                                <label>Delivery to <strong><?php echo esc_html($delivery_address); ?></strong></label>
                                            </div>
                                        <?php else: ?>
                                            <div class="ps-fulfillment-option ps-fulfillment-pickup active">
                                                <input type="radio" checked disabled>
                                                <label>Pickup <strong>Ready Today</strong><br><small>At Store</small></label>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                </div>

								<div class="ps-cart-item-price-remove">
									<div class="ps-cart-item-price">
										<?php
											echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key );
										?>
									</div>
									<div class="ps-cart-item-remove-cell">
										<?php
											echo apply_filters(
												'woocommerce_cart_item_remove_link',
												sprintf(
													'<a href="%s" class="ps-remove-item" aria-label="%s" data-product_id="%s" data-product_sku="%s" style="text-decoration:none; color:#1a73e8; font-size: 24px;">✕</a>',
													esc_url( wc_get_cart_remove_url( $cart_item_key ) ),
													esc_attr( sprintf( __( 'Remove %s from cart', 'woocommerce' ), wp_strip_all_tags( $product_name ) ) ),
													esc_attr( $product_id ),
													esc_attr( $_product->get_sku() )
												),
												$cart_item_key
											);
										?>
									</div>
								</div>
							</div>

                            <div class="ps-cart-item-details-accordion">
                                <div class="ps-cart-item-details-header">
                                    <span>Hide Details</span>
                                    <span class="ps-accordion-icon">▲</span>
                                </div>
                                <div class="ps-cart-item-details-content">
                                    <table class="ps-metadata-table">
                                        <?php if($custom_color_name): ?>
                                        <tr><th>Color:</th><td><?php echo esc_html($custom_color_name); ?></td></tr>
                                        <?php endif; ?>
                                        <tr><th>Type:</th><td>Interior</td></tr>
                                        <?php if($sheen): ?>
                                        <tr><th>Sheen:</th><td><?php echo esc_html($sheen); ?></td></tr>
                                        <?php endif; ?>
                                        <?php if($brand): ?>
                                        <tr><th>Brand:</th><td><?php echo esc_html($brand); ?></td></tr>
                                        <?php endif; ?>
                                        <?php if($size): ?>
                                        <tr><th>Size:</th><td><?php echo esc_html($size); ?></td></tr>
                                        <?php endif; ?>
                                    </table>
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

<script>
jQuery(document).ready(function($) {
    // Accordion Toggle
    $(document).on('click', '.ps-cart-item-details-header', function() {
        var accordion = $(this).closest('.ps-cart-item-details-accordion');
        var content = accordion.find('.ps-cart-item-details-content');
        var text = $(this).find('span').first();
        var icon = $(this).find('.ps-accordion-icon');
        
        if (content.is(':visible')) {
            content.slideUp(200);
            accordion.addClass('closed');
            text.text('Show Details');
            icon.text('▼');
        } else {
            content.slideDown(200);
            accordion.removeClass('closed');
            text.text('Hide Details');
            icon.text('▲');
        }
    });

    // Details Link Trigger
    $(document).on('click', '.ps-toggle-details', function(e) {
        e.preventDefault();
        $(this).closest('.ps-cart-item').find('.ps-cart-item-details-header').click();
    });

    // Auto-update Cart on Quantity Change
    $(document).on('change', '.ps-cart-item-quantity input.qty', function() {
        $("[name='update_cart']").prop("disabled", false).trigger("click");
    });
});
</script>
