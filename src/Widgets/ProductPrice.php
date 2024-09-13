<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class ProductPrice extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'ProductPrice';
    }

    public function get_title()
    {
        return esc_html__('Product Price', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-product-price';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'product', 'price'];
    }


    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }

        $widgetId = 'ecom_' . $this->get_id();
        
        $post = get_post();
        $productId = get_the_ID();
        $vendureId = get_post_meta($productId, 'vendure_id', true);

        ?>

        

        <div 
            id="<?= $widgetId ?>"
            class="ecom-components-root" 
            data-widget-type="product-price"
            data-product-id="<?= $vendureId ?>"
        >
        </div>
        <?php
    }
}