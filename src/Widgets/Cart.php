<?php
namespace Haus\Widgets;

use \Elementor\Widget_Base;
use \Haus\Traits\ElementorTemplate;

class Cart extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'Cart';
    }

    public function get_title()
    {
        return esc_html__('Cart', 'haus-ecom-widgets');
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
        return ['Ecommerce', 'cart'];
    }

    protected function register_controls()
    {

        $this->start_controls_section(
            'price_section',
            [
                'label' => __('Varukorg pris', 'webien'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
			'show_subTotal',
			[
				'label' => esc_html__( 'Visa varukostnad (utan tax)', 'webien' ),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__( 'Visa', 'webien' ),
				'label_off' => esc_html__( 'Dölj', 'webien' ),
                'return_value' => 'yes',
				'default' => 'yes',
			]
		);

        $this->add_control(
			'show_tax',
			[
				'label' => esc_html__( 'Visa moms', 'webien' ),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__( 'Visa', 'webien' ),
				'label_off' => esc_html__( 'Dölj', 'webien' ),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

        $this->add_control(
			'show_shipping',
			[
				'label' => esc_html__( 'Visa frakt', 'webien' ),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__( 'Visa', 'webien' ),
				'label_off' => esc_html__( 'Dölj', 'webien' ),
                'return_value' => 'yes',
				'default' => 'yes',
			]
		);

        $this->add_control(
			'show_total',
			[
				'label' => esc_html__( 'Visa totalt (med tax)', 'webien' ),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__( 'Visa', 'webien' ),
				'label_off' => esc_html__( 'Dölj', 'webien' ),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

        $this->add_control(
            'custom-message',
            [
                'label' => __('Meddelande', 'webien'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
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
        $widgetId = 'ecom_' . $this->get_id();
        ?>

        <div 
            id="<?= $widgetId ?>"
            class="ecom-components-root" 
            data-vendure-token="<?= $_ENV["VENDURE_TOKEN"] ?>"
            data-show-subtotal="<?= $settings['show_subTotal']  ?>"
            data-show-tax="<?= $settings['show_tax']  ?>"
            data-show-shipping="<?=  $settings['show_shipping'] ?>"
            data-show-total="<?=  $settings['show_total'] ?>"
            data-custom-message="<?= $settings['custom-message']?>"
            data-widget-type="cart">
        </div>

        <?php
    }
}