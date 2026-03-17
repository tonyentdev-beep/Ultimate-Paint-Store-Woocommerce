<?php
/**
 * Orders
 *
 * Shows orders on the account page.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/myaccount/orders.php.
 *
 * @see https://woo.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 8.5.0
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_account_orders', $has_orders );

if ( $has_orders ) : ?>

	<div class="ps-orders-container mb-8">
		<h2 class="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

		<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			<table class="w-full text-left border-collapse">
				<thead class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold hidden md:table-header-group">
					<tr>
						<?php foreach ( wc_get_account_orders_columns() as $column_id => $column_name ) : ?>
							<th class="px-6 py-4 <?php echo esc_attr( $column_id ); ?>">
								<?php echo esc_html( $column_name ); ?>
							</th>
						<?php endforeach; ?>
					</tr>
				</thead>

				<tbody class="divide-y divide-gray-100">
					<?php foreach ( $customer_orders->orders as $customer_order ) :
						$order      = wc_get_order( $customer_order );
						$item_count = $order->get_item_count() - $order->get_item_count_refunded();
						?>
						<!-- Map WP Classes directly to the row to keep extensions working if needed -->
						<tr class="woocommerce-orders-table__row woocommerce-orders-table__row--status-<?php echo esc_attr( $order->get_status() ); ?> flex flex-col md:table-row p-4 md:p-0 hover:bg-gray-50 transition-colors">
							
							<?php foreach ( wc_get_account_orders_columns() as $column_id => $column_name ) : ?>
								<td class="px-6 py-3 md:py-4 <?php echo esc_attr( $column_id ); ?>" data-title="<?php echo esc_attr( $column_name ); ?>">
									
									<?php if ( has_action( 'woocommerce_my_account_my_orders_column_' . $column_id ) ) : ?>
										<?php do_action( 'woocommerce_my_account_my_orders_column_' . $column_id, $order ); ?>

									<?php elseif ( 'order-number' === $column_id ) : ?>
										<!-- Mobile Label -->
										<span class="md:hidden font-medium text-gray-500 text-sm mb-1 block"><?php echo esc_html( $column_name ); ?></span>
										
										<a href="<?php echo esc_url( $order->get_view_order_url() ); ?>" class="text-[#0b1d3a] font-bold hover:underline">
											#<?php echo esc_html( $order->get_order_number() ); ?>
										</a>

									<?php elseif ( 'order-date' === $column_id ) : ?>
										<!-- Mobile Label -->
										<span class="md:hidden font-medium text-gray-500 text-sm mb-1 block"><?php echo esc_html( $column_name ); ?></span>
										
										<time class="text-gray-600" datetime="<?php echo esc_attr( $order->get_date_created()->date( 'c' ) ); ?>">
											<?php echo esc_html( wc_format_datetime( $order->get_date_created() ) ); ?>
										</time>

									<?php elseif ( 'order-status' === $column_id ) : ?>
										<!-- Mobile Label -->
										<span class="md:hidden font-medium text-gray-500 text-sm mb-1 block"><?php echo esc_html( $column_name ); ?></span>
										
										<?php
											$status = $order->get_status();
											// Badge Styling
											$badge_class = 'bg-gray-100 text-gray-700';
											if( 'completed' === $status ) { $badge_class = 'bg-green-100 text-green-800'; }
											elseif( 'processing' === $status ) { $badge_class = 'bg-blue-100 text-blue-800'; }
											elseif( 'on-hold' === $status ) { $badge_class = 'bg-yellow-100 text-yellow-800'; }
											elseif( 'cancelled' === $status || 'failed' === $status ) { $badge_class = 'bg-red-100 text-red-800'; }
										?>
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold <?php echo esc_attr( $badge_class ); ?>">
											<?php echo esc_html( wc_get_order_status_name( $order->get_status() ) ); ?>
										</span>

									<?php elseif ( 'order-total' === $column_id ) : ?>
										<!-- Mobile Label -->
										<span class="md:hidden font-medium text-gray-500 text-sm mt-3 mb-1 block"><?php echo esc_html( $column_name ); ?></span>
										
										<span class="font-medium text-gray-900">
											<?php
											/* translators: 1: formatted order total 2: total order items */
											printf( _n( '%1$s for %2$s item', '%1$s for %2$s items', $item_count, 'woocommerce' ), $order->get_formatted_order_total(), $item_count ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
											?>
										</span>

									<?php elseif ( 'order-actions' === $column_id ) : ?>
										<div class="flex items-center gap-2 md:justify-end mt-4 md:mt-0">
											<?php
											$actions = wc_get_account_orders_actions( $order );

											if ( ! empty( $actions ) ) {
												foreach ( $actions as $key => $action ) {
													$btn_class = ( 'view' === $key ) 
														? 'text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-1.5 px-3 rounded-lg shadow-sm transition-colors'
														: 'text-sm bg-[#0b1d3a] text-white hover:bg-blue-800 font-medium py-1.5 px-3 rounded-lg shadow-sm transition-colors';
													
													echo '<a href="' . esc_url( $action['url'] ) . '" class="woocommerce-button ' . esc_attr( $btn_class ) . '">' . esc_html( $action['name'] ) . '</a>';
												}
											}
											?>
										</div>
									<?php endif; ?>
								</td>
							<?php endforeach; ?>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
	</div>

	<?php do_action( 'woocommerce_before_account_orders_pagination' ); ?>

	<?php if ( 1 < $customer_orders->max_num_pages ) : ?>
		<div class="woocommerce-pagination flex justify-center mt-6">
			<?php if ( 1 !== $current_page ) : ?>
				<a class="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-l-lg hover:bg-gray-50 transition-colors" href="<?php echo esc_url( wc_get_endpoint_url( 'orders', $current_page - 1 ) ); ?>">
					&larr; Previous
				</a>
			<?php endif; ?>

			<!-- Basic current page indicator -->
			<span class="px-4 py-1 bg-gray-50 border-t border-b border-gray-300 text-gray-600 font-medium">
				Page <?php echo esc_html( $current_page ); ?> of <?php echo esc_html( $customer_orders->max_num_pages ); ?>
			</span>

			<?php if ( intval( $customer_orders->max_num_pages ) !== $current_page ) : ?>
				<a class="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-r-lg hover:bg-gray-50 transition-colors" href="<?php echo esc_url( wc_get_endpoint_url( 'orders', $current_page + 1 ) ); ?>">
					Next &rarr;
				</a>
			<?php endif; ?>
		</div>
	<?php endif; ?>

<?php else : ?>

	<div class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
		<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
			  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
			</svg>
		</div>
		<p class="text-gray-500 mb-6 font-medium"><?php esc_html_e( 'No order has been made yet.', 'woocommerce' ); ?></p>
		<a class="inline-block bg-[#0b1d3a] text-white hover:bg-blue-800 font-medium py-3 px-8 rounded-full shadow-sm transition-all text-sm uppercase tracking-wide" href="<?php echo esc_url( apply_filters( 'woocommerce_return_to_shop_redirect', wc_get_page_permalink( 'shop' ) ) ); ?>">
			<?php esc_html_e( 'Browse products', 'woocommerce' ); ?>
		</a>
	</div>

<?php endif; ?>

<?php do_action( 'woocommerce_after_account_orders', $has_orders ); ?>
