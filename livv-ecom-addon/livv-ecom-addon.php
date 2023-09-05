<?php
/**
 * Plugin Name: Livv Ecom Widgets Addon
 * Description: Livv ecom widgets for Elementor.
 * Version:     0.0.1
 * Author:      Haus Tech
 * Author URI:  https://haus.se/
 * Text Domain: elementor-addon
 */

 require_once( __DIR__ . '/widgets/product-list-widget.php' );

 $widgets_manager->register( new \Elementor_Livv_Product_List_Widget() );