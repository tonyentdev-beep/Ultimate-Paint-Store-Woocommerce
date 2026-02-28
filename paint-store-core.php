<?php
/**
 * Plugin Name:       Paint Store Core V2
 * Plugin URI:        https://example.com/
 * Description:       A custom paint store management system integrating seamlessly with WooCommerce for product builders, colors, bases, and user projects.
 * Version:           1.0.0
 * Author:            Your Name
 * Author URI:        https://example.com/
 * Text Domain:       paint-store-core
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Autoload Composer dependencies (e.g. Plugin Update Checker)
 */
if ( file_exists( plugin_dir_path( __FILE__ ) . 'vendor/autoload.php' ) ) {
	require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';
}

/**
 * Initialize the Plugin Update Checker
 */
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

// TODO: Replace with your actual GitHub repository URL and branch
$myUpdateChecker = PucFactory::buildUpdateChecker(
	'https://github.com/your-username/your-repo/',
	__FILE__,
	'paint-store-core'
);

// Set the branch that contains the stable release.
$myUpdateChecker->setBranch('main');

// Optional: If it's a private repository, you'll need to set an authentication token.
// $myUpdateChecker->setAuthentication('your-github-personal-access-token');

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 */
define( 'PAINT_STORE_CORE_VERSION', '1.0.0' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-paint-store-core.php';

/**
 * The code that runs during plugin activation.
 */
function activate_paint_store_core() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-paint-store-activator.php';
	Paint_Store_Activator::activate();
}
register_activation_hook( __FILE__, 'activate_paint_store_core' );

/**
 * Begins execution of the plugin.
 */
function run_paint_store_core() {
	$plugin = new Paint_Store_Core();
	$plugin->run();
}
run_paint_store_core();
