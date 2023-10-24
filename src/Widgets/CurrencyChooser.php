<?php
namespace Haus\Widgets;

use \Elementor\Widget_Base;
use \Haus\Traits\ElementorTemplate;

class CurrencyChooser extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'CurrencyChooser';
    }

    public function get_title()
    {
        return esc_html__('Currency Chooser', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-purchase-summary';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'currency', 'chooser'];
    }

    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }
        $widget_id = 'ecom_' . $this->get_id();
        echo '<div id="' . $widget_id . '" data-vendure-token="' . $_ENV["VENDURE_TOKEN"] .'"  data-vendure-api-url="' . $_ENV["VENDURE_API_URL"] .'" class="ecom-components-root" data-widget-type="currency-chooser"></div>';
        ?>

        <?php
    }
}