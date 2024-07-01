<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class ProductImageCarousel extends Widget_Base
{
    use ElementorTemplate;
    public function get_name()
    {
        return 'Product Image Carousel';
    }
    public function get_title()
    {
        return esc_html__('Product Image Carousel', 'haus-ecom-widgets');
    }
    public function get_icon()
    {
        return 'eicon-nested-carousel';
    }
    public function get_categories()
    {
        return ['haus-ecom'];
    }
    public function get_keywords()
    {
        return ['Ecommerce', 'product'];
    }
    protected function _register_controls()
    {
        $this->start_controls_section(
            'section_general',
            [
                'label' => __('General settings', 'haus-ecom-widgets'),
            ]
        );

        $this->add_control(
            'hide_thumbs_if_single',
            [
                'label' => __('Hide thumbs if single', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '1',
                'options' => [
                    '0' => __('No', 'haus-ecom-widgets'),
                    '1' => __('Yes', 'haus-ecom-widgets'),
                ],
            ]
        );

        $this->end_controls_section();
    }
    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }
        
        $widget_id = 'ecom_' . $this->get_id();
        $post = get_post();
        $product_id = get_the_ID();
        echo '<div id="' . $widget_id . '" class="ecom-components-root" data-widget-type="product-image-carousel" data-product-id="'.$product_id.'" data-product-slug="'.$post->post_name.'"></div>';
        ?>
        <?php
    }
}