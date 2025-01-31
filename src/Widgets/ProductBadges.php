<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class ProductBadges extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'ProductBadges';
    }

    public function get_title()
    {
        return esc_html__('Product Badges', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-logo';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'product', 'price'];
    }

    protected function _register_controls()
    {
        $this->start_controls_section(
            'section_general',
            [
                'label' => __('General settings', 'haus-ecom-widgets')
            ]
        );

        $this->add_control(
            'badge_positions',
            [
                'label' => __('Badge positions', 'haus_ecom_widgets'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'description' => 'Seperate by coma (if empty, all positions will be displayed)',
            ]
        );

        $this->add_responsive_control(
            'badge_height',
            [
                'label' => __('Badge Height (px)', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => ['px'],
                'range' => [
                    'px' => [
                        'min' => 30,
                        'max' => 400,
                        'step' => 1,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 90,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ecom-components-root[data-widget-type="product-badges"]' => '--badge-height: {{SIZE}}{{UNIT}};',
                ],
            ]
        );


        $this->add_responsive_control(
            'badge_gap',
            [
                'label' => __('Gap between badges (px)', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => ['px'],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 50,
                        'step' => 2,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 0,
                ],
                'selectors' => [
                    '{{WRAPPER}} .ecom-components-root[data-widget-type="product-badges"]' => '--badges-container-gap: {{SIZE}}{{UNIT}};',
                ],
            ]
        );
    }


    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            $this->getTemplate();
            return;
        }

        $settings = $this->get_settings_for_display();
        $widgetId = 'ecom_' . $this->get_id();

        $post = get_post();
        $productId = get_the_ID();
        $vendureId = get_post_meta($productId, 'vendure_id', true);

        ?>
        <style>
            .ecom-components-root[data-widget-type='product-badges'] {
                --badges-container-position: relative;
                --badge-wrapper-position: relative;
                --badge-wrapper-display: flex;
                --badge-wrapper-flex-direction: row;
                --badge-wrapper-justify-content: flex-start;
                --badge-wrapper-align-items: center;
                --badge-wrapper-flex-wrap: wrap;
                --badge-wrapper-width: auto;
                --badges-container-height: fit-content;
                --badge-max-width: 100%;
                --badge-object-fit: contain;
                --badge-width: auto;
                --badge-margin: 0;
            }
        </style>

        <div id="<?= $widgetId ?>" class="ecom-components-root" data-widget-type="product-badges"
            data-product-id="<?= $vendureId ?>" data-badge-positions="<?= $settings['badge_positions'] ?>"
            data-product-id="<?= $vendureId ?>">
        </div>
        <?php
    }
}