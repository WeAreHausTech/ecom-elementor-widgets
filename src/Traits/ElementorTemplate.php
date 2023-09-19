<?php
namespace Haus\Traits;

trait ElementorTemplate
{
    public function getTemplate()
    {
        ?>
        <div class="webien-elementor-preview" style="
                background:transparent; 
                border: 2px dashed #ccc; 
                padding: 50px;  
                color: #ccc; 
                display:flex; 
                flex-direction: 
                column; 
                justify-content:center; 
                align-items:center;">
            <i class="<?= $this->get_icon() ?>"></i>
            <h3 class="title">
                <?= $this->get_title() ?>
            </h3>
            <small>Ingen förhandsvisning</small>
        </div>
        <?php
    }
}