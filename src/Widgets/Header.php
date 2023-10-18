<?php
namespace Haus\Widgets;

use \Elementor\Widget_Base;
use \Haus\Traits\ElementorTemplate;

class Header extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'Header';
    }

    public function get_title()
    {
        return esc_html__('Header', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-header';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'header'];
    }

    protected function register_controls()
    {

        $this->start_controls_section(
            'header_section',
            [
                'label' => __('Header', 'webien'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'logo',
            [
                'label' => __('Välj logga', 'webien'),
                'type' => \Elementor\Controls_Manager::MEDIA,
                'default' => [
                    'url' => \Elementor\Utils::get_placeholder_image_src(),
                ],
            ]
        );

        $this->add_control(
            'contact_us_link',
            [
                'label' => __('Knapplänk', 'webien'),
                'type' => \Elementor\Controls_Manager::URL,
                'options' => ['url'],
                'default' => [
                    'url' => '',
                ],
                'label_block' => true,
            ]
        );

        $this->add_control(
            'contact_us_text',
            [
                'label' => __('Text i knapp:', 'webien'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
            ]
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'menu-section',
            [
                'label' => __('Meny', 'webien'),
            ]
        );

        $this->add_control(
            'menu_id',
            [
                'label' => __('Id på meny:', 'webien'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
            ]
        );

        $this->add_control(
            'products_menu_id',
            [
                'label' => __('Id på produkter:', 'webien'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
            ]
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'cart-section',
            [
                'label' => __('Varukorg', 'webien'),
            ]
        );

        $this->add_control(
            'cart_redirect_to',
            [
                'label' => __('Varukorg länk:', 'webien'),
                'description' => __('Länk till varukorgen, tex /varukorg', 'webien'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
            ]
        );

        $this->end_controls_section();
    }

    public function getAllProductCategories()
    {
        $term_args = array(
            'taxonomy' => 'produkter-kategorier',
        );
        $termData = get_terms($term_args);

        if (!is_array($termData) || empty($termData)) {
            return null;
        }

        $terms = [];

        foreach ($termData as $key => $term) {
            if ($term->parent == 0) {
                $terms[$term->term_id]['data'] = $term;
            } else {
                $terms[$term->parent]['children'][] = $term;
            }
        }
        return $terms;
    }

    public function getTaxonomies($taxonomy)
    {
        $term_args = array(
            'taxonomy' => $taxonomy,
        );
        $termData = get_terms($term_args);

        if (!is_array($termData) || empty($termData)) {
            return null;
        }

        // Use array_values to reset the array keys
        return array_values($termData);
    }

    protected function render()
    {
        $data = [
            'logo' => $this->get_settings_for_display('logo'),
            'contact_us_text' => $this->get_settings_for_display('contact_us_text'),
            'contact_us_link' => $this->get_settings_for_display('contact_us_link'),
            'menu_id' => $this->get_settings_for_display('menu_id'),
            'product_menu_id' => $this->get_settings_for_display('products_menu_id'),
        ];

        $categories = $this->getAllProductCategories();

        $taxonomies = [
            [
                'heading' => 'Varumärken',
                'data' => $this->getTaxonomies('produkter-varumarken'),
                'class' => 'brand'
            ],
            [
                'heading' => 'Avdelningar',
                'data' => $this->getTaxonomies('produkter-avdelningar'),
                'class' => 'department'
            ]
        ];

        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }

        include(__DIR__ . '/../Templates/Header/View.php');
    }
}