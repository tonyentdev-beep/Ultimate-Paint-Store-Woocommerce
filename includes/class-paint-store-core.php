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
	}

	private function load_dependencies() {
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-paint-store-loader.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-paint-store-activator.php';
		
		$this->loader = new Paint_Store_Loader();
	}

	private function define_admin_hooks() {
		// Admin specific hooks will go here
	}

	private function define_public_hooks() {
		// Public specific hooks will go here
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
