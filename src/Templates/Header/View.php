<div class="header">
    <div class="header-content" id="header-content">
        <div class="logo">
            <a href="<?= get_home_url() ?>">
                <img style="height: 100%; width: auto;" src="<?= $data['logo']['url'] ?>"
                    alt="<?= $data['logo']['alt'] ? $data['logo']['alt'] : 'logo' ?> ">
                </img>
            </a>
        </div>
        <div class="menu" id="main-menu">
            <?php if ($data['menu_id']) {
                wp_nav_menu([
                    'menu' => $data['menu_id'],
                    'depth' => 2,
                ]);
            } ?>
        </div>
        <div class="menu-links">
            <div class="icons">
                <?php include ('Search.php') ?>
                <?php include ('Login.php') ?>
                <?php include ('Cart.php') ?>
            </div>
            <div class="close-button">
                <button onClick="onCloseModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M7.12099 5.70717C6.73051 5.31668 6.09741 5.31668 5.70693 5.70717C5.31644 6.09765 5.31644 6.73075 5.70693 7.12123L10.5858 12L5.70693 16.8789C5.31644 17.2693 5.31644 17.9024 5.70693 18.2929C6.09741 18.6834 6.73051 18.6834 7.12099 18.2929L11.9998 13.4141L16.8787 18.2929C17.2691 18.6834 17.9022 18.6834 18.2927 18.2929C18.6832 17.9024 18.6832 17.2693 18.2927 16.8789L13.4139 12L18.2927 7.12123C18.6832 6.73075 18.6832 6.09765 18.2927 5.70717C17.9022 5.31668 17.2691 5.31668 16.8787 5.70717L11.9998 10.586L7.12099 5.70717Z"
                            fill="#3E4849" />
                    </svg>
                </button>
            </div>
            <?php if ($data['contact_us_link'] && $data['contact_us_text']) { ?>
                <div class="contact-button">
                    <a href="<?= $data['contact_us_link'] ?>">
                        <?= $data['contact_us_text'] ?>
                    </a>
                </div>
            <?php } ?>
        </div>
    </div>

    <div class="mobile-heaader">
        <div class="mobile-logo">
            <a href="<?= get_home_url() ?>">
                <img style="height:100%; width: auto;" src="<?= $data['logo']['url'] ?>"
                    alt="<?= $data['logo']['alt'] ? $data['logo']['alt'] : 'logo' ?> ">
                </img>
            </a>
        </div>
        <div class="mobile-icons">
            <?php include ('Search.php') ?>
            <?php include ('Login.php') ?>
            <?php include ('Cart.php') ?>

            <div class="open-button">
                <button onClick="onOpenModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M2.74998 6.75H21.25C21.664 6.75 21.9999 6.30195 21.9999 5.75C21.9999 5.19796 21.6639 4.75 21.25 4.75H2.74998C2.33603 4.75 2 5.19796 2 5.75C2 6.30204 2.33603 6.75 2.74998 6.75Z"
                            fill="#3E4849" />
                        <path
                            d="M21.25 11.25H2.74998C2.33596 11.25 2 11.698 2 12.25C2 12.802 2.33603 13.25 2.74998 13.25H21.25C21.664 13.25 21.9999 12.802 21.9999 12.25C21.9999 11.698 21.664 11.25 21.25 11.25Z"
                            fill="#3E4849" />
                        <path
                            d="M2.74998 17.75H21.25C21.664 17.75 22 18.198 21.9999 18.75C21.9999 19.302 21.664 19.75 21.25 19.75H2.74998C2.33603 19.75 2 19.302 2 18.75C2 18.198 2.33596 17.75 2.74998 17.75Z"
                            fill="#3E4849" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>

<?php include ('CategoriesDropdown.php') ?>

<script>
    const productMenuIds = <?= json_encode($data['products_menu_ids']) ?>;
</script>

