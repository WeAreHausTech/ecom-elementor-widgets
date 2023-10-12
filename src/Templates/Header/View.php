<div class="header">
    <div class="header-content" id="header-content">
        <div class="logo">
            <a href="<?= get_home_url() ?>">
                <img style="height: 100%;" src="<?= $data['logo']['url'] ?>"
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
                <div>
                    <a href="/search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M10.25 3.5C6.25482 3.5 3 6.75482 3 10.75C3 14.7452 6.25482 18 10.25 18C11.9782 18 13.5669 17.3895 14.8145 16.375L19.7197 21.2803C19.7888 21.3523 19.8716 21.4097 19.9632 21.4493C20.0548 21.4889 20.1534 21.5098 20.2532 21.5108C20.3529 21.5118 20.4519 21.4929 20.5443 21.4552C20.6367 21.4175 20.7206 21.3617 20.7912 21.2912C20.8617 21.2206 20.9175 21.1367 20.9552 21.0443C20.9929 20.9519 21.0118 20.8529 21.0108 20.7532C21.0098 20.6534 20.9889 20.5548 20.9493 20.4632C20.9097 20.3716 20.8523 20.2888 20.7803 20.2197L15.875 15.3145C16.8895 14.0669 17.5 12.4782 17.5 10.75C17.5 6.75482 14.2452 3.5 10.25 3.5ZM10.25 5C13.4345 5 16 7.56548 16 10.75C16 12.3013 15.3881 13.7029 14.3955 14.7354C14.3343 14.7803 14.2803 14.8343 14.2354 14.8955C13.2029 15.8881 11.8013 16.5 10.25 16.5C7.06548 16.5 4.5 13.9345 4.5 10.75C4.5 7.56548 7.06548 5 10.25 5Z"
                                fill="#3E4849" />
                        </svg>
                    </a>
                </div>
                <div>
                    <a href="/mina-sidor">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 3.75C9.1084 3.75 6.75 6.1084 6.75 9C6.75 10.8076 7.67285 12.4131 9.07031 13.3594C6.39551 14.5078 4.5 17.1621 4.5 20.25H6C6 16.9277 8.67773 14.25 12 14.25C15.3223 14.25 18 16.9277 18 20.25H19.5C19.5 17.1621 17.6045 14.5078 14.9297 13.3594C16.3271 12.4131 17.25 10.8076 17.25 9C17.25 6.1084 14.8916 3.75 12 3.75ZM12 5.25C14.0801 5.25 15.75 6.91992 15.75 9C15.75 11.0801 14.0801 12.75 12 12.75C9.91992 12.75 8.25 11.0801 8.25 9C8.25 6.91992 9.91992 5.25 12 5.25Z"
                                fill="#3E4849" />
                        </svg>
                    </a>
                </div>
                <div>
                    <a href="/varukorg">
                        <symbol viewBox="0 0 24 24" fill="#000" id="varukorg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none">
                                <path
                                    d="M2.84211 4C2.37829 4 2 4.38184 2 4.85C2 5.31816 2.37829 5.7 2.84211 5.7H4.71053L6.92105 14.625C7.10855 15.382 7.7796 15.9 8.55263 15.9H18.2105C18.9704 15.9 19.6151 15.392 19.8158 14.6516L22 6.55H7.89474L8.31579 8.25H19.8158L18.2105 14.2H8.55263L6.34211 5.275C6.15461 4.51797 5.48355 4 4.71053 4H2.84211ZM17.1579 15.9C15.773 15.9 14.6316 17.0521 14.6316 18.45C14.6316 19.8479 15.773 21 17.1579 21C18.5428 21 19.6842 19.8479 19.6842 18.45C19.6842 17.0521 18.5428 15.9 17.1579 15.9ZM9.57895 15.9C8.19408 15.9 7.05263 17.0521 7.05263 18.45C7.05263 19.8479 8.19408 21 9.57895 21C10.9638 21 12.1053 19.8479 12.1053 18.45C12.1053 17.0521 10.9638 15.9 9.57895 15.9ZM9.57895 17.6C10.0526 17.6 10.4211 17.9719 10.4211 18.45C10.4211 18.9281 10.0526 19.3 9.57895 19.3C9.10526 19.3 8.73684 18.9281 8.73684 18.45C8.73684 17.9719 9.10526 17.6 9.57895 17.6ZM17.1579 17.6C17.6316 17.6 18 17.9719 18 18.45C18 18.9281 17.6316 19.3 17.1579 19.3C16.6842 19.3 16.3158 18.9281 16.3158 18.45C16.3158 17.9719 16.6842 17.6 17.1579 17.6Z"
                                    fill="#3E4849" />
                            </svg>
                    </a>
                    </symbol>
                </div>
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
                    <a href="<?= $data['contact_us_link']['url'] ?>">
                        <?= $data['contact_us_text'] ?>
                    </a>
                </div>
            <?php } ?>
        </div>
    </div>

    <div class="mobile-heaader">
        <div class="mobile-logo">
            <a href="<?= get_home_url() ?>">
                <img style="height: 100%;" src="<?= $data['logo']['url'] ?>"
                    alt="<?= $data['logo']['alt'] ? $data['logo']['alt'] : 'logo' ?> ">
                </img>
            </a>
        </div>
        <div class="mobile-icons">
            <div>
                <a href="/search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M10.25 3.5C6.25482 3.5 3 6.75482 3 10.75C3 14.7452 6.25482 18 10.25 18C11.9782 18 13.5669 17.3895 14.8145 16.375L19.7197 21.2803C19.7888 21.3523 19.8716 21.4097 19.9632 21.4493C20.0548 21.4889 20.1534 21.5098 20.2532 21.5108C20.3529 21.5118 20.4519 21.4929 20.5443 21.4552C20.6367 21.4175 20.7206 21.3617 20.7912 21.2912C20.8617 21.2206 20.9175 21.1367 20.9552 21.0443C20.9929 20.9519 21.0118 20.8529 21.0108 20.7532C21.0098 20.6534 20.9889 20.5548 20.9493 20.4632C20.9097 20.3716 20.8523 20.2888 20.7803 20.2197L15.875 15.3145C16.8895 14.0669 17.5 12.4782 17.5 10.75C17.5 6.75482 14.2452 3.5 10.25 3.5ZM10.25 5C13.4345 5 16 7.56548 16 10.75C16 12.3013 15.3881 13.7029 14.3955 14.7354C14.3343 14.7803 14.2803 14.8343 14.2354 14.8955C13.2029 15.8881 11.8013 16.5 10.25 16.5C7.06548 16.5 4.5 13.9345 4.5 10.75C4.5 7.56548 7.06548 5 10.25 5Z"
                            fill="#3E4849" />
                    </svg>
                </a>
            </div>
            <div>
                <a href="/mina-sidor">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 3.75C9.1084 3.75 6.75 6.1084 6.75 9C6.75 10.8076 7.67285 12.4131 9.07031 13.3594C6.39551 14.5078 4.5 17.1621 4.5 20.25H6C6 16.9277 8.67773 14.25 12 14.25C15.3223 14.25 18 16.9277 18 20.25H19.5C19.5 17.1621 17.6045 14.5078 14.9297 13.3594C16.3271 12.4131 17.25 10.8076 17.25 9C17.25 6.1084 14.8916 3.75 12 3.75ZM12 5.25C14.0801 5.25 15.75 6.91992 15.75 9C15.75 11.0801 14.0801 12.75 12 12.75C9.91992 12.75 8.25 11.0801 8.25 9C8.25 6.91992 9.91992 5.25 12 5.25Z"
                            fill="#3E4849" />
                    </svg>
                </a>
            </div>
            <div>
                <a href="/varukorg">
                    <symbol viewBox="0 0 24 24" fill="#000" id="varukorg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M2.84211 4C2.37829 4 2 4.38184 2 4.85C2 5.31816 2.37829 5.7 2.84211 5.7H4.71053L6.92105 14.625C7.10855 15.382 7.7796 15.9 8.55263 15.9H18.2105C18.9704 15.9 19.6151 15.392 19.8158 14.6516L22 6.55H7.89474L8.31579 8.25H19.8158L18.2105 14.2H8.55263L6.34211 5.275C6.15461 4.51797 5.48355 4 4.71053 4H2.84211ZM17.1579 15.9C15.773 15.9 14.6316 17.0521 14.6316 18.45C14.6316 19.8479 15.773 21 17.1579 21C18.5428 21 19.6842 19.8479 19.6842 18.45C19.6842 17.0521 18.5428 15.9 17.1579 15.9ZM9.57895 15.9C8.19408 15.9 7.05263 17.0521 7.05263 18.45C7.05263 19.8479 8.19408 21 9.57895 21C10.9638 21 12.1053 19.8479 12.1053 18.45C12.1053 17.0521 10.9638 15.9 9.57895 15.9ZM9.57895 17.6C10.0526 17.6 10.4211 17.9719 10.4211 18.45C10.4211 18.9281 10.0526 19.3 9.57895 19.3C9.10526 19.3 8.73684 18.9281 8.73684 18.45C8.73684 17.9719 9.10526 17.6 9.57895 17.6ZM17.1579 17.6C17.6316 17.6 18 17.9719 18 18.45C18 18.9281 17.6316 19.3 17.1579 19.3C16.6842 19.3 16.3158 18.9281 16.3158 18.45C16.3158 17.9719 16.6842 17.6 17.1579 17.6Z"
                                fill="#3E4849" />
                        </svg>
                </a>
                </symbol>
            </div>

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

