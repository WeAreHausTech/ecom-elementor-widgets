<div class="header">
    <div class="logo">
        <a href="<?= get_home_url() ?>">
            <img style="height: 100%;" src="<?= $data['logo']['url'] ?>"
                alt="<?= $data['logo']['alt'] ? $data['logo']['alt'] : 'logo' ?> ">
            </img>
        </a>
    </div>
    <div>
        meny
    </div>
    <div class="menu-links">
        <?php if ($data['contact_us_link'] && $data['contact_us_text']) { ?>
            <a class="contact-button" href="<?= $data['contact_us_link']['url'] ?>">
                <?= $data['contact_us_text'] ?>
            </a>
        <?php } ?>
        </div>
</div>


<style>
    .header {
        display: flex;
        width: 100vw;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 24px;
    }

    .logo {
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
        padding: 24px 0;
    }

    .header .contact-button {
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
    }

    .header .contact-button:hover {
        color: var(--Almost-Black, #3E4849);
        background: rgba(0, 0, 0, 0.05);
    }
</style>