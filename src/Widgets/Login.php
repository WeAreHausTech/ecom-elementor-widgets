<?php
namespace Haus\Widgets;

use \Elementor\Widget_Base;
use \Haus\Traits\ElementorTemplate;

class Login extends Widget_Base
{
  use ElementorTemplate;

  public function get_name()
  {
    return 'Login';
  }

  public function get_title()
  {
    return esc_html__('Login', 'haus-ecom-widgets');
  }

  public function get_icon()
  {
    return 'eicon-lock-user';
  }
  
  public function get_categories()
  {
    return ['haus-ecom'];
  }

  public function get_keywords()
  {
    return ['Ecommerce', 'login'];
  }

  protected function _register_controls()
  {
    $this->start_controls_section(
      'section_content',
      [
        'label' => __('Login settings', 'webien'),
      ]
    );

    $this->add_control(
      'show_as_modal',
      [
        'label' => esc_html__('Visa som modal', 'webien'),
        'type' => \Elementor\Controls_Manager::SWITCHER,
        'label_on' => esc_html__('Ja', 'webien'),
        'label_off' => esc_html__('Nej', 'webien'),
        'return_value' => 'yes',
        'default' => 'yes',
      ]
    );

    $this->add_control(
      'link',
      [
        'label' => esc_html__('Login Page URL', 'webien'),
        'type' => \Elementor\Controls_Manager::TEXT,
        'default' => '',
        'condition' => [
          'show_as_modal!' => 'yes',
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
    $widget_id = 'ecom_' . $this->get_id();
    ?>
     <div
        id="<?= $widget_id ?>"
        class="ecom-components-root"
        data-vendure-api-url="<?= VENDURE_API_URL ?>" 
        data-vendure-token="<?= VENDURE_TOKEN ?>"
        data-widget-type="login"
        data-show-as-modal="<?= $settings['show_as_modal'] ?>"
        data-redirect-to="<?= $settings['link'] ?>"
      >
        </div>
    <?php
  }
}