<script>
    //TODO move to separate external file

    let header = document.querySelector('.header')
    let isMobile = header.offsetWidth <= 983

    const updateIsMobile = () => {
        header = document.querySelector('.header')
        isMobile = header.offsetWidth <= 983
    }

    window.addEventListener('load', updateIsMobile);
    window.addEventListener('resize', updateIsMobile);

     // Function to set display style for elements
     const setDisplayStyle = (selector, displayValue) => {
    document.querySelectorAll(selector).forEach((element) => {
        element.style.display = displayValue
    })
    }

    // Function to set flex direction for elements 
    const setFlexDirection = (selector, flexDirection) => {
    document.querySelectorAll(selector).forEach((element) => {
        element.style.flexDirection = flexDirection
    })
    }

    openSubcategories = (categoryId, categoryName) => {
        if (!isMobile) {
            return;
        }
    // Hide the main dropdown product link
    document.querySelector('.dropdown-product-link').style.display = 'none'

    //Hide container with image, svg and heading
    setDisplayStyle('.parent-inner-container', 'none');

    // Set display properties for headings for categories and departments
    document.querySelectorAll('[id^="parent-"]').forEach((element) => {
        element.style.display = element.id === `parent-${categoryId}` ? 'flex' : 'none'
    })

    // Adjust button visibility
    document.getElementById('go-back-button').style.display = 'none'
    document.getElementById('back-to-menu-button').style.display = 'block'
    document.getElementById('back-to-menu-placeholder').textContent = `${categoryName}`

    // Set display properties for categories and departments
    const categoryElement = document.getElementById(`category-${categoryId}`)
    if (categoryElement) categoryElement.style.display = 'flex'
    
    const departmentElement = document.getElementById(`department-list-${categoryId}`)
    if (departmentElement) departmentElement.style.display = 'flex'
    
    // Set explore link properties
    const desktopLink = document.getElementById(`desktop-link-${categoryId}`)
    let link = ''
    if (desktopLink) {
        link = desktopLink.getAttribute('href')
    }

    if (link) {
        const exploreContainer = document.querySelector('.explore-categories')
        const exploreLink = document.querySelector('.explore-link')
        exploreLink.setAttribute('href', link)
        exploreLink.textContent = `Utforska ${categoryName}`
        exploreContainer.style.display = 'block'
    }
    }

    const resetMobileDropdown = () => {
        console.log("RESETTING MOBILE")
    
    //Show the main product link
    document.querySelector('.dropdown-product-link').style.display = 'block'

    //Show container with image, svg and heading
    setDisplayStyle('.parent-inner-container', 'flex');

    // Set display and flex direction properties for various elements
    setDisplayStyle('[id^="parent-"]', 'flex')
    
    setDisplayStyle('.category', 'none')
    setDisplayStyle('.department-list', 'none')
    setDisplayStyle('.explore-categories', 'none')

    setFlexDirection('.department', 'column')

    //Adjust button visibility
    document.getElementById('go-back-button').style.display = 'block'
    document.getElementById('back-to-menu-button').style.display = 'none'
    }

    const resetDesktopDropdown = () => {
        console.log("RESETTING DESKTOP")
    // Hide the go-back button
    document.getElementById('go-back-button').style.display = 'none'

    // Set display and flex direction properties for categories and departments
    setDisplayStyle('.category', 'flex')
    setDisplayStyle('.department-list', 'flex')
    setFlexDirection('.parent', 'column')
    setFlexDirection('.department', 'column')

    // Hide the main product link
    document.querySelector('.dropdown-product-link').style.display = 'none'
    }

    showMore = (buttonElement) => {
        const buttonId = buttonElement.id;
        const id = buttonId.split('-')[2];
        document.querySelectorAll(`[data-parent="${id}"]`).forEach((element) => {
            element.style.display = 'block'
        })

        document.getElementById(buttonId).style.display = 'none'
    }
    closeProductModal = () => {
        const dropdown = document.getElementById('dropdown')
        const dropdownMenu = document.getElementById('dropdown-menu');
        const dropdownContent = document.getElementById('dropdown-content');

        if (dropdown.classList.contains('active-dropdown')) {
            dropdown.classList.remove('active-dropdown');
        }

        if (dropdownMenu.classList.contains('active-dropdown-menu')) {
            dropdownMenu.classList.remove('active-dropdown-menu')
        }

        if (dropdownContent.classList.contains('active-dropdown-content')) {
            dropdownContent.classList.remove('active-dropdown-content')
        }
    }
    closeMobileMenuModal = () => {
        const mobileMenu = document.getElementById('header-content');
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    }
    onOpenModal = () => {
        document.getElementById('header-content').classList.toggle('active')

    }
    onCloseModal = () => {
        document.getElementById('header-content').classList.toggle('active')
    }

    onGoBackButton = () => {
        document.getElementById('dropdown-menu').classList.remove('active-dropdown');
        document.getElementById('dropdown-content').classList.remove('active-dropdown-content')
        document.getElementById('dropdown').classList.remove('active-dropdown');
        document.getElementById('header-content').classList.add('active')

    }

    onBackToMenu = () => {
    resetMobileDropdown()
    }

    closeMenu = (e) => {
        document.getElementById('dropdown-content').classList.remove('active-dropdown-content')
        setTimeout(() => {
            document.getElementById('dropdown-menu').classList.remove('active-dropdown-menu');
            document.getElementById('dropdown').classList.remove('active-dropdown');

            if (document.getElementById('header-content').classList.contains('active')) {
            onCloseModal();
            }
        }, 400);
        
    }

    openOrCloseMenu = (e) => {
        e.preventDefault();
        const isOpen = document.getElementById('dropdown').classList.contains('active-dropdown')

        if (isOpen) {
            closeMenu()
            closeMobileMenuModal();
        } else {
            document.getElementById('dropdown').classList.add('active-dropdown')
            document.getElementById('dropdown-menu').classList.add('active-dropdown-menu')

            setTimeout(() => {
                document.getElementById('dropdown-content').classList.add('active-dropdown-content')
            }, 50);

            if (isMobile) {
                resetMobileDropdown();
            } else {
                resetMobileDropdown();
                resetDesktopDropdown();
            }
        }
    }

    updateDeviceType = () => {
        if (Array.isArray(productMenuIds)) {
            productMenuIds.forEach((productMenuId) => {
                const menuItemProducts = document.querySelectorAll('#menu-item-' + productMenuId);
                menuItemProducts.forEach((menuItemProduct) => {
                    menuItemProduct.addEventListener('click', openOrCloseMenu );
                });
            });
        }
    }

    updateDeviceType()

    const handleResize = () => {
        updateDeviceType()
        closeMenu()
        closeMobileMenuModal()
     }

    window.addEventListener('resize', handleResize)

    const dropdown = document.getElementById('dropdown');

    document.body.addEventListener('click', (event) => {

        const targetId = event.target.id;
        console.log(targetId)

        if (dropdown.classList.contains('active-dropdown')) {
            if (!targetId || targetId == null || targetId === 'dropdown-content' || targetId === 'back-to-menu-button' || targetId === 'back-to-menu-placeholder' ||  targetId.startsWith('menu-item-') ||  targetId.startsWith('category-button-') || targetId.startsWith('desktop-link-') || targetId.startsWith('department-button-') || targetId.startsWith('see-more-') || targetId.startsWith('parent-')) {
                return;
            } else {
                closeMenu();
            }
        }
    })

    const searchElement = document.getElementById('search-widget')

    searchElement.addEventListener('click', function (e) {
        closeProductModal();
    });

</script>

<style>
    :root {
        --header-height: 84px;
    }

    div[data-elementor-type="header"] {
        height: var(--header-height);
    }

    @media only screen and (min-width: 983px) {
        #main-menu {
            height: 84px;
        }
    }

    .icon-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

    }

    @media only screen and (min-width: 983px) {

        .menu-header-main-container,
        .menu,
        .menu-header-main-engelska-container,
        .menu-item {
            height: 100%;
        }
    }

    .dropdown {
        position: relative;
        display: none;
    }

    .active-dropdown {
        display: flex;
    }

    .dropdown-menu {
        display: none;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        background: rgba(0, 0, 0, 0.40);
        min-height: 100vh;
        position: fixed;
        top: var(--header-height);
        left: 0;
    }

    .active-dropdown-menu {
        display: flex;
        overflow: hidden;
        z-index: 9999;
    }

    .dropdown-content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        border-radius: 0px 0px 20px 20px;
        background: var(--header-dropdown-background, #fff);
        width: 100%;
        overflow-y: auto;
        max-height: 0;
        height: auto;
        opacity: 0;
        transform: translateY(-30%);
        transition: 0.4s ease, transform 0.4s ease, z-index 0s ease 0.9s;
        padding: 46px 64px;
    }

    .active-dropdown-content {
        max-height: calc(100vh - var(--header-height));
        height: auto;
        opacity: 1;
        transform: translateY(0);
        z-index: 9999;
    }

    .dropdown-categories {
        border-right: 1px solid rgba(0, 0, 0, 0.10);
        margin-right: 64px;
        margin-left: 64px;
        width: 100%;
        max-width: 960px;
    }

    .child .see-more-button {
        padding: 0;
        margin: 0;
        font-weight: 400;
        font-size: 14px;
        font-style: italic;
        font-weight: 400;
        line-height: 150%;
        border: none;
        display: flex;
        flex-direction: row;
        gap: 4px;
        justify-content: center;
        align-items: center;
    }

    .see-more-button {
        color: var(--header-see-more-button-color, #3E4849) !important;
        font-size: 14px !important;
        font-style: italic !important;
        font-weight: 400 !important;
        line-height: 150% !important;
        padding: 0 !important;
        margin: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        border: none !important;
    }

    .see-more-button:hover {
        background-color: transparent !important;
        border: none !important;
        text-decoration: underline !important;
        color: var(--header-see-more-button-color-hover, #000) !important;
    }

    .dropdown-content .go-back-button {
        background: none;
        border: none;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 140%;
        font-family: Inter;
        color: var(--header-go-back-button-color, #3E4849);
        padding: 8px 0;
        padding: 8px 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
    }

    .dropdown-content .go-back-button:hover {
        background: none;
        border: none;
        text-decoration: underline;
        color: var(--header-go-back-button-color-hover, #000);
    }

    .child .see-more-button:hover {
        background: none;
        border: none;
        color: var(--header-see-more-button-color-hover, #000);
    }

    .child .see-more-button:focus {
        background: none;
        border: none;
        text-decoration: underline;
    }

    .dropdown-menu .categories {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        row-gap: 64px;
        column-gap: 24px;
        justify-items: start;
        padding-left: 0;
        list-style: none;
        width: 100%;
    }

    .dropdown-menu .parent {
        font-weight: bold;
        min-width: 200px;
    }

    .child-link {
        font-weight: 400;
        color: var(--header-dropdown-child-color, #3E4849) !important;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%;
    }

    .parent-link:hover,
    .child-link:hover a {
        text-decoration: underline;
        color: var(--header-dropdown-child-color-hover, #000) !important;
    }


    .dropdown-menu .child {
        font-weight: 400;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%;
    }

    .dropdown-menu .brand label,
    .dropdown-menu .department label {
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 150%;
    }


    .dropdown-product-link {
        display: none;
    }

    @media screen and (max-width: 983px) {
        .dropdown-product-link {
            display: block;
            margin-top: 24px;
            margin-left: 0px;

        }

        .dropdown-product-link a {
            text-decoration: underline;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 150%;
        }

    }

    .dropdown-type {
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: minmax(auto, 1fr);
        gap: 24px;
        min-width: 200px;
    }

    .dropdown-a {
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 150%;
    }

    .dropdown-a:hover {
        cursor: pointer;
        text-decoration: underline;
        color: var(--header-dropdown-child-color-hover, #000) !important;
    }

    .dropdown-a {
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 150%;
    }

    .dropdown-a:hover {
        cursor: pointer;
        text-decoration: underline;
        color: var(--header-dropdown-child-color-hover, #000) !important;
    }

    @media screen and (max-width: 983px) {
        .dropdown-type {
            grid-auto-rows: auto;
        }
    }

    .dropdown-menu .category,
    .dropdown-menu .brand ul,
    .dropdown-menu .department ul {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
        padding-left: 0;
        list-style: none;
    }

    @media only screen and (max-width: 983px) {
        .dropdown-menu .parent {
            flex: 0 0 100%;
        }
    }

    .mobile-heaader {
        display: flex;
        width: 100vw;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .header {
        display: flex;
        width: 100vw;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 24px;
        flex-wrap: wrap;
        position: fixed;
        top: 0;
        background: var(--header-background-color, #fff);
        z-index: 9999;
    }

    .logo,
    .mobile-logo {
        height: 76px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .logo {
        min-width: 250px;
    }

    .header a {
        display: inline-block;
    }

    .header img {
        height: 100%;
    }

    .header .menu-links {
        display: flex;
        flex-direction: row;
        gap: 16px;
        padding: 24px 0;
        align-items: center;
        min-width: 250px;
        justify-content: flex-end;
    }

    .header .contact-button a {
        display: flex;
        height: 36px;
        padding: 8px;
        align-items: center;
        gap: 4px;
        border-radius: 8px;
        border: 1px solid var(--header-contact-button-border-color, #DEDEDE);
        color: var(--header-contact-button-color, #3E4849);
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 160%;
        letter-spacing: -0.14px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .header .contact-button a:hover {
        color: var(--header-contact-button-color-hover, #3E4849);
        background: rgba(0, 0, 0, 0.05);
    }

    .menu {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 8px;
        flex-wrap: wrap;
    }



    .menu ul {
        padding-left: 0;
        list-style: none;
    }

    .menu li {
        color: var(--header-menu-li-color, #3E4849);
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 160%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0 4px;
    }

    .menu li:hover {
        border-radius: 20px;
    }

    .menu li a {
        padding: 5px 12px;
    }

    .menu li a:hover {
        border-radius: 20px;
        background: var(--header-menu-li-color-hover, #F2F2F2);

    }


    .menu .current-menu-item {
        border-radius: 20px;
    }

    .menu a:hover {
        color: var(---header-menu-a-color, #3E4849);
    }

    .header-content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        z-index: 9999;
    }

    .header-content .logo a,
    .mobile-heaader .mobile-logo a {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .header-content img,
    .mobile-logo img {
        max-height: 36px;
        border-radius: 0;
    }

    .header .icons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .header .icons a {
        width: 36px;
        height: 36px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center
    }

    .header .icons a:hover,
    .mobile-icons a:hover,
    .mobile-icons .open-button button:hover,
    .close-button button:hover {
        border-radius: 20px;
        background: var(--header-icons-background-hover, #F2F2F2);
    }

    .mobile-icons {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
    }

    .mobile-icons a,
    .mobile-icons .open-button button,
    .close-button button {
        width: 36px;
        height: 36px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .header .close-button {
        display: none;
    }

    .header .open-button button {
        padding: 0;

    }

    .dropdown-categories-header .close-button {
        display: block;
        position: absolute;
        top: 20px;
        right: 24px;
    }

    @media only screen and (max-width: 983px) {
        .dropdown-categories-header .close-button {
            display: block;
            position: relative; 
            top: 0px; 
            right: 0px; 
        }
    }

    .dropdown-categories-header .go-back-button {
        display: none;
    }

    @media only screen and (max-width: 983px) {
        .dropdown-categories-header .go-back-button {
            display: block;
        }
    }


    @media only screen and (min-width: 983px) {
        .mobile-heaader {
            display: none;
        }
    }

    @media only screen and (max-width: 983px) {
        .header-content {
            display: none;
        }

        .header .close-button {
            display: block;
            position: absolute;
            top: 20px;
            right: 24px;
        }

        .active,
        .active-dropdown {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            position: fixed;
            top: 0;
            left: 0;
            background-color: var(--header-dropdown-background, #fff);
            overflow-y: hidden;
            padding: 20px 24px 24px 24px;
            z-index: 9999;
        }

        .active-dropdown {
            padding: 0;
        }

        .menu {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            overflow: auto;
            height: calc(100vh - 54px - var(--header-height));
            width: calc(100vw - 24px - 24px);
            flex-wrap: nowrap;
            gap: 0;
        }

        .dropdown-content {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            overflow: auto;
            flex-wrap: nowrap;
            gap: 0;
            padding: 20px 24px 24px 24px;
        }

        .dropdown-categories-header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 24px; 
            position: sticky; 
            top: 0; 
            background-color: var(--header-dropdown-background, #fff);
        }

        .menu li {
            padding: 8px;
            font-size: 18px;
        }

        .logo,
        .icons {
            display: none !important;
        }

        .contact-button {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 24px;
        }

        .dropdown-menu {
            top: 0;
        }

        .dropdown-menu .categories {
            row-gap: 24px;
            grid-template-columns: repeat(auto-fit, 100vw);
            display: flex; 
            flex-direction: column; 
        }

        .dropdown-type {
            margin-top: 24px;
            margin-left: 0px;
        }

        .dropdown-categories,
        .dropdown-type {
            border-right: none;
            width: 100%;
        }

        .dropdown-categories {
            margin: 0;

        }

        .menu .current-menu-item {
            border: none;
            background: none;
        }

        .dropdown-content,
        .active-dropdown-content {
            transform: none;
        }

        .dropdown-content {
            opacity: 1;
            max-height: 100vh;
            height: auto;
            border-radius: 0px;
            padding-bottom: 50px;
        }
    }

    .category-image {
        display: none; 
    }

    @media only screen and (max-width: 983px) {
        .category-image {
            display: block; 
            width: 10%; 
        }
    }

    @media only screen and (max-width: 983px) {
        .parent-link.desktop {
            pointer-events: none; 
        }

        .dropdown-a.desktop {
            pointer-events: none; 
        }
    }

    .arrow-icon {
        display: none; 
    }

    @media only screen and (max-width: 983px) {
        .arrow-icon {
            display: flex; 
            margin-left: auto; 
        }
    }

    .parent-inner-container {
        display: flex; 
        flex-direction: row; 
    }

</style>