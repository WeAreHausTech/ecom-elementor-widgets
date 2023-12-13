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
    $content = file_get_contents(__DIR__ . '/dist/parcel-manifest.json');
    $content = json_decode($content, true);

    $style = $content["index.scss"];
    $script = $content["index.tsx"];

    wp_register_style('ecom-addon', plugins_url('/dist' . $style, __FILE__));
    wp_register_script('ecom-addon', plugins_url('/dist' . $script, __FILE__));
    wp_enqueue_style('ecom-addon');
    wp_enqueue_script('ecom-addon', '', [], false, ['strategy' => 'async']);
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

add_action('wp_head', function () {
    $json_file_path_en = $_SERVER['DOCUMENT_ROOT'] . '/locales/en/translation.json';
    $json_file_path_sv = $_SERVER['DOCUMENT_ROOT'] . '/locales/sv/translation.json';
    $langData = [];

    if (file_exists($json_file_path_en)) {
        $langData[] = '"en":' . file_get_contents($json_file_path_en);
    }

    if (file_exists($json_file_path_sv)) {
        $langData[] = '"sv":' . file_get_contents($json_file_path_sv);
    }

    if (empty($langData)) {
        return;
    }

    ?>
    <script>
        var ecomLangData = {<?= implode(',',$langData) ?>};
    </script>
    <?php
});
