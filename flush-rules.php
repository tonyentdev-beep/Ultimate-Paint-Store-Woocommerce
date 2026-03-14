<?php
require_once '/Users/anthony/Documents/paint store woo/app/public/wp-load.php';

// Flush rewrite rules
flush_rewrite_rules( false );

// Also check and inject the menu item if needed
$menu_name = 'primary'; // Or whatever menu name is most common
$locations = get_nav_menu_locations();
if ( isset( $locations['primary'] ) ) {
    $menu = wp_get_nav_menu_object( $locations['primary'] );
    if ( $menu ) {
        $items = wp_get_nav_menu_items( $menu->term_id );
        $exists = false;
        foreach($items as $i) { if($i->title == 'Browse Colors') $exists = true; }
        if(!$exists) {
            wp_update_nav_menu_item( $menu->term_id, 0, array(
                'menu-item-title'  => 'Browse Colors',
                'menu-item-url'    => home_url( '/colors/' ),
                'menu-item-status' => 'publish',
                'menu-item-type'   => 'custom',
            ) );
            echo "Menu item added.\n";
        }
    }
}

echo "Rewrite rules flushed successfully.\n";
