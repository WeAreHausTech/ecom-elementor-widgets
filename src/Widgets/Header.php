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

        $this->add_control(
            'footer_menu_id',
            [
                'label' => __('Id på footer i mobilmeny:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
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

    public function getTaxonomies($taxonomy, $urlSv, $urlEn, $urlFi)
    {
        global $wpdb;
        $terms = $wpdb->prefix . 'terms';
        $termmeta = $wpdb->prefix . 'termmeta';

        if ($this->wpmlHelper->hasWpml()) {
            $query = $wpdb->prepare(
                "SELECT DISTINCT tt.term_id, tt.parent, t.name, t.slug, tr.language_code as lang, 
                IFNULL(tm_bild.meta_value, '') AS bild, 
                IFNULL(tm_position.meta_value, '') AS position
                FROM wp_term_taxonomy tt
                LEFT JOIN $terms t ON tt.term_id = t.term_id
                LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
                LEFT JOIN {$wpdb->prefix}icl_translations tr
                    ON tt.term_taxonomy_id = tr.element_id
                    AND tr.element_type = 'tax_{$taxonomy}'
                LEFT JOIN $termmeta tm_bild ON tt.term_id = tm_bild.term_id AND tm_bild.meta_key = 'bild'
                LEFT JOIN $termmeta tm_position ON tt.term_id = tm_position.term_id AND tm_position.meta_key = 'vendure_term_position'
                WHERE tr.language_code =  '$this->currentLang'
                AND tm.meta_value IS NOT NULL
                AND taxonomy = %s
                AND (tt.parent = 0 OR tt.parent IN (SELECT term_id FROM wp_term_taxonomy WHERE parent = 0))",
                $taxonomy
            );

        } else {
            $query = $wpdb->prepare(
                "SELECT DISTINCT tt.term_id, tt.parent, t.name, t.slug, 
                IFNULL(tm_bild.meta_value, '') AS bild, 
                IFNULL(tm_position.meta_value, '') AS position
                FROM wp_term_taxonomy tt
                LEFT JOIN $terms t ON tt.term_id = t.term_id
                LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
                LEFT JOIN $termmeta tm_bild ON tt.term_id = tm_bild.term_id AND tm_bild.meta_key = 'bild'
                LEFT JOIN $termmeta tm_position ON tt.term_id = tm_position.term_id AND tm_position.meta_key = 'vendure_term_position'
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

        $page = $this->lang($urlEn, $urlSv, $urlFi);
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

        // sort parents by position
        usort($terms, callback: function ($a, $b) {
            $posA = isset($a['data']['position']) && is_numeric($a['data']['position']) ? (int) $a['data']['position'] : 0;
            $posB = isset($b['data']['position']) && is_numeric($b['data']['position']) ? (int) $b['data']['position'] : 0;

            return $posA <=> $posB;
        });

        // Sort children alphabetically by name within each parent
        foreach ($terms as &$term) {
            if (isset($term['children'])) {
                usort($term['children'], function ($a, $b) {
                    return strcmp($a['name'], $b['name']);
                });
            }
        }

        unset($term);

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
     * @param string $sv The string to return if the current language is not English.
     *
     * @return string The language-specific string.
     */
    protected function lang($en, $sv, $fi)
    {

        if (isset($fi) && $this->currentLang === 'fi') {
            return $fi;
        } else
            if ($this->currentLang === 'en') {
                return $en;
            } else {
                return $sv;
            }
    }

    protected function render()
    {
        $product_ids_string = $this->get_settings_for_display('products_menu_ids');
        $product_ids = isset($product_ids_string) ? array_map('intval', explode(',', $product_ids_string)) : [];

        $data = [
            'logo' => $this->get_settings_for_display('logo'),
            'contact_us_text' => $this->lang('Contact us', 'Kontakta oss', 'Ota yhteyttä'),
            'contact_us_link' => $this->lang('/en/contact-us/', '/kontakta-oss/', '/ota-meihin-yhteytta-osoitteessa/'),
            'menu_id' => $this->get_settings_for_display('menu_id'),
            'products_menu_ids' => $product_ids,
            'footer_menu_id' => $this->get_settings_for_display('footer_menu_id'),
            'cart_redirect_to' => $this->get_settings_for_display('cart_redirect_to') ? $this->get_settings_for_display('cart_redirect_to') : '/varukorg',
            'search_placeholder' => $this->get_settings_for_display('search_placeholder'),
            'search_redirect' => $this->get_settings_for_display('search_redirect'),
            'login_redirect' => $this->get_settings_for_display('login_redirect'),
            'login_show_as_modal' => $this->get_settings_for_display('login_show_as_modal'),
            'product_page_url' => $this->lang('/en/products/', '/produkter/', '/tuotteet/'),
            'product_page' => $this->lang('Show all products', 'Visa alla produkter', 'Näytä kaikki tuotteet'),
            'products' => $this->lang('Products', 'Produkter', 'Tuotteet'),
            'explore' => $this->lang('Explore', 'Utforska', 'Tutkia'),
            'language_selector' => $this->lang('Choose language', 'Välj språk', 'Valitse kieli'),
        ];

        $loggedInmenuId = $this->get_settings_for_display('login_in_menu_id');
        $formattedMenuItems = $this->getFormatedMenuItems($loggedInmenuId);


        $categories = $this->getTaxonomies('produkter-kategorier', '/produkter/kategorier/', '/en/products/categories/', '/tuotteet/kategoriat/');

        $taxonomies = [
            [
                'heading' => $this->lang('Departments', 'Avdelningar', 'Tilat'),
                'heading-link' => get_home_url() . $this->lang('/products/departments/', '/produkter/avdelningar/', '/tuotteet/osastot/'),
                'data' => $this->getTaxonomies('produkter-avdelningar', '/produkter/avdelningar/', '/en/products/departments/', '/tuotteet/osastot/'),
                'class' => 'department',
                'show-all-list' => 'false'
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