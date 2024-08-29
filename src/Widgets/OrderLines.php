<?php
namespace WeAreHausTech\Widgets; 

use\Elementor\Widget_Base; 
use\WeAreHausTech\Traits\ElementorTemplate; 

class OrderLines extends Widget_Base
{
    use ElementorTemplate; 

    public function get_name()
    {
        return 'OrderLines'; 
    }

    public function get_title()
    {
        return esc_html__('Order Lines', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-cart'; 
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }
    
    public function get_keywords()
    {
        return ['Ecommerce', 'orderlines', 'cart'];
    }
    
    //Osäker på om jag ska registrera kontroller
    protected function register_controls()
    {
       
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
            id="<?= $widgetId ?>"
            class="ecom-components-root" 
            data-widget-type="orderlines">
        </div>
        <?php
    }




}