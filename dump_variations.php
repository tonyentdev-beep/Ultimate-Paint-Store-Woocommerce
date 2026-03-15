<?php
require('/Users/anthony/Documents/paint store woo/app/public/wp-load.php');

$args = array( 'post_type' => 'product', 'title' => 'Minwax Wood Stain | Oil Based', 'post_status' => 'publish' );
$query = new WP_Query( $args );

if ( $query->have_posts() ) {
    $product_id = $query->posts[0]->ID;
    $product = wc_get_product( $product_id );
    echo 'Product ID: ' . $product_id . "\n";
    echo 'Product Type: ' . $product->get_type() . "\n";
    
    if ( $product->is_type( 'variable' ) ) {
        $variations = $product->get_children();
        echo 'Variations count: ' . count( $variations ) . "\n";
        foreach( $variations as $vid ) {
            $v = wc_get_product( $vid );
            echo "Variation ID: $vid | Attributes: " . json_encode($v->get_variation_attributes()) . "\n";
        }
    }
} else {
    echo 'Product not found.';
}
