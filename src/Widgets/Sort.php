<?php

namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class Sort extends Widget_Base
{
  use ElementorTemplate;

  public function get_name()
  {
    return 'Sort';
  }

  public function get_title()
  {
    return 'Product List Sort';
  }

  public function get_icon()
  {
    return 'eicon-filter';
  }

  public function get_categories()
  {
    return ['haus-ecom'];
  }

  public function get_keywords()
  {
    return ['Ecommerce', 'productfilter'];
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
      'price_list_identifier',
      [
        'label' => __('Price list identifier', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::TEXT,
        'description' => __('Price list identifier, if none specified, sort will update all Product Lists without identifier.', 'haus-ecom-widgets'),
        'default' => 'product-list',
      ]
    );

    // Mobile display controls
    $this->add_control(
      'open_in_modal',
      [
        'label' => __('Open in modal on mobile', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::SWITCHER,
        'label_on' => __('Yes', 'haus-ecom-widgets'),
        'label_off' => __('No', 'haus-ecom-widgets'),
        'return_value' => 'yes',
        'default' => 'no',
      ]
    );

    $this->add_control(
      'mobile_breakpoint',
      [
        'label' => __('Mobile breakpoint (px)', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::NUMBER,
        'description' => __('Screen width of which the sort will open in a modal', 'haus-ecom-widgets'),
        'default' => 768,
        'min' => 320,
        'max' => 1200,
        'step' => 1,
        'condition' => [
          'open_in_modal' => 'yes',
        ],
      ]
    );

    $this->end_controls_section();
  }

  protected function render()
  {
    $settings = $this->get_settings_for_display();
    $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

    if (strpos($url, '&action=elementor') !== false) {
      $this->getTemplate();
      return;
    }

    $widgetId = 'ecom_' . $this->get_id();
    ?>

    <div id="<?= $widgetId ?>" class="ecom-components-root" data-widget-type="product-list-sort"
      data-product-list-identifier="<?= $settings['price_list_identifier'] ?>" data-widget-id="<?= $widgetId ?>"
      data-open-in-modal="<?= $settings['open_in_modal'] ?>" data-mobile-breakpoint="<?= $settings['mobile_breakpoint'] ?>">
    </div>
    <?php
  }
}
