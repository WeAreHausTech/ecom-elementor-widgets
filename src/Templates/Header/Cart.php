<div class="icon-wrapper">
    <?php
    $widgetId = 'ecom_' . uniqid();
    echo '<div 
        id="' . $widgetId . '"
        class="ecom-components-root" 
        data-vendure-token="' . $_ENV["VENDURE_TOKEN"] .'"
        data-widget-type="dropdown-cart"
        data-redirect-to="' . $data['cart_redirect_to'] . '"
        >
    </div>';
    ?>
</div>