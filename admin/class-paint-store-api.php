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

		// Sheens Endpoints
		register_rest_route( $this->namespace, '/sheens', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_sheens' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_sheen' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/sheens/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_sheen' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_sheen' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
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
}
