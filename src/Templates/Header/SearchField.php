<div class="icon-wrapper" id="search-widget">
  <?php
  $widget_id = 'ecom_' . uniqid();
  echo '<div 
      id="' . $widget_id . '" 
      data-open-on-button="true"
      class="ecom-components-root" 
      data-widget-type="search-field"
      data-placeholder="' . $data['search_placeholder'] . '"
      >
  </div>';
  ?>
</div>