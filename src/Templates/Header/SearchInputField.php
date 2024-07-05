<div class="search-field-wrapper" id="search-field-widget">
  <?php
  $widget_id = 'ecom_' . uniqid();
  echo '<div 
      id="' . $widget_id . '" 
      data-open-on-button="false"
      class="ecom-components-root search" 
      data-widget-type="search-field"
      data-placeholder="' . $data['search_placeholder'] . '"
      >
  </div>';
  ?>
</div>