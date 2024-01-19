<div class="dropdown" id="dropdown">
    <div class="dropdown-menu" id="dropdown-menu">
        <div class="dropdown-content" id="dropdown-content">
            <div class="dropdown-categories-header">
                <button class="go-back-button" onClick="onGoBackButton()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                            d="M5.85826 9.53507C5.71766 9.39443 5.63867 9.20369 5.63867 9.00482C5.63867 8.80595 5.71766 8.61522 5.85826 8.47457L10.3583 3.97457C10.4997 3.83795 10.6892 3.76236 10.8858 3.76407C11.0825 3.76577 11.2706 3.84465 11.4096 3.98371C11.5487 4.12276 11.6276 4.31087 11.6293 4.50752C11.631 4.70417 11.5554 4.89362 11.4188 5.03507L7.44901 9.00482L11.4188 12.9746C11.5554 13.116 11.631 13.3055 11.6293 13.5021C11.6276 13.6988 11.5487 13.8869 11.4096 14.0259C11.2706 14.165 11.0825 14.2439 10.8858 14.2456C10.6892 14.2473 10.4997 14.1717 10.3583 14.0351L5.85826 9.53507Z"
                            fill="#3E4849" />
                    </svg>Tillbaka
                </button>
                <div class="close-button">
                    <button onClick="onCloseModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M7.12099 5.70717C6.73051 5.31668 6.09741 5.31668 5.70693 5.70717C5.31644 6.09765 5.31644 6.73075 5.70693 7.12123L10.5858 12L5.70693 16.8789C5.31644 17.2693 5.31644 17.9024 5.70693 18.2929C6.09741 18.6834 6.73051 18.6834 7.12099 18.2929L11.9998 13.4141L16.8787 18.2929C17.2691 18.6834 17.9022 18.6834 18.2927 18.2929C18.6832 17.9024 18.6832 17.2693 18.2927 16.8789L13.4139 12L18.2927 7.12123C18.6832 6.73075 18.6832 6.09765 18.2927 5.70717C17.9022 5.31668 17.2691 5.31668 16.8787 5.70717L11.9998 10.586L7.12099 5.70717Z"
                                fill="#3E4849" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="dropdown-categories">
                <ul class="categories">
                    <?php if ($categories) { ?>
                        <?php foreach ($categories as $mainCategory) { ?>
                            <li class="parent">
                                <a class="parent-link" href="<?= $mainCategory['data']['slug'] ?>/">
                                    <?= $mainCategory['data']['name'] ?>
                                </a>
                                <?php if (!empty($mainCategory['children'])) { ?>
                                    <ul class="category">
                                        <?php foreach ($mainCategory['children'] as $index => $child) {
                                             ?>
                                            <li class="child-link" data-parent="<?= $mainCategory['data']['term_id'] ?>" class="child"
                                                style="display: <?= $index < 5 || count($mainCategory['children']) === 6 ?'block' : 'none'; ?>">
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
                            </li>
                        <?php } ?>
                    <?php } ?>
                </ul>
            </div>
            <div class="dropdown-type">
                <?php foreach ($taxonomies as $taxonomy) { ?>
                    <div class="department">
                        <a  class="dropdown-a" href="<?= $taxonomy['heading-link'] ?>">
                            <?= $taxonomy['heading'] ?>
                        </a>
                        <ul>
                            <?php foreach ($taxonomy['data'] as $index => $value) { ?>
                                <?php $value = $value['data'] ?>
                                <li class="child-link" data-parent="<?= $taxonomy['class'] ?>" class="child"
                                    style="display: <?= $index < 7 ? 'block' : 'none'; ?>">
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