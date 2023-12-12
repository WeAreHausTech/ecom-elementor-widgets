<?php
namespace Haus\SyncData\Classes;

use Haus\SyncData\Helpers\WpmlHelper;
use Haus\SyncData\Helpers\WpHelper;

class Products
{
    public $created = 0;
    public $updated = 0;
    public $deleted = 0;
    public $defaultLang = '';
    public $useWpml = false;


    public function __construct()
    {
        $wpmlHelper = new WpmlHelper();
        $this->useWpml = $wpmlHelper->hasWpml();
        $this->defaultLang = $wpmlHelper->getDefaultLanguage();
    }
    public function syncProductsData($vendureProducts, $wpProducts)
    {
        //Exists in WP, not in Vendure
        $delete = array_diff_key($wpProducts, $vendureProducts);

        array_walk($delete, function ($product) {
            $shouldBeExcluded = "1";
            if ($product['exclude_from_sync'] === $shouldBeExcluded) {
                return;
            }

            $this->deleteProduct($product['id']);

            foreach ($product['translations'] as $lang => $translation) {
                if ($translation['id']) {
                    $this->deleteProduct($translation['id']);
                }
            }
        });

        //Exists in Vendure, not in WP
        $create = array_diff_key($vendureProducts, $wpProducts);

        array_walk($create, function ($product) {
            $this->createProduct($product);
        });

        //Exists in Vendure and in  WP
        $update = array_intersect_key($vendureProducts, $wpProducts);

        foreach ($update as $vendureId => $vendureProduct) {
            $this->updateProduct($wpProducts[$vendureId], $vendureProduct);
        }

    }

    public function insertPost($ProductName, $slug, $vendureId)
    {

        $post = wp_insert_post([
            'post_title' => $ProductName,
            'post_status' => 'publish',
            'post_type' => 'produkter',
            'post_name' => $slug,
            'meta_input' => [
                'vendure_id' => $vendureId,
            ]
        ]);

        WpHelper::log(['Creating product', $vendureId, $ProductName, $slug]);

        return $post;

    }

    public function createProduct($product)
    {
        $orignal = $this->insertPost($product['productName'], $product['slug'], $product['productId']);

        if (!$this->useWpml) {
            $this->created++;
            return;
        }

        foreach ($product['translations'] as $lang => $translation) {
            $translations[$lang] = $this->insertPost($translation['productName'], $translation['slug'], $product['productId']);
        }

        $wpmlHelper = new WpmlHelper();
        $wpmlHelper->setLanguageDetails($orignal, $translations, 'post_produkter');
        $this->created++;
    }

    public function deleteProduct($postId)
    {
        wp_delete_post($postId, true);

        WpHelper::log(['Deleting product', $postId]);
        $this->deleted++;
    }

    public function updateProduct($wpProduct, $vendureProduct)
    {

        $update = $this->isUpdatedInVendure($wpProduct, $vendureProduct);

        if ($update === []) {
            return;
        }

        foreach ($update as $lang) {
            if ($lang === $this->defaultLang) {
                $this->updatePost($wpProduct['id'], $vendureProduct['productName'], $vendureProduct['slug'], $vendureProduct['productId']);
                continue;
            }

            $langExistsInWp = $wpProduct['translations'][$lang];

            if ($langExistsInWp && $langExistsInWp['id']) {
                $translatedPostId = $wpProduct['translations'][$lang]['id'];
                $translatedSlug = $vendureProduct['translations'][$lang]['slug'];
                $translatedName = $vendureProduct['translations'][$lang]['productName'];

                $this->updatePost($translatedPostId, $translatedName, $translatedSlug, $vendureProduct['productId']);
            } else {
                $this->createTranslatedPost($vendureProduct, $wpProduct['id'], $lang);
            }
        }
    }

    public function createTranslatedPost($vendureProduct, $originalId, $lang)
    {
        $newPost[$lang] = $this->insertPost($vendureProduct['translations'][$lang]['productName'], $vendureProduct['translations'][$lang]['slug'], $vendureProduct['productId']);
        $wpmlHelper = new WpmlHelper();
        $wpmlHelper->setLanguageDetails($originalId, $newPost, 'post_produkter');

        WpHelper::log(['Create product translation', $vendureProduct['translations'][$lang]['productName'], $vendureProduct['translations'][$lang]['slug']]);
        $this->created++;

    }

    public function updatePost($postId, $postTitle, $postName, $vendureId)
    {
        wp_update_post([
            'ID' => $postId,
            'post_title' => $postTitle,
            'post_name' => $postName
        ]);

        WpHelper::log(['Updating product', $postTitle, $postName, $vendureId]);

        $this->updated++;
    }

    public function isUpdatedInVendure($wpProduct, $vendureProduct)
    {
        $updateLang = [];
        $updateName = wp_specialchars_decode($wpProduct['post_title']) !== $vendureProduct['productName'];
        $updateSlug = $wpProduct['post_name'] !== $vendureProduct['slug'];

        if ($updateName || $updateSlug) {
            $updateLang[] = $this->defaultLang;
        }

        if (!$this->useWpml) {
            return $updateLang;
        }

        foreach ($wpProduct['translations'] as $lang => $translation) {
            if ($translation === []) {
                $updateLang[] = $lang;
                continue;
            }

            $updateTranslationName = wp_specialchars_decode($translation['post_title']) !== $vendureProduct['translations'][$lang]['productName'];
            $updateTranslationSlug = $translation['post_name'] !== $vendureProduct['translations'][$lang]['slug'];

            if ($updateTranslationName || $updateTranslationSlug) {
                $updateLang[] = $lang;
            }
        }

        return $updateLang;
    }
}