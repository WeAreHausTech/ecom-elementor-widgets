<?php
namespace Haus\Widgets;

use \Elementor\Widget_Base;
use ElementorPro\Modules\Forms\Submissions\Database\Query;

class ProductList extends Widget_Base
{

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
    return 'eicon-code';
  }

  public function get_categories()
  {
    return ['basic'];
  }

  public function get_keywords()
  {
    return ['hello', 'world'];
  }

  protected function _register_controls()
  {
    $this->start_controls_section(
      'section_content',
      [
        'label' => __('Settings', 'webien'),
      ]
    );

    $this->add_control(
      'collection',
      [
        'label' => __('Kategori:', 'webien'),
        'type' => \Elementor\Controls_Manager::SELECT,
        'label_block' => true,
        'options' => $this->get_collection_options(),
        'default' => 'all'
      ]
    );

    $this->add_control(
      'facet',
      [
        'label' => __('Facet:', 'webien'),
        'type' => \Elementor\Controls_Manager::SELECT,
        'label_block' => true,
        'options' => $this->get_facet_options(),
        'default' => 'all'
      ]
    );

    $this->end_controls_section();
  }

  public function get_collection_options()
  {
    $collections = (new \Haus\Queries\Collection)->get();
    $options = $this->get_options($collections, 'collections');
    return $options;
  }

  public function get_facet_options()
  {
    $facets = (new \Haus\Queries\Facet)->get();
    $options = $this->get_options($facets, 'facets');
    return $options;
  }

  public function get_options($values, $type)
  {
    $options = [
      'all' => __('Alla', 'webien'),
    ];

    foreach ($values['data'][$type]['items'] as $value) {
      $options[$value['id']] = $value['name'];
    }

    return $options;
  }

  protected function render()
  {

    $callStartTime = microtime(true);

    $settings = $this->get_settings_for_display();

    var_dump($settings['collection'], $settings['facet']);

    var_dump((microtime(true) - $callStartTime) * 1000);

    ?>
    <p> Haus Tech &gt; Haus Webb </p>
    <?php
  }
}