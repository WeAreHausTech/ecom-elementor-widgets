<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

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
        'label' => __('Filter settings', 'haus-ecom-widgets'),
      ]
    );

    $this->add_control(
      'orders_take',
      [
        'label' => esc_html__('Antal', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::NUMBER,
        'default' => 10,
      ]
    );

    $this->add_control(
      'orders_state_filter',
      [
        'label' => esc_html__('Status', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::SELECT2,
        'multiple' => true,
        'options' => [
          'AddingItems' => esc_html__('AddingItems', 'haus-ecom-widgets'),
          'ArrangingPayment' => esc_html__('ArrangingPayment', 'haus-ecom-widgets'),
          'Cancelled' => esc_html__('Cancelled', 'haus-ecom-widgets'),
          'CancelledAfterApproval' => esc_html__('CancelledAfterApproval', 'haus-ecom-widgets'),
          'Delivered' => esc_html__('Delivered', 'haus-ecom-widgets'),
          'PaymentAuthorized' => esc_html__('PaymentAuthorized', 'haus-ecom-widgets'),
          'PaymentSettled' => esc_html__('PaymentSettled', 'haus-ecom-widgets'),
          'PaymentDeclined' => esc_html__('PaymentDeclined', 'haus-ecom-widgets'),
          'PaymentFailed' => esc_html__('PaymentFailed', 'haus-ecom-widgets'),
          'Pending' => esc_html__('Pending', 'haus-ecom-widgets'),
          'Refunded' => esc_html__('Refunded', 'haus-ecom-widgets'),
          'Shipped' => esc_html__('Shipped', 'haus-ecom-widgets'),
        ],
      ]
    );

    $this->add_control(
      'show_order_again_button',
      [
        'label' => esc_html__('Show order again button', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::SWITCHER,
        'label_on' => esc_html__('Vis', 'haus-ecom-widgets'),
        'label_off' => esc_html__('Skjul', 'haus-ecom-widgets'),
        'return_value' => 'yes',
        'default' => 'yes',
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
    
     $filters = [];
     forEach($settings['orders_state_filter'] as $filter) {
       $filters[] = $filter;
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
      data-show-order-again-button="<?= $settings['show_order_again_button'] ?>"
      data-orders-state-filter="<?= implode(", ", $filters) ?>"
    >
    </div>
    <?php
  }
}