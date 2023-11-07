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

    protected function register_controls()
    {
        (new \Haus\Controls\OrderLines)->getControlsForCartPrice($this);
    }

    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
        $settings = $this->get_settings_for_display();

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }

        $widgetId = 'ecom_' . $this->get_id();?>

        <div 
            id="<?= $widgetId ?>"
            class="ecom-components-root" 
            data-vendure-token="<?= VENDURE_TOKEN?>"
            data-vendure-api-url="<?= VENDURE_API_URL ?>"
            data-show-subtotal="<?= $settings['show_subTotal']  ?>"
            data-show-tax="<?= $settings['show_tax']  ?>"
            data-show-shipping="<?=  $settings['show_shipping'] ?>"
            data-show-total="<?=  $settings['show_total'] ?>"
            data-custom-message="<?= $settings['custom-message']?>"
            data-widget-type="checkout">
        </div>
        <?php
    }
}