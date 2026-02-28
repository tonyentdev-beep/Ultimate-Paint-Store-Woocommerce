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
	}

	public function permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	// --- Colors Handlers ---

	public function get_colors( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'ps_colors';
		$results = $wpdb->get_results( "SELECT * FROM $table_name", ARRAY_A );
		return rest_ensure_response( $results );
	}

	public function create_color( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'ps_colors';

		$name        = sanitize_text_field( $request->get_param( 'name' ) );
		$hex_value   = sanitize_text_field( $request->get_param( 'hex_value' ) );
		$rgb_value   = sanitize_text_field( $request->get_param( 'rgb_value' ) );
		$family_id   = intval( $request->get_param( 'family_id' ) );

		if ( empty( $name ) ) {
			return new WP_Error( 'missing_name', 'Color name is required', array( 'status' => 400 ) );
		}

		$wpdb->insert(
			$table_name,
			array(
				'name'      => $name,
				'hex_value' => $hex_value,
				'rgb_value' => $rgb_value,
				'family_id' => $family_id,
			),
			array( '%s', '%s', '%s', '%d' )
		);

		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
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

		$wpdb->insert(
			$table_name,
			array(
				'name'               => $name,
				'slug'               => $slug,
				'hex_representative' => $hex_representative,
			),
			array( '%s', '%s', '%s' )
		);

		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}
}
