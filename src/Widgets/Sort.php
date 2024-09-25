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
      data-product-list-identifier="<?= $settings['price_list_identifier'] ?>" data-widget-id="<?= $widgetId ?>">
    </div>
    <?php
  }
}
