<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class GoogleAnalytics extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'GoogleAnalytics';
    }

    public function get_title()
    {
        return esc_html__('Google analytics', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-progress-tracker';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'google', 'analytics', 'tracking', 'ga'];
    }

    
    protected function _register_controls()
    {
        $this->start_controls_section(
            'section_content',
            [
                'label' => __('Filter settings', 'haus-ecom-widgets'),
            ]
        );

        $this->add_control(
            'analytics_event',
            [
                'label' => __('Event type', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '0',
                'required' => true,
                'options' => [
                    'purchase' => __('purchase', 'haus-ecom-widgets'),
                ],
            ]
        );

        $this->end_controls_section();

    }

    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }

        $settings = $this->get_settings_for_display();
        $widgetId = 'ecom_' . $this->get_id();?>

        <div 
            id="<?= $widgetId ?>"
            class="ecom-components-root" 
            data-vendure-token="<?= VENDURE_TOKEN?>"
            data-vendure-api-url="<?= VENDURE_API_URL ?>"
            data-analytics-event="<?= $settings['analytics_event'] ?>"
            data-widget-type="google-analytics">
        </div>
        <?php
    }
}