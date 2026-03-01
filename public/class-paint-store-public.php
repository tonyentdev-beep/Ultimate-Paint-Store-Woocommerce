<?php

class Paint_Store_Public {

	private $plugin_name;
	private $version;

	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	public function enqueue_styles() {
		wp_enqueue_style( $this->plugin_name . '-frontend', plugin_dir_url( dirname( __FILE__ ) ) . 'build/frontend/index.css', array(), $this->version, 'all' );
	}

	public function enqueue_scripts() {
		$asset_file = plugin_dir_path( dirname( __FILE__ ) ) . 'build/frontend/index.asset.php';
		if ( file_exists( $asset_file ) ) {
			$assets = include $asset_file;
			wp_enqueue_script(
				$this->plugin_name . '-frontend',
				plugin_dir_url( dirname( __FILE__ ) ) . 'build/frontend/index.js',
				$assets['dependencies'],
				$assets['version'],
				true
			);
		}
	}

	public function render_builder_shortcode( $atts ) {
		$atts = shortcode_atts( array(
			'family_id' => 0,
		), $atts, 'paint_store_builder' );

		// Enqueue scripts specifically when this shortcode is used if we want, 
		// but they are already enqueued globally via WP enqueue scripts hook above.
		// For performance in the future we could conditionalize enqueue_scripts on has_shortcode.

		ob_start();
		?>
		<div id="paint-store-builder-root" data-family-id="<?php echo esc_attr( $atts['family_id'] ); ?>">
			<p>Loading Product Builder...</p>
		</div>
		<?php
		return ob_get_clean();
	}

}
