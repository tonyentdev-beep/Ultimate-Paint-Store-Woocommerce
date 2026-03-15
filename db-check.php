<?php
require_once('../../../wp-load.php');

$wood_stain_id = 15; // I remember family ID for wood stain was 15 or so. Let's just find "Wood Stain"
global $wpdb;
$family = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}ps_product_families WHERE name LIKE '%Wood Stain%'");
if ($family) {
    echo "Family: " . $family->name . "\n";
    echo "WC Product ID: " . $family->wc_product_id . "\n";
    $product = wc_get_product($family->wc_product_id);
    if ($product) {
        echo "Product Type: " . $product->get_type() . "\n";
        echo "Variations: " . count($product->get_children()) . "\n";
        
        // Print product meta if needed to see if it's manageable
        echo "Price: " . $product->get_price() . "\n";
        echo "Manage Stock: " . ($product->get_manage_stock() ? 'yes' : 'no') . "\n";
    } else {
        echo "Product not found in Woo.\n";
    }
} else {
    echo "Family not found.\n";
}

die();
