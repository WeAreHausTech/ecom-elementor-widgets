<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class ProductImageCarousel extends Widget_Base
{
    use ElementorTemplate;
    public function get_name()
    {
        return 'ProductImageCarousel';
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
                'default' => 'no',
                'options' => [
                    'no' => __('No', 'haus-ecom-widgets'),
                    'yes' => __('Yes', 'haus-ecom-widgets'),
                ],
            ]
        );

        $this->add_control(
            'variant_images_only',
            [
                'label' => __('Show only variant images', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'no',
                'options' => [
                    'no' => __('No', 'haus-ecom-widgets'),
                    'yes' => __('Yes', 'haus-ecom-widgets'),
                ],
            ]
        );
        $this->add_control(
            'show_badges',
            [
                'label' => __('Show badges', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'no',
                'options' => [
                    'no' => __('No', 'haus-ecom-widgets'),
                    'yes' => __('Yes', 'haus-ecom-widgets'),
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

        $widgetId = 'ecom_' . $this->get_id();
        $post = get_post();
        $productId = get_the_ID();
        $vendureId = get_post_meta($productId, 'vendure_id', true);
        $settings = $this->get_settings_for_display();

        ?>

        <div id="<?= $widgetId ?>" class="ecom-components-root" data-widget-type="product-image-carousel"
            data-product-id="<?= $vendureId ?>" data-variant-images-only="<?= $settings['variant_images_only'] ?>"
            data-show-badges="<?= $settings['show_badges'] ?>" data-product-slug="<?= $post->post_name ?>">
        </div>
        <?php
    }
}