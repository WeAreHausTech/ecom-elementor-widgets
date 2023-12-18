<?php
namespace Haus\Widgets;

use \Elementor\Widget_Base;
use \Haus\Traits\ElementorTemplate;

class CartIcon extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'Cart icon';
    }

    public function get_title()
    {
        return esc_html__('Cart icon', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-cart-medium';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'cart'];
    }



    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }
        $widgetId = 'ecom_' . $this->get_id(); ?>

        <div 
            id="<?= $widgetId ?>"
            class="ecom-components-root" 
            data-vendure-token="<?= VENDURE_TOKEN ?>"
            data-vendure-api-url="<?= VENDURE_API_URL ?>"
            data-widget-type="dropdown-cart">
        </div>
        <?php
    }
}