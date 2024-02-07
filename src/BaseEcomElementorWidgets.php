<?php

namespace WeAreHausTech;

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
                ->register(new \WeAreHausTech\Widgets\ProductList());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\Checkout());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\ProductSingle());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\Header());
            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\Cart());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\CurrencyChooser());
            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\OrderConfirmation());
            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\Login());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\AccountDetails());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\Orders());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\OrderView());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\CartIcon());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\AccountDropdown());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\RelatedProducts());

            if (defined('WP_CLI') && WP_CLI) {
                require_once 'SyncData/Commands/SyncProductData.php';
                require_once 'SyncData/Commands/DeleteAllPosts.php';
                require_once 'SyncData/Commands/RemoveLock.php';
            }
        });
    }
}