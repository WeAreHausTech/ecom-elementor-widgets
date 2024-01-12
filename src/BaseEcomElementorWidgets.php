<?php

namespace Haus;

class BaseEcomElementorWidgets
{
    public static function init()
    {
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

            if (defined('WP_CLI') && WP_CLI) {
                require_once 'SyncData/Commands/SyncProductData.php';
                require_once 'SyncData/Commands/DeleteAllPosts.php';
            }
        });
    }
}