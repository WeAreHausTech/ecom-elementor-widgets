<?php
namespace Haus\Widgets;

use \Elementor\Widget_Base;
use \Haus\Traits\ElementorTemplate;

class ProductList extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'Product List';
    }

    public function get_title()
    {
        return esc_html__('Product List', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-post-list';
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
                'label' => __('General settings', 'webien'),
            ]
        );

        $this->add_control(
            'show_add_to_cart',
            [
                'label' => __('Show Add to cart', 'webien'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '0',
                'options' => [
                    '0' => __('No', 'webien'),
                    '1' => __('Yes', 'webien'),
                ],
            ]
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'section_content',
            [
                'label' => __('Filter settings', 'webien'),
            ]
        );

        $this->add_facet_controls();
        $this->end_controls_section();

        $this->start_controls_section(
            'section_pagination',
            [
                'label' => __('Pagination', 'webien'),
            ]
        );
        $this->add_pagination_controls();
        $this->end_controls_section();

        $this->start_controls_section(
            'section-filter',
            [
                'label' => __('Filter', 'webien'),
            ]
        );

        $this->getAvailableFacets();

        $this->end_controls_section();
    }

    public function getAvailableFacets(){
        $facets = $this->get_facets();

        if (!isset($facets['data']['facets']['items'])) {
            return;
        }

        $options = [];

        forEach($facets['data']['facets']['items'] as $facet){
            $options[$facet['id']] = $facet['name'];
        }

        $this->add_control(
            'filter_values',
            [
                'label' => __('Filters:', 'webien'),
                'type' => \Elementor\Controls_Manager::SELECT2,
                'label_block' => true,
                'options' => $options,
                'default' => '0',
                'multiple' => true,
            ]
        );
    }

    public function get_facets(){
        $facets = get_transient('ecom-haus-queries-facet');

        if (!$facets) {
            $facets = (new \Haus\Queries\Facet)->get('sv');
            set_transient('ecom-haus-queries-facet', $facets, 60 * 5);
        }

        return $facets;
    }

    public function add_facet_controls()
    {
        $facets = $this->get_facets();

        if (!isset($facets['data']['facets']['items'])) {
            return;
        }

        $this->add_control(
            'autoFacet',
            [
                'label' => __('Autoset taxonomy:', 'webien'),
                'type' => \Elementor\Controls_Manager::SELECT2,
                'label_block' => true,
                'options' => [
                    '0' => '-',
                    'department' => 'Department',
                    'brand' => 'Brand',
                    'category' => 'Category',
                ],
                'default' => '0',
            ]
        );

        foreach ($facets['data']['facets']['items'] as $facet) {
            $this->add_control(
                'facetType-' . $facet['name'],
                [
                    'label' => __(ucfirst($facet['name']) . ':', 'webien'),
                    'type' => \Elementor\Controls_Manager::SELECT2,
                    'label_block' => true,
                    'options' => $this->get_facet_options($facet),
                    'default' => '0',
                    'condition' => [
                        'autoFacet!' =>  $facet['name'],
                    ],
                ]
            );
        }
    }

    public function get_facet_options($facet)
    {
        $options = [
            '0' => '-',
        ];

        foreach ($facet['values'] as $value) {
            $options[$value['id']] = $value['name'];
        }

        return $options;
    }

    public function add_pagination_controls()
    {
        $this->add_control(
            'sort_enabled',
            [
                'label' => __('Enable Sort', 'webien'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '0',
                'options' => [
                    '0' => __('No', 'webien'),
                    '1' => __('Yes', 'webien'),
                ],
            ]
        );

        $this->add_control(
            'pagination_enabled',
            [
                'label' => __('Enable Pagination', 'webien'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '0',
                'options' => [
                    '0' => __('No', 'webien'),
                    '1' => __('Yes', 'webien'),
                ],
            ]
        );

        $this->add_control(
            'products_per_page',
            [
                'label' => __('Products per page', 'webien'),
                'type' => \Elementor\Controls_Manager::NUMBER,
                'default' => '12',
            ]
        );
    }

    protected function render()
    {
        $settings = $this->get_settings_for_display();
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }

        $taxonomy = '';
        $facets = [];

        $autoSetTaxonomy = $settings['autoFacet'] !== '0';

        if ($autoSetTaxonomy) {
            $currentTerm = get_queried_object();
            $termId = $currentTerm->term_id;
            $termTaxonomy = $currentTerm->taxonomy;

            if ($termId && $termTaxonomy === 'produkter-kategorier') {
                $taxonomy = get_term_meta($termId, 'vendure_collection_id', true);
            } else {
                $facetId = get_term_meta($termId, 'vendure_term_id', true);
                $facets[] = $facetId;
            }
        }

        foreach ($settings as $key => $value) {
            if (strpos($key, 'facetType-') !== false && $value !== '0' && ($autoSetTaxonomy && $key !== 'facetType-' . $settings['autoFacet'])) {
                    $facets[] = $value;
            }
        }

        $widgetId = 'ecom_' . $this->get_id();
        ?>
        <div
            id="<?= $widgetId ?>"
            class="ecom-components-root"
            data-vendure-api-url="<?= VENDURE_API_URL ?>" 
            data-vendure-token="<?= VENDURE_TOKEN ?>"
            data-widget-type="product-list"
            data-facet="<?= implode(", ", $facets) ?>"
            data-collection="<?= $taxonomy ?>"
            data-take="<?= $settings['products_per_page'] ?>"
            data-sort-enabled="<?= $settings['sort_enabled'] ?>"
            data-pagination-enabled="<?= $settings['pagination_enabled'] ?>"
            data-add-to-cart-enabled="<?= $settings['show_add_to_cart'] ?>"
            data-filter-values="<?= implode(", ", $settings['filter_values'])?>"
        >
        </div>
        <?php
    }
}
