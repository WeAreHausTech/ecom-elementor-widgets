<?php

namespace WeAreHausTech\Widgets;

use Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class Filters extends Widget_Base
{
  use ElementorTemplate;

  public function get_name()
  {
    return 'Product List Filters';
  }

  public function get_title()
  {
    return 'Product List Filters';
  }

  public function get_icon()
  {
    return 'eicon-filter';
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
        'label' => __('General settings', 'haus-ecom-widgets'),
      ]
    );

    $this->add_control(
      'price_list_identifier',
      [
        'label' => __('Price list identifier', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::TEXT,
        'description' => __('Price list identifier, if none specified, filter will update all Product Lists without identifier.', 'haus-ecom-widgets'),
        'default' => 'product-list',
      ]
    );
    $this->end_controls_section();

    $this->start_controls_section(
      'section-filter',
      [
        'label' => __('Filter', 'haus-ecom-widgets'),
      ]
    );

    $this->getAvailableFacets();

    $this->add_control(
      'price_filter_enabled',
      [
        'label' => __('Price filter enabled', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::SELECT,
        'description' => __('Price filter does not support multiple currencies', 'haus-ecom-widgets'),
        'default' => '0',
        'options' => [
          '0' => __('No', 'haus-ecom-widgets'),
          '1' => __('Yes', 'haus-ecom-widgets'),
        ],
      ]
    );

    $this->end_controls_section();
  }

  public function getAvailableFacets()
  {
    $facets = $this->get_facets();

    if (!isset($facets['data']['facets']['items'])) {
      return;
    }

    $options = [];

    foreach ($facets['data']['facets']['items'] as $facet) {
      $options[$facet['code']] = $facet['code'] . ' (id: ' . $facet['id'] . ')';
    }

    $repeater = new \Elementor\Repeater();

    $repeater->add_control(
      'filter_value',
      [
        'label' => __('Filter Value:', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::SELECT,
        'label_block' => true,
        'options' => $options,
        'default' => '0',
      ]
    );

    $repeater->add_control(
      'filter_condition',
      [
        'label' => __('Filter Condition:', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::SELECT,
        'label_block' => true,
        'options' => [
          'OR' => __('OR', 'haus-ecom-widgets'),
          'AND' => __('AND', 'haus-ecom-widgets'),
          'NOT' => __('NOT', 'haus-ecom-widgets'),
        ],
        'default' => 'OR',
      ]
    );

    $repeater->add_control(
      'filter_label',
      [
        'label' => __('Filter Label:', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::TEXT,
        'label_block' => true,
        'default' => '',
      ]
    );

    $this->add_control(
      'enabled_filters',
      [
        'label' => __('Enabled filters:', 'haus-ecom-widgets'),
        'type' => \Elementor\Controls_Manager::REPEATER,
        'fields' => $repeater->get_controls(),
        'default' => [],
        'title_field' => '{{{ filter_value }}} {{{ filter_condition }}}',
        'prevent_empty' => false,
      ]
    );
  }

  public function get_facets()
  {
    $facets = get_transient('ecom-haus-queries-facet');

    if (!$facets) {
      $facets = (new \WeAreHausTech\Queries\Facet)->get('sv');
      set_transient('ecom-haus-queries-facet', $facets, 60 * 5);
    }

    return $facets;
  }

  protected function render()
  {
    $settings = $this->get_settings_for_display();
    $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

    if (strpos($url, '&action=elementor') !== false) {
      $this->getTemplate();
      return;
    }

    $widgetId = 'ecom_' . $this->get_id();
?>

    <div
      id="<?= $widgetId ?>"
      class="ecom-components-root"
      data-widget-type="product-list-filters"
      data-widget-id="<?= $widgetId ?>"
      data-price-filter-enabled="<?= $settings['price_filter_enabled'] ?>"
      data-filter-values="<?= htmlspecialchars(json_encode($settings['enabled_filters']), ENT_QUOTES, 'UTF-8'); ?>">
    </div>
<?php
  }
}
