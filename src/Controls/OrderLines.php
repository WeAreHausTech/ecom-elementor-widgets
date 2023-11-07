<?php
namespace Haus\Controls;

class OrderLines
{
 public function getControlsForCartPrice($widget)
	{
		$widget->start_controls_section(
			'price_section',
			[
				'label' => __('Varukorg pris', 'webien'),
				'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
			]
		);

		$widget->add_control(
			'show_subTotal',
			[
				'label' => esc_html__('Visa varukostnad (utan tax)', 'webien'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__('Visa', 'webien'),
				'label_off' => esc_html__('Dölj', 'webien'),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

		$widget->add_control(
			'show_tax',
			[
				'label' => esc_html__('Visa moms', 'webien'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__('Visa', 'webien'),
				'label_off' => esc_html__('Dölj', 'webien'),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

		$widget->add_control(
			'show_shipping',
			[
				'label' => esc_html__('Visa frakt', 'webien'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__('Visa', 'webien'),
				'label_off' => esc_html__('Dölj', 'webien'),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

		$widget->add_control(
			'show_total',
			[
				'label' => esc_html__('Visa totalt (med tax)', 'webien'),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => esc_html__('Visa', 'webien'),
				'label_off' => esc_html__('Dölj', 'webien'),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

		$widget->add_control(
			'custom-message',
			[
				'label' => __('Meddelande', 'webien'),
				'type' => \Elementor\Controls_Manager::TEXT,
				'label_block' => true,
			]
		);


		$widget->end_controls_section();
	}
}