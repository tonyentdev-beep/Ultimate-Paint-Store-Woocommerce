<?php
require_once('/Users/anthony/Documents/paint store woo/app/public/wp-load.php');

// Load plugin
require_once( __DIR__ . '/paint-store.php' );

// Get API instance
$api = new Paint_Store_API( 'paint-store', '1.0.0' );

// Set user ID to 1 (admin)
wp_set_current_user( 1 );

// Try syncing family 111 (Minwax Wood Stain?) or all families
// Or wait, let's find the family ID where name is "Minwax Wood Stain"
global $wpdb;
$family_id = $wpdb->get_var("SELECT id FROM {$wpdb->prefix}ps_product_families WHERE name LIKE '%Minwax%Stain%' LIMIT 1");

if ( $family_id ) {
    echo "Found family ID: " . $family_id . "\n";
    $_SERVER['REQUEST_METHOD'] = 'POST';
    $request = new WP_REST_Request( 'POST', '/paint-store/v1/admin/sync' );
    $request->set_param( 'family_ids', [ $family_id ] );
    
    $response = $api->sync_products( $request );
    var_dump($response);
} else {
    echo "Family not found.\n";
    // Let's just sync everything? No, takes too long.
    // List some families
    $families = $wpdb->get_results("SELECT id, name FROM {$wpdb->prefix}ps_product_families LIMIT 5");
    print_r($families);
}
