<?php
/**
 * Plugin Name: Livv Ecom Widgets Addon
 * Description: Livv ecom widgets for Elementor.
 * Version:     0.0.1
 * Author:      Haus Tech
 * Author URI:  https://haus.se/
 * Text Domain: elementor-addon
 */

define('HAUS_ECOM_PLUGIN_PATH', __DIR__);
define('HAUS_ECOM_PLUGIN_URI', plugin_dir_url(__FILE__));

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

if (file_exists(HAUS_ECOM_PLUGIN_PATH . '/vendor/autoload.php')) {
    require HAUS_ECOM_PLUGIN_PATH . '/vendor/autoload.php';
}

add_action('init', function () {
    if (!defined('WP_INSTALLING') && did_action('elementor/loaded')) {

        // Register widgets
        \Elementor\Plugin::instance()
            ->widgets_manager
            ->register(new \Haus\Widgets\ProductList());
    }
});