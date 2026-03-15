<?php
// Just dump it directly into a file because of path issues
echo "<?php\n";
echo "define('WP_USE_THEMES', false);\n";
echo "require('./wp-blog-header.php');\n";
echo "global \$wpdb;\n";
echo "\$family = \$wpdb->get_row(\"SELECT * FROM {\$wpdb->prefix}ps_product_families WHERE name LIKE '%Wood Stain%'\");\n";
echo "if (\$family) {\n";
echo "    echo \"Family: \" . \$family->name . \"\\n\";\n";
echo "    echo \"WC Product ID: \" . \$family->wc_product_id . \"\\n\";\n";
echo "    \$product = wc_get_product(\$family->wc_product_id);\n";
echo "    if (\$product) {\n";
echo "        echo \"Product Type: \" . \$product->get_type() . \"\\n\";\n";
echo "        echo \"Manage Stock: \" . (\$product->get_manage_stock() ? 'yes' : 'no') . \"\\n\";\n";
echo "        echo \"Price: \" . \$product->get_price() . \"\\n\";\n";
echo "        \$children = \$product->get_children();\n";
echo "        echo \"Variation IDs: \" . implode(', ', \$children) . \"\\n\";\n";
echo "        if (!empty(\$children)) {\n";
echo "            foreach(\$children as \$vid) {\n";
echo "                \$v = wc_get_product(\$vid);\n";
echo "                echo \"Var \$vid Price: \" . \$v->get_price() . \" SKU: \" . \$v->get_sku() . \"\\n\";\n";
echo "            }\n";
echo "        }\n";
echo "    } else {\n";
echo "        echo \"Product not found in Woo.\\n\";\n";
echo "    }\n";
echo "} else {\n";
echo "    echo \"Family not found.\\n\";\n";
echo "}\n";
