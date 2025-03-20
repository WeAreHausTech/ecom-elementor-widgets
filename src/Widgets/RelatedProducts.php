<?php

namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;
use WeAreHausTech\Queries\QueryHelper;

class RelatedProducts extends Widget_Base
{
    use ElementorTemplate;
    public function get_name()
    {
        return 'RelatedProducts';
    }
    public function get_title()
    {
        return esc_html__('Related products', 'haus-ecom-widgets');
    }
    public function get_icon()
    {
        return 'eicon-products';
    }
    public function get_categories()
    {
        return ['haus-ecom'];
    }
    public function get_keywords()
    {
        return ['Ecommerce', 'product'];
    }

    protected function _register_controls()
    {
        $this->start_controls_section(
            'section_content',
            [
                'label' => __('Filter settings', 'haus-ecom-widgets'),
            ]
        );

        $this->add_facet_controls();

        // This prop doesn't exist anymore, should use the hideAddToCart prop instead
        // $this->add_control(
        //     'show_add_to_cart',
        //     [
        //         'label' => __('Show Add to cart', 'haus-ecom-widgets'),
        //         'type' => \Elementor\Controls_Manager::SELECT,
        //         'default' => '0',
        //         'options' => [
        //             '0' => __('No', 'haus-ecom-widgets'),
        //             '1' => __('Yes', 'haus-ecom-widgets'),
        //         ],
        //     ]
        // );

        $this->add_control(
            'max_products',
            [
                'label' => __('Max products', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::NUMBER,
                'default' => '12',
            ]
        );

        $this->end_controls_section();
    }


    public function get_facets()
    {
        $facets = get_transient('ecom-haus-queries-facet');

        if (!$facets) {
            $facets = (new QueryHelper)->getVendureFacets('sv');
            set_transient('ecom-haus-queries-facet', $facets, 60 * 5);
        }

        return $facets;
    }

    public function add_facet_controls()
    {
        $facets = $this->get_facets();

        if (!isset($facets)) {
            return;
        }

        $options = [];

        foreach ($facets as $facet) {
            $options[$facet['id']] = $facet['name'];
        }

        $this->add_control(
            'facet',
            [
                'label' => __('Show related products based on:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT2,
                'label_block' => true,
                'options' => $options,
            ]
        );
    }
    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }
        $settings = $this->get_settings_for_display();
        $facet = $settings['facet'] ?? '';
        $productId = get_the_ID();
        $vendureId = get_post_meta($productId, 'vendure_id', true);

        $widget_id = 'ecom_' . $this->get_id();
        ?>
        <div
            id="<?= $widget_id ?>"
            data-vendure-api-url="<?= VENDURE_API_URL ?>"
            data-vendure-token="<?= VENDURE_TOKEN ?>"
            class="ecom-components-root"
            data-widget-type="related-products"
            data-product="<?= $vendureId ?>"
            data-take="<?= $settings['max_products'] ?>"
            data-facet="<?= $facet ?>">
        </div>
        <?php

    }
}