<script>
    onOpenModal = () => {
        document.getElementById('header-content').classList.toggle('active')
        document.body.style.overflowY = 'hidden';
        document.body.style.height = '100vh';
    }

    onCloseModal = () => {
        document.getElementById('header-content').classList.toggle('active')
        document.body.style.overflowY = 'auto';
        document.body.style.height = 'auto';
    }
</script>

<style>
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
    }

    .logo,
    .mobile-logo {
        height: 76px;
    }

    .header a {
        height: 100%;
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
    }

    .header .contact-button a {
        display: flex;
        height: 36px;
        padding: 8px;
        align-items: center;
        gap: 4px;
        border-radius: 8px;
        border: 1px solid var(--Gray-Medium, #DEDEDE);
        color: var(--Almost-Black, #3E4849);
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
        color: var(--Almost-Black, #3E4849);
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

    .menu li {
        padding: 5px 12px;
        color: var(--Almost-Black, #3E4849);
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 160%;
    }

    .menu li:hover {
        border-radius: 20px;
        background: var(--Gray-Light, #F2F2F2);
    }

    .menu a:hover {
        color: var(--Almost-Black, #3E4849);
    }

    .header-content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .header .icons {
        display: flex;
        flex-direction: row;
        gap: 16px;
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
        background: var(--Gray-Light, #F2F2F2);
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

    @media only screen and (min-width: 768px) {
        .mobile-heaader {
            display: none;
        }
    }

    @media only screen and (max-width: 768px) {
        .header-content {
            display: none;
        }

        .header .close-button {
            display: block;
            position: absolute;
            top: 20px;
            right: 24px;
        }

        .active {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 900;
            background-color: #fff;
            overflow-y: hidden;
            padding: 20px 24px 24px 24px;
        }

        .menu {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            overflow: auto;
            height: calc(100vh - 54px - 84px);
            width: calc(100vw - 24px - 24px);
            flex-wrap: nowrap;
            gap: 0;
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
    }
</style>