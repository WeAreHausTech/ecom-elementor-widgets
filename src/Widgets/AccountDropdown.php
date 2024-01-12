<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class AccountDropdown extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'AccountDropdown';
    }

    public function get_title()
    {
        return esc_html__('Account Dropdown', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-user-circle-o';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'account', 'dropdown'];
    }

    protected function register_controls()
    {
        
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
            data-widget-type="account-dropdown"
            data-use-login-modal="<?= $settings['use_login_modal'] ?>"
            data-icon-component="<?= $settings['icon_component'] ?>"
            data-on-logout-redirect="<?= $settings['on_logout_redirect'] ?>"
        >
        </div>
        <?php
    }
}