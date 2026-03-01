<?php

class Paint_Store_Activator {

	public static function activate() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		// Array of tables to create
		$tables = array();

		// 1. Sheens (Finishes)
		$table_name = $wpdb->prefix . 'ps_sheens';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			wc_attribute_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY wc_attribute_id (wc_attribute_id)
		) $charset_collate;";

		// 2. Bases
		$table_name = $wpdb->prefix . 'ps_bases';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		// 3. Color Families
		$table_name = $wpdb->prefix . 'ps_color_families';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			slug varchar(255) NOT NULL,
			hex_representative varchar(10) DEFAULT '' NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		// 4. Brands
		$table_name = $wpdb->prefix . 'ps_brands';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		// 5. Colors
		$table_name = $wpdb->prefix . 'ps_colors';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			color_code varchar(50) DEFAULT '' NOT NULL,
			hex_value varchar(10) DEFAULT '' NOT NULL,
			rgb_value varchar(50) DEFAULT '' NOT NULL,
			family_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			brand_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY family_id (family_id),
			KEY brand_id (brand_id)
		) $charset_collate;";

		// 6. Color Bases (Join Table)
		$table_name = $wpdb->prefix . 'ps_color_bases';
		$tables[] = "CREATE TABLE $table_name (
			color_id bigint(20) unsigned NOT NULL,
			base_id bigint(20) unsigned NOT NULL,
			PRIMARY KEY  (color_id, base_id)
		) $charset_collate;";

		// 7a. Product Brands (separate from color brands)
		$table_name = $wpdb->prefix . 'ps_product_brands';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			wc_attribute_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY wc_attribute_id (wc_attribute_id)
		) $charset_collate;";

		// 7b. Product Families (linked to Product Brand)
		$table_name = $wpdb->prefix . 'ps_product_families';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			brand_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			description text,
			short_description text,
			image_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			wc_product_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY brand_id (brand_id),
			KEY wc_product_id (wc_product_id)
		) $charset_collate;";

		// 8. Product Categories
		$table_name = $wpdb->prefix . 'ps_product_categories';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			slug varchar(255) NOT NULL,
			wc_category_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY wc_category_id (wc_category_id)
		) $charset_collate;";

		// 9. Sizes
		$table_name = $wpdb->prefix . 'ps_sizes';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			liters decimal(10,2) DEFAULT 0.00 NOT NULL,
			wc_attribute_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY wc_attribute_id (wc_attribute_id)
		) $charset_collate;";

		// 10. Surface Types
		$table_name = $wpdb->prefix . 'ps_surface_types';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			wc_attribute_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY wc_attribute_id (wc_attribute_id)
		) $charset_collate;";

		// 11. Scene Images (for Color Visualizer)
		$table_name = $wpdb->prefix . 'ps_scene_images';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			image_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		// 12. Products (The physical SKUs tied to WooCommerce)
		$table_name = $wpdb->prefix . 'ps_products';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			family_id bigint(20) unsigned NOT NULL,
			size_id bigint(20) unsigned NOT NULL,
			sheen_id bigint(20) unsigned NOT NULL,
			base_id bigint(20) unsigned NOT NULL,
			surface_id bigint(20) unsigned NOT NULL,
			sku varchar(100) DEFAULT '' NOT NULL,
			price decimal(10,2) DEFAULT 0.00 NOT NULL,
			stock_quantity int(11) DEFAULT 0 NOT NULL,
			woo_product_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY family_id (family_id),
			KEY woo_product_id (woo_product_id)
		) $charset_collate;";

		// 10. Projects
		$table_name = $wpdb->prefix . 'ps_projects';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			customer_id bigint(20) unsigned NOT NULL,
			name varchar(255) NOT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
			PRIMARY KEY  (id),
			KEY customer_id (customer_id)
		) $charset_collate;";

		// 11. Project Items
		$table_name = $wpdb->prefix . 'ps_project_items';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			project_id bigint(20) unsigned NOT NULL,
			product_id bigint(20) unsigned NOT NULL,
			color_id bigint(20) unsigned DEFAULT NULL,
			PRIMARY KEY  (id),
			KEY project_id (project_id)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		$dbdelta_results = array();
		foreach ( $tables as $sql ) {
			$res = dbDelta( $sql );
			$dbdelta_results = array_merge($dbdelta_results, $res);
		}
		return $dbdelta_results;
	}

}
