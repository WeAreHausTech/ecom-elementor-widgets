<div class="dropdown" id="dropdown">
    <div class="dropdown-menu" id="dropdown-menu">
        <div class="dropdown-content" id="dropdown-content">
            <div class="dropdown-categories-header">
                <button class="go-back-button" id="go-back-button" onClick="onGoBackButton()">
                <div class="back-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.81134 12.7132C7.62387 12.5257 7.51855 12.2713 7.51855 12.0062C7.51855 11.741 7.62387 11.4867 7.81134 11.2992L13.8113 5.29918C13.9999 5.11703 14.2525 5.01623 14.5147 5.01851C14.7769 5.02079 15.0278 5.12596 15.2132 5.31137C15.3986 5.49677 15.5037 5.74759 15.506 6.00978C15.5083 6.27198 15.4075 6.52458 15.2253 6.71319L9.93234 12.0062L15.2253 17.2992C15.4075 17.4878 15.5083 17.7404 15.506 18.0026C15.5037 18.2648 15.3986 18.5156 15.2132 18.701C15.0278 18.8864 14.7769 18.9916 14.5147 18.9939C14.2525 18.9961 13.9999 18.8953 13.8113 18.7132L7.81134 12.7132Z" fill="#3E4849"/>
                </svg>
                </div>
                Produkter
                
                </button>
                <button class="go-back-button" id="back-to-menu-button" onClick="onBackToMenu()">
                <div class="back-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.81134 12.7132C7.62387 12.5257 7.51855 12.2713 7.51855 12.0062C7.51855 11.741 7.62387 11.4867 7.81134 11.2992L13.8113 5.29918C13.9999 5.11703 14.2525 5.01623 14.5147 5.01851C14.7769 5.02079 15.0278 5.12596 15.2132 5.31137C15.3986 5.49677 15.5037 5.74759 15.506 6.00978C15.5083 6.27198 15.4075 6.52458 15.2253 6.71319L9.93234 12.0062L15.2253 17.2992C15.4075 17.4878 15.5083 17.7404 15.506 18.0026C15.5037 18.2648 15.3986 18.5156 15.2132 18.701C15.0278 18.8864 14.7769 18.9916 14.5147 18.9939C14.2525 18.9961 13.9999 18.8953 13.8113 18.7132L7.81134 12.7132Z" fill="#3E4849"/>
                </svg>
