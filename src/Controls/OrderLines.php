<?php
namespace Haus\Controls;

class OrderLines
{
	public function getControlsForCartPrice($widget)
	{
		$widget->start_controls_section(
			'price_section',
			[
				'label' => __('Varukorg pris', 'haus-ecom-widgets'),
				'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
			]
		);

		$widget->add_control(
			'show_subTotal',
			[
				'label' => esc_html__('Visa varukostnad (utan tax)', 'haus-ecom-widgets'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__('Visa', 'haus-ecom-widgets'),
				'label_off' => esc_html__('Dölj', 'haus-ecom-widgets'),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

		$widget->add_control(
			'show_tax',
			[
				'label' => esc_html__('Visa moms', 'haus-ecom-widgets'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__('Visa', 'haus-ecom-widgets'),
				'label_off' => esc_html__('Dölj', 'haus-ecom-widgets'),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

		$widget->add_control(
			'show_shipping',
			[
				'label' => esc_html__('Visa frakt', 'haus-ecom-widgets'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__('Visa', 'haus-ecom-widgets'),
				'label_off' => esc_html__('Dölj', 'haus-ecom-widgets'),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

		$widget->add_control(
			'show_total',
			[
				'label' => esc_html__('Visa totalt (med tax)', 'haus-ecom-widgets'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__('Visa', 'haus-ecom-widgets'),
				'label_off' => esc_html__('Dölj', 'haus-ecom-widgets'),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

		$widget->add_control(
			'custom-message',
			[
				'label' => __('Meddelande', 'haus-ecom-widgets'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__('Visa', 'haus-ecom-widgets'),
				'label_off' => esc_html__('Dölj', 'haus-ecom-widgets'),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);


		$widget->end_controls_section();
	}
}