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

		// Product Types Endpoints
		register_rest_route( $this->namespace, '/product-types', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_product_types' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_product_type' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/product-types/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_product_type' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_product_type' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );

		// Product Makes Endpoints
		register_rest_route( $this->namespace, '/product-makes', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_product_makes' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_product_make' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/product-makes/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_product_make' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_product_make' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
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

		// Products (Physical SKUs) Endpoints
		register_rest_route( $this->namespace, '/products', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_products' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_product' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/products/export', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'export_products_csv' ),
				'permission_callback' => '__return_true', // Manual check in handler
			),
		) );
		register_rest_route( $this->namespace, '/products/bulk-import', array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'bulk_import_products' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );
		register_rest_route( $this->namespace, '/products/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_product' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_product' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
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
		register_rest_route( $this->namespace, '/product-brands/sync', array(
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'sync_product_brands_to_woo' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
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
		register_rest_route( $this->namespace, '/product-categories/sync', array(
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'sync_product_categories_to_woo' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
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

		// Tool Attributes Endpoints
		register_rest_route( $this->namespace, '/tool-attributes', array(
			array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'get_tool_attributes' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'create_tool_attribute' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
		) );
		register_rest_route( $this->namespace, '/tool-attributes/(?P<id>\\d+)', array(
			array( 'methods' => WP_REST_Server::EDITABLE, 'callback' => array( $this, 'update_tool_attribute' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
			array( 'methods' => WP_REST_Server::DELETABLE, 'callback' => array( $this, 'delete_tool_attribute' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
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
		register_rest_route( $this->namespace, '/surface-types/sync', array(
			array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'sync_surface_types_to_woo' ), 'permission_callback' => array( $this, 'permissions_check' ) ),
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

		// Bulk Export Colors Endpoint
		register_rest_route( $this->namespace, '/colors/export', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'export_colors_csv' ),
				'permission_callback' => '__return_true', // Manual check in handler
			),
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

		register_rest_route( $this->namespace, '/admin/reviews', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'admin_get_reviews' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );

		register_rest_route( $this->namespace, '/admin/reviews/(?P<id>\\d+)', array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'admin_update_review' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'admin_delete_review' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );

		// ==========================================
		// PUBLIC ENDPOINTS (Frontend React App)
		// ==========================================

		register_rest_route( $this->namespace, '/public/product-families/(?P<id>\\d+)', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'public_get_product_family' ),
				'permission_callback' => '__return_true',
			),
		) );

		register_rest_route( $this->namespace, '/public/product-families-list', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'public_get_product_families_list' ),
				'permission_callback' => '__return_true',
			),
		) );

		register_rest_route( $this->namespace, '/public/product-families/(?P<id>\\d+)/reviews', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'public_get_reviews' ),
				'permission_callback' => '__return_true',
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'public_submit_review' ),
				'permission_callback' => '__return_true',
			),
		) );

		// ==========================================
		// PUBLIC Q&A ENDPOINTS
		// ==========================================
		register_rest_route( $this->namespace, '/public/product-families/(?P<id>\\d+)/questions', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'public_get_questions' ),
				'permission_callback' => '__return_true',
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'public_submit_question' ),
				'permission_callback' => '__return_true',
			),
		) );

		register_rest_route( $this->namespace, '/public/questions/(?P<id>\\d+)/answers', array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'public_submit_answer' ),
				'permission_callback' => '__return_true',
			),
		) );

		register_rest_route( $this->namespace, '/public/answers/(?P<id>\\d+)/vote', array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'public_vote_answer' ),
				'permission_callback' => '__return_true',
			),
		) );

		register_rest_route( $this->namespace, '/public/color-families', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'public_get_color_families' ),
				'permission_callback' => '__return_true',
			),
		) );

		register_rest_route( $this->namespace, '/public/colors', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'public_get_colors' ),
				'permission_callback' => '__return_true',
			),
		) );

		register_rest_route( $this->namespace, '/public/brands', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'public_get_brands' ),
				'permission_callback' => '__return_true',
			),
		) );


		// Admin Fulfillment Orders
		register_rest_route( $this->namespace, '/admin/fulfillment-orders', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'admin_get_fulfillment_orders' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );

		register_rest_route( $this->namespace, '/admin/fulfillment-orders/(?P<id>\\d+)', array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'admin_update_fulfillment_order' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
		) );

		// Admin Fulfillment Settings
		register_rest_route( $this->namespace, '/admin/fulfillment-settings', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'admin_get_fulfillment_settings' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'admin_save_fulfillment_settings' ),
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
		$coordinations_table = $wpdb->prefix . 'ps_color_coordinations';

		// Fetch all colors
		$colors = $wpdb->get_results( "SELECT * FROM $colors_table", ARRAY_A );

		// For each color, fetch its assigned bases and coordinating colors
		foreach ( $colors as &$color ) {
			$color_id = $color['id'];
			
			$bases = $wpdb->get_col( $wpdb->prepare(
				"SELECT base_id FROM $color_bases_table WHERE color_id = %d",
				$color_id
			) );
			$color['base_ids'] = $bases ? array_map('intval', $bases) : array();

			$cc_ids = $wpdb->get_col( $wpdb->prepare(
				"SELECT coordinating_color_id FROM $coordinations_table WHERE primary_color_id = %d",
				$color_id
			) );
			$color['coordinating_color_ids'] = $cc_ids ? array_map('intval', $cc_ids) : array();
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
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		$family_id   = intval( $request->get_param( 'family_id' ) );
		$brand_id    = intval( $request->get_param( 'brand_id' ) );
		
		// The frontend will send an array of selected base IDs
		$base_ids    = $request->get_param( 'base_ids' );
		
		// Array of explicitly declared coordinating color IDs
		$coordinating_color_ids = $request->get_param( 'coordinating_color_ids' );

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
				'description' => $description,
				'family_id'  => $family_id,
				'brand_id'   => $brand_id,
			),
			array( '%s', '%s', '%s', '%s', '%s', '%d', '%d' )
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

		// Save the coordinating colors assignments if any
		$coordinations_table = $wpdb->prefix . 'ps_color_coordinations';
		if ( ! empty( $coordinating_color_ids ) && is_array( $coordinating_color_ids ) ) {
			foreach ( $coordinating_color_ids as $cc_id ) {
				if ( intval( $cc_id ) !== $color_id ) { // Prevent self-assignment
					$wpdb->insert(
						$coordinations_table,
						array(
							'primary_color_id'      => $color_id,
							'coordinating_color_id' => intval( $cc_id ),
						),
						array( '%d', '%d' )
					);
				}
			}
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
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		$family_id   = intval( $request->get_param( 'family_id' ) );
		$brand_id    = intval( $request->get_param( 'brand_id' ) );
		
		$base_ids    = $request->get_param( 'base_ids' );
		$coordinating_color_ids = $request->get_param( 'coordinating_color_ids' );

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
				'description' => $description,
				'family_id'  => $family_id,
				'brand_id'   => $brand_id,
			),
			array( 'id' => $id ),
			array( '%s', '%s', '%s', '%s', '%s', '%d', '%d' ),
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

		// Save coordinating colors (delete and re-insert)
		$coordinations_table = $wpdb->prefix . 'ps_color_coordinations';
		$wpdb->delete( $coordinations_table, array( 'primary_color_id' => $id ), array( '%d' ) );
		if ( ! empty( $coordinating_color_ids ) && is_array( $coordinating_color_ids ) ) {
			foreach ( $coordinating_color_ids as $cc_id ) {
				if ( intval( $cc_id ) !== intval( $id ) ) { // Prevent self-assignment
					$wpdb->insert(
						$coordinations_table,
						array(
							'primary_color_id'      => $id,
							'coordinating_color_id' => intval( $cc_id ),
						),
						array( '%d', '%d' )
					);
				}
			}
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
		$description        = sanitize_textarea_field( $request->get_param( 'description' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Family name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->insert(
			$table_name,
			array(
				'name'               => $name,
				'slug'               => $slug,
				'description'        => $description,
				'hex_representative' => $hex_representative,
			),
			array( '%s', '%s', '%s', '%s' )
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
		$description        = sanitize_textarea_field( $request->get_param( 'description' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Family name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->update(
			$table_name,
			array(
				'name'               => $name,
				'slug'               => $slug,
				'description'        => $description,
				'hex_representative' => $hex_representative,
			),
			array( 'id' => $id ),
			array( '%s', '%s', '%s', '%s' ),
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
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Base name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->insert(
			$table_name,
			array(
				'name' => $name,
				'description' => $description,
			),
			array( '%s', '%s' )
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
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Base name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->update(
			$table_name,
			array(
				'name' => $name,
				'description' => $description,
			),
			array( 'id' => $id ),
			array( '%s', '%s' ),
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
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Brand name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->insert(
			$table_name,
			array(
				'name' => $name,
				'description' => $description,
			),
			array( '%s', '%s' )
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
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Brand name is required', array( 'status' => 400 ) );
		}

		$result = $wpdb->update(
			$table_name,
			array(
				'name' => $name,
				'description' => $description,
			),
			array( 'id' => $id ),
			array( '%s', '%s' ),
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
		
		foreach ( $results as &$row ) {
			$row['gallery_images'] = array();
			$row['image_url'] = '';
			if ( ! empty( $row['gallery_image_ids'] ) ) {
				$ids = array_filter( array_map( 'intval', explode( ',', $row['gallery_image_ids'] ) ) );
				foreach ( $ids as $img_id ) {
					$url = wp_get_attachment_url( $img_id );
					if ( $url ) $row['gallery_images'][] = array( 'id' => $img_id, 'url' => $url );
				}
				if ( ! empty( $row['gallery_images'] ) ) {
					$row['image_url'] = $row['gallery_images'][0]['url'];
				}
			}
			// Fetch associated category IDs
			$row['category_ids'] = array_map( 'intval', $wpdb->get_col( $wpdb->prepare(
				"SELECT category_id FROM {$wpdb->prefix}ps_family_categories WHERE family_id = %d", $row['id']
			) ) );
			// Fetch associated surface type IDs
			$row['surface_type_ids'] = array_map( 'intval', $wpdb->get_col( $wpdb->prepare(
				"SELECT surface_type_id FROM {$wpdb->prefix}ps_family_surface_types WHERE family_id = %d", $row['id']
			) ) );
			// Fetch associated sheen IDs (Explicit mapping)
			$row['sheen_ids'] = array_map( 'intval', $wpdb->get_col( $wpdb->prepare(
				"SELECT sheen_id FROM {$wpdb->prefix}ps_family_sheens WHERE family_id = %d", $row['id']
			) ) );
			// Fetch associated size IDs (Explicit mapping)
			$row['size_ids'] = array_map( 'intval', $wpdb->get_col( $wpdb->prepare(
				"SELECT size_id FROM {$wpdb->prefix}ps_family_sizes WHERE family_id = %d", $row['id']
			) ) );
			// Fetch associated brush width IDs (tool_attributes type='width')
			$row['width_ids'] = array_map( 'intval', $wpdb->get_col( $wpdb->prepare(
				"SELECT width_id FROM {$wpdb->prefix}ps_family_widths WHERE family_id = %d", $row['id']
			) ) );
			// Fetch associated scene IDs
			$row['scene_ids'] = array_map( 'intval', $wpdb->get_col( $wpdb->prepare(
				"SELECT scene_id FROM {$wpdb->prefix}ps_family_scenes WHERE family_id = %d", $row['id']
			) ) );
			// Fetch associated datasheets
			$row['datasheets'] = $wpdb->get_results( $wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}ps_family_datasheets WHERE family_id = %d", $row['id']
			), ARRAY_A );
			// Fetch associated family color IDs (for wood stains / specialty)
			$row['family_color_ids'] = array_map( 'intval', $wpdb->get_col( $wpdb->prepare(
				"SELECT color_id FROM {$wpdb->prefix}ps_family_colors WHERE family_id = %d", $row['id']
			) ) );
		}
		return rest_ensure_response( $results );
	}

	public function create_product_family( $request ) {
		global $wpdb;
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$brand_id = intval( $request->get_param( 'brand_id' ) );
		$description = wp_kses_post( $request->get_param( 'description' ) );
		$short_description = wp_kses_post( $request->get_param( 'short_description' ) );
		$how_to_use = wp_kses_post( $request->get_param( 'how_to_use' ) );
		$gallery_ids_raw = $request->get_param( 'gallery_image_ids' );
		$gallery_image_ids = is_array( $gallery_ids_raw ) ? implode( ',', array_map( 'intval', $gallery_ids_raw ) ) : sanitize_text_field( $gallery_ids_raw );
		
		// Accept compare_attributes JSON
		$compare_attributes = wp_unslash( $request->get_param( 'compare_attributes' ) );
		// Ensure it's valid JSON
		if ( ! empty( $compare_attributes ) && is_string( $compare_attributes ) ) {
			$decoded = json_decode( $compare_attributes );
			$compare_attributes = $decoded !== null ? wp_json_encode( $decoded ) : null;
		} else {
			$compare_attributes = null;
		}

		// Extract new Tool Specification IDs
		$tool_handle_shape_id     = intval( $request->get_param( 'tool_handle_shape_id' ) );
		$tool_bristle_material_id = intval( $request->get_param( 'tool_bristle_material_id' ) );
		$tool_head_shape_id       = intval( $request->get_param( 'tool_head_shape_id' ) );
		$tool_handle_length_id    = intval( $request->get_param( 'tool_handle_length_id' ) );
		$tool_handle_material_id  = intval( $request->get_param( 'tool_handle_material_id' ) );
		$tool_stiffness_id        = intval( $request->get_param( 'tool_stiffness_id' ) );
		$tool_paint_compat_id     = intval( $request->get_param( 'tool_paint_compat_id' ) );
		$tool_ferrule_material_id = intval( $request->get_param( 'tool_ferrule_material_id' ) );

		$make_id = intval( $request->get_param( 'make_id' ) );

		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		
		$result = $wpdb->insert( $wpdb->prefix . 'ps_product_families', array( 'name' => $name, 'brand_id' => $brand_id, 'make_id' => $make_id, 'description' => $description, 'short_description' => $short_description, 'how_to_use' => $how_to_use, 'gallery_image_ids' => $gallery_image_ids, 'compare_attributes' => $compare_attributes, 'tool_handle_shape_id' => $tool_handle_shape_id, 'tool_bristle_material_id' => $tool_bristle_material_id, 'tool_head_shape_id' => $tool_head_shape_id, 'tool_handle_length_id' => $tool_handle_length_id, 'tool_handle_material_id' => $tool_handle_material_id, 'tool_stiffness_id' => $tool_stiffness_id, 'tool_paint_compat_id' => $tool_paint_compat_id, 'tool_ferrule_material_id' => $tool_ferrule_material_id ), array( '%s', '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%d', '%d', '%d', '%d', '%d', '%d', '%d', '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		
		$family_id = $wpdb->insert_id;
		$this->sync_family_relations( $family_id, $request );
		
		return rest_ensure_response( array( 'id' => $family_id ) );
	}

	public function update_product_family( $request ) {
		global $wpdb;
		$id = intval( $request->get_param( 'id' ) );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$brand_id = intval( $request->get_param( 'brand_id' ) );
		$description = wp_kses_post( $request->get_param( 'description' ) );
		$short_description = wp_kses_post( $request->get_param( 'short_description' ) );
		$how_to_use = wp_kses_post( $request->get_param( 'how_to_use' ) );
		$gallery_ids_raw = $request->get_param( 'gallery_image_ids' );
		$gallery_image_ids = is_array( $gallery_ids_raw ) ? implode( ',', array_map( 'intval', $gallery_ids_raw ) ) : sanitize_text_field( $gallery_ids_raw );
		
		// Accept compare_attributes JSON
		$compare_attributes = wp_unslash( $request->get_param( 'compare_attributes' ) );
		// Ensure it's valid JSON
		if ( ! empty( $compare_attributes ) && is_string( $compare_attributes ) ) {
			$decoded = json_decode( $compare_attributes );
			$compare_attributes = $decoded !== null ? wp_json_encode( $decoded ) : null;
		} else {
			$compare_attributes = null;
		}

		// Extract new Tool Specification IDs
		$tool_handle_shape_id     = intval( $request->get_param( 'tool_handle_shape_id' ) );
		$tool_bristle_material_id = intval( $request->get_param( 'tool_bristle_material_id' ) );
		$tool_head_shape_id       = intval( $request->get_param( 'tool_head_shape_id' ) );
		$tool_handle_length_id    = intval( $request->get_param( 'tool_handle_length_id' ) );
		$tool_handle_material_id  = intval( $request->get_param( 'tool_handle_material_id' ) );
		$tool_stiffness_id        = intval( $request->get_param( 'tool_stiffness_id' ) );
		$tool_paint_compat_id     = intval( $request->get_param( 'tool_paint_compat_id' ) );
		$tool_ferrule_material_id = intval( $request->get_param( 'tool_ferrule_material_id' ) );


		$make_id = intval( $request->get_param( 'make_id' ) );

		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		
		$result = $wpdb->update( $wpdb->prefix . 'ps_product_families', array( 'name' => $name, 'brand_id' => $brand_id, 'make_id' => $make_id, 'description' => $description, 'short_description' => $short_description, 'how_to_use' => $how_to_use, 'gallery_image_ids' => $gallery_image_ids, 'compare_attributes' => $compare_attributes, 'tool_handle_shape_id' => $tool_handle_shape_id, 'tool_bristle_material_id' => $tool_bristle_material_id, 'tool_head_shape_id' => $tool_head_shape_id, 'tool_handle_length_id' => $tool_handle_length_id, 'tool_handle_material_id' => $tool_handle_material_id, 'tool_stiffness_id' => $tool_stiffness_id, 'tool_paint_compat_id' => $tool_paint_compat_id, 'tool_ferrule_material_id' => $tool_ferrule_material_id ), array( 'id' => $id ), array( '%s', '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%d', '%d', '%d', '%d', '%d', '%d', '%d', '%d' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		
		$this->sync_family_relations( $id, $request );
		
		return rest_ensure_response( array( 'success' => true ) );
	}

	private function sync_family_relations( $family_id, $request ) {
		global $wpdb;
		
		// Sync categories
		$category_ids = $request->get_param( 'category_ids' );
		if ( is_array( $category_ids ) ) {
			$wpdb->delete( $wpdb->prefix . 'ps_family_categories', array( 'family_id' => $family_id ), array( '%d' ) );
			foreach ( $category_ids as $cid ) {
				$wpdb->insert( $wpdb->prefix . 'ps_family_categories', array( 'family_id' => $family_id, 'category_id' => intval( $cid ) ), array( '%d', '%d' ) );
			}
		}
		
		// Sync surface types
		$surface_type_ids = $request->get_param( 'surface_type_ids' );
		if ( is_array( $surface_type_ids ) ) {
			$wpdb->delete( $wpdb->prefix . 'ps_family_surface_types', array( 'family_id' => $family_id ), array( '%d' ) );
			foreach ( $surface_type_ids as $sid ) {
				$wpdb->insert( $wpdb->prefix . 'ps_family_surface_types', array( 'family_id' => $family_id, 'surface_type_id' => intval( $sid ) ), array( '%d', '%d' ) );
			}
		}

		// Sync sheens (Explicit mapping)
		$sheen_ids = $request->get_param( 'sheen_ids' );
		if ( is_array( $sheen_ids ) ) {
			$wpdb->delete( $wpdb->prefix . 'ps_family_sheens', array( 'family_id' => $family_id ), array( '%d' ) );
			foreach ( $sheen_ids as $shid ) {
				$wpdb->insert( $wpdb->prefix . 'ps_family_sheens', array( 'family_id' => $family_id, 'sheen_id' => intval( $shid ) ), array( '%d', '%d' ) );
			}
		}

		// Sync sizes (Explicit mapping)
		$size_ids = $request->get_param( 'size_ids' );
		if ( is_array( $size_ids ) ) {
			$wpdb->delete( $wpdb->prefix . 'ps_family_sizes', array( 'family_id' => $family_id ), array( '%d' ) );
			foreach ( $size_ids as $sid ) {
				$wpdb->insert( $wpdb->prefix . 'ps_family_sizes', array( 'family_id' => $family_id, 'size_id' => intval( $sid ) ), array( '%d', '%d' ) );
			}
		}

		// Sync brush widths (tool_attributes type='width')
		$width_ids = $request->get_param( 'width_ids' );
		if ( is_array( $width_ids ) ) {
			$wpdb->delete( $wpdb->prefix . 'ps_family_widths', array( 'family_id' => $family_id ), array( '%d' ) );
			foreach ( $width_ids as $wid ) {
				$wpdb->insert( $wpdb->prefix . 'ps_family_widths', array( 'family_id' => $family_id, 'width_id' => intval( $wid ) ), array( '%d', '%d' ) );
			}
		}

		// Sync datasheets
		$datasheets = $request->get_param( 'datasheets' );
		if ( is_array( $datasheets ) ) {
			$wpdb->delete( $wpdb->prefix . 'ps_family_datasheets', array( 'family_id' => $family_id ), array( '%d' ) );
			foreach ( $datasheets as $sheet ) {
				// Resolve URLs if needed
				$sds_url = sanitize_text_field( $sheet['sds_file_url'] ?? '' );
				$pds_url = sanitize_text_field( $sheet['pds_file_url'] ?? '' );
				
				if ( ! empty( $sheet['sds_file_id'] ) && empty( $sds_url ) ) {
					$sds_url = wp_get_attachment_url( intval( $sheet['sds_file_id'] ) ) ?: '';
				}
				if ( ! empty( $sheet['pds_file_id'] ) && empty( $pds_url ) ) {
					$pds_url = wp_get_attachment_url( intval( $sheet['pds_file_id'] ) ) ?: '';
				}

				$wpdb->insert( $wpdb->prefix . 'ps_family_datasheets', array( 
					'family_id' => $family_id,
					'product_number' => sanitize_text_field( $sheet['product_number'] ?? '' ),
					'sheen' => sanitize_text_field( $sheet['sheen'] ?? '' ),
					'base_color' => sanitize_text_field( $sheet['base_color'] ?? '' ),
					'container_size' => sanitize_text_field( $sheet['container_size'] ?? '' ),
					'sds_file_id' => intval( $sheet['sds_file_id'] ?? 0 ),
					'sds_file_url' => $sds_url,
					'pds_file_id' => intval( $sheet['pds_file_id'] ?? 0 ),
					'pds_file_url' => $pds_url
				), array( '%d', '%s', '%s', '%s', '%s', '%d', '%s', '%d', '%s' ) );
			}
		}

		// Sync scenes
		$scene_ids = $request->get_param( 'scene_ids' );
		if ( is_array( $scene_ids ) ) {
			$wpdb->delete( $wpdb->prefix . 'ps_family_scenes', array( 'family_id' => $family_id ), array( '%d' ) );
			foreach ( $scene_ids as $scid ) {
				$wpdb->insert( $wpdb->prefix . 'ps_family_scenes', array( 'family_id' => $family_id, 'scene_id' => intval( $scid ) ), array( '%d', '%d' ) );
			}
		}

		// Sync family colors (for wood stains / specialty coatings)
		$family_color_ids = $request->get_param( 'family_color_ids' );
		if ( is_array( $family_color_ids ) ) {
			$wpdb->delete( $wpdb->prefix . 'ps_family_colors', array( 'family_id' => $family_id ), array( '%d' ) );
			foreach ( $family_color_ids as $cid ) {
				$wpdb->insert( $wpdb->prefix . 'ps_family_colors', array( 'family_id' => $family_id, 'color_id' => intval( $cid ) ), array( '%d', '%d' ) );
			}
		}
	}

	public function delete_product_family( $request ) {
		global $wpdb;
		$id = intval( $request->get_param( 'id' ) );
		$wpdb->delete( $wpdb->prefix . 'ps_product_families', array( 'id' => $id ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Products (Physical SKUs) Handlers ---

	public function get_products( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_products", ARRAY_A );
		// Ensure IDs are cast to integers for the frontend
		foreach( $results as &$row ) {
			$row['id']         = intval( $row['id'] );
			$row['family_id']  = intval( $row['family_id'] );
			$row['size_id']    = intval( $row['size_id'] );
			$row['sheen_id']   = intval( $row['sheen_id'] );
			$row['base_id']    = intval( $row['base_id'] );
			$row['surface_id'] = intval( $row['surface_id'] );
			$row['price']      = floatval( $row['price'] );
			$row['stock_quantity'] = intval( $row['stock_quantity'] );
			$row['color_name'] = isset( $row['color_name'] ) ? $row['color_name'] : '';
			$row['opacity']    = isset( $row['opacity'] ) ? $row['opacity'] : '';
			$row['stain_image_id'] = intval( isset( $row['stain_image_id'] ) ? $row['stain_image_id'] : 0 );
			$row['stain_image_url'] = $row['stain_image_id'] > 0 ? wp_get_attachment_url( $row['stain_image_id'] ) : '';
			$row['width_id'] = intval( isset( $row['width_id'] ) ? $row['width_id'] : 0 );
		}
		return rest_ensure_response( $results );
	}

	public function create_product( $request ) {
		global $wpdb;
		$family_id  = intval( $request->get_param( 'family_id' ) );
		$size_id    = intval( $request->get_param( 'size_id' ) );
		$sheen_id   = intval( $request->get_param( 'sheen_id' ) );
		$base_id    = intval( $request->get_param( 'base_id' ) );
		$surface_id = intval( $request->get_param( 'surface_id' ) );
		$sku        = sanitize_text_field( $request->get_param( 'sku' ) );
		$price      = floatval( $request->get_param( 'price' ) );
		$stock_quantity = intval( $request->get_param( 'stock_quantity' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		$color_name = sanitize_text_field( $request->get_param( 'color_name' ) );
		$opacity    = sanitize_text_field( $request->get_param( 'opacity' ) );
		$stain_image_id = intval( $request->get_param( 'stain_image_id' ) );
		$width_id   = intval( $request->get_param( 'width_id' ) );
		
		if ( ! $family_id ) return new WP_Error( 'missing_family', 'Product Family is required', array( 'status' => 400 ) );
		
		$result = $wpdb->insert( 
			$wpdb->prefix . 'ps_products', 
			array( 
				'family_id'  => $family_id, 
				'size_id'    => $size_id, 
				'sheen_id'   => $sheen_id, 
				'base_id'    => $base_id,
				'surface_id' => $surface_id,
				'sku'        => $sku,
				'price'      => $price,
				'description' => $description,
				'stock_quantity' => $stock_quantity,
				'color_name' => $color_name,
				'opacity'    => $opacity,
				'stain_image_id' => $stain_image_id,
				'width_id'   => $width_id
			), 
			array( '%d', '%d', '%d', '%d', '%d', '%s', '%f', '%s', '%d', '%s', '%s', '%d', '%d' ) 
		);
		
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_product( $request ) {
		global $wpdb;
		$id         = intval( $request->get_param( 'id' ) );
		$family_id  = intval( $request->get_param( 'family_id' ) );
		$size_id    = intval( $request->get_param( 'size_id' ) );
		$sheen_id   = intval( $request->get_param( 'sheen_id' ) );
		$base_id    = intval( $request->get_param( 'base_id' ) );
		$surface_id = intval( $request->get_param( 'surface_id' ) );
		$sku        = sanitize_text_field( $request->get_param( 'sku' ) );
		$price      = floatval( $request->get_param( 'price' ) );
		$stock_quantity = intval( $request->get_param( 'stock_quantity' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		$color_name = sanitize_text_field( $request->get_param( 'color_name' ) );
		$opacity    = sanitize_text_field( $request->get_param( 'opacity' ) );
		$stain_image_id = intval( $request->get_param( 'stain_image_id' ) );
		$width_id   = intval( $request->get_param( 'width_id' ) );
		
		if ( ! $family_id ) return new WP_Error( 'missing_family', 'Product Family is required', array( 'status' => 400 ) );
		
		$result = $wpdb->update( 
			$wpdb->prefix . 'ps_products', 
			array( 
				'family_id'  => $family_id, 
				'size_id'    => $size_id, 
				'sheen_id'   => $sheen_id, 
				'base_id'    => $base_id,
				'surface_id' => $surface_id,
				'sku'        => $sku,
				'price'      => $price,
				'description' => $description,
				'stock_quantity' => $stock_quantity,
				'color_name' => $color_name,
				'opacity'    => $opacity,
				'stain_image_id' => $stain_image_id,
				'width_id'   => $width_id
			), 
			array( 'id' => $id ), 
			array( '%d', '%d', '%d', '%d', '%d', '%s', '%f', '%s', '%d', '%s', '%s', '%d', '%d' ), 
			array( '%d' ) 
		);
		
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_product( $request ) {
		global $wpdb;
		$id = intval( $request->get_param( 'id' ) );
		$wpdb->delete( $wpdb->prefix . 'ps_products', array( 'id' => $id ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function sync_product_family_to_woo( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) return new WP_Error( 'woo_missing', 'WooCommerce is not active.', array( 'status' => 400 ) );
		global $wpdb;
		$family_id = intval( $request->get_param( 'id' ) );
		
		try {
		// 1. Get the Family
		$family = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ps_product_families WHERE id = %d", $family_id ) );
		if ( ! $family ) return new WP_Error( 'not_found', 'Product family not found.', array( 'status' => 404 ) );

		// Let's create the parent Variable Product first.
		$product = new WC_Product_Variable();
		if ( $family->wc_product_id ) {
			try {
				$existing = wc_get_product( $family->wc_product_id );
				if ( $existing && $existing->is_type( 'variable' ) ) {
					$product = $existing;
				}
			} catch ( Exception $e ) {
				$product = new WC_Product_Variable(); // fallback if deleted in woo
			}
		}

		$product->set_name( $family->name );
		$product->set_description( $family->description ?: '' );
		$product->set_short_description( isset( $family->short_description ) ? $family->short_description : '' );
		// Set featured image and gallery from gallery_image_ids
		if ( ! empty( $family->gallery_image_ids ) ) {
			$gallery_ids = array_filter( array_map( 'intval', explode( ',', $family->gallery_image_ids ) ) );
			if ( ! empty( $gallery_ids ) ) {
				$product->set_image_id( $gallery_ids[0] );
				if ( count( $gallery_ids ) > 1 ) {
					$product->set_gallery_image_ids( array_slice( $gallery_ids, 1 ) );
				}
			}
		}
		
		// 3. Get all physical products (SKUs) under this family
		$physical_products = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ps_products WHERE family_id = %d", $family_id ) );
		if ( empty( $physical_products ) ) {
			return new WP_Error( 'no_products', 'No physical SKUs have been mapped to this Product Family yet. Create them first in the Physical Products tab.', array( 'status' => 400 ) );
		}

		// 4. Extract purely the unique sizes and sheens utilized by these physical products
		$attached_size_ids = array_unique( wp_list_pluck( $physical_products, 'size_id' ) );
		$attached_sheen_ids = array_unique( wp_list_pluck( $physical_products, 'sheen_id' ) );

		if ( empty( $attached_size_ids ) || empty( $attached_sheen_ids ) ) {
			return new WP_Error( 'missing_attributes', 'The physical products must have Sizes and Sheens assigned.', array( 'status' => 400 ) );
		}

		// Pull the Woo Attribute Terms mappings for those distinct IDs
		$size_list = implode( ',', array_map( 'intval', $attached_size_ids ) );
		$sheen_list = implode( ',', array_map( 'intval', $attached_sheen_ids ) );
		
		$sizes = $wpdb->get_results( "SELECT wc_attribute_id, name FROM {$wpdb->prefix}ps_sizes WHERE id IN ($size_list) AND wc_attribute_id > 0" );
		$sheens = $wpdb->get_results( "SELECT wc_attribute_id, name FROM {$wpdb->prefix}ps_sheens WHERE id IN ($sheen_list) AND wc_attribute_id > 0" );
		
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

		// 4b. Assign WooCommerce Categories from the family's linked categories
		$linked_category_ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT fc.category_id FROM {$wpdb->prefix}ps_family_categories fc WHERE fc.family_id = %d", $family_id
		) );
		if ( ! empty( $linked_category_ids ) ) {
			$wc_cat_ids = array();
			foreach ( $linked_category_ids as $ps_cat_id ) {
				$wc_cat_id = $wpdb->get_var( $wpdb->prepare(
					"SELECT wc_category_id FROM {$wpdb->prefix}ps_product_categories WHERE id = %d AND wc_category_id > 0", $ps_cat_id
				) );
				if ( $wc_cat_id ) $wc_cat_ids[] = intval( $wc_cat_id );
			}
			if ( ! empty( $wc_cat_ids ) ) {
				wp_set_object_terms( $product_id, $wc_cat_ids, 'product_cat' );
			}
		}

		// 4c. Assign Brand taxonomy term from the family's brand
		if ( $family->brand_id ) {
			$brand = $wpdb->get_row( $wpdb->prepare(
				"SELECT name, slug, description FROM {$wpdb->prefix}ps_product_brands WHERE id = %d", $family->brand_id
			) );
			if ( $brand ) {
				$brand_slug = ! empty( $brand->slug ) ? $brand->slug : sanitize_title( $brand->name );
				// Create or get the term in the product_brand taxonomy
				$term = term_exists( $brand_slug, 'product_brand' );
				if ( ! $term ) {
					$term = wp_insert_term( $brand->name, 'product_brand', array( 'slug' => $brand_slug ) );
				}
				if ( ! is_wp_error( $term ) ) {
					$term_id = is_array( $term ) ? $term['term_id'] : $term;
					wp_set_object_terms( $product_id, intval( $term_id ), 'product_brand' );
				}
			}
		}

		// 5. Generate / Update WooCommerce Variations mapping to explicitly defined ps_products
		$synced_variations = 0;
		foreach ( $physical_products as $ps_product ) {
			
			// Find the Woo Term Slug for this product's specific Size
			$size_wc_id = $wpdb->get_var( $wpdb->prepare( "SELECT wc_attribute_id FROM {$wpdb->prefix}ps_sizes WHERE id = %d", $ps_product->size_id ) );
			$size_term = $size_wc_id ? get_term( $size_wc_id ) : false;
			
			// Find the Woo Term Slug for this product's specific Sheen
			$sheen_wc_id = $wpdb->get_var( $wpdb->prepare( "SELECT wc_attribute_id FROM {$wpdb->prefix}ps_sheens WHERE id = %d", $ps_product->sheen_id ) );
			$sheen_term = $sheen_wc_id ? get_term( $sheen_wc_id ) : false;

			if ( ! $size_term || ! $sheen_term || is_wp_error( $size_term ) || is_wp_error( $sheen_term ) ) continue;

			// Check if variation exists for this exact Size + Sheen block
			$variation_id = $this->find_matching_variation( $product_id, array(
				'attribute_pa_paint_size' => $size_term->slug,
				'attribute_pa_paint_sheen' => $sheen_term->slug
			) );

			try {
				$variation = new WC_Product_Variation( $variation_id );
				$variation->set_parent_id( $product_id );
				$variation->set_attributes( array(
					'pa_paint_size' => $size_term->slug,
					'pa_paint_sheen' => $sheen_term->slug
				) );
				
				$variation->set_regular_price( $ps_product->price );
				// Only set SKU if it's non-empty, and catch duplicate SKU errors
				if ( ! empty( $ps_product->sku ) ) {
					$variation->set_sku( $ps_product->sku );
				}
				$variation->set_manage_stock( true );
				$variation->set_stock_quantity( $ps_product->stock_quantity );
				
				$var_id_saved = $variation->save();
				
				if ( $var_id_saved ) {
					// Update ps_product table linking to the distinct Woo Variation ID
					$wpdb->update( $wpdb->prefix . 'ps_products', array( 'woo_product_id' => $var_id_saved ), array( 'id' => $ps_product->id ) );
					$synced_variations++;
				}
			} catch ( Exception $e ) {
				// Skip this variation if there's a WooCommerce error (e.g. duplicate SKU)
				continue;
			}
		}

		return rest_ensure_response( array( 'success' => true, 'wc_product_id' => $product_id ) );

		} catch ( Exception $e ) {
			return new WP_Error( 'sync_error', 'Sync failed: ' . $e->getMessage(), array( 'status' => 500 ) );
		}
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

	// ========== Product Types ==========
	public function get_product_types( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_product_types ORDER BY name ASC", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_product_type( $request ) {
		global $wpdb;
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$slug = sanitize_title( $name );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_product_types', array( 'name' => $name, 'slug' => $slug, 'description' => $description ), array( '%s', '%s', '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_product_type( $request ) {
		global $wpdb;
		$id = intval( $request->get_param( 'id' ) );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$slug = sanitize_title( $name );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_product_types', array( 'name' => $name, 'slug' => $slug, 'description' => $description ), array( 'id' => $id ), array( '%s', '%s', '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_product_type( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_product_types', array( 'id' => intval( $request->get_param( 'id' ) ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	// ========== Product Makes ==========
	public function get_product_makes( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT m.*, t.name AS type_name FROM {$wpdb->prefix}ps_product_makes m LEFT JOIN {$wpdb->prefix}ps_product_types t ON m.product_type_id = t.id ORDER BY m.name ASC", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_product_make( $request ) {
		global $wpdb;
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$slug = sanitize_title( $name );
		$product_type_id = intval( $request->get_param( 'product_type_id' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) || empty( $product_type_id ) ) return new WP_Error( 'missing_fields', 'Name and Product Type are required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_product_makes', array( 'name' => $name, 'slug' => $slug, 'product_type_id' => $product_type_id, 'description' => $description ), array( '%s', '%s', '%d', '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_product_make( $request ) {
		global $wpdb;
		$id = intval( $request->get_param( 'id' ) );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$slug = sanitize_title( $name );
		$product_type_id = intval( $request->get_param( 'product_type_id' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) || empty( $product_type_id ) ) return new WP_Error( 'missing_fields', 'Name and Product Type are required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_product_makes', array( 'name' => $name, 'slug' => $slug, 'product_type_id' => $product_type_id, 'description' => $description ), array( 'id' => $id ), array( '%s', '%s', '%d', '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_product_make( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_product_makes', array( 'id' => intval( $request->get_param( 'id' ) ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	// ========== Product Categories ==========
	public function get_product_categories( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_product_categories", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_product_category( $request ) {
		global $wpdb;
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$slug = sanitize_title( $name );
		$make_id = intval( $request->get_param( 'make_id' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_product_categories', array( 'name' => $name, 'slug' => $slug, 'make_id' => $make_id, 'description' => $description ), array( '%s', '%s', '%d', '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_product_category( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$slug = sanitize_title( $name );
		$make_id = intval( $request->get_param( 'make_id' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_product_categories', array( 'name' => $name, 'slug' => $slug, 'make_id' => $make_id, 'description' => $description ), array( 'id' => $id ), array( '%s', '%s', '%d', '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_product_category( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_product_categories', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function sync_product_categories_to_woo( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) return new WP_Error( 'woo_missing', 'WooCommerce is not active.', array( 'status' => 400 ) );
		global $wpdb;

		$categories = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_product_categories" );
		$synced = 0;

		foreach ( $categories as $category ) {
			$term = term_exists( $category->name, 'product_cat' );
			if ( ! $term ) {
				$term = wp_insert_term( $category->name, 'product_cat', array( 'slug' => $category->slug, 'description' => $category->description ) );
				} else {
					wp_update_term( $term['term_id'], 'product_cat', array( 'description' => $category->description ) );
				}
			if ( ! is_wp_error( $term ) && isset( $term['term_id'] ) ) {
				$wpdb->update( $wpdb->prefix . 'ps_product_categories', array( 'wc_category_id' => $term['term_id'] ), array( 'id' => $category->id ) );
				$synced++;
			}
		}
		
		return rest_ensure_response( array( 'success' => true, 'synced' => $synced ) );
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
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_sizes', array( 'name' => $name, 'liters' => $liters, 'description' => $description ), array( '%s', '%f', '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_size( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$liters = floatval( $request->get_param( 'liters' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_sizes', array( 'name' => $name, 'liters' => $liters, 'description' => $description ), array( 'id' => $id ), array( '%s', '%f', '%s' ), array( '%d' ) );
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
		$attribute_id = wc_attribute_taxonomy_id_by_name( $taxonomy );
		if ( ! $attribute_id ) {
			$attribute_id = wc_attribute_taxonomy_id_by_name( 'Paint Size' );
		}

		if ( ! $attribute_id ) {
			$attribute_id = wc_create_attribute( array( 'name' => 'Paint Size', 'slug' => $slug, 'type' => 'select' ) );
			if ( is_wp_error( $attribute_id ) ) return $attribute_id;
		}
		if ( ! taxonomy_exists( $taxonomy ) ) {
			register_taxonomy( $taxonomy, array( 'product' ) );
		}

		// 2. Sync all local sizes to terms
		$sizes = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_sizes" );
		$synced = 0;

		foreach ( $sizes as $size ) {
			$term = term_exists( $size->name, $taxonomy );
			if ( ! $term ) {
				$term = wp_insert_term( $size->name, $taxonomy, array( 'description' => $size->description ) );
				} else {
					wp_update_term( $term['term_id'], $taxonomy, array( 'description' => $size->description ) );
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
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_sheens', array( 'name' => $name, 'description' => $description ), array( '%s', '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_sheen( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_sheens', array( 'name' => $name, 'description' => $description ), array( 'id' => $id ), array( '%s', '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_sheen( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_sheens', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Tool Attributes Handlers ---

	public function get_tool_attributes( $request ) {
		global $wpdb;
		$type = $request->get_param( 'attribute_type' );
		if ( ! empty( $type ) ) {
			$results = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ps_tool_attributes WHERE attribute_type = %s ORDER BY name", $type ), ARRAY_A );
		} else {
			$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_tool_attributes ORDER BY attribute_type, name", ARRAY_A );
		}
		return rest_ensure_response( $results );
	}

	public function create_tool_attribute( $request ) {
		global $wpdb;
		$attribute_type = sanitize_text_field( $request->get_param( 'attribute_type' ) );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $attribute_type ) || empty( $name ) ) return new WP_Error( 'missing_fields', 'attribute_type and name are required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_tool_attributes', array( 'attribute_type' => $attribute_type, 'name' => $name, 'description' => $description ), array( '%s', '%s', '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_tool_attribute( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$attribute_type = sanitize_text_field( $request->get_param( 'attribute_type' ) );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_tool_attributes', array( 'attribute_type' => $attribute_type, 'name' => $name, 'description' => $description ), array( 'id' => $id ), array( '%s', '%s', '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_tool_attribute( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_tool_attributes', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}
	public function sync_sheens_to_woo( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) return new WP_Error( 'woo_missing', 'WooCommerce is not active.', array( 'status' => 400 ) );
		global $wpdb;

		$slug = 'paint_sheen';
		$taxonomy = 'pa_' . $slug;
		$attribute_id = wc_attribute_taxonomy_id_by_name( $taxonomy );
		if ( ! $attribute_id ) {
			$attribute_id = wc_attribute_taxonomy_id_by_name( 'Paint Sheen' );
		}

		if ( ! $attribute_id ) {
			$attribute_id = wc_create_attribute( array( 'name' => 'Paint Sheen', 'slug' => $slug, 'type' => 'select' ) );
			if ( is_wp_error( $attribute_id ) ) return $attribute_id;
		}
		if ( ! taxonomy_exists( $taxonomy ) ) {
			register_taxonomy( $taxonomy, array( 'product' ) );
		}

		$sheens = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_sheens" );
		$synced = 0;

		foreach ( $sheens as $sheen ) {
			$term = term_exists( $sheen->name, $taxonomy );
			if ( ! $term ) {
				$term = wp_insert_term( $sheen->name, $taxonomy, array( 'description' => $sheen->description ) );
				} else {
					wp_update_term( $term['term_id'], $taxonomy, array( 'description' => $sheen->description ) );
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
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_surface_types', array( 'name' => $name, 'description' => $description ), array( '%s', '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_surface_type( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_surface_types', array( 'name' => $name, 'description' => $description ), array( 'id' => $id ), array( '%s', '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_surface_type( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_surface_types', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function sync_surface_types_to_woo( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) return new WP_Error( 'woo_missing', 'WooCommerce is not active.', array( 'status' => 400 ) );
		global $wpdb;

		$slug = 'paint_surface';
		$taxonomy = 'pa_' . $slug;
		$attribute_id = wc_attribute_taxonomy_id_by_name( $taxonomy );
		if ( ! $attribute_id ) {
			$attribute_id = wc_attribute_taxonomy_id_by_name( 'Paint Surface' );
		}

		if ( ! $attribute_id ) {
			$attribute_id = wc_create_attribute( array( 'name' => 'Paint Surface', 'slug' => $slug, 'type' => 'select' ) );
			if ( is_wp_error( $attribute_id ) ) return $attribute_id;
		}
		if ( ! taxonomy_exists( $taxonomy ) ) {
			register_taxonomy( $taxonomy, array( 'product' ) );
		}

		$surfaces = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_surface_types" );
		$synced = 0;

		foreach ( $surfaces as $surface ) {
			$term = term_exists( $surface->name, $taxonomy );
			if ( ! $term ) {
				$term = wp_insert_term( $surface->name, $taxonomy, array( 'description' => $surface->description ) );
				} else {
					wp_update_term( $term['term_id'], $taxonomy, array( 'description' => $surface->description ) );
				}
			if ( ! is_wp_error( $term ) && isset( $term['term_id'] ) ) {
				$wpdb->update( $wpdb->prefix . 'ps_surface_types', array( 'wc_attribute_id' => $term['term_id'] ), array( 'id' => $surface->id ) );
				$synced++;
			}
		}
		
		return rest_ensure_response( array( 'success' => true, 'synced' => $synced ) );
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
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		if ( empty( $image_id ) ) return new WP_Error( 'missing_image', 'Image is required', array( 'status' => 400 ) );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_scene_images', array( 'name' => $name, 'image_id' => $image_id, 'description' => $description ), array( '%s', '%d', '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_scene_image( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$image_id = intval( $request->get_param( 'image_id' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$result = $wpdb->update( $wpdb->prefix . 'ps_scene_images', array( 'name' => $name, 'image_id' => $image_id, 'description' => $description ), array( 'id' => $id ), array( '%s', '%d', '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function delete_scene_image( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_scene_images', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Bulk Export Colors Handler ---

	public function export_colors_csv( $request ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Unauthorized Access' );
		}

		global $wpdb;

		// Fetch all colors with their joined family and brand names
		$query = "
			SELECT c.*, f.name as family_name, b.name as brand_name
			FROM {$wpdb->prefix}ps_colors c
			LEFT JOIN {$wpdb->prefix}ps_color_families f ON c.family_id = f.id
			LEFT JOIN {$wpdb->prefix}ps_brands b ON c.brand_id = b.id
			ORDER BY c.name ASC
		";
		$colors = $wpdb->get_results( $query, ARRAY_A );

		// We also need to fetch all base associations to build the 'Bases' column
		$bases_query = "
			SELECT cb.color_id, b.name
			FROM {$wpdb->prefix}ps_color_bases cb
			INNER JOIN {$wpdb->prefix}ps_bases b ON cb.base_id = b.id
		";
		$color_bases_raw = $wpdb->get_results( $bases_query );
		
		// Map color_id -> array of base names
		$bases_map = array();
		foreach ( $color_bases_raw as $row ) {
			if ( ! isset( $bases_map[ $row->color_id ] ) ) {
				$bases_map[ $row->color_id ] = array();
			}
			$bases_map[ $row->color_id ][] = $row->name;
		}

		// Prepare headers for CSV download
		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename=paint_store_colors_export.csv' );

		// Create a file pointer connected to the output stream
		$output = fopen( 'php://output', 'w' );

		// Output the column headings
		fputcsv( $output, array( 'Name', 'Code', 'Hex', 'RGB', 'Family', 'Brand', 'Bases' ) );

		// Loop over the rows, formatting the data
		foreach ( $colors as $color ) {
			$bases_str = '';
			if ( isset( $bases_map[ $color['id'] ] ) ) {
				$bases_str = implode( '|', $bases_map[ $color['id'] ] );
			}

			fputcsv( $output, array(
				$color['name'],
				$color['color_code'],
				$color['hex_value'],
				$color['rgb_value'],
				$color['family_name'],
				$color['brand_name'],
				$bases_str
			) );
		}

		fclose( $output );
		exit; // Stop execution to ensure only the CSV is sent
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
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$slug = sanitize_title( $name );
		$result = $wpdb->insert( $wpdb->prefix . 'ps_product_brands', array( 'name' => $name, 'slug' => $slug, 'description' => $description ), array( '%s', '%s', '%s' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	public function update_product_brand( $request ) {
		global $wpdb;
		$id = $request->get_param( 'id' );
		$name = sanitize_text_field( $request->get_param( 'name' ) );
		$description = sanitize_textarea_field( $request->get_param( 'description' ) );
		if ( empty( $name ) ) return new WP_Error( 'missing_name', 'Name is required', array( 'status' => 400 ) );
		$slug = sanitize_title( $name );
		$result = $wpdb->update( $wpdb->prefix . 'ps_product_brands', array( 'name' => $name, 'slug' => $slug, 'description' => $description ), array( 'id' => $id ), array( '%s', '%s', '%s' ), array( '%d' ) );
		if ( false === $result ) return new WP_Error( 'db_error', $wpdb->last_error, array( 'status' => 500 ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Bulk Export Physical Products (SKUs) Handler ---

	public function export_products_csv( $request ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Unauthorized Access' );
		}

		global $wpdb;
		fclose( $output );
		exit;
	}

	public function bulk_import_products( $request ) {
		global $wpdb;
		$products = $request->get_param( 'products' );
		if ( ! is_array( $products ) || empty( $products ) ) {
			return new WP_Error( 'missing_products', 'No products provided', array( 'status' => 400 ) );
		}

		$products_table = $wpdb->prefix . 'ps_products';
		$imported = 0;
		$errors = array();

		foreach ( $products as $idx => $product ) {
			$family_id = intval( isset( $product['family_id'] ) ? $product['family_id'] : 0 );
			$base_id   = intval( isset( $product['base_id'] ) ? $product['base_id'] : 0 );
			$size_id   = intval( isset( $product['size_id'] ) ? $product['size_id'] : 0 );
			$sheen_id  = intval( isset( $product['sheen_id'] ) ? $product['sheen_id'] : 0 );
			$surface_id = intval( isset( $product['surface_id'] ) ? $product['surface_id'] : 0 );

			if ( ! $family_id || ! $base_id || ! $size_id || ! $sheen_id || ! $surface_id ) {
				$errors[] = 'Row ' . ($idx + 1) . ': Missing required relations (Family, Base, Size, Sheen, or Surface).';
				continue;
			}

			$data = array(
				'family_id'      => $family_id,
				'base_id'        => $base_id,
				'size_id'        => $size_id,
				'sheen_id'       => $sheen_id,
				'surface_id'     => $surface_id,
				'sku'            => sanitize_text_field( isset( $product['sku'] ) ? $product['sku'] : '' ),
				'price'          => floatval( isset( $product['price'] ) ? $product['price'] : 0 ),
				'stock_quantity' => intval( isset( $product['stock_quantity'] ) ? $product['stock_quantity'] : 0 ),
				'description'    => sanitize_textarea_field( isset( $product['description'] ) ? $product['description'] : '' )
			);

			$result = $wpdb->insert( $products_table, $data, array( '%d', '%d', '%d', '%d', '%d', '%s', '%f', '%d', '%s' ) );

			if ( false === $result ) {
				$errors[] = 'Row ' . ($idx + 1) . ': ' . $wpdb->last_error;
				continue;
			}

			$imported++;
		}

		return rest_ensure_response( array(
			'success'  => true,
			'imported' => $imported,
			'errors'   => $errors,
			'total'    => count( $products ),
		) );
	}

	public function delete_product_brand( $request ) {
		global $wpdb;
		$wpdb->delete( $wpdb->prefix . 'ps_product_brands', array( 'id' => $request->get_param( 'id' ) ), array( '%d' ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function sync_product_brands_to_woo( $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) return new WP_Error( 'woo_missing', 'WooCommerce is not active.', array( 'status' => 400 ) );
		global $wpdb;

		$taxonomy = 'product_brand';

		$brands = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_product_brands" );
		$synced = 0;

		foreach ( $brands as $brand ) {
			$brand_slug = ! empty( $brand->slug ) ? $brand->slug : sanitize_title( $brand->name );
			
			// Update slug in DB if missing
			if ( empty( $brand->slug ) ) {
				$wpdb->update( $wpdb->prefix . 'ps_product_brands', array( 'slug' => $brand_slug ), array( 'id' => $brand->id ) );
			}

			$term = term_exists( $brand_slug, $taxonomy );
			if ( ! $term ) {
				$term = wp_insert_term( $brand->name, $taxonomy, array( 'slug' => $brand_slug, 'description' => $brand->description ) );
				} else {
					wp_update_term( $term['term_id'], $taxonomy, array( 'description' => $brand->description ) );
				}
			if ( ! is_wp_error( $term ) ) {
				$term_id = is_array( $term ) ? $term['term_id'] : $term;
				$wpdb->update( $wpdb->prefix . 'ps_product_brands', array( 'wc_attribute_id' => $term_id ), array( 'id' => $brand->id ) );
				$synced++;
			}
		}
		
		return rest_ensure_response( array( 'success' => true, 'synced' => $synced ) );
	}

	// ==========================================
	// PUBLIC HANDLERS (Frontend React App)
	// ==========================================

	public function public_get_product_family( $request ) {
		global $wpdb;
		$family_id = intval( $request->get_param( 'id' ) );
		
		$query = $wpdb->prepare( "
			SELECT f.*, m.slug as make_slug, m.name as make_name 
			FROM {$wpdb->prefix}ps_product_families f
			LEFT JOIN {$wpdb->prefix}ps_product_makes m ON f.make_id = m.id
			WHERE f.id = %d
		", $family_id );

		$family = $wpdb->get_row( $query, ARRAY_A );
		if ( ! $family ) return new WP_Error( 'not_found', 'Product family not found.', array( 'status' => 404 ) );

		// Parse gallery images
		$family['gallery_images'] = array();
		$family['image_url'] = '';
		if ( ! empty( $family['gallery_image_ids'] ) ) {
			$ids = array_filter( array_map( 'intval', explode( ',', $family['gallery_image_ids'] ) ) );
			foreach ( $ids as $img_id ) {
				$url = wp_get_attachment_url( $img_id );
				if ( $url ) $family['gallery_images'][] = array( 'id' => $img_id, 'url' => $url );
			}
			if ( ! empty( $family['gallery_images'] ) ) {
				$family['image_url'] = $family['gallery_images'][0]['url'];
			}
		}

		// Fetch datasheets for this family
		$family['datasheets'] = $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM {$wpdb->prefix}ps_family_datasheets WHERE family_id = %d", $family_id
		), ARRAY_A );

		// Fetch assigned scene images and PREPEND them before product gallery images
		$scene_ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT scene_id FROM {$wpdb->prefix}ps_family_scenes WHERE family_id = %d", $family_id
		) );
		$family['scene_images'] = array();
		if ( ! empty( $scene_ids ) ) {
			$scene_list = implode( ',', array_map( 'intval', $scene_ids ) );
			$scenes = $wpdb->get_results( "SELECT id, name, image_id FROM {$wpdb->prefix}ps_scene_images WHERE id IN ($scene_list)" );
			$scene_entries = array();
			foreach ( $scenes as $scene ) {
				if ( $scene->image_id ) {
					$url = wp_get_attachment_url( $scene->image_id );
					if ( $url ) {
						$scene_entry = array( 'id' => intval( $scene->image_id ), 'url' => $url, 'name' => $scene->name, 'is_scene' => true );
						$family['scene_images'][] = $scene_entry;
						$scene_entries[] = $scene_entry;
					}
				}
			}
			// Prepend scenes before product gallery images
			$family['gallery_images'] = array_merge( $scene_entries, $family['gallery_images'] );
			// Update image_url to first scene if available
			if ( ! empty( $scene_entries ) ) {
				$family['image_url'] = $scene_entries[0]['url'];
			}
		}

		// Fetch assigned categories for Breadcrumbs
		$category_ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT category_id FROM {$wpdb->prefix}ps_family_categories WHERE family_id = %d", $family_id
		) );
		$family['categories'] = array();
		if ( ! empty( $category_ids ) ) {
			$cat_list = implode( ',', array_map( 'intval', $category_ids ) );
			$categories = $wpdb->get_results( "SELECT name FROM {$wpdb->prefix}ps_product_categories WHERE id IN ($cat_list)" );
			foreach ( $categories as $cat ) {
				$family['categories'][] = $cat->name;
			}
		}

		// Fetch explicitly assigned Sheens
		$sheen_ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT sheen_id FROM {$wpdb->prefix}ps_family_sheens WHERE family_id = %d", $family_id
		) );
		$family['explicit_sheen_ids'] = array_map( 'intval', $sheen_ids );

		// Fetch explicitly assigned Sizes
		$size_ids = $wpdb->get_col( $wpdb->prepare(
			"SELECT size_id FROM {$wpdb->prefix}ps_family_sizes WHERE family_id = %d", $family_id
		) );
		$family['explicit_size_ids'] = array_map( 'intval', $size_ids );

		$variations = array();
		$attributes = array( 'sizes' => array(), 'sheens' => array() );

		if ( class_exists( 'WooCommerce' ) && ! empty( $family['wc_product_id'] ) ) {
			$product = wc_get_product( $family['wc_product_id'] );
			if ( $product && $product->is_type( 'variable' ) ) {
				$available_variations = $product->get_available_variations();
				foreach ( $available_variations as $var ) {
					$variations[] = array(
						'id'         => $var['variation_id'],
						'attributes' => $var['attributes'],
						'price'      => $var['display_price'],
						'price_html' => $var['price_html']
					);
				}

				$sizes = wc_get_product_terms( $family['wc_product_id'], 'pa_paint_size', array( 'fields' => 'all' ) );
				if ( ! is_wp_error( $sizes ) ) {
					foreach ( $sizes as $term ) {
						$attributes['sizes'][] = array( 'slug' => $term->slug, 'name' => $term->name, 'description' => $term->description );
					}
				}

				$sheens = wc_get_product_terms( $family['wc_product_id'], 'pa_paint_sheen', array( 'fields' => 'all' ) );
				if ( ! is_wp_error( $sheens ) ) {
					foreach ( $sheens as $term ) {
						$attributes['sheens'][] = array( 'slug' => $term->slug, 'name' => $term->name, 'description' => $term->description );
					}
				}
			}
		}

		$ps_products = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ps_products WHERE family_id = %d", $family_id ), ARRAY_A );

		// Cast and enrich each product with WooCommerce term slugs for frontend filtering
		foreach( $ps_products as &$prod ) {
			$prod['id']         = intval( $prod['id'] );
			$prod['family_id']  = intval( $prod['family_id'] );
			$prod['size_id']    = intval( $prod['size_id'] );
			$prod['sheen_id']   = intval( $prod['sheen_id'] );
			$prod['base_id']    = intval( $prod['base_id'] );
			$prod['surface_id'] = intval( $prod['surface_id'] );
			$prod['price']      = floatval( $prod['price'] );
			$prod['stock_quantity'] = intval( $prod['stock_quantity'] );
			$prod['woo_product_id'] = intval( $prod['woo_product_id'] );

			// Resolve size name + WooCommerce slug
			$size_row = $wpdb->get_row( $wpdb->prepare( "SELECT name, wc_attribute_id FROM {$wpdb->prefix}ps_sizes WHERE id = %d", $prod['size_id'] ) );
			$prod['size_name'] = $size_row ? $size_row->name : '';
			$size_term = ( $size_row && $size_row->wc_attribute_id ) ? get_term( $size_row->wc_attribute_id ) : null;
			$prod['size_slug'] = ( $size_term && ! is_wp_error( $size_term ) ) ? $size_term->slug : '';

			// Resolve sheen name + WooCommerce slug
			$sheen_row = $wpdb->get_row( $wpdb->prepare( "SELECT name, wc_attribute_id FROM {$wpdb->prefix}ps_sheens WHERE id = %d", $prod['sheen_id'] ) );
			$prod['sheen_name'] = $sheen_row ? $sheen_row->name : '';
			$sheen_term = ( $sheen_row && $sheen_row->wc_attribute_id ) ? get_term( $sheen_row->wc_attribute_id ) : null;
			$prod['sheen_slug'] = ( $sheen_term && ! is_wp_error( $sheen_term ) ) ? $sheen_term->slug : '';

			// Resolve stain image URL
			$prod['stain_image_url'] = '';
			if ( ! empty( $prod['stain_image_id'] ) ) {
				$prod['stain_image_url'] = wp_get_attachment_url( intval( $prod['stain_image_id'] ) ) ?: '';
			}
		}

		// Calculate Review Statistics
		$reviews_table = $wpdb->prefix . 'ps_reviews';
		$stats = $wpdb->get_row( $wpdb->prepare(
			"SELECT COUNT(*) as total_reviews, AVG(rating) as average_rating 
			 FROM $reviews_table 
			 WHERE family_id = %d", 
			$family_id
		) );
		
		$review_stats = array(
			'total' => $stats ? intval( $stats->total_reviews ) : 0,
			'average' => $stats && $stats->average_rating ? floatval( $stats->average_rating ) : 0
		);

		// Decode compare_attributes if it exists
		if ( ! empty( $family['compare_attributes'] ) ) {
			$family['compare_attributes'] = json_decode( $family['compare_attributes'], true );
		} else {
			$family['compare_attributes'] = null;
		}

		// Resolve tool attribute IDs to names for the storefront
		$tool_attr_map = array(
			'tool_handle_shape'     => 'tool_handle_shape_id',
			'tool_bristle_material' => 'tool_bristle_material_id',
			'tool_head_shape'       => 'tool_head_shape_id',
			'tool_handle_length'    => 'tool_handle_length_id',
			'tool_handle_material'  => 'tool_handle_material_id',
			'tool_stiffness'        => 'tool_stiffness_id',
			'tool_paint_compat'     => 'tool_paint_compat_id',
			'tool_ferrule_material' => 'tool_ferrule_material_id'
		);
		$tool_attrs = array();
		foreach ( $tool_attr_map as $name_key => $id_key ) {
			$attr_id = isset( $family[ $id_key ] ) ? intval( $family[ $id_key ] ) : 0;
			if ( $attr_id > 0 ) {
				$attr_name = $wpdb->get_var( $wpdb->prepare( "SELECT name FROM {$wpdb->prefix}ps_tool_attributes WHERE id = %d", $attr_id ) );
				$tool_attrs[ $name_key ] = $attr_name ?: '';
			} else {
				$tool_attrs[ $name_key ] = '';
			}
			$tool_attrs[ $id_key ] = $attr_id;
		}

		$response = array(
			'family'     => array_merge($family, $tool_attrs),
			'variations' => $variations,
			'attributes' => $attributes,
			'ps_products' => $ps_products,
			'review_stats' => $review_stats
		);

		return rest_ensure_response( $response );
	}

	public function public_get_product_families_list( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT id, name FROM {$wpdb->prefix}ps_product_families ORDER BY name ASC", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function public_get_color_families( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_color_families", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function public_get_colors( $request ) {
		global $wpdb;
		$family_id = intval( $request->get_param( 'family_id' ) );
		
		$query = "SELECT * FROM {$wpdb->prefix}ps_colors";
		if ( $family_id > 0 ) {
			$query .= $wpdb->prepare( " WHERE family_id = %d", $family_id );
		}
		
		$colors = $wpdb->get_results( $query, ARRAY_A );
		
		// Map the base_ids and coordinating_color_ids to each Color
		foreach ( $colors as &$color ) {
			$color_id = intval( $color['id'] );
			
			$base_ids = $wpdb->get_col( $wpdb->prepare( "SELECT base_id FROM {$wpdb->prefix}ps_color_bases WHERE color_id = %d", $color_id ) );
			$color['base_ids'] = array_map( 'intval', $base_ids );

			$cc_ids = $wpdb->get_col( $wpdb->prepare( "SELECT coordinating_color_id FROM {$wpdb->prefix}ps_color_coordinations WHERE primary_color_id = %d", $color_id ) );
			$color['coordinating_color_ids'] = array_map( 'intval', $cc_ids );
		}

		return rest_ensure_response( $colors );
	}

	public function public_get_brands( $request ) {
		global $wpdb;
		$results = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ps_brands", ARRAY_A );
		return rest_ensure_response( $results );
	}

	// ==========================================
	// PUBLIC REVIEWS ENDPOINTS
	// ==========================================

	public function public_get_reviews( $request ) {
		global $wpdb;
		$family_id = intval( $request->get_param( 'id' ) );

		if ( ! $family_id ) {
			return new WP_Error( 'missing_id', 'Family ID is required', array( 'status' => 400 ) );
		}

		$table_name = $wpdb->prefix . 'ps_reviews';
		
		// get all reviews for this family
		$reviews = $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM $table_name WHERE family_id = %d ORDER BY created_at DESC",
			$family_id
		), ARRAY_A );

		// calculate aggregates
		$total_reviews = count( $reviews );
		$aggregate = array(
			'average' => 0,
			'total' => $total_reviews,
			'recommend_percent' => 0,
			'distribution' => array(
				5 => array( 'stars' => 5, 'count' => 0, 'percent' => 0 ),
				4 => array( 'stars' => 4, 'count' => 0, 'percent' => 0 ),
				3 => array( 'stars' => 3, 'count' => 0, 'percent' => 0 ),
				2 => array( 'stars' => 2, 'count' => 0, 'percent' => 0 ),
				1 => array( 'stars' => 1, 'count' => 0, 'percent' => 0 ),
			)
		);

		if ( $total_reviews > 0 ) {
			$sum_rating = 0;
			$recommend_count = 0;

			foreach ( $reviews as $review ) {
				$rating = intval( $review['rating'] );
				if ( $rating >= 1 && $rating <= 5 ) {
					$aggregate['distribution'][$rating]['count']++;
					$sum_rating += $rating;
				}
				if ( intval( $review['recommend'] ) === 1 ) {
					$recommend_count++;
				}
			}

			// Format to 1 decimal place
			$aggregate['average'] = number_format( $sum_rating / $total_reviews, 1 );
			$aggregate['recommend_percent'] = round( ( $recommend_count / $total_reviews ) * 100 );

			foreach ( $aggregate['distribution'] as $stars => $data ) {
				$aggregate['distribution'][$stars]['percent'] = round( ( $data['count'] / $total_reviews ) * 100 );
			}
		}

		// Re-key distribution to a flat array for easier frontend mapping
		$aggregate['distribution'] = array_values( $aggregate['distribution'] );

		// Map to frontend-friendly keys
		$formatted_reviews = array_map(function($r) {
			return array(
				'id' => intval($r['id']),
				'title' => $r['title'],
				'rating' => intval($r['rating']),
				'recommend' => intval($r['recommend']) === 1,
				'text' => $r['text'],
				'helpful' => array(
					'yes' => intval($r['helpful_yes']),
					'no' => intval($r['helpful_no'])
				),
				'author' => $r['author_name'],
				'date' => date('F j, Y', strtotime($r['created_at'])),
				'productInfo' => $r['product_info'],
				'verified' => intval($r['verified_purchaser']) === 1,
				'images' => !empty($r['image_urls']) ? json_decode($r['image_urls'], true) : array(),
				'response' => $r['response_author'] ? array(
					'author' => $r['response_author'],
					'date' => date('F j, Y', strtotime($r['response_date'])),
					'text' => $r['response_text']
				) : null
			);
		}, $reviews);

		return rest_ensure_response( array(
			'aggregate' => $aggregate,
			'reviews'   => $formatted_reviews
		) );
	}

	public function public_submit_review( $request ) {
		global $wpdb;
		$family_id = intval( $request->get_param( 'id' ) );

		if ( ! $family_id ) {
			return new WP_Error( 'missing_id', 'Family ID is required', array( 'status' => 400 ) );
		}

		$rating      = intval( $request->get_param( 'rating' ) );
		$title       = sanitize_text_field( $request->get_param( 'title' ) );
		$text        = sanitize_textarea_field( $request->get_param( 'text' ) );
		$recommend   = intval( $request->get_param( 'recommend' ) ) ? 1 : 0;
		$author_name = sanitize_text_field( $request->get_param( 'author_name' ) );
		$product_info= sanitize_text_field( $request->get_param( 'product_info' ) );

		if ( ! $rating || ! $title || ! $text || ! $author_name ) {
			return new WP_Error( 'missing_fields', 'Required fields are missing', array( 'status' => 400 ) );
		}

		$image_urls = array();
		if ( ! empty( $_FILES['images'] ) ) {
			require_once( ABSPATH . 'wp-admin/includes/file.php' );
			$files = $_FILES['images'];
			
			if ( is_array( $files['name'] ) ) {
				$file_count = count( $files['name'] );
				for ( $i = 0; $i < $file_count; $i++ ) {
					if ( $files['error'][$i] === UPLOAD_ERR_OK ) {
						$file = array(
							'name'     => $files['name'][$i],
							'type'     => $files['type'][$i],
							'tmp_name' => $files['tmp_name'][$i],
							'error'    => $files['error'][$i],
							'size'     => $files['size'][$i]
						);
						$upload_overrides = array( 'test_form' => false );
						$movefile = wp_handle_upload( $file, $upload_overrides );
						if ( $movefile && ! isset( $movefile['error'] ) ) {
							$image_urls[] = $movefile['url'];
						}
					}
				}
			} else {
				if ( $files['error'] === UPLOAD_ERR_OK ) {
					$upload_overrides = array( 'test_form' => false );
					$movefile = wp_handle_upload( $files, $upload_overrides );
					if ( $movefile && ! isset( $movefile['error'] ) ) {
						$image_urls[] = $movefile['url'];
					}
				}
			}
		}

		$table_name = $wpdb->prefix . 'ps_reviews';
		$wpdb->insert(
			$table_name,
			array(
				'family_id'    => $family_id,
				'rating'       => $rating,
				'title'        => $title,
				'text'         => $text,
				'recommend'    => $recommend,
				'author_name'  => $author_name,
				'product_info' => $product_info,
				'image_urls'   => empty( $image_urls ) ? null : json_encode( $image_urls ),
				'created_at'   => current_time( 'mysql' )
			),
			array( '%d', '%d', '%s', '%s', '%d', '%s', '%s', '%s', '%s' )
		);

		return rest_ensure_response( array( 'success' => true, 'id' => $wpdb->insert_id ) );
	}


	// ==========================================
	// ADMIN REVIEWS ENDPOINTS
	// ==========================================

	public function admin_get_reviews( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'ps_reviews';
		
		// Join with families to get the family name
		$families_table = $wpdb->prefix . 'ps_product_families';

		$query = "
			SELECT r.*, f.name as family_name 
			FROM $table_name r
			LEFT JOIN $families_table f ON r.family_id = f.id
			ORDER BY r.created_at DESC
		";

		$reviews = $wpdb->get_results( $query, ARRAY_A );

		// Format for frontend admin consumption
		$formatted_reviews = array_map(function($r) {
			return array(
				'id' => intval($r['id']),
				'family_id' => intval($r['family_id']),
				'family_name' => $r['family_name'],
				'title' => $r['title'],
				'rating' => intval($r['rating']),
				'recommend' => intval($r['recommend']) === 1,
				'text' => $r['text'],
				'author' => $r['author_name'],
				'date' => $r['created_at'],
				'images' => !empty($r['image_urls']) ? json_decode($r['image_urls'], true) : array(),
				'response' => $r['response_author'] ? array(
					'author' => $r['response_author'],
					'date' => $r['response_date'],
					'text' => $r['response_text']
				) : null
			);
		}, $reviews);

		return rest_ensure_response( $formatted_reviews );
	}

	public function admin_update_review( $request ) {
		global $wpdb;
		$id = intval( $request->get_param( 'id' ) );

		if ( ! $id ) {
			return new WP_Error( 'missing_id', 'Review ID is required', array( 'status' => 400 ) );
		}

		$response_text = sanitize_textarea_field( $request->get_param( 'response_text' ) );
		$response_author = sanitize_text_field( $request->get_param( 'response_author' ) );

		$update_data = array();
		$update_format = array();

		if ( $response_text !== null ) {
			$update_data['response_text'] = $response_text;
			$update_data['response_author'] = $response_author ? $response_author : 'Customer Service';
			$update_data['response_date'] = current_time( 'mysql' );
			array_push($update_format, '%s', '%s', '%s');
		}

		if ( empty( $update_data ) ) {
			return rest_ensure_response( array( 'success' => true, 'message' => 'No changes provided.' ) );
		}

		$table_name = $wpdb->prefix . 'ps_reviews';
		$updated = $wpdb->update(
			$table_name,
			$update_data,
			array( 'id' => $id ),
			$update_format,
			array( '%d' )
		);

		if ( $updated === false ) {
			return new WP_Error( 'db_error', 'Could not update review', array( 'status' => 500 ) );
		}

		return rest_ensure_response( array( 'success' => true ) );
	}

	public function admin_delete_review( $request ) {
		global $wpdb;
		$id = intval( $request->get_param( 'id' ) );

		if ( ! $id ) {
			return new WP_Error( 'missing_id', 'Review ID is required', array( 'status' => 400 ) );
		}

		$table_name = $wpdb->prefix . 'ps_reviews';

		// Optional: Delete physical files from media library if they exist
		$review = $wpdb->get_row( $wpdb->prepare( "SELECT image_urls FROM $table_name WHERE id = %d", $id ) );
		if ( $review && ! empty( $review->image_urls ) ) {
			$image_urls = json_decode( $review->image_urls, true );
			if ( is_array( $image_urls ) ) {
				foreach ( $image_urls as $url ) {
					$attachment_id = attachment_url_to_postid( $url );
					if ( $attachment_id ) {
						wp_delete_attachment( $attachment_id, true );
					}
				}
			}
		}

		$deleted = $wpdb->delete(
			$table_name,
			array( 'id' => $id ),
			array( '%d' )
		);

		if ( $deleted === false ) {
			return new WP_Error( 'db_error', 'Could not delete review', array( 'status' => 500 ) );
		}

		return rest_ensure_response( array( 'success' => true ) );
	}

	// ==========================================
	// PUBLIC Q&A METHODS
	// ==========================================

	public function public_get_questions( $request ) {
		global $wpdb;
		$family_id = intval( $request->get_param( 'id' ) );
		$sort_by = sanitize_text_field( $request->get_param( 'sort' ) ); // 'newest', 'most_answered'

		if ( ! $family_id ) {
			return new WP_Error( 'missing_id', 'Family ID is required', array( 'status' => 400 ) );
		}

		$questions_table = $wpdb->prefix . 'ps_questions';
		$answers_table = $wpdb->prefix . 'ps_answers';

		$order_sql = "ORDER BY created_at DESC";
		if ( $sort_by === 'Most Answered' || $sort_by === 'most_answered' ) {
			$order_sql = "ORDER BY (SELECT COUNT(*) FROM $answers_table WHERE question_id = $questions_table.id) DESC, created_at DESC";
		}

		$questions = $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM $questions_table WHERE family_id = %d $order_sql",
			$family_id
		), ARRAY_A );

		// Fetch all answers for these questions efficiently
		if ( ! empty( $questions ) ) {
			$question_ids = wp_list_pluck( $questions, 'id' );
			$ids_list = implode( ',', array_map( 'intval', $question_ids ) );
			
			$answers = $wpdb->get_results(
				"SELECT * FROM $answers_table WHERE question_id IN ($ids_list) ORDER BY is_brand_response DESC, helpful_yes DESC, created_at ASC",
				ARRAY_A
			);

			// Group answers by question ID
			$answers_by_question = array();
			foreach ( $answers as $answer ) {
				$qid = $answer['question_id'];
				if ( ! isset( $answers_by_question[ $qid ] ) ) {
					$answers_by_question[ $qid ] = array();
				}
				
				$answers_by_question[ $qid ][] = array(
					'id' => intval($answer['id']),
					'author' => $answer['author_name'], 
					'text' => $answer['text'],
					'isBrandResponse' => intval($answer['is_brand_response']) === 1,
					'helpful' => array(
						'yes' => intval($answer['helpful_yes']),
						'no' => intval($answer['helpful_no'])
					),
					'date' => date('F j, Y', strtotime($answer['created_at']))
				);
			}

			// Map answers to questions
			foreach ( $questions as &$q ) {
				$q['author'] = $q['author_name'];
				$q['date'] = date('F j, Y', strtotime($q['created_at']));
				$q['answers'] = isset( $answers_by_question[ $q['id'] ] ) ? $answers_by_question[ $q['id'] ] : array();
				
				// Remove raw db fields matching internal database structure to keep public API clean and safe
				unset($q['author_name']);
				unset($q['author_email']);
				unset($q['created_at']);
				unset($q['family_id']);
			}
		}

		return rest_ensure_response( $questions );
	}

	public function public_submit_question( $request ) {
		global $wpdb;
		$family_id = intval( $request->get_param( 'id' ) );
		$params = $request->get_json_params();

		if ( ! $family_id ) {
			return new WP_Error( 'missing_id', 'Family ID is required', array( 'status' => 400 ) );
		}

		$author_name = sanitize_text_field( $params['author_name'] ?? '' );
		$author_email = sanitize_email( $params['author_email'] ?? '' );
		$text = sanitize_textarea_field( $params['text'] ?? '' );

		if ( empty( $author_name ) || empty( $author_email ) || empty( $text ) ) {
			return new WP_Error( 'missing_fields', 'Name, email, and question text are required.', array( 'status' => 400 ) );
		}

		$table_name = $wpdb->prefix . 'ps_questions';
		$wpdb->insert(
			$table_name,
			array(
				'family_id' => $family_id,
				'author_name' => $author_name,
				'author_email' => $author_email,
				'text' => $text,
			),
			array( '%d', '%s', '%s', '%s' )
		);

		return rest_ensure_response( array( 'success' => true, 'id' => $wpdb->insert_id ) );
	}

	public function public_submit_answer( $request ) {
		global $wpdb;
		$question_id = intval( $request->get_param( 'id' ) );
		$params = $request->get_json_params();

		if ( ! $question_id ) {
			return new WP_Error( 'missing_id', 'Question ID is required', array( 'status' => 400 ) );
		}

		$author_name = sanitize_text_field( $params['author_name'] ?? '' );
		$author_email = sanitize_email( $params['author_email'] ?? '' );
		$text = sanitize_textarea_field( $params['text'] ?? '' );

		if ( empty( $author_name ) || empty( $author_email ) || empty( $text ) ) {
			return new WP_Error( 'missing_fields', 'Name, email, and answer text are required.', array( 'status' => 400 ) );
		}

		// Mark as brand response automatically if submitted by a WP Admin
		$is_brand_response = current_user_can( 'manage_options' ) ? 1 : 0;

		$table_name = $wpdb->prefix . 'ps_answers';
		$wpdb->insert(
			$table_name,
			array(
				'question_id' => $question_id,
				'author_name' => $author_name,
				'author_email' => $author_email,
				'text' => $text,
				'is_brand_response' => $is_brand_response
			),
			array( '%d', '%s', '%s', '%s', '%d' )
		);

		return rest_ensure_response( array( 'success' => true, 'id' => $wpdb->insert_id ) );
	}

	public function public_vote_answer( $request ) {
		global $wpdb;
		$answer_id = intval( $request->get_param( 'id' ) );
		$params = $request->get_json_params();

		if ( ! $answer_id ) {
			return new WP_Error( 'missing_id', 'Answer ID is required', array( 'status' => 400 ) );
		}

		$vote_type = sanitize_text_field( $params['type'] ?? '' ); // 'yes' or 'no'
		
		if ( ! in_array( $vote_type, ['yes', 'no'] ) ) {
			return new WP_Error( 'invalid_type', 'Vote type must be yes or no.', array( 'status' => 400 ) );
		}

		$column = $vote_type === 'yes' ? 'helpful_yes' : 'helpful_no';
		$table_name = $wpdb->prefix . 'ps_answers';

		// direct count increment to prevent race conditions
		$wpdb->query( $wpdb->prepare(
			"UPDATE $table_name SET $column = $column + 1 WHERE id = %d",
			$answer_id
		) );

		return rest_ensure_response( array( 'success' => true ) );
	}

	// --- Fulfillment Orders Handlers ---

	public function admin_get_fulfillment_orders( $request ) {
		// Ensure WooCommerce is active
		if ( ! function_exists( 'wc_get_orders' ) ) {
			return rest_ensure_response( array() );
		}

		// Get all WooCommerce orders
		$args = array(
			'limit'  => 50,
			'orderby' => 'date',
			'order'   => 'DESC',
		);
		$wc_orders = wc_get_orders( $args );

		$orders = array();
		foreach ( $wc_orders as $wc_order ) {
			$fulfillment_method = $wc_order->get_meta( 'Fulfillment Method' );
			
			// Only include orders that actually went through our custom fulfillment flow
			if ( empty( $fulfillment_method ) ) {
				continue;
			}

			// Generate a summary of items (e.g., "Valspar Reserve (x2), Tape (x1)")
			$items_summary = array();
			foreach ( $wc_order->get_items() as $item_id => $item ) {
				$items_summary[] = $item->get_name() . ' (x' . $item->get_quantity() . ')';
			}
			$items_str = implode( ', ', $items_summary );

			// Determine status: Custom meta if set, otherwise default 'pending'
			$status = $wc_order->get_meta( '_ps_fulfillment_status' );
			if ( empty( $status ) ) {
				$status = 'pending';
			}

			$orders[] = array(
				'id'               => $wc_order->get_id(),
				'fulfillment_type' => strtolower( $fulfillment_method ),
				'customer_name'    => $wc_order->get_billing_first_name() . ' ' . $wc_order->get_billing_last_name(),
				'customer_email'   => $wc_order->get_billing_email(),
				'items_summary'    => $items_str,
				'status'           => $status,
				'created_at'       => $wc_order->get_date_created() ? $wc_order->get_date_created()->date( 'Y-m-d H:i:s' ) : '',
			);
		}

		return rest_ensure_response( $orders );
	}

	public function admin_update_fulfillment_order( $request ) {
		if ( ! function_exists( 'wc_get_order' ) ) {
			return new WP_Error( 'woocommerce_missing', 'WooCommerce is not active.', array( 'status' => 500 ) );
		}

		$id     = (int) $request['id'];
		$params = $request->get_json_params();
		$status = sanitize_text_field( $params['status'] ?? '' );

		if ( empty( $status ) ) {
			return new WP_Error( 'missing_status', 'Status is required.', array( 'status' => 400 ) );
		}

		$order = wc_get_order( $id );
		if ( ! $order ) {
			return new WP_Error( 'invalid_order', 'Order not found.', array( 'status' => 404 ) );
		}

		$order->update_meta_data( '_ps_fulfillment_status', $status );
		$order->save();

		return rest_ensure_response( array( 'success' => true, 'id' => $id, 'status' => $status ) );
	}

	// --- Fulfillment Settings Handlers ---

	public function admin_get_fulfillment_settings( $request ) {
		$defaults = array(
			'pickup_prep_time'     => '3',
			'delivery_estimate'    => 'Same Day',
			'store_address'        => '',
			'store_lat'            => '',
			'store_lng'            => '',
			'delivery_rate_per_km' => '2.00',
			'currency_symbol'      => 'GHS',
			'google_maps_api_key'  => '',
		);
		$settings = get_option( 'ps_fulfillment_settings', $defaults );
		return rest_ensure_response( wp_parse_args( $settings, $defaults ) );
	}

	public function admin_save_fulfillment_settings( $request ) {
		$params   = $request->get_json_params();
		$settings = array(
			'pickup_prep_time'     => sanitize_text_field( $params['pickup_prep_time'] ?? '3' ),
			'delivery_estimate'    => sanitize_text_field( $params['delivery_estimate'] ?? 'Same Day' ),
			'store_address'        => sanitize_text_field( $params['store_address'] ?? '' ),
			'store_lat'            => sanitize_text_field( $params['store_lat'] ?? '' ),
			'store_lng'            => sanitize_text_field( $params['store_lng'] ?? '' ),
			'delivery_rate_per_km' => sanitize_text_field( $params['delivery_rate_per_km'] ?? '2.00' ),
			'currency_symbol'      => sanitize_text_field( $params['currency_symbol'] ?? 'GHS' ),
			'google_maps_api_key'  => sanitize_text_field( $params['google_maps_api_key'] ?? '' ),
		);
		update_option( 'ps_fulfillment_settings', $settings );
		return rest_ensure_response( array( 'success' => true, 'settings' => $settings ) );
	}

}
