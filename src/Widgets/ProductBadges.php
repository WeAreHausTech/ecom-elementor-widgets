<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class Badges extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'Product Badges';
    }

    public function get_title()
    {
        return esc_html__('Badges (produktpage)', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-tags';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'cart'];
    }

    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
        $settings = $this->get_settings_for_display();

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }
        $productId = get_the_ID();
        $vendureId = get_post_meta($productId, 'vendure_id', true);

        if (!$vendureId) {
            return;
        }
        ?>
        <div id="badges" class="ecom-components-root" data-widget-type="product-badges" data-product=<?= $vendureId ?>>
        </div>
        <?php
    }
}