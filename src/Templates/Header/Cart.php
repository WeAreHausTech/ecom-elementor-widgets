<?php
    $widgetId = 'ecom_' . uniqid();
    $widgetRedirectTo = '/varukorg';
    echo '<div 
        id="' . $widget_id . '" 
        class="ecom-components-root" 
        data-widget-type="cart-icon"
        data-redirect-to="' . $widgetRedirectTo . '"
        >
    </div>';
?>