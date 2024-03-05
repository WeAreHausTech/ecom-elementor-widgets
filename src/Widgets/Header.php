<?php

namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;
use WeAreHausTech\SyncData\Helpers\WpmlHelper;

class Header extends Widget_Base
{
    use ElementorTemplate;

    private WpmlHelper $wpmlHelper;
    private $currentLang = 'sv';

    public function __construct($data = [], $args = null)
    {
        parent::__construct($data, $args);

        $this->wpmlHelper = new WpmlHelper();
        $this->currentLang = $this->wpmlHelper->getCurrentLang();
    }

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
                'label' => __('Header', 'haus-ecom-widgets'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'logo',
            [
                'label' => __('Välj logga', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::MEDIA,
                'default' => [
                    'url' => \Elementor\Utils::get_placeholder_image_src(),
                ],
            ]
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'menu-section',
            [
                'label' => __('Meny', 'haus-ecom-widgets'),
            ]
        );

        $this->add_control(
            'menu_id',
            [
                'label' => __('Id på meny:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
            ]
        );

        $this->add_control(
            'products_menu_ids',
            [
                'label' => __('IDs på produkter:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::TEXTAREA,
                'rows' => 4,
                'label_block' => true,
                'description' => __('Öppnar produktdropdownen. Kan ta emot flera idn, separera med kommatecken, tex 1, 2, 3', 'haus-ecom-widgets'),
            ]
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'cart-section',
            [
                'label' => __('Varukorg', 'haus-ecom-widgets'),
            ]
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'search-section',
            [
                'label' => __('Sök', 'haus-ecom-widgets'),
            ]
        );

        $this->add_control(
            'search_placeholder',
            [
                'label' => __('Placeholder:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
            ]
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'login-section',
            [
                'label' => __('Login', 'haus-ecom-widgets'),
            ]
        );

        $this->add_control(
            'login_show_as_modal',
            [
                'label' => esc_html__('Visa som modal', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'label_on' => esc_html__('Ja', 'haus-ecom-widgets'),
                'label_off' => esc_html__('Nej', 'haus-ecom-widgets'),
                'return_value' => 'yes',
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'login_in_menu_id',
            [
                'label' => __('Id på meny för inloggade:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
            ]
        );

        $this->end_controls_section();
    }

    public function getTaxonomies($taxonomy, $urlSv, $urlEn)
    {
        global $wpdb;
        $terms = $wpdb->prefix . 'terms';
        $termmeta = $wpdb->prefix . 'termmeta';

        if ($this->wpmlHelper->hasWpml()) {
            $query = $wpdb->prepare(
                "SELECT DISTINCT tt.term_id, tt.parent, t.name, t.slug, tr.language_code as lang
                FROM wp_term_taxonomy tt
                LEFT JOIN $terms t ON tt.term_id = t.term_id
                LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
                LEFT JOIN {$wpdb->prefix}icl_translations tr
                    ON tt.term_taxonomy_id = tr.element_id
                    AND tr.element_type = 'tax_{$taxonomy}'
                WHERE tr.language_code =  '$this->currentLang'
                AND tm.meta_value IS NOT NULL
                AND taxonomy = %s
                AND (tt.parent = 0 OR tt.parent IN (SELECT term_id FROM wp_term_taxonomy WHERE parent = 0))",
                $taxonomy
            );
            
        } else {
            $query = $wpdb->prepare(
                "SELECT DISTINCT tt.term_id, tt.parent, t.name, t.slug
                FROM wp_term_taxonomy tt
                LEFT JOIN $terms t ON tt.term_id = t.term_id
                LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
                WHERE tm.meta_value IS NOT NULL
                AND taxonomy= %s
                (tt.parent = 0 OR tt.parent IN (SELECT term_id FROM wp_term_taxonomy WHERE parent = 0))",
                $taxonomy
            );
        }

        $termData = $wpdb->get_results($query, ARRAY_A);

        if (!is_array($termData) || empty($termData)) {
            return null;
        }

        $page = $this->lang($urlEn, $urlSv);
        $terms = [];
        foreach ($termData as $term) {
            $term['slug'] = $page . $term['slug'];
            $termId = $term['term_id'];
            $parent = $term['parent'];

            if ($parent === '0') {
                $terms[$termId]['data'] = $term;
            } else {
                $terms[$parent]['children'][] = $term;
            }
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

    /**
     * Returns a language-specific string based on the current language setting.
     *
     * @param string $en The string to return if the current language is English.
     * @param string $default The string to return if the current language is not English.
     *
     * @return string The language-specific string.
     */
    protected function lang($en, $default)
    {
        if ($this->currentLang === 'en') {
            return $en;
        } else {
            return $default;
        }
    }

    protected function render()
    {
        $product_ids_string = $this->get_settings_for_display('products_menu_ids');
        $product_ids = isset($product_ids_string) ? array_map('intval', explode(',', $product_ids_string)) : [];

        $data = [
            'logo' => $this->get_settings_for_display('logo'),
            'contact_us_text' => $this->lang('Contact us', 'Kontakta oss'),
            'contact_us_link' => $this->lang('/en/contact-us/', '/kontakta-oss/'),
            'menu_id' => $this->get_settings_for_display('menu_id'),
            'products_menu_ids' => $product_ids,
            'cart_redirect_to' => $this->get_settings_for_display('cart_redirect_to') ? $this->get_settings_for_display('cart_redirect_to') : '/varukorg',
            'search_placeholder' => $this->get_settings_for_display('search_placeholder'),
            'search_redirect' => $this->get_settings_for_display('search_redirect'),
            'login_redirect' => $this->get_settings_for_display('login_redirect'),
            'login_show_as_modal' => $this->get_settings_for_display('login_show_as_modal'),
            'product_page_url' => $this->lang('/en/products/', '/produkter/'),
            'product_page' => $this->lang('Show all products', 'Visa alla produkter'),
        ];

        $loggedInmenuId = $this->get_settings_for_display('login_in_menu_id');
        $formattedMenuItems = $this->getFormatedMenuItems($loggedInmenuId);


        $categories = $this->getTaxonomies('produkter-kategorier', '/produkter/kategorier/', '/en/products/categories/');

        $taxonomies = [
            [
                'heading' => $this->lang('Brands', 'Varumärken'),
                'heading-link' => get_home_url() . $this->lang('/products/brands/', '/produkter/varumarken/'),
                'data' => $this->getTaxonomies('produkter-varumarken', '/produkter/varumarken/', '/en/products/brands/'),
                'class' => 'brand'
            ],
            [
                'heading' => $this->lang('Departments', 'Avdelningar'),
                'heading-link' => get_home_url() . $this->lang('/products/departments/', '/produkter/avdelningar/'),
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
