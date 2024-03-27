<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class AuthChecker extends Widget_Base
{
  use ElementorTemplate;

  public function get_name()
  {
    return 'Auth checker';
  }

  public function get_title()
  {
    return esc_html__('Auth Checker', 'haus-ecom-widgets');
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
    return ['Ecommerce', 'auth'];
  }

  protected function render()
  {
    $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
    if (strpos($url, '&action=elementor') !== false) {
      $this->getTemplate();
      return;
    }
    $widget_id = 'ecom_' . $this->get_id();
    ?>
     <div
        id="<?= $widget_id ?>"
        class="ecom-components-root"
        data-widget-type="auth-checker"
      >
        </div>
    <?php
  }
}