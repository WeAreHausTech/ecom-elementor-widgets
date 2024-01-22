<?php
namespace WeAreHausTech\SyncData\Classes;

use WeAreHausTech\SyncData\Helpers\WpmlHelper;
use WeAreHausTech\SyncData\Helpers\WpHelper;

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

    public function insertPost($ProductName, $slug, $vendureId, $updatedAt)
    {

        $post = wp_insert_post([
            'post_title' => $ProductName,
            'post_status' => 'publish',
            'post_type' => 'produkter',
            'post_name' => $slug,
            'meta_input' => [
                'vendure_id' => $vendureId,
                'vendure_updated_at' => $updatedAt,
            ]
        ]);

        WpHelper::log(['Creating product', $vendureId, $ProductName, $slug]);

        return $post;

    }

    public function createProduct($product)
    {
        $orignal = $this->insertPost($product['name'], $product['slug'], $product['id'], $product['updatedAt']);

        if (!$this->useWpml) {
            $this->created++;
            return;
        }

        foreach ($product['translations'] as $lang => $translation) {
            $translations[$lang] = $this->insertPost($translation['name'], $translation['slug'], $product['id'], $product['updatedAt']);
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
                $this->updatePost($wpProduct['id'], $vendureProduct['name'], $vendureProduct['slug'], $vendureProduct['id'], $vendureProduct['updatedAt']);
                continue;
            }

            $langExistsInWp = $wpProduct['translations'][$lang];

            if ($langExistsInWp && $langExistsInWp['id']) {
                $translatedPostId = $wpProduct['translations'][$lang]['id'];
                $translatedSlug = $vendureProduct['translations'][$lang]['slug'];
                $translatedName = $vendureProduct['translations'][$lang]['name'];

                $this->updatePost($translatedPostId, $translatedName, $translatedSlug, $vendureProduct['id'], $vendureProduct['updatedAt']);
            } else {
                $this->createTranslatedPost($vendureProduct, $wpProduct['id'], $lang);
            }
        }
    }

    public function createTranslatedPost($vendureProduct, $originalId, $lang)
    {
        $newPost[$lang] = $this->insertPost($vendureProduct['translations'][$lang]['name'], $vendureProduct['translations'][$lang]['slug'], $vendureProduct['id'], $vendureProduct['updatedAt']);
        $wpmlHelper = new WpmlHelper();
        $wpmlHelper->setLanguageDetails($originalId, $newPost, 'post_produkter');

        WpHelper::log(['Create product translation', $vendureProduct['translations'][$lang]['name'], $vendureProduct['translations'][$lang]['slug']]);
        $this->created++;

    }

    public function updatePost($postId, $postTitle, $postName, $vendureId, $updatedAt)
    {
        wp_update_post([
            'ID' => $postId,
            'post_title' => $postTitle,
            'post_name' => $postName, 
            'meta_input' => [
                'vendure_updated_at' => $updatedAt,
            ]
        ]);

        WpHelper::log(['Updating product', $postTitle, $postName, $vendureId]);

        $this->updated++;
    }

    public function isUpdatedInVendure($wpProduct, $vendureProduct)
    {
        $updateLang = [];

        if ($vendureProduct['updatedAt'] === $wpProduct['vendure_updated_at']) {
            return $updateLang;
        }

        $updateLang[] = $this->defaultLang;

        if (!$this->useWpml) {
            return $updateLang;
        }

        foreach ($wpProduct['translations'] as $lang => $translation) {
            $updateLang[] = $lang;
        }

        return $updateLang;
    }
}