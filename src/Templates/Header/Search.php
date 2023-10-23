<div class="icon-wrapper" id="search-widget">
    <?php
    $widget_id = 'ecom_' . uniqid();
    $placeholder = $data['search_placeholder'];
    $redirect = $data['search_redirect'];
    echo '<div 
        id="' . $widget_id . '" 
        class="ecom-components-root" 
        data-widget-type="search-field"
        data-redirect-to="' . $data['search_redirect'] . '"
        data-placeholder="' . $data['search_placeholder'] . '"
        >
    </div>';
    ?>
</div>