<?php

/**
 * Plugin Name: Haus Ecom Elementor Widgets
 * Description: Lastest commit: {{COMMIT_DATE}}. Build date: {{BUILD_DATE}}
 * Version:     {{VERSION}}
 * Author:      Haus Tech
 * Author URI:  https://haus.se/
 * GitHub Plugin URI: https://github.com/WeAreHausTech/ecom-elementor-widgets
 * Primary Branch: main
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

    \Elementor\Plugin::instance()
    ->widgets_manager
    ->register(new \Haus\Widgets\OrderView());

    \Elementor\Plugin::instance()
    ->widgets_manager
    ->register(new \Haus\Widgets\CartIcon());
});


if (defined('WP_CLI') && WP_CLI) {
    add_action('init', function () {
        require_once HAUS_ECOM_PLUGIN_PATH . '/src/SyncData/Commands/SyncProductData.php';
    });

    add_action('init', function () {
        require_once HAUS_ECOM_PLUGIN_PATH . '/src/SyncData/Commands/DeleteAllPosts.php';
    });
}
