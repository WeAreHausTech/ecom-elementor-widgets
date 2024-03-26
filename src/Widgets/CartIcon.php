<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class CartIcon extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'Cart icon';
    }

    public function get_title()
    {
        return esc_html__('Cart icon', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-cart-medium';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'cart'];
    }
    
    protected function register_controls()
    {
        $this->start_controls_section(
            'section_general',
            [
                'label' => __('General settings', 'haus-ecom-widgets'),
            ]
        );

        $this->add_control(
            'dropdown-enabled',
            [
                'label' => __('Enable dropdown', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '0',
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
        $settings = $this->get_settings_for_display();

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }
        $widgetId = 'ecom_' . $this->get_id(); ?>

        <div 
            id="<?= $widgetId ?>"
            class="ecom-components-root" 
            data-vendure-token="<?= VENDURE_TOKEN ?>"
            data-vendure-api-url="<?= VENDURE_API_URL ?>"
            data-dropdown-enabled="<?= $settings['dropdown-enabled'] ?>"
            data-widget-type="dropdown-cart">
        </div>
        <?php
    }
}