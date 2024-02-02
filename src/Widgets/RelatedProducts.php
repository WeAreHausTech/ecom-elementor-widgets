<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class RelatedProducts extends Widget_Base
{
    use ElementorTemplate;
    public function get_name()
    {
        return 'RelatedProducts';
    }
    public function get_title()
    {
        return esc_html__('Related products', 'haus-ecom-widgets');
    }
    public function get_icon()
    {
        return 'eicon-products';
    }
    public function get_categories()
    {
        return ['haus-ecom'];
    }
    public function get_keywords()
    {
        return ['Ecommerce', 'product'];
    }
    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
        
        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }

        $widget_id = 'ecom_' . $this->get_id();
        ?>
        <div 
            id="<?= $widget_id ?>"
            class="ecom-components-root"
            data-widget-type="related-products"
            >
        </div>
        <?php
      
    }
}