<div class="search-field-wrapper" id="search-field-widget" style="position:static; top:10px; padding:20px;">
  <?php
  $widget_id = 'ecom_' . uniqid();
  $search_placeholder = htmlspecialchars($data['search_placeholder'], ENT_QUOTES, 'UTF-8');
  $trigger_component = '<div style="display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 8px;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex: 1; box-sizing: border-box; gap: 16px; width: 100%; height: 36px; border-radius: 999px; background-color: rgb(242, 242, 242); font-size: 16px; font-weight: 400; color: #000; padding: 0 16px;">
      <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
        <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="24" height="24" class="icon icon-search">
          <g clip-path="url(#clip0_1398_6381)">
            <path
              d="M10.25 3.5C6.25482 3.5 3 6.75482 3 10.75C3 14.7452 6.25482 18 10.25 18C11.9782 18 13.5669 17.3895 14.8145 16.375L19.7197 21.2803C19.7888 21.3523 19.8716 21.4097 19.9632 21.4493C20.0548 21.4889 20.1534 21.5098 20.2532 21.5108C20.3529 21.5118 20.4519 21.4929 20.5443 21.4552C20.6367 21.4175 20.7206 21.3617 20.7912 21.2912C20.8617 21.2206 20.9175 21.1367 20.9552 21.0443C20.9929 20.9519 21.0118 20.8529 21.0108 20.7532C21.0098 20.6534 20.9889 20.5548 20.9493 20.4632C20.9097 20.3716 20.8523 20.2888 20.7803 20.2197L15.875 15.3145C16.8895 14.0669 17.5 12.4782 17.5 10.75C17.5 6.75482 14.2452 3.5 10.25 3.5ZM10.25 5C13.4345 5 16 7.56548 16 10.75C16 12.3013 15.3881 13.7029 14.3955 14.7354C14.3343 14.7803 14.2803 14.8343 14.2354 14.8955C13.2029 15.8881 11.8013 16.5 10.25 16.5C7.06548 16.5 4.5 13.9345 4.5 10.75C4.5 7.56548 7.06548 5 10.25 5Z"
              fill="currentColor" />
          </g>
          <defs>
            <clipPath id="clip0_1398_6381">
              <rect width="24" height="24" fill="currentColor" />
            </clipPath>
          </defs>
        </svg>
      </div>
     <span style="width: 100%; font-size: 16px; font-weight: 500; color: #999999;">' . $search_placeholder . '</span>
    </div>
  </div>';
  ?>

  <div id="<?= $widget_id ?>" data-open-on-button="true" class="ecom-components-root search" data-widget-type="search-field" data-trigger-component='<?= htmlspecialchars($trigger_component, ENT_QUOTES, 'UTF-8') ?>'></div>
</div>