<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class ProductVariantOptions extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'ProductVariantOptions';
    }

    public function get_title()
    {
        return esc_html__('Variant options', 'haus-ecom-widgets');
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
        return ['Ecommerce', 'product', 'variant', 'options'];
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
          'use_url',
          [
              'label' => __('Use URL params', 'haus-ecom-widgets'),
              'type' => \Elementor\Controls_Manager::SELECT,
              'default' => '1',
              'options' => [
                  '0' => __('No', 'haus-ecom-widgets'),
                  '1' => __('Yes', 'haus-ecom-widgets'),
              ],
          ]
        );

        $this->add_control(
          'option_variable',
          [
            'label' => __('Use ID or Code', 'haus-ecom-widgets'),
            'type' => \Elementor\Controls_Manager::SELECT,
            'default' => 'id',
            'options' => [
                'id' => __('Id', 'haus-ecom-widgets'),
                'code' => __('Code', 'haus-ecom-widgets'),
            ],
            'condition' => [
              'use_url' => '1',
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

        $settings = $this->get_settings_for_display();
        $widgetId = 'ecom_' . $this->get_id();
        
        $post = get_post();
        $productId = get_the_ID();
        $vendureId = get_post_meta($productId, 'vendure_id', true);

        ?>

        

        <div 
            id="<?= $widgetId ?>"
            class="ecom-components-root" 
            data-widget-type="product-variant-options"
            data-use-url="<?= $settings['use_url'] ?>"
            data-option-variable="<?= $settings['option_variable'] ?>"
            data-product-id="<?= $vendureId ?>"
            data-product-slug="<?= $post->post_name ?>"
        >
        </div>
        <?php
    }
}