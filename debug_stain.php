<?php
require_once('../../../wp-load.php');

global $wpdb;
$results = $wpdb->get_results("SELECT id, family_id, color_name, stain_image_id FROM {$wpdb->prefix}ps_products WHERE opacity = 'Wood Stain' OR color_name LIKE '%Dark%' LIMIT 10");

print_r($results);
