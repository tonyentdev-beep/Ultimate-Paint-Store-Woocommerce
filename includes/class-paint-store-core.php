<?php

class Paint_Store_Core {

	protected $loader;
	protected $plugin_name;
	protected $version;

	public function __construct() {
		if ( defined( 'PAINT_STORE_CORE_VERSION' ) ) {
			$this->version = PAINT_STORE_CORE_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'paint-store-core';

		$this->load_dependencies();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->define_api_hooks();
		$this->define_woocommerce_hooks();
	}

	private function load_dependencies() {
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-paint-store-loader.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-paint-store-activator.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-paint-store-admin.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-paint-store-api.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-paint-store-public.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-paint-store-woocommerce.php';
		
		$this->loader = new Paint_Store_Loader();
	}

	private function define_admin_hooks() {
		$plugin_admin = new Paint_Store_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'add_plugin_admin_menu' );
	}

	private function define_public_hooks() {
		$plugin_public = new Paint_Store_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
		
		// Add shortcode registration
		$this->loader->add_shortcode( 'paint_store_builder', $plugin_public, 'render_builder_shortcode' );
	}

	private function define_api_hooks() {
		$plugin_api = new Paint_Store_API( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'rest_api_init', $plugin_api, 'register_routes' );
	}

	private function define_woocommerce_hooks() {
		$plugin_woo = new Paint_Store_WooCommerce( $this->get_plugin_name(), $this->get_version() );

		// Single Product Override
		$this->loader->add_action( 'wp', $plugin_woo, 'override_single_product_summary' );

		// Cart and Checkout Custom Meta
		$this->loader->add_filter( 'woocommerce_get_item_data', $plugin_woo, 'get_item_data', 10, 2 );
		$this->loader->add_action( 'woocommerce_checkout_create_order_line_item', $plugin_woo, 'checkout_create_order_line_item', 10, 4 );
	}

	public function run() {
		$this->loader->run();
	}

	public function get_plugin_name() {
		return $this->plugin_name;
	}

	public function get_loader() {
		return $this->loader;
	}

	public function get_version() {
		return $this->version;
	}
}
