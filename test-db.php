<?php
$_SERVER['HTTP_HOST'] = 'paint-store.local';
$_SERVER['SERVER_NAME'] = 'paint-store.local';
$_SERVER['REQUEST_METHOD'] = 'GET';
require_once('/Users/anthony/Documents/paint store woo/app/public/wp-load.php');
global $wpdb;
$wpdb->show_errors();
$res = $wpdb->insert($wpdb->prefix . 'ps_product_categories', [
    'name' => 'Test Category',
    'slug' => 'test-cat',
    'make_id' => 1,
    'description' => 'Test desc'
]);
if ($res === false) {
    echo "ERROR: " . $wpdb->last_error . "\n";
} else {
    echo "SUCCESS: " . $wpdb->insert_id . "\n";
    $wpdb->delete($wpdb->prefix . 'ps_product_categories', ['id' => $wpdb->insert_id]);
}