</div>
                    <span id="back-to-menu-placeholder"></span>
                </button>
                <div class="close-button">
                    <button onClick="closeMenu()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M7.12099 5.70717C6.73051 5.31668 6.09741 5.31668 5.70693 5.70717C5.31644 6.09765 5.31644 6.73075 5.70693 7.12123L10.5858 12L5.70693 16.8789C5.31644 17.2693 5.31644 17.9024 5.70693 18.2929C6.09741 18.6834 6.73051 18.6834 7.12099 18.2929L11.9998 13.4141L16.8787 18.2929C17.2691 18.6834 17.9022 18.6834 18.2927 18.2929C18.6832 17.9024 18.6832 17.2693 18.2927 16.8789L13.4139 12L18.2927 7.12123C18.6832 6.73075 18.6832 6.09765 18.2927 5.70717C17.9022 5.31668 17.2691 5.31668 16.8787 5.70717L11.9998 10.586L7.12099 5.70717Z"
                                fill="#3E4849" />
                        </svg>
                    </button>
            </div>
            </div>

            <div class="explore-categories" style="display: none">
            <a class="explore-link" href="#" >Utforska</a>
            </div>
            <div class="dropdown-categories">
                <ul class="categories">
                    <?php if ($categories) { ?>
                        <?php foreach ($categories as $mainCategory) { ?>
                            <li class="parent" id="parent-<?= $mainCategory['data']['term_id'] ?>" onClick="openSubcategories(<?= $mainCategory['data']['term_id'] ?>, '<?= addSlashes($mainCategory['data']['name']) ?>')">
                                <div class="parent-inner-container"">
                                <?php if (!empty($mainCategory['data']['bild'])) { ?>
                                    <div class="category-image">
                                     <img src="<?= $mainCategory['data']['bild'] ?>" alt="<?= $mainCategory['data']['name'] ?>">
                                     </div>
                                <?php } ?>
                                <a class="parent-link desktop" id="desktop-link-<?= $mainCategory['data']['term_id'] ?>" href="<?= $mainCategory['data']['slug'] ?>/">
                                    <?= $mainCategory['data']['name'] ?>
                                </a>
                                <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15.7133 11.2993C15.9008 11.4868 16.0061 11.7411 16.0061 12.0063C16.0061 12.2714 15.9008 12.5257 15.7133 12.7133L9.71332 18.7133C9.52471 18.8954 9.27211 18.9962 9.00992 18.9939C8.74772 18.9917 8.49691 18.8865 8.3115 18.7011C8.12609 18.5157 8.02092 18.2649 8.01864 18.0027C8.01636 17.7405 8.11716 17.4879 8.29932 17.2993L13.5923 12.0063L8.29932 6.71327C8.11716 6.52466 8.01636 6.27206 8.01864 6.00986C8.02092 5.74767 8.12609 5.49686 8.3115 5.31145C8.49691 5.12604 8.74772 5.02087 9.00992 5.01859C9.27211 5.01631 9.52471 5.11711 9.71332 5.29927L15.7133 11.2993Z" fill="#3E4849"/>
                                </svg>
                                </div>
                                <?php if (!empty($mainCategory['children'])) { ?>
                                    <ul class="category" id="category-<?= $mainCategory['data']['term_id'] ?>">
                                        <?php foreach ($mainCategory['children'] as $index => $child) {
                                             ?>
                                            <li class="child-link" data-parent="<?= $mainCategory['data']['term_id'] ?>" class="child"
                                                style="display: <?= $index < 5 || count($mainCategory['children']) === 6 ?'flex' : 'none'; ?>">
                                                <a href="<?= $child['slug'] ?>/">
                                                    <?= $child['name']?>
                                                </a>
                                            </li>
                                            <?php if ($index === 5 && count($mainCategory['children']) > 6) { ?>
                                                <button class="see-more-button" id="see-more-<?= $mainCategory['data']['term_id'] ?>"
                                                    onClick="showMore(this)">
                                                    <?= 'Visa alla (' . count($mainCategory['children']) - 5 . ')' ?>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17"
                                                        fill="none">
                                                        <path
                                                            d="M8.47936 11.3048C8.35434 11.4298 8.18481 11.5 8.00803 11.5C7.83125 11.5 7.66171 11.4298 7.5367 11.3048L3.5367 7.30481C3.41526 7.17907 3.34806 7.01067 3.34958 6.83587C3.3511 6.66108 3.42121 6.49387 3.54482 6.37026C3.66842 6.24666 3.83563 6.17654 4.01043 6.17503C4.18523 6.17351 4.35363 6.2407 4.47936 6.36214L8.00803 9.89081L11.5367 6.36214C11.6624 6.2407 11.8308 6.17351 12.0056 6.17503C12.1804 6.17655 12.3476 6.24666 12.4712 6.37026C12.5948 6.49387 12.665 6.66108 12.6665 6.83588C12.668 7.01067 12.6008 7.17907 12.4794 7.30481L8.47936 11.3048Z"
                                                            fill="#3E4849" />
                                                    </svg>
                                                </button>
                                            <?php } ?>
                                        <?php } ?>
                                    </ul>
                                <?php } ?>
                        <?php } ?>
                    <?php } ?>
                </ul>
            </div>
            <div class="dropdown-type">
                <?php foreach ($taxonomies as $taxonomy) { ?>
                    <div class="department" id="parent-<?= $taxonomy['class'] ?>" onClick="openSubcategories('<?= $taxonomy['class'] ?>', '<?= $taxonomy['heading'] ?>')">
                    <div class="parent-inner-container">
                            <a class="dropdown-a desktop" id="desktop-link-<?= $taxonomy['class'] ?>" href="<?= $taxonomy['heading-link'] ?>" >
                                <?= $taxonomy['heading'] ?>
                            </a>
                            <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15.7133 11.2993C15.9008 11.4868 16.0061 11.7411 16.0061 12.0063C16.0061 12.2714 15.9008 12.5257 15.7133 12.7133L9.71332 18.7133C9.52471 18.8954 9.27211 18.9962 9.00992 18.9939C8.74772 18.9917 8.49691 18.8865 8.3115 18.7011C8.12609 18.5157 8.02092 18.2649 8.01864 18.0027C8.01636 17.7405 8.11716 17.4879 8.29932 17.2993L13.5923 12.0063L8.29932 6.71327C8.11716 6.52466 8.01636 6.27206 8.01864 6.00986C8.02092 5.74767 8.12609 5.49686 8.3115 5.31145C8.49691 5.12604 8.74772 5.02087 9.00992 5.01859C9.27211 5.01631 9.52471 5.11711 9.71332 5.29927L15.7133 11.2993Z" fill="#3E4849"/>
                                </svg>
                        </div>
                        <ul class="department-list" id="department-list-<?= $taxonomy['class'] ?>">
                            <?php foreach ($taxonomy['data'] as $index => $value) { ?>
                                <?php $value = $value['data'] ?>
                                <li class="child-link" data-parent="<?= $taxonomy['class'] ?>" class="child"
                                    style="display: <?= $index < 7 ? 'flex' : 'none'; ?>">
                                    <?php if (!empty($value['bild'])) { ?>
                                     <img class="category-image" src="<?= $value['bild'] ?>" alt="<?= $value['name'] ?>">
                                <?php } ?>
                                    <a href="<?= $value['slug'] ?>/">
                                        <?= $value['name'] ?>
                                    </a>
                                </li>
                                <?php if ($index === 8) { ?>
                                    <a class="see-more-button" id="see-more-<?= $taxonomy['class'] ?>" href="<?= $taxonomy['heading-link'] ?>">
                                        <?= 'Visa alla (' . count($taxonomy['data']) . ')' ?>
                                    </a>
                                <?php } ?>
                            <?php } ?>
                        </ul>
                    </div>
                <?php } ?>
            </div>
            <div class="dropdown-product-link">
                <a href="<?= $data['product_page_url']?> "><?= $data['product_page']?></a>
            </div>
        </div>
    </div>
</div>