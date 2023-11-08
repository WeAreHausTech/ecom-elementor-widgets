<div class="icon-wrapper" id="search-widget">
    <?php
    $widget_id = 'ecom_' . uniqid();
    $accountDropdownItemsJson = json_encode($formattedMenuItems);

    echo '<div 
        id="' . $widget_id . '" 
        class="ecom-components-root" 
        data-vendure-token="' . VENDURE_TOKEN . '"
        data-vendure-api-url="' . VENDURE_API_URL . '"
        data-widget-type="account-dropdown"
        data-redirect-to="' . $data['login_redirect'] . '"
        data-show-as-modal="' . $data['login_show_as_modal'] . '"
        data-dropdown-items=\'' . $accountDropdownItemsJson . '\'
        >
    </div>';
    ?>
</div>

