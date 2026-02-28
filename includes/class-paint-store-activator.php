<?php

class Paint_Store_Activator {

	public static function activate() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		// Array of tables to create
		$tables = array();

		// 1. Finishes
		$table_name = $wpdb->prefix . 'ps_finishes';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			PRIMARY KEY  (id)
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

		// 3.5 Brands
		$table_name = $wpdb->prefix . 'ps_brands';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		// 4. Colors
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

		// 5. Color Bases (Join Table)
		$table_name = $wpdb->prefix . 'ps_color_bases';
		$tables[] = "CREATE TABLE $table_name (
			color_id bigint(20) unsigned NOT NULL,
			base_id bigint(20) unsigned NOT NULL,
			PRIMARY KEY  (color_id, base_id)
		) $charset_collate;";

		// 6. Product Families
		$table_name = $wpdb->prefix . 'ps_product_families';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			search_tags text,
			description text,
			is_primer_recommended tinyint(1) DEFAULT 0 NOT NULL,
			coverage_sq_ft_per_gallon int(11) DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		// 7. Surfaces
		$table_name = $wpdb->prefix . 'ps_surfaces';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		// 8. Family Surfaces (Join Table)
		$table_name = $wpdb->prefix . 'ps_family_surfaces';
		$tables[] = "CREATE TABLE $table_name (
			family_id bigint(20) unsigned NOT NULL,
			surface_id bigint(20) unsigned NOT NULL,
			PRIMARY KEY  (family_id, surface_id)
		) $charset_collate;";

		// 9. Products (The physical SKUs tied to WooCommerce)
		$table_name = $wpdb->prefix . 'ps_products';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			family_id bigint(20) unsigned NOT NULL,
			woo_product_id bigint(20) unsigned NOT NULL,
			type varchar(50) DEFAULT 'isCoating' NOT NULL,
			is_mixable tinyint(1) DEFAULT 0 NOT NULL,
			finish_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			base_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			size_gallons decimal(5,2) DEFAULT 0.00 NOT NULL,
			size_liters decimal(5,2) DEFAULT 0.00 NOT NULL,
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
