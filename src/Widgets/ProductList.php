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
            'section_content',
            [
                'label' => __('Filter settings', 'webien'),
            ]
        );

        $this->add_facet_controls();
        $this->end_controls_section();
    }

    public function add_facet_controls()
    {
        $facets = (new \Haus\Queries\Facet)->get();

        if (!isset($facets['data']['facets']['items'])) {
            return;
        }

        foreach ($facets['data']['facets']['items'] as $facet) {
            $this->add_control(
                'facetType-' . $facet['name'],
                [
                    'label' => __(ucfirst($facet['name']) . ':', 'webien'),
                    'type' => \Elementor\Controls_Manager::SELECT2,
                    'label_block' => true,
                    'options' => $this->get_facet_options($facet),
                    'default' => '0',
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

    protected function render()
    {
        $settings = $this->get_settings_for_display();
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }

        $facets = [];

        foreach ($settings as $key => $value) {
            if (strpos($key, 'facetType-') !== false && $value !== '0') {
                $facets[] = $value;
            }
        }

        ?>
        <div id="productList" data-facet="<?= implode(", ", $facets) ?>"></div>
        <?php
    }
}