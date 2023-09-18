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
    return 'eicon-post-list';
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
        'label' => __('Filter settings', 'webien'),
      ]
    );

    $this->add_control(
      'collection',
      [
        'label' => __('Collection:', 'webien'),
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

    $options = [
      'all' => __('Alla', 'webien'),
    ];

    foreach ($collections['data']['collections']['items'] as $collection) {
      $options[$collection['id']] = $collection['name'];
    }

    return $options;
  }

  public function get_facet_options()
  {
    $facets = (new \Haus\Queries\Facet)->get();

    $options = [
      'all' => __('Alla', 'webien'),
    ];

    foreach ($facets['data']['facets']['items'] as $facet) {
      foreach ($facet['values'] as $value) {
        $options[$value['id']] = $facet['name'] . ' - ' . $value['name'];
      }
    }

    return $options;
  }

  protected function render()
  {
    $callStartTime = microtime(true);
    $settings = $this->get_settings_for_display();
    $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

    if (strpos($url, '&action=elementor') !== false) {
      $this->content_template();
      return;
    }

    ?>
    <div id="productFilter" facet=<?= $settings['facet'] ?> collection=<?= $settings['collection'] ?>></div>
    <?php
  }


  protected function content_template()
  {
    ?>
    <div class="webien-elementor-preview">
      <i class="<?= $this->get_icon() ?>"></i>
      <h3 class="title">
        <?= $this->get_title() ?>
      </h3>
      <small>Ingen förhandsvisning</small>
    </div>
    <?php
  }
}