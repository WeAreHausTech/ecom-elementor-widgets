<?php
namespace Haus\Widgets;

use \Elementor\Widget_Base;
use \Haus\Traits\ElementorTemplate;

class Checkout extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'Checkout';
    }

    public function get_title()
    {
        return esc_html__('Checkout', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-checkout';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'checkout'];
    }

    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }
        ?>
        <div id="checkout"></div>
        <?php
    }
}