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

if (!defined('HAUS_ECOM_VENDURE_API_URL')) {
    define('HAUS_ECOM_VENDURE_API_URL', 'https://livv-ecom-test.azurewebsites.net/');
}

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

if (file_exists(HAUS_ECOM_PLUGIN_PATH . '/vendor/autoload.php')) {
    require HAUS_ECOM_PLUGIN_PATH . '/vendor/autoload.php';
}

add_action('wp_enqueue_scripts', function () {
    wp_register_style('livv-ecom-addon', plugins_url('/dist/index.css', __FILE__));
    wp_register_script('livv-ecom-addon', plugins_url('/dist/index.js', __FILE__));
    wp_enqueue_style('livv-ecom-addon');
    wp_enqueue_script('livv-ecom-addon', '', [], false, ['strategy' => 'defer']);
});

add_action('init', function () {
    if (!defined('WP_INSTALLING') && !did_action('elementor/loaded')) {
        return;
    }

    // Register widgets
    \Elementor\Plugin::instance()
        ->widgets_manager
        ->register(new \Haus\Widgets\ProductList());
});