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

    protected function _register_controls()
    {
        $this->start_controls_section(
            'section_general', 
            [
                'label' => __('General settings', 'haus-ecom-widgets')
            ]
            );

            $this->add_control(
                'price_type', 
            [
                'label'=> __('Price type', 'haus_ecom_widgets'), 
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'ordinaryPrice',
                'options' => [
                    'ordinaryPrice' => __('ordinaryPrice', 'haus-ecom-widgets'),
                    'ordinaryIokPrice' => __('ordinaryIokPrice', 'haus-ecom-widgets')
                ],
            ]
            ); 
    }


    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }

        $settings = $this->get_settings_for_display(); 
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
            data-price-type="<?= $settings['price_type'] ?>"
        >
        </div>
        <?php
    }
}