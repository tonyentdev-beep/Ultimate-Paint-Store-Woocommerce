<?php
/*
Plugin Name: Cart Dump Debug
Description: Dumps cart
Version: 1.0
Author: System
*/
add_action('wp_footer', function() {
    if ( is_cart() && isset(WC()->cart) ) {
        echo '<div style="background:var(--ps-white); padding: 20px; z-index:9999999; position:relative; max-width: 800px; margin: 0 auto; overflow:auto;">';
        echo '<h3 style="color:black;">CART DUMP</h3><pre style="color:black;">';
        $cart = WC()->cart->get_cart();
        foreach($cart as $key => $item) {
            echo "Item Key: " . $key . "\n";
            echo "Product ID: " . $item['product_id'] . "\n";
            echo "Custom Meta: \n";
            print_r($item['paint_custom_color']);
            echo "------------------\n";
        }
        echo '</pre></div>';
    }
});
