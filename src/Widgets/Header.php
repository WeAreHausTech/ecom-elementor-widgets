<?php
namespace Haus\Widgets;

use \Elementor\Widget_Base;
use \Haus\Traits\ElementorTemplate;
use Haus\SyncData\Helpers\WpmlHelper;

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

        $this->add_control(
            'products_menu_ids',
            [
                'label' => __('IDs på produkter:', 'webien'),
                'type' => \Elementor\Controls_Manager::TEXTAREA,
                'rows' => 4,
                'label_block' => true,
                'description' => __('Öppnar produktdropdownen. Kan ta emot flera idn, separera med kommatecken, tex 1, 2, 3', 'webien'),
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

            ]
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'search-section',
            [
                'label' => __('Sök', 'webien'),
            ]
        );

        $this->add_control(
            'search_placeholder',
            [
                'label' => __('Placeholder:', 'webien'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
            ]
        );

        $this->add_control(
            'search_redirect',
            [
                'label' => __('Söksidan:', 'webien'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
            ]
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'login-section',
            [
                'label' => __('Login', 'webien'),
            ]
        );

        $this->add_control(
            'login_show_as_modal',
            [
                'label' => esc_html__('Visa som modal', 'webien'),
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'label_on' => esc_html__('Ja', 'webien'),
                'label_off' => esc_html__('Nej', 'webien'),
                'return_value' => 'yes',
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'login_redirect',
            [
                'label' => __('Loginsidan:', 'webien'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
                'condition' => [
                    'login_show_as_modal!' => 'yes',
                ],
            ]
        );

        $this->add_control(
            'login_in_menu_id',
            [
                'label' => __('Id på meny för inloggade:', 'webien'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
            ]
        );

        $this->end_controls_section();
    }

    public function createTranslatedButton()
    {
        $wpmlHelper = new WpmlHelper();
        $currentLang = $wpmlHelper->getCurrentLang();
    }

    public function getAllProductCategories()
    {
        $wpmlHelper = new WpmlHelper();
        $currentLang = $wpmlHelper->getCurrentLang();

        global $wpdb;
        $terms = $wpdb->prefix . 'terms';
        $termmeta = $wpdb->prefix . 'termmeta';

        $query = $wpdb->prepare(
            "SELECT tt.term_id, tt.parent, t.name, t.slug, tr.language_code as lang
             FROM wp_term_taxonomy tt 
             LEFT JOIN $terms t ON tt.term_id = t.term_id 
             LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
             LEFT JOIN {$wpdb->prefix}icl_translations tr 
             ON tt.term_taxonomy_id = tr.element_id
             AND tr.element_type = 'tax_produkter-kategorier'
            WHERE tr.language_code = '$currentLang' 
             AND taxonomy = 'produkter-kategorier'"
        );

        if ($currentLang === 'en') {
            $page = '/en/products/categories/';
        } else {
            $page = '/produkter/kategorier/';
        }

        $termData = $wpdb->get_results($query, ARRAY_A);

        if (!is_array($termData) || empty($termData)) {
            return null;
        }

        $terms = [];

        foreach ($termData as $key => $term) {
            $parent = $term['parent'];
            $termId = $term['term_id'];

            $term['slug'] = $page . $term['slug'];

            if ($parent === '0') {
                $terms[$termId]['data'] = $term;
            } else {
                $terms[$parent]['children'][] = $term;
            }
        }

        return $terms;
    }

    public function getTaxonomies($taxonomy, $urlSv, $urlEn)
    {

        $wpmlHelper = new WpmlHelper();
        $currentLang = $wpmlHelper->getCurrentLang();
        global $wpdb;
        $terms = $wpdb->prefix . 'terms';
        $termmeta = $wpdb->prefix . 'termmeta';



        $query = $wpdb->prepare(
            "SELECT tt.term_id, t.name, t.slug, tr.language_code as lang
            FROM wp_term_taxonomy tt 
            LEFT JOIN $terms t ON tt.term_id = t.term_id 
            LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
            LEFT JOIN {$wpdb->prefix}icl_translations tr 
                ON tt.term_taxonomy_id = tr.element_id
                AND tr.element_type = 'tax_{$taxonomy}'
                WHERE tr.language_code =  '$currentLang' 
            AND tm.meta_value IS NOT NULL
            AND taxonomy= %s",
            $taxonomy
        );

        $termData = $wpdb->get_results($query, ARRAY_A);

        if (!is_array($termData) || empty($termData)) {
            return null;
        }

        if ($currentLang === 'en') {
            $page = $urlEn;
        } else {
            $page = $urlSv;
        }

        $terms = [];

        foreach ($termData as $term) {
            $term['slug'] = $page . $term['slug'];
            $termId = $term['term_id'];
            $terms[$termId] = $term;
        }

        // Use array_values to reset the array keys
        return array_values($terms);
    }

    protected function getFormatedMenuItems($menuId)
    {
        $loggedInMenu = wp_get_nav_menu_items($menuId);
        $formattedMenuItems = array();

        foreach ($loggedInMenu as $item) {
            $formattedMenuItems[] = array(
                'label' => $item->title,
                'href' => $item->url,
            );
        }

        return $formattedMenuItems;
    }

    protected function getHeadingBrands()
    {
        $wpmlHelper = new WpmlHelper();
        $currentLang = $wpmlHelper->getCurrentLang();

        if ($currentLang === 'en') {
            return 'Brands';
        } else {
            return 'Varumärken';
        }
    }

    protected function getHeadingDepartments()
    {
        $wpmlHelper = new WpmlHelper();
        $currentLang = $wpmlHelper->getCurrentLang();

        if ($currentLang === 'en') {
            return 'Departments';
        } else {
            return 'Avdelningar';
        }
    }

    protected function render()
    {

        $product_ids_string = $this->get_settings_for_display('products_menu_ids');

        $product_ids = isset($product_ids_string) ? array_map('intval', explode(',', $product_ids_string)) : [];

        $wpmlHelper = new WpmlHelper();
        $currentLang = $wpmlHelper->getCurrentLang();

        if ($currentLang === 'en') {
            $buttonText = 'Contact us';
            $buttonLink = '/en/contact-us/';
        } else {
            $buttonText = 'Kontakta oss';
            $buttonLink = '/en/contact-us/';
        }

        $data = [
            'logo' => $this->get_settings_for_display('logo'),
            'contact_us_text' => $buttonText, 
            'contact_us_link' => $buttonLink,
            'menu_id' => $this->get_settings_for_display('menu_id'),
            'products_menu_ids' => $product_ids,
            'cart_redirect_to' => $this->get_settings_for_display('cart_redirect_to') ? $this->get_settings_for_display('cart_redirect_to') : '/varukorg',
            'search_placeholder' => $this->get_settings_for_display('search_placeholder'),
            'search_redirect' => $this->get_settings_for_display('search_redirect'),
            'login_redirect' => $this->get_settings_for_display('login_redirect'),
            'login_show_as_modal' => $this->get_settings_for_display('login_show_as_modal'),
        ];

        $loggedInmenuId = $this->get_settings_for_display('login_in_menu_id');
        $formattedMenuItems = $this->getFormatedMenuItems($loggedInmenuId);

        $categories = $this->getAllProductCategories();

        $taxonomies = [
            [
                'heading' => $this->getHeadingBrands(),
                'data' => $this->getTaxonomies('produkter-varumarken', '/produkter/varumarken/', '/en/products/brands/'),
                'class' => 'brand'
            ],
            [
                'heading' => $this->getHeadingDepartments(),
                'data' => $this->getTaxonomies('produkter-avdelningar', '/produkter/avdelningar/', '/en/products/departments/'),
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