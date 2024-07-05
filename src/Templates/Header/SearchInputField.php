<div class="search-field-wrapper" id="search-field-widget">
  <?php
  $widget_id = 'ecom_' . uniqid();
  echo '<div 
      id="' . $widget_id . '" 
      data-open-on-button="false"
      class="ecom-components-root search" 
      data-vendure-token="' . VENDURE_TOKEN . '"
      data-vendure-api-url="' . VENDURE_API_URL . '"
      data-widget-type="search-dialogue"
      data-placeholder="' . $data['search_placeholder'] . '"
      >
  </div>';
  ?>
</div>
