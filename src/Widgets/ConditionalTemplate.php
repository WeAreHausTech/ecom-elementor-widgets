<?php
namespace WeAreHausTech\Widgets;

use \Elementor\Widget_Base;
use \WeAreHausTech\Traits\ElementorTemplate;

class ConditionalTemplate extends Widget_Base
{
    use ElementorTemplate;

    public function get_name()
    {
        return 'ConditionalTemplate';
    }

    public function get_title()
    {
        return esc_html__('Conditional template', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-container';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'template'];
    }


    protected function _register_controls()
    {

        if (!\Elementor\Plugin::$instance->editor->is_edit_mode()) {
            return;
        }

        $this->start_controls_section(
            'section_general',
            [
                'label' => __('General settings', 'haus-ecom-widgets'),
            ]
        );

        $this->add_control(
            'condition',
            [
                'label' => __('Condition', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'options' => apply_filters('haus_ecom_widgets_conditional_template_options', [
                    'priceIsZero' => __('Salesprice is 0 (variant)', 'haus-ecom-widgets'),
                ]),
            ]
        );

        $elementor_templates = get_posts([
            'post_type' => 'elementor_library',
            'posts_per_page' => -1,
        ]);

        $template_options = [];
        foreach ($elementor_templates as $template) {
            $template_options[$template->ID] = $template->post_title;
        }

        $this->add_control(
            'template-id',
            [
                'label' => __('Select Elementor Template', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'description' => __(
                    'Choose your template carefully. Using a large or overly complex template may negatively impact your site’s performance. Note that the template will still be rendered in the background, even if the condition for displaying it is not met.',
                    'haus-ecom-widgets'
                ),
                'options' => $template_options,
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
        $widgetId = 'ecom_' . $this->get_id();
        $templateId = $settings['template-id'];

        ?>
        <div id="<?= $widgetId ?>" class="ecom-components-root" data-template-id="<?= $templateId ?>" data-widget-type="conditional-template"
            data-condition="<?= $settings['condition'] ?>">
        </div>
        <div id="ecom-elementor-template-<?= $templateId ?>" style="display:none">
            <?php echo do_shortcode('[elementor-template id="' . $templateId . '"]'); ?>
        </div>
        <?php
    }
}