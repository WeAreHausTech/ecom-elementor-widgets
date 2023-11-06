<div class="icon-wrapper" id="search-widget">
    <?php
    $widget_id = 'ecom_' . uniqid();

    echo '<div 
        id="' . $widget_id . '" 
        class="ecom-components-root" 
        data-vendure-token="' . VENDURE_TOKEN .'"
        data-vendure-api-url="' . VENDURE_API_URL .'"
        data-widget-type="login"
        data-redirect-to="' . $data['login_redirect'] . '"
        data-show-as-modal="' . $data['login_show_as_modal'] . '"
        >
    </div>';
    ?>
</div>