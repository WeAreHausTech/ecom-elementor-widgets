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

if (!defined('VENDURE_API_URL')) {
    die("VENDURE_API_URL is not set.");
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
    wp_enqueue_script('livv-ecom-addon', '', [], false, ['strategy' => 'async']);
});

add_action('init', function () {
    if (!defined('WP_INSTALLING') && !did_action('elementor/loaded')) {
        return;
    }

    // Register category
    \Elementor\Plugin::instance()
        ->elements_manager
        ->add_category('haus-ecom', ['title' => 'Haus ecom']);

    // Register widgets
    \Elementor\Plugin::instance()
        ->widgets_manager
        ->register(new \Haus\Widgets\ProductList());

    \Elementor\Plugin::instance()
        ->widgets_manager
        ->register(new \Haus\Widgets\Checkout());


    \Elementor\Plugin::instance()
        ->widgets_manager
        ->register(new \Haus\Widgets\ProductSingle());

    \Elementor\Plugin::instance()
        ->widgets_manager
        ->register(new \Haus\Widgets\Header());
       \Elementor\Plugin::instance()
        ->widgets_manager
        ->register(new \Haus\Widgets\Cart());

    \Elementor\Plugin::instance()
        ->widgets_manager
        ->register(new \Haus\Widgets\CurrencyChooser());
    \Elementor\Plugin::instance()
        ->widgets_manager
        ->register(new \Haus\Widgets\OrderConfirmation());
    \Elementor\Plugin::instance()
        ->widgets_manager
        ->register(new \Haus\Widgets\Login());

    \Elementor\Plugin::instance()
        ->widgets_manager
        ->register(new \Haus\Widgets\AccountDetails());

    \Elementor\Plugin::instance()
        ->widgets_manager
        ->register(new \Haus\Widgets\Orders());

});


if (defined('WP_CLI') && WP_CLI) {
    add_action('init', function () {
        require_once HAUS_ECOM_PLUGIN_PATH . '/src/SyncData/Commands/SyncProductData.php';
    });
}
