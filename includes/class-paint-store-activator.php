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
			description text,
			wc_attribute_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY wc_attribute_id (wc_attribute_id)
		) $charset_collate;";

		// 2. Bases
		$table_name = $wpdb->prefix . 'ps_bases';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			description text,
			PRIMARY KEY  (id)
		) $charset_collate;";

		// 3. Color Families
		$table_name = $wpdb->prefix . 'ps_color_families';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			slug varchar(255) NOT NULL,
			description text,
			hex_representative varchar(10) DEFAULT '' NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		// 4. Brands
		$table_name = $wpdb->prefix . 'ps_brands';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			description text,
			PRIMARY KEY  (id)
		) $charset_collate;";

		// 5. Colors
		$table_name = $wpdb->prefix . 'ps_colors';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			slug varchar(255) DEFAULT '' NOT NULL,
			color_code varchar(50) DEFAULT '' NOT NULL,
			hex_value varchar(10) DEFAULT '' NOT NULL,
			rgb_value varchar(50) DEFAULT '' NOT NULL,
			description text,
			family_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			brand_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			is_popular tinyint(1) NOT NULL DEFAULT 0,
			is_color_of_week tinyint(1) NOT NULL DEFAULT 0,
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
			slug varchar(255) DEFAULT '' NOT NULL,
			description text,
			wc_attribute_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY wc_attribute_id (wc_attribute_id)
		) $charset_collate;";

		// 7b. Product Types (Coatings, Tools, etc.)
		$table_name = $wpdb->prefix . 'ps_product_types';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			slug varchar(255) NOT NULL,
			description text,
			PRIMARY KEY  (id)
		) $charset_collate;";

		// 7c. Product Makes (Architectural Paints, Wood Stains, Brushes, etc.)
		$table_name = $wpdb->prefix . 'ps_product_makes';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			slug varchar(255) NOT NULL,
			product_type_id bigint(20) unsigned NOT NULL,
			description text,
			PRIMARY KEY  (id),
			KEY product_type_id (product_type_id)
		) $charset_collate;";

		// 7d. Product Families (linked to Product Brand and Make)
		$table_name = $wpdb->prefix . 'ps_product_families';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			brand_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			make_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			product_type varchar(50) DEFAULT 'coating' NOT NULL,
			coating_type varchar(50) DEFAULT 'architectural' NOT NULL,
			description text,
			how_to_use text,
			short_description text,
			gallery_image_ids text,
			compare_attributes longtext DEFAULT NULL,
			tool_handle_shape_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			tool_bristle_material_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			tool_head_shape_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			tool_handle_length_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			tool_handle_material_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			tool_stiffness_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			tool_paint_compat_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			tool_ferrule_material_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			wc_product_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY brand_id (brand_id),
			KEY make_id (make_id),
			KEY wc_product_id (wc_product_id)
		) $charset_collate;";

		// 7c. Family ↔ Colors (Explicit mapping for Stains/Specialty)
		$table_name = $wpdb->prefix . 'ps_family_colors';
		$tables[] = "CREATE TABLE $table_name (
			family_id bigint(20) unsigned NOT NULL,
			color_id bigint(20) unsigned NOT NULL,
			PRIMARY KEY  (family_id, color_id),
			KEY color_id (color_id)
		) $charset_collate;";

		// 7d. Family ↔ Categories (many-to-many)
		$table_name = $wpdb->prefix . 'ps_family_categories';
		$tables[] = "CREATE TABLE $table_name (
			family_id bigint(20) unsigned NOT NULL,
			category_id bigint(20) unsigned NOT NULL,
			PRIMARY KEY  (family_id, category_id),
			KEY category_id (category_id)
		) $charset_collate;";

		// 7d. Family ↔ Surface Types (many-to-many)
		$table_name = $wpdb->prefix . 'ps_family_surface_types';
		$tables[] = "CREATE TABLE $table_name (
			family_id bigint(20) unsigned NOT NULL,
			surface_type_id bigint(20) unsigned NOT NULL,
			PRIMARY KEY  (family_id, surface_type_id),
			KEY surface_type_id (surface_type_id)
		) $charset_collate;";

		// 7e. Family ↔ Scenes (many-to-many)
		$table_name = $wpdb->prefix . 'ps_family_scenes';
		$tables[] = "CREATE TABLE $table_name (
			family_id bigint(20) unsigned NOT NULL,
			scene_id bigint(20) unsigned NOT NULL,
			PRIMARY KEY  (family_id, scene_id),
			KEY scene_id (scene_id)
		) $charset_collate;";

		// 7f. Family ↔ Sheens (Explicit mapping)
		$table_name = $wpdb->prefix . 'ps_family_sheens';
		$tables[] = "CREATE TABLE $table_name (
			family_id bigint(20) unsigned NOT NULL,
			sheen_id bigint(20) unsigned NOT NULL,
			PRIMARY KEY  (family_id, sheen_id),
			KEY sheen_id (sheen_id)
		) $charset_collate;";

		// 7h. Family ↔ Brush Widths (many-to-many, references ps_tool_attributes)
		$table_name = $wpdb->prefix . 'ps_family_widths';
		$tables[] = "CREATE TABLE $table_name (
			family_id bigint(20) unsigned NOT NULL,
			width_id bigint(20) unsigned NOT NULL,
			PRIMARY KEY  (family_id, width_id),
			KEY width_id (width_id)
		) $charset_collate;";

		// 7g. Color ↔ Coordinating Colors (one-way mapping)
		$table_name = $wpdb->prefix . 'ps_color_coordinations';
		$tables[] = "CREATE TABLE $table_name (
			primary_color_id bigint(20) unsigned NOT NULL,
			coordinating_color_id bigint(20) unsigned NOT NULL,
			PRIMARY KEY  (primary_color_id, coordinating_color_id),
			KEY coordinating_color_id (coordinating_color_id)
		) $charset_collate;";

		// 8. Product Categories (scoped to a Product Make)
		$table_name = $wpdb->prefix . 'ps_product_categories';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			slug varchar(255) NOT NULL,
			make_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			description text,
			wc_category_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY make_id (make_id),
			KEY wc_category_id (wc_category_id)
		) $charset_collate;";

		// 9. Sizes
		$table_name = $wpdb->prefix . 'ps_sizes';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			liters decimal(10,2) DEFAULT 0.00 NOT NULL,
			description text,
			wc_attribute_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY wc_attribute_id (wc_attribute_id)
		) $charset_collate;";

		// 10. Surface Types
		$table_name = $wpdb->prefix . 'ps_surface_types';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			description text,
			wc_attribute_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY wc_attribute_id (wc_attribute_id)
		) $charset_collate;";

		// 11. Scene Images (for Color Visualizer)
		$table_name = $wpdb->prefix . 'ps_scene_images';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			description text,
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
			description text,
			stock_quantity int(11) DEFAULT 0 NOT NULL,
			color_name varchar(255) DEFAULT '' NOT NULL,
			opacity varchar(50) DEFAULT '' NOT NULL,
			stain_image_ids text,
			width_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			woo_product_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			PRIMARY KEY  (id),
			KEY family_id (family_id),
			KEY woo_product_id (woo_product_id)
		) $charset_collate;";

		// 13. Family Datasheets (PDS and SDS PDFs per sku config)
		$table_name = $wpdb->prefix . 'ps_family_datasheets';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			family_id bigint(20) unsigned NOT NULL,
			product_number varchar(100) DEFAULT '' NOT NULL,
			sheen varchar(100) DEFAULT '' NOT NULL,
			base_color varchar(100) DEFAULT '' NOT NULL,
			container_size varchar(50) DEFAULT '' NOT NULL,
			sds_file_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			sds_file_url varchar(255) DEFAULT '' NOT NULL,
			pds_file_id bigint(20) unsigned DEFAULT 0 NOT NULL,
			pds_file_url varchar(255) DEFAULT '' NOT NULL,
			PRIMARY KEY  (id),
			KEY family_id (family_id)
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

		// 14. Customer Reviews
		$table_name = $wpdb->prefix . 'ps_reviews';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			family_id bigint(20) unsigned NOT NULL,
			rating tinyint(1) NOT NULL DEFAULT 5,
			title text NOT NULL,
			text text NOT NULL,
			recommend tinyint(1) NOT NULL DEFAULT 1,
			author_name varchar(255) NOT NULL,
			product_info varchar(255) DEFAULT '' NOT NULL,
			verified_purchaser tinyint(1) NOT NULL DEFAULT 0,
			helpful_yes int(11) NOT NULL DEFAULT 0,
			helpful_no int(11) NOT NULL DEFAULT 0,
			image_urls text,
			response_author varchar(255) DEFAULT '' NOT NULL,
			response_text text,
			response_date datetime DEFAULT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
			PRIMARY KEY  (id),
			KEY family_id (family_id)
		) $charset_collate;";

		// 15. Community Q&A - Questions
		$table_name = $wpdb->prefix . 'ps_questions';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			family_id bigint(20) unsigned NOT NULL,
			author_name varchar(255) NOT NULL,
			author_email varchar(255) NOT NULL,
			text longtext NOT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
			PRIMARY KEY  (id),
			KEY family_id (family_id)
		) $charset_collate;";

		// 16. Community Q&A - Answers
		$table_name = $wpdb->prefix . 'ps_answers';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			question_id bigint(20) unsigned NOT NULL,
			author_name varchar(255) NOT NULL,
			author_email varchar(255) NOT NULL,
			text longtext NOT NULL,
			is_brand_response tinyint(1) NOT NULL DEFAULT 0,
			helpful_yes int(11) NOT NULL DEFAULT 0,
			helpful_no int(11) NOT NULL DEFAULT 0,
			created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
			PRIMARY KEY  (id),
			KEY question_id (question_id)
		) $charset_collate;";

		// 17. Tool Attributes
		$table_name = $wpdb->prefix . 'ps_tool_attributes';
		$tables[] = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			attribute_type varchar(100) NOT NULL,
			name varchar(255) NOT NULL,
			description text,
			PRIMARY KEY  (id),
			KEY attribute_type (attribute_type)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		$dbdelta_results = array();
		foreach ( $tables as $sql ) {
			$res = dbDelta( $sql );
			$dbdelta_results = array_merge($dbdelta_results, $res);
		}

		// Drop old varchar tool columns if they exist
		$family_table = $wpdb->prefix . 'ps_product_families';
		$old_columns = array(
			'tool_handle_shape', 'tool_bristle_material', 'tool_head_shape',
			'tool_handle_length', 'tool_handle_material', 'tool_stiffness',
			'tool_paint_compat', 'tool_ferrule_material'
		);
		foreach ($old_columns as $col) {
			$col_exists = $wpdb->get_results( "SHOW COLUMNS FROM {$family_table} LIKE '{$col}'" );
			if ( ! empty( $col_exists ) ) {
				$wpdb->query( "ALTER TABLE {$family_table} DROP COLUMN {$col}" );
			}
		}

		// Add Custom Roles for Paint Store
		add_role(
			'delivery_personnel',
			__( 'Delivery Personnel', 'paint-store' ),
			array(
				'read'         => true,
				'edit_posts'   => false,
				'delete_posts' => false,
			)
		);

		add_role(
			'store_helper',
			__( 'Store Helper', 'paint-store' ),
			array(
				'read'         => true,
				'edit_posts'   => false,
				'delete_posts' => false,
			)
		);

		return $dbdelta_results;
	}

}
