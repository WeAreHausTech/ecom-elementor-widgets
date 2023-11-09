<?php
namespace Haus\Widgets;

use \Elementor\Widget_Base;
use \Haus\Traits\ElementorTemplate;

class Orders extends Widget_Base
{
  use ElementorTemplate;

  public function get_name()
  {
    return 'Orders';
  }

  public function get_title()
  {
    return esc_html__('Orders', 'haus-ecom-widgets');
  }

  public function get_icon()
  {
    return 'eicon-product-related';
  }

  public function get_categories()
  {
    return ['haus-ecom'];
  }

  public function get_keywords()
  {
    return ['Ecommerce', 'orders'];
  }

  protected function _register_controls()
  {
    $this->start_controls_section(
      'section_content',
      [
        'label' => __('Filter settings', 'webien'),
      ]
    );

    $this->add_control(
      'orders_take',
      [
        'label' => esc_html__('Antal', 'webien'),
        'type' => \Elementor\Controls_Manager::NUMBER,
        'default' => 10,
      ]
    );

    $this->add_control(
      'orders_state_filter',
      [
        'label' => esc_html__('Status', 'webien'),
        'type' => \Elementor\Controls_Manager::SELECT2,
        'multiple' => true,
        'options' => [
          'AddingItems' => esc_html__('AddingItems', 'webien'),
          'ArrangingPayment' => esc_html__('ArrangingPayment', 'webien'),
          'Cancelled' => esc_html__('Cancelled', 'webien'),
          'CancelledAfterApproval' => esc_html__('CancelledAfterApproval', 'webien'),
          'Delivered' => esc_html__('Delivered', 'webien'),
          'PaymentAuthorized' => esc_html__('PaymentAuthorized', 'webien'),
          'PaymentSettled' => esc_html__('PaymentSettled', 'webien'),
          'PaymentDeclined' => esc_html__('PaymentDeclined', 'webien'),
          'PaymentFailed' => esc_html__('PaymentFailed', 'webien'),
          'Pending' => esc_html__('Pending', 'webien'),
          'Refunded' => esc_html__('Refunded', 'webien'),
          'Shipped' => esc_html__('Shipped', 'webien'),
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

    $widgetId = 'ecom_' . $this->get_id();?>

    <div 
      id="<?= $widgetId ?>"
      class="ecom-components-root" 
      data-vendure-token="<?= VENDURE_TOKEN?>"
      data-vendure-api-url="<?= VENDURE_API_URL ?>"
      data-widget-type="orders"
      data-orders-sort="<?= $settings['orders_sort'] ?>"
      data-orders-take="<?= $settings['orders_take'] ?>"
      data-orders-state-filter="<?= $settings['orders_state_filter'] ?>"
    >
    </div>
    <?php
  }
}