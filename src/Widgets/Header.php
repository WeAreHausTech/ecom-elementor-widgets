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
            'content_section',
            [
                'label' => __('Content', 'webien'),
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
                'label' =>  __('Knapplänk', 'webien'),
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

    }

    protected function render()
    {
        $data = [
            'logo' => $this->get_settings_for_display('logo'),
            'contact_us_text' => $this->get_settings_for_display('contact_us_text'),
            'contact_us_link' => $this->get_settings_for_display('contact_us_link'),
        ];


        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }

        include(__DIR__ . '/../Templates/Header/View.php');
    }
}