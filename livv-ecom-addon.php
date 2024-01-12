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

add_action('wp_head', function() {
    $content = file_get_contents(__DIR__ . '/dist/.vite/manifest.json');
    $content = json_decode($content, true);
    $script = $content["components/index.tsx"]["file"];
    ?>
    <script src="<?= plugins_url('/dist/' . $script, __FILE__) ?>" id="ecom-addon-js" async="" data-wp-strategy="async" type="module"></script>
    <?php
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
        require_once HAUS_ECOM_PLUGIN_PATH . '/src/SyncData/Commands/DeleteAllPosts.php';
        require_once HAUS_ECOM_PLUGIN_PATH . '/src/SyncData/Commands/RemoveLock.php';
    });
}

add_action('wp_head', function () {

    if (!defined('ECOM_DATA_PATH')) {
        die("ECOM_DATA_PATH is not set.");
    }

    // Translations
    // Loop through uploads/ecom_lang/locales and add all json files to the page
    $directoryPath = $_SERVER['DOCUMENT_ROOT'] . ECOM_DATA_PATH . '/locales'; // Path to your directory
    $translations = [];

    // Loop through all JSON files in the directory
    foreach (glob($directoryPath . '/*.json') as $filename) {
        // Extract the locale code from the filename
        $locale = basename($filename, '.json');

        // Read the contents of the file
        $content = file_get_contents($filename);
        if ($content === false) {
            // Handle the error, e.g., file not readable
            continue;
        }

        // Add the content to the translations array
        $translations[$locale] = json_decode($content, true);
    }

    // Convert the translations array to a JSON string
    $jsonTranslationsString = json_encode($translations, JSON_PRETTY_PRINT);


    // Query updates
    $directoryPath = $_SERVER['DOCUMENT_ROOT'] . ECOM_DATA_PATH . '/queries/updates.json'; // Path to your directory
    $jsonUpdatesString = file_get_contents($directoryPath);

    // Config
    $configPath = $_SERVER['DOCUMENT_ROOT'] . ECOM_DATA_PATH . '/config.json';

    ?>
    <script>
        localStorage.setItem('ecomLangData', JSON.stringify(<?= $jsonTranslationsString ?>));
        localStorage.setItem('ecomQueryUpdates', JSON.stringify(<?= $jsonUpdatesString ?>));
        localStorage.setItem('ecomConfig', JSON.stringify(<?= file_get_contents($configPath) ?>));
    </script>
    <?php

    // Styles
    $stylePath = $_SERVER['DOCUMENT_ROOT'] . ECOM_DATA_PATH . '/styles/ecom-styles.css';
    ?>
    <style>
        <?= file_get_contents($stylePath) ?>
    </style>


    <?php
});
