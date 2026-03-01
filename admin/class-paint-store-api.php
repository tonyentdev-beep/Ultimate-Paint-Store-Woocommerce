<?php

class Paint_Store_API {

	private $plugin_name;
	private $version;
	private $namespace;

	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->namespace = 'paint-store/v1';
	}

	public function register_routes() {
		// Colors Endpoints
		register_rest_route( $this->namespace, '/colors', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_colors' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_color' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );
		register_rest_route( $this->namespace, '/colors/(?P<id>\\d+)', array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_color' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_color' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );

		// Color Families Endpoints
		register_rest_route( $this->namespace, '/families', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_families' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_family' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );
		register_rest_route( $this->namespace, '/families/(?P<id>\\d+)', array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_family' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_family' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );
		// Bases Endpoints
		register_rest_route( $this->namespace, '/bases', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_bases' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_base' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );
		register_rest_route( $this->namespace, '/bases/(?P<id>\\d+)', array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_base' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_base' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );

		// Brands Endpoints
		register_rest_route( $this->namespace, '/brands', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_brands' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_brand' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );
		register_rest_route( $this->namespace, '/brands/(?P<id>\\d+)', array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_brand' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_brand' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );

		// Product Families Endpoints
		register_rest_route( $this->namespace, '/product-families', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_product_families' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_product_family' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/product-families/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_product_family' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_product_family' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/product-families/(?P<id>\\d+)/sync', array(
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'sync_product_family_to_woo' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );

		// Product Brands Endpoints
		register_rest_route( $this->namespace, '/product-brands', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_product_brands' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_product_brand' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/product-brands/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_product_brand' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_product_brand' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );

		// Product Categories Endpoints
		register_rest_route( $this->namespace, '/product-categories', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_product_categories' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_product_category' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/product-categories/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_product_category' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_product_category' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );

		// Sizes Endpoints
		register_rest_route( $this->namespace, '/sizes', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_sizes' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_size' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/sizes/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_size' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_size' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/sizes/sync', array(
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'sync_sizes_to_woo' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );

		// Sheens Endpoints
		register_rest_route( $this->namespace, '/sheens', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_sheens' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_sheen' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/sheens/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_sheen' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_sheen' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/sheens/sync', array(
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'sync_sheens_to_woo' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );

		// Surface Types Endpoints
		register_rest_route( $this->namespace, '/surface-types', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_surface_types' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_surface_type' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/surface-types/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_surface_type' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_surface_type' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );

		// Scene Images Endpoints
		register_rest_route( $this->namespace, '/scene-images', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_scene_images' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_scene_image' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/scene-images/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_scene_image' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_scene_image' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );

		// Bulk Import Colors Endpoint
		register_rest_route( $this->namespace, '/colors/bulk-import', array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'bulk_import_colors' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );

		// Dashboard Stats Endpoint
		register_rest_route( $this->namespace, '/dashboard-stats', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_dashboard_stats' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );

		// Plugin Settings Endpoint
		register_rest_route( $this->namespace, '/settings', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_settings' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'save_settings' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );

		// Temporary DB Upgrade Endpoint
		register_rest_route( $this->namespace, '/upgrade-db', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'upgrade_db_schema' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );
	}

	public function permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	public function upgrade_db_schema( $request ) {
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-paint-store-activator.php';
		$results = Paint_Store_Activator::activate();
		return rest_ensure_response( array( 'success' => true, 'message' => 'Database schema updated', 'dbdelta' => $results ) );
	}

	// --- Colors Handlers ---

	public function get_colors( $request ) {
		global $wpdb;
		$colors_table = $wpdb->prefix . 'ps_colors';
		$color_bases_table = $wpdb->prefix . 'ps_color_bases';

		// Fetch all colors
		$colors = $wpdb->get_results( "SELECT * FROM $colors_table", ARRAY_A );

		// For each color, fetch its assigned bases
		foreach ( $colors as &$color ) {
			$color_id = $color['id'];
			$bases = $wpdb->get_col( $wpdb->prepare(
				"SELECT base_id FROM $color_bases_table WHERE color_id = %d",
				$color_id
			) );
			$color['base_ids'] = $bases ? array_map('intval', $bases) : array();
		}
		
		return rest_ensure_response( $colors );
	}

	public function create_color( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'ps_colors';
		$color_bases_table = $wpdb->prefix . 'ps_color_bases';

		$name        = sanitize_text_field( $request->get_param( 'name' ) );
		$color_code  = sanitize_text_field( $request->get_param( 'color_code' ) );
		$hex_value   = sanitize_text_field( $request->get_param( 'hex_value' ) );
		$rgb_value   = sanitize_text_field( $request->get_param( 'rgb_value' ) );
		$family_id   = intval( $request->get_param( 'family_id' ) );
		$brand_id    = intval( $request->get_param( 'brand_id' ) );
		
		// The frontend will send an array of selected base IDs
		$base_ids    = $request->get_param( 'base_ids' );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Color name is required', array( 'status' => 400 ) );
		}

		if ( empty( $base_ids ) || ! is_array( $base_ids ) ) {
			return new WP_Error( 'missing_bases', 'At least one Base is required for a Color', array( 'status' => 400 ) );
		}

		$result = $wpdb->insert(
			$table_name,
			array(
				'name'       => $name,
				'color_code' => $color_code,
				'hex_value'  => $hex_value,
				'rgb_value'  => $rgb_value,
				'family_id'  => $family_id,
				'brand_id'   => $brand_id,
			),
			array( '%s', '%s', '%s', '%s', '%d', '%d' )
		);

		if ( false === $result ) {
			return new WP_Error( 'db_insert_error', 'Failed to insert color: ' . $wpdb->last_error, array( 'status' => 500 ) );
		}

		$color_id = $wpdb->insert_id;

		// Save the multiple Base assignments to the junction table
		foreach ( $base_ids as $base_id ) {
			$wpdb->insert(
				$color_bases_table,
				array(
					'color_id' => $color_id,
					'base_id'  => intval( $base_id ),
				),
				array( '%d', '%d' )
			);
		}

		return rest_ensure_response( array( 'id' => $color_id ) );
	}

	public function update_color( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$table_name = $wpdb->prefix . 'ps_colors';
		$color_bases_table = $wpdb->prefix . 'ps_color_bases';

		$name        = sanitize_text_field( $request->get_param( 'name' ) );
		$color_code  = sanitize_text_field( $request->get_param( 'color_code' ) );
		$hex_value   = sanitize_text_field( $request->get_param( 'hex_value' ) );
		$rgb_value   = sanitize_text_field( $request->get_param( 'rgb_value' ) );
		$family_id   = intval( $request->get_param( 'family_id' ) );
		$brand_id    = intval( $request->get_param( 'brand_id' ) );
		
		$base_ids    = $request->get_param( 'base_ids' );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Color name is required', array( 'status' => 400 ) );
		}

		if ( empty( $base_ids ) || ! is_array( $base_ids ) ) {
			return new WP_Error( 'missing_bases', 'At least one Base is required for a Color', array( 'status' => 400 ) );
		}

		$result = $wpdb->update(
			$table_name,
			array(
				'name'       => $name,
				'color_code' => $color_code,
				'hex_value'  => $hex_value,
				'rgb_value'  => $rgb_value,
				'family_id'  => $family_id,
				'brand_id'   => $brand_id,
			),
			array( 'id' => $id ),
			array( '%s', '%s', '%s', '%s', '%d', '%d' ),
			array( '%d' )
		);

		if ( false === $result ) {
			return new WP_Error( 'db_update_error', 'Failed to update color: ' . $wpdb->last_error, array( 'status' => 500 ) );
		}

		// Save the multiple Base assignments to the junction table (delete and re-insert)
		$wpdb->delete( $color_bases_table, array( 'color_id' => $id ), array( '%d' ) );
		foreach ( $base_ids as $base_id ) {
			$wpdb->insert(
				$color_bases_table,
				array(
					'color_id' => $id,
					'base_id'  => intval( $base_id ),
				),
				array( '%d', '%d' )
			);
		}

		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_color( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		
		$wpdb->delete( $wpdb->prefix . 'ps_color_bases', array( 'color_id' => $id ), array( '%d' ) );
		$wpdb->delete( $wpdb->prefix . 'ps_colors', array( 'id' => $id ), array( '%d' ) );

		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Families Handlers ---

	public function get_families( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'ps_color_families';
		$results = $wpdb->get_results( "SELECT * FROM $table_name", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_family( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'ps_color_families';

		$name               = sanitize_text_field( $request->get_param( 'name' ) );
		$slug               = sanitize_title( $name );
		$hex_representative = sanitize_text_field( $request->get_param( 'hex_representative' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Family name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->insert(
			$table_name,
			array(
				'name'               => $name,
				'slug'               => $slug,
				'hex_representative' => $hex_representative,
			),
			array( '%s', '%s', '%s' )
		);

		if ( false === $result ) {
			return new WP_Error( 'db_insert_error', 'Failed to insert family: ' . $wpdb->last_error, array( 'status' => 500 ) );
		}

		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_family( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$table_name = $wpdb->prefix . 'ps_color_families';

		$name               = sanitize_text_field( $request->get_param( 'name' ) );
		$slug               = sanitize_title( $name );
		$hex_representative = sanitize_text_field( $request->get_param( 'hex_representative' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Family name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->update(
			$table_name,
			array(
				'name'               => $name,
				'slug'               => $slug,
				'hex_representative' => $hex_representative,
			),
			array( 'id' => $id ),
			array( '%s', '%s', '%s' ),
			array( '%d' )
		);

		if ( false === $result ) {
			return new WP_Error( 'db_update_error', 'Failed to update family: ' . $wpdb->last_error, array( 'status' => 500 ) );
		}

		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_family( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		
		$wpdb->delete( $wpdb->prefix . 'ps_color_families', array( 'id' => $id ), array( '%d' ) );

		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Bases Handlers ---

	public function get_bases( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'ps_bases';
		$results = $wpdb->get_results( "SELECT * FROM $table_name", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_base( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'ps_bases';

		$name = sanitize_text_field( $request->get_param( 'name' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Base name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->insert(
			$table_name,
			array(
				'name' => $name,
			),
			array( '%s' )
		);

		if ( false === $result ) {
			return new WP_Error( 'db_insert_error', 'Failed to insert base: ' . $wpdb->last_error, array( 'status' => 500 ) );
		}

		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_base( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$table_name = $wpdb->prefix . 'ps_bases';

		$name = sanitize_text_field( $request->get_param( 'name' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Base name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->update(
			$table_name,
			array(
				'name' => $name,
			),
			array( 'id' => $id ),
			array( '%s' ),
			array( '%d' )
		);

		if ( false === $result ) {
			return new WP_Error( 'db_update_error', 'Failed to update base: ' . $wpdb->last_error, array( 'status' => 500 ) );
		}

		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_base( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		
		$wpdb->delete( $wpdb->prefix . 'ps_bases', array( 'id' => $id ), array( '%d' ) );

		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Brands Handlers ---

	public function get_brands( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'ps_brands';
		$results = $wpdb->get_results( "SELECT * FROM $table_name", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_brand( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'ps_brands';

		$name = sanitize_text_field( $request->get_param( 'name' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Brand name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->insert(
			$table_name,
			array(
				'name' => $name,
			),
			array( '%s' )
		);

		if ( false === $result ) {
			return new WP_Error( 'db_insert_error', 'Failed to insert brand: ' . $wpdb->last_error, array( 'status' => 500 ) );
		}

		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_brand( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$table_name = $wpdb->prefix . 'ps_brands';

		$name = sanitize_text_field( $request->get_param( 'name' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Brand name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->update(
			$table_name,
			array(
				'name' => $name,
			),
			array( 'id' => $id ),
			array( '%s' ),
			array( '%d' )
		);

		if ( false === $result ) {
			return new WP_Error( 'db_update_error', 'Failed to update brand: ' . $wpdb->last_error, array( 'status' => 500 ) );
		}

		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_brand( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		
		$wpdb->delete( $wpdb->prefix . 'ps_brands', array( 'id' => $id ), array( '%d' ) );

		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Product Families Handlers ---

	public function get_product_families( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_product_families", ARRAY_A );
		// Resolve image URLs
		foreach ( $results as &$row ) {
			$row['image_url'] = '';
			if ( ! empty( $row['image_id'] ) ) {
				$url = wp_get_attachment_url( intval( $row['image_id'] ) );
				if ( $url ) $row['image_url'] = $url;
			}
		}
		return rest_ensure_response( $results );
	}

	public function create_product_family( $request ) {
		global $wpdb;
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$brand_id = intval( $request->get_param( 'brand_id' ) );
		$description = wp_kses_post( $request->get_param( 'description' ) );
		$image_id = intval( $request->get_param( 'image_id' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_product_families', array( 'name' => $name, 'brand_id' => $brand_id, 'description' => $description, 'image_id' => $image_id ), array( '%s', '%d', '%s', '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_product_family( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$brand_id = intval( $request->get_param( 'brand_id' ) );
		$description = wp_kses_post( $request->get_param( 'description' ) );
		$image_id = intval( $request->get_param( 'image_id' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_product_families', array( 'name' => $name, 'brand_id' => $brand_id, 'description' => $description, 'image_id' => $image_id ), array( 'id' => $id ), array( '%s', '%d', '%s', '%d' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_product_family( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_product_families', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function sync_product_family_to_woo( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) return new WP_Error( 'woo_missing', 'WooCommerce is not active.', array( 'status' => 400 ) );
		global $wpdb;
		$family_id = intval( $request->get_param( 'id' ) );
		
		// 1. Get the Family
		$family = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ps_product_families WHERE id = %d", $family_id ) );
		if ( ! $family ) return new WP_Error( 'not_found', 'Product family not found.', array( 'status' => 404 ) );

		// 2. Get all physical products linked to this family to know which sizes/sheens to activate
		// Note: The structure implies we need actual `ps_products` tied to this family.
		// If ps_products are not yet built out, we need a way to assign available sizes/sheens to the family directly.
		// Since we haven't built the `ps_products` UI yet, for Phase 4, we will assign ALL sizes and ALL sheens as a baseline, 
		// OR we can wait to build the Products UI first.

		// Let's create the parent Variable Product first.
		$product = new WC_Product_Variable();
		if ( $family->wc_product_id ) {
			try {
				$product = new WC_Product_Variable( $family->wc_product_id );
			} catch ( Exception $e ) {
				$product = new WC_Product_Variable(); // fallback if deleted in woo
			}
		}

		$product->set_name( $family->name );
		$product->set_description( $family->description );
		if ( $family->image_id ) {
			$product->set_image_id( $family->image_id );
		}
		
		// 3. Set global attributes for Size and Sheen on this parent product
		$sizes = $wpdb->get_results( "SELECT wc_attribute_id, name FROM {$wpdb->prefix}ps_sizes WHERE wc_attribute_id > 0" );
		$sheens = $wpdb->get_results( "SELECT wc_attribute_id, name FROM {$wpdb->prefix}ps_sheens WHERE wc_attribute_id > 0" );
		
		$attributes = array();
		
		if ( ! empty( $sizes ) ) {
			$attr = new WC_Product_Attribute();
			$attr->set_id( wc_attribute_taxonomy_id_by_name( 'Paint Size' ) );
			$attr->set_name( 'pa_paint_size' );
			$attr->set_options( wp_list_pluck( $sizes, 'wc_attribute_id' ) );
			$attr->set_visible( true );
			$attr->set_variation( true ); // Crucial for variable products
			$attributes[] = $attr;
		}

		if ( ! empty( $sheens ) ) {
			$attr = new WC_Product_Attribute();
			$attr->set_id( wc_attribute_taxonomy_id_by_name( 'Paint Sheen' ) );
			$attr->set_name( 'pa_paint_sheen' );
			$attr->set_options( wp_list_pluck( $sheens, 'wc_attribute_id' ) );
			$attr->set_visible( true );
			$attr->set_variation( true );
			$attributes[] = $attr;
		}

		$product->set_attributes( $attributes );
		$product_id = $product->save();

		// Update family with the Woo ID
		$wpdb->update( $wpdb->prefix . 'ps_product_families', array( 'wc_product_id' => $product_id ), array( 'id' => $family_id ) );

		// 4. Generate Variations (if Size and Sheen exist)
		// For a real app, you only generate variations for combinations that actually exist as `ps_products` and set their specific price.
		// For now, we will just create the variations with a default price of 0 to get them into WooCommerce.
		if ( ! empty( $sizes ) && ! empty( $sheens ) ) {
			foreach ( $sizes as $size ) {
				$size_term = get_term( $size->wc_attribute_id );
				foreach ( $sheens as $sheen ) {
					$sheen_term = get_term( $sheen->wc_attribute_id );
					if ( ! $size_term || ! $sheen_term ) continue;

					// Check if variation exists
					$variation_id = $this->find_matching_variation( $product_id, array(
						'attribute_pa_paint_size' => $size_term->slug,
						'attribute_pa_paint_sheen' => $sheen_term->slug
					) );

					$variation = new WC_Product_Variation( $variation_id );
					$variation->set_parent_id( $product_id );
					$variation->set_attributes( array(
						'pa_paint_size' => $size_term->slug,
						'pa_paint_sheen' => $sheen_term->slug
					) );
					
					// If new, set default price
					if ( ! $variation_id ) {
						$variation->set_regular_price( '0.00' ); 
					}
					
					$variation->set_manage_stock( false );
					$variation->save();
				}
			}
		}

		return rest_ensure_response( array( 'success' => true, 'wc_product_id' => $product_id ) );
	}

	private function find_matching_variation( $product_id, $match_attributes ) {
		$product = wc_get_product( $product_id );
		if ( ! $product || ! $product->is_type( 'variable' ) ) return 0;
		foreach ( $product->get_children() as $child_id ) {
			$variation = wc_get_product( $child_id );
			$attributes = $variation->get_attributes();
			$match = true;
			foreach ( $match_attributes as $key => $value ) {
				if ( ! isset( $attributes[ $key ] ) || $attributes[ $key ] !== $value ) {
					$match = false;
					break;
				}
			}
			if ( $match ) return $child_id;
		}
		return 0;
	}

	// --- Product Categories Handlers ---

	public function get_product_categories( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_product_categories", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_product_category( $request ) {
		global $wpdb;
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$slug = sanitize_title( $name );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_product_categories', array( 'name' => $name, 'slug' => $slug ), array( '%s', '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_product_category( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$slug = sanitize_title( $name );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_product_categories', array( 'name' => $name, 'slug' => $slug ), array( 'id' => $id ), array( '%s', '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_product_category( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_product_categories', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Sizes Handlers ---

	public function get_sizes( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_sizes", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_size( $request ) {
		global $wpdb;
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$liters = floatval( $request->get_param( 'liters' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_sizes', array( 'name' => $name, 'liters' => $liters ), array( '%s', '%f' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_size( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$liters = floatval( $request->get_param( 'liters' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_sizes', array( 'name' => $name, 'liters' => $liters ), array( 'id' => $id ), array( '%s', '%f' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_size( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_sizes', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function sync_sizes_to_woo( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) return new WP_Error( 'woo_missing', 'WooCommerce is not active.', array( 'status' => 400 ) );
		global $wpdb;

		// 1. Create the Global Attribute if it doesn't exist
		$slug = 'paint_size';
		$taxonomy = 'pa_' . $slug;
		$attribute_id = wc_attribute_taxonomy_id_by_name( 'Paint Size' );

		if ( ! $attribute_id ) {
			$attribute_id = wc_create_attribute( array( 'name' => 'Paint Size', 'slug' => $slug, 'type' => 'select' ) );
			if ( is_wp_error( $attribute_id ) ) return $attribute_id;
			register_taxonomy( $taxonomy, array( 'product' ) ); // Register it temporarily for this request
		}

		// 2. Sync all local sizes to terms
		$sizes = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_sizes" );
		$synced = 0;

		foreach ( $sizes as $size ) {
			$term = term_exists( $size->name, $taxonomy );
			if ( ! $term ) {
				$term = wp_insert_term( $size->name, $taxonomy );
			}
			if ( ! is_wp_error( $term ) && isset( $term['term_id'] ) ) {
				$wpdb->update( $wpdb->prefix . 'ps_sizes', array( 'wc_attribute_id' => $term['term_id'] ), array( 'id' => $size->id ) );
				$synced++;
			}
		}
		
		return rest_ensure_response( array( 'success' => true, 'synced' => $synced ) );
	}

	// --- Sheens Handlers ---

	public function get_sheens( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_sheens", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_sheen( $request ) {
		global $wpdb;
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_sheens', array( 'name' => $name ), array( '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_sheen( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_sheens', array( 'name' => $name ), array( 'id' => $id ), array( '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_sheen( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_sheens', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function sync_sheens_to_woo( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) return new WP_Error( 'woo_missing', 'WooCommerce is not active.', array( 'status' => 400 ) );
		global $wpdb;

		$slug = 'paint_sheen';
		$taxonomy = 'pa_' . $slug;
		$attribute_id = wc_attribute_taxonomy_id_by_name( 'Paint Sheen' );

		if ( ! $attribute_id ) {
			$attribute_id = wc_create_attribute( array( 'name' => 'Paint Sheen', 'slug' => $slug, 'type' => 'select' ) );
			if ( is_wp_error( $attribute_id ) ) return $attribute_id;
			register_taxonomy( $taxonomy, array( 'product' ) );
		}

		$sheens = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_sheens" );
		$synced = 0;

		foreach ( $sheens as $sheen ) {
			$term = term_exists( $sheen->name, $taxonomy );
			if ( ! $term ) {
				$term = wp_insert_term( $sheen->name, $taxonomy );
			}
			if ( ! is_wp_error( $term ) && isset( $term['term_id'] ) ) {
				$wpdb->update( $wpdb->prefix . 'ps_sheens', array( 'wc_attribute_id' => $term['term_id'] ), array( 'id' => $sheen->id ) );
				$synced++;
			}
		}
		
		return rest_ensure_response( array( 'success' => true, 'synced' => $synced ) );
	}

	// --- Surface Types Handlers ---

	public function get_surface_types( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_surface_types", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_surface_type( $request ) {
		global $wpdb;
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_surface_types', array( 'name' => $name ), array( '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_surface_type( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_surface_types', array( 'name' => $name ), array( 'id' => $id ), array( '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_surface_type( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_surface_types', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Scene Images Handlers ---

	public function get_scene_images( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_scene_images", ARRAY_A );
		foreach ( $results as &$row ) {
			$row['image_url'] = '';
			if ( ! empty( $row['image_id'] ) ) {
				$url = wp_get_attachment_url( intval( $row['image_id'] ) );
				if ( $url ) $row['image_url'] = $url;
			}
		}
		return rest_ensure_response( $results );
	}

	public function create_scene_image( $request ) {
		global $wpdb;
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$image_id = intval( $request->get_param( 'image_id' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		if ( empty( $image_id ) ) return new WP_Error( 'missing_image', 'Image is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_scene_images', array( 'name' => $name, 'image_id' => $image_id ), array( '%s', '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_scene_image( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$image_id = intval( $request->get_param( 'image_id' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_scene_images', array( 'name' => $name, 'image_id' => $image_id ), array( 'id' => $id ), array( '%s', '%d' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_scene_image( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_scene_images', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Bulk Import Colors Handler ---

	public function bulk_import_colors( $request ) {
		global $wpdb;
		$colors = $request->get_param( 'colors' );
		if ( ! is_array( $colors ) || empty( $colors ) ) {
			return new WP_Error( 'missing_colors', 'No colors provided', array( 'status' => 400 ) );
		}

		$colors_table = $wpdb->prefix . 'ps_colors';
		$color_bases_table = $wpdb->prefix . 'ps_color_bases';
		$imported = 0;
		$errors = array();

		foreach ( $colors as $idx => $color ) {
			$name = sanitize_text_field( isset( $color['name'] ) ? $color['name'] : '' );
			if ( empty( $name ) ) {
				$errors[] = 'Row ' . ($idx + 1) . ': Name is required';
				continue;
			}

			$data = array(
				'name'       => $name,
				'color_code' => sanitize_text_field( isset( $color['color_code'] ) ? $color['color_code'] : '' ),
				'hex_value'  => sanitize_text_field( isset( $color['hex_value'] ) ? $color['hex_value'] : '' ),
				'rgb_value'  => sanitize_text_field( isset( $color['rgb_value'] ) ? $color['rgb_value'] : '' ),
				'family_id'  => intval( isset( $color['family_id'] ) ? $color['family_id'] : 0 ),
				'brand_id'   => intval( isset( $color['brand_id'] ) ? $color['brand_id'] : 0 ),
			);

			$result = $wpdb->insert( $colors_table, $data, array( '%s', '%s', '%s', '%s', '%d', '%d' ) );

			if ( false === $result ) {
				$errors[] = 'Row ' . ($idx + 1) . ': ' . $wpdb->last_error;
				continue;
			}

			$color_id = $wpdb->insert_id;

			// Insert base associations
			if ( ! empty( $color['base_ids'] ) && is_array( $color['base_ids'] ) ) {
				foreach ( $color['base_ids'] as $base_id ) {
					$wpdb->insert(
						$color_bases_table,
						array( 'color_id' => $color_id, 'base_id' => intval( $base_id ) ),
						array( '%d', '%d' )
					);
				}
			}

			$imported++;
		}

		return rest_ensure_response( array(
			'success'  => true,
			'imported' => $imported,
			'errors'   => $errors,
			'total'    => count( $colors ),
		) );
	}

	// --- Dashboard Stats Handler ---

	public function get_dashboard_stats( $request ) {
		global $wpdb;
		$prefix = $wpdb->prefix . 'ps_';

		$tables = array(
			'brands'             => 'brands',
			'color_families'     => 'color_families',
			'colors'             => 'colors',
			'bases'              => 'bases',
			'product_families'   => 'product_families',
			'product_brands'     => 'product_brands',
			'product_categories' => 'product_categories',
			'sizes'              => 'sizes',
			'sheens'             => 'sheens',
			'surface_types'      => 'surface_types',
			'scene_images'       => 'scene_images',
		);

		$stats = array();
		foreach ( $tables as $key => $table ) {
			$full_table = $prefix . $table;
			$count = $wpdb->get_var( "SELECT COUNT(*) FROM $full_table" );
			$stats[ $key ] = $count !== null ? intval( $count ) : 0;
		}

		return rest_ensure_response( $stats );
	}

	// --- Settings Handlers ---

	public function get_settings( $request ) {
		$defaults = array(
			'store_name'       => '',
			'currency'         => 'USD',
			'measurement_unit' => 'gallons',
			'store_phone'      => '',
			'store_email'      => '',
			'store_address'    => '',
		);
		$settings = get_option( 'paint_store_settings', $defaults );
		$settings = wp_parse_args( $settings, $defaults );
		return rest_ensure_response( $settings );
	}

	public function save_settings( $request ) {
		$settings = array(
			'store_name'       => sanitize_text_field( $request->get_param( 'store_name' ) ),
			'currency'         => sanitize_text_field( $request->get_param( 'currency' ) ),
			'measurement_unit' => sanitize_text_field( $request->get_param( 'measurement_unit' ) ),
			'store_phone'      => sanitize_text_field( $request->get_param( 'store_phone' ) ),
			'store_email'      => sanitize_email( $request->get_param( 'store_email' ) ),
			'store_address'    => sanitize_textarea_field( $request->get_param( 'store_address' ) ),
		);
		update_option( 'paint_store_settings', $settings );
		return rest_ensure_response( array( 'success' => true, 'settings' => $settings ) );
	}

	// --- Product Brands Handlers ---

	public function get_product_brands( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_product_brands", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_product_brand( $request ) {
		global $wpdb;
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_product_brands', array( 'name' => $name ), array( '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_product_brand( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_product_brands', array( 'name' => $name ), array( 'id' => $id ), array( '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_product_brand( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_product_brands', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}
}
