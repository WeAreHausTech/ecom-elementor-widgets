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
    return ['ecommerce'];
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

    $this->add_control(
      'facet-value',
      [
        'label' => __('Filtrera på: ', 'webien'),
        'type' => \Elementor\Controls_Manager::SELECT2,
        'label_block' => true,
        'options' => $this->get_available_filters($facets),
        'default' => 'all'
      ]
    );

    foreach ($facets['data']['facets']['items'] as $facet) {
      $this->add_control(
        'facet-' . $facet['id'],
        [
          'label' => __($facet['name'] . ':', 'webien'),
          'type' => \Elementor\Controls_Manager::SELECT2,
          'label_block' => true,
          'options' => $this->get_facet_options($facet),
          'default' => 'all',
          'condition' => ['facet-value' => $facet['id']]
        ]
      );
    }
  }

  public function get_available_filters($facets)
  {
    $options = [
      'all' => __('Alla', 'webien'),
    ];

    foreach ($facets['data']['facets']['items'] as $facet) {
      $options[$facet['id']] = $facet['name'];
    }

    return $options;
  }
  public function get_facet_options($facet)
  {
    $options = [
      'all' => __('Alla', 'webien'),
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

    $facet = [];

    if ($settings['facet-value'] !== 'all') {
      $facet = $settings['facet-' . $settings['facet-value']];
    }

    ?>
    <div id="productList" data-facet=<?= $facet ?>></div>
    <?php
  }
}