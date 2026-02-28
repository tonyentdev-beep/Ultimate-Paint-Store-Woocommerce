<?php

class Paint_Store_Admin {

	private $plugin_name;
	private $version;

	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	public function enqueue_styles() {
		$css_path = plugin_dir_url( dirname( __FILE__ ) ) . 'build/admin/index.css';
		if ( file_exists( plugin_dir_path( dirname( __FILE__ ) ) . 'build/admin/index.css' ) ) {
			wp_enqueue_style( $this->plugin_name . '-admin', $css_path, array(), $this->version, 'all' );
		}
	}

	public function enqueue_scripts() {
		$asset_file = plugin_dir_path( dirname( __FILE__ ) ) . 'build/admin/index.asset.php';
		
		if ( file_exists( $asset_file ) ) {
			$assets = require( $asset_file );
			wp_enqueue_script( $this->plugin_name . '-admin', plugin_dir_url( dirname( __FILE__ ) ) . 'build/admin/index.js', $assets['dependencies'], $assets['version'], true );
			wp_enqueue_editor();
		}
	}

	public function add_plugin_admin_menu() {
		add_menu_page(
			'Paint Store',
			'Paint Store',
			'manage_options',
			$this->plugin_name,
			array( $this, 'display_plugin_admin_page' ),
			'dashicons-art',
			25
		);
	}

	public function display_plugin_admin_page() {
		echo '<div class="wrap"><div id="paint-store-admin-root"></div></div>';
	}

}
