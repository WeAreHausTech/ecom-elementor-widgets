<?php
namespace Haus\Widgets;

use \Elementor\Widget_Base;
use \Haus\Traits\ElementorTemplate;

class ProductSingle extends Widget_Base
{
    use ElementorTemplate;
    public function get_name()
    {
        return 'Product Single';
    }
    public function get_title()
    {
        return esc_html__('Product Single', 'haus-ecom-widgets');
    }
    public function get_icon()
    {
        return 'eicon-single-page';
    }
    public function get_categories()
    {
        return ['haus-ecom'];
    }
    public function get_keywords()
    {
        return ['Ecommerce', 'product'];
    }
    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }

        $productId = get_the_ID();
        $vendureId = get_post_meta($productId, 'vendure_id', true);

        if (!$vendureId) {
            $this->getMissingProductTemplate();
            return;
        }
        
        $widget_id = 'ecom_' . $this->get_id();
        echo '<div id="' . $widget_id . '" data-vendure-token="' .VENDURE_TOKEN .'" data-vendure-api-url="' . VENDURE_API_URL .'" class="ecom-components-root" data-widget-type="product-detail" data-product="' . $vendureId . '"></div>';
        ?>
        <?php
    }

    protected function getMissingProductTemplate()
    {
        ?>
        <div class="webien-elementor-preview">
            <h1 style="display:flex; justify-content: center; align-items:center; margin: 2rem 0 2rem 0;">
                Produkten kunde inte hittas
            </h1>
        </div>
        <?php
    }
}