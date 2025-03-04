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
                ->register(new \WeAreHausTech\Widgets\Filters());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\Sort());

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

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\ResetPassword());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\AuthChecker());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\GoogleAnalytics());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\ProductImageCarousel());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\ProductVariantOptions());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\AddToCartButtonWidget());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\OrderLines());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\CartPrice());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\ProductPrice());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\ProductBadges());

            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \WeAreHausTech\Widgets\ConditionalTemplate());


            if (defined('WP_CLI') && WP_CLI && !class_exists(\WeAreHausTech\WpProductSync\Commands\SyncProductData::class)) {
                \WP_CLI::add_command('sync-products', \WeAreHausTech\SyncData\Commands\SyncProductData::class);
                \WP_CLI::add_command('sync-products', \WeAreHausTech\SyncData\Commands\DeleteAllPosts::class);
                \WP_CLI::add_command('sync-products', \WeAreHausTech\SyncData\Commands\RemoveLock::class);
            }
        });
    }
}
