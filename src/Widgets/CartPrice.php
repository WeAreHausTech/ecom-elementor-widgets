<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class CartPrice extends Widget_Base 
{
    use ElementorTemplate; 

    public function get_name()
    {
        return 'CartPrice';
    }

    public function get_title()
    {
        return esc_html__('Cart Price', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-price-table';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'cart', 'price'];
    }

    protected function register_controls()
    {
        (new \WeAreHausTech\Controls\OrderLines)->getControlsForCartPrice($this);
    }

    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
        $settings = $this->get_settings_for_display();

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }
        $widgetId = 'ecom_' . $this->get_id(); ?>

        <div 
            id="<?= ($widgetId) ?>" 
            class="ecom-components-root"
            data-vendure-token="<?= VENDURE_TOKEN ?>"
            data-vendure-api-url="<?= VENDURE_API_URL ?>"
            data-show-subtotal="<?= $settings['show_subTotal'] ?>"
            data-show-tax="<?= $settings['show_tax'] ?>"
            data-show-shipping="<?= $settings['show_shipping'] ?>"
            data-show-total="<?= $settings['show_total'] ?>"
            data-custom-message="<?= $settings['custom_message'] ?>"
            data-widget-type="cart-price"
            >
        </div>
        <?php
    }
}