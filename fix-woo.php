<?php
// Just dump it directly into a file because of path issues
echo "<?php\n";
echo "define('WP_USE_THEMES', false);\n";
echo "require('./wp-blog-header.php');\n";
echo "global \$wpdb;\n";
echo "\$family = \$wpdb->get_row(\"SELECT * FROM {\$wpdb->prefix}ps_product_families WHERE name LIKE '%Wood Stain%'\");\n";
echo "if (\$family) {\n";
echo "    echo \"Changed back to simple product: \" . \$family->wc_product_id . \"\\n\";\n";
echo "    wp_set_object_terms(\$family->wc_product_id, 'simple', 'product_type');\n";
echo "}\n";
