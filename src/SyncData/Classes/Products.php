<?php
namespace Haus\SyncData\Classes;

class Products
{
    public $created = 0;
    public $updated = 0;
    public $deleted = 0;

    public $defaultLang = 'sv';
    public function getAllProductsFromVendure($avalibleTranslations)
    {

        $products = $this->getVendureDefaultLang($this->defaultLang);
        $translations = [];

        foreach ($avalibleTranslations as $lang) {
            if ($lang === $this->defaultLang) {
                continue;
            }
            $translations[$lang] = $this->getVendureDefaultLang($lang);
        }

        foreach ($translations as $lang => $translation) {
            foreach ($translation as $key => $value) {
                $products[$key]['translations'][$lang] = [
                    'productName' => $value['productName'],
                    'slug' => $value['slug'],
                ];
            }
        }

        return $products;
    }

    public function getFirstUniqueTranslation($translations)
    {
        $seenProductIds = array();
        $products = [];

        foreach ($translations as $translation) {
            $productId = $translation['productId'];

            if (!in_array($productId, $seenProductIds)) {
                $seenProductIds[] = $productId;
                $products[] = $translation;
            }
        }

        return $products;
    }

    public function getVendureDefaultLang($lang)
    {
        $products = (new \Haus\Queries\Product)->get($lang);

        if (!isset($products['data']['search']['items'])) {
            return [];
        }

        $items = $products['data']['search']['items'];

        $unique = $this->getFirstUniqueTranslation($items);

        return array_combine(array_column($unique, 'productId'), $unique);
    }

    public function getAllProductsFromWp($avalibleTranslations)
    {
        $p = $this->getDefaultLang();

        foreach ($avalibleTranslations as $lang) {
            foreach ($p as $key => $value) {
                if ($lang === $this->defaultLang) {
                    continue;
                }
                if ($p[$key]) {
                    $p[$key]['translations'][$lang] = $this->getTranslations($value['id'], $lang);
                }

            }
        }

        return $p;
    }

    public function getTranslations($postId, $lang)
    {

        $translatedPostId = apply_filters('wpml_object_id', $postId, 'post', true, $lang);

        if ((int) $postId === $translatedPostId) {
            return [];
        }

        $translatedPost = get_post($translatedPostId);
        $data = [];

        if ($translatedPost) {
            $data = array(
                'post_title' => $translatedPost->post_title,
                'post_name' => $translatedPost->post_name,
                'id' => $translatedPost->ID,
            );
        }
        return $data;
    }

    public function getDefaultLang()
    {
        global $wpdb;

        $query = $wpdb->prepare(
            "SELECT p.ID as id, p.post_title, p.post_name, pm.meta_value as vendure_id, pm2.meta_value as exclude_from_sync, t.language_code as lang
             FROM {$wpdb->prefix}posts p 
             LEFT JOIN  {$wpdb->prefix}postmeta pm
                ON p.ID = pm.post_id
                AND pm.meta_key = 'vendure_id'
            LEFT JOIN {$wpdb->prefix}postmeta pm2
                ON p.ID = pm2.post_id
                AND pm2.meta_key = 'exclude_from_sync'
            LEFT JOIN {$wpdb->prefix}icl_translations t
                ON p.ID = t.element_id
                AND t.element_type = 'post_produkter'
                AND t.language_code IS NOT NULL
                WHERE t.language_code = 'sv'
                AND post_type ='produkter'"
        );


        $products = $wpdb->get_results($query, ARRAY_A);

        return array_combine(array_column($products, 'vendure_id'), $products);
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
            
            forEach($product['translations'] as $lang => $translation) {
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

    public function createProduct($product)
    {
        $orignal = wp_insert_post([
            'post_title' => $product['productName'],
            'post_status' => 'publish',
            'post_type' => 'produkter',
            'post_name' => $product['slug'],
            'meta_input' => [
                'vendure_id' => $product['productId'],
            ]
        ]);

        foreach ($product['translations'] as $lang => $translation) {
            $translations[$lang] = wp_insert_post([
                'post_title' => $translation['productName'],
                'post_status' => 'publish',
                'post_type' => 'produkter',
                'post_name' => $translation['slug'],
                'meta_input' => [
                    'vendure_id' => $product['productId'],
                ]
            ]);
        }

        $this->setLanguageDetails($orignal, $translations);

        $this->created++;
    }

    public function setLanguageDetails($orignal, $translations)
    {
        $wpmlElementType = apply_filters('wpmlElementType', 'post_produkter');
        $getLanguageArgs = array('element_id' => $orignal, 'element_type' => 'post_produkter');
        $goriginalPostLanguageInfo = apply_filters('wpml_element_language_details', null, $getLanguageArgs);

        foreach ($translations as $lang => $translation) {
            $setLanguageArgs = array(
                'element_id' => $translation,
                'element_type' => $wpmlElementType,
                'trid' => $goriginalPostLanguageInfo->trid,
                'language_code' => $lang,
                'source_language_code' => $goriginalPostLanguageInfo->language_code
            );
            do_action('wpml_set_element_language_details', $setLanguageArgs);
        }
    }

    public function deleteProduct($postId)
    {
        wp_delete_post($postId, true);
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
                $this->updatePost($wpProduct['id'], $vendureProduct['productName'], $vendureProduct['slug']);
                continue;
            }

            $langExistsInWp = $wpProduct['translations'][$lang];

            if ($langExistsInWp && $langExistsInWp['id']) {
                $translatedPostId = $wpProduct['translations'][$lang]['id'];
                $translatedSlug = $vendureProduct['translations'][$lang]['slug'];
                $translatedName = $vendureProduct['translations'][$lang]['productName'];

                $this->updatePost($translatedPostId, $translatedName, $translatedSlug);
            } else {
                $this->createTranslatedPost($vendureProduct, $wpProduct['id'], $lang);
            }
        }
    }

    public function createTranslatedPost($vendureProduct, $originalId, $lang)
    {
        $newPost[$lang] = wp_insert_post([
            'post_title' => $vendureProduct['translations'][$lang]['productName'],
            'post_status' => 'publish',
            'post_type' => 'produkter',
            'post_name' => $vendureProduct['translations'][$lang]['slug'],
            'meta_input' => [
                'vendure_id' => $vendureProduct['productId'],
            ]
        ]);

        $this->setLanguageDetails($originalId['id'], $newPost);
        $this->created++;

    }

    public function updatePost($postId, $postTitle, $postName)
    {
        wp_update_post([
            'ID' => $postId,
            'post_title' => $postTitle,
            'post_name' => $postName
        ]);
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

        foreach ($wpProduct['translations'] as $lang => $translation) {
            if ($wpProduct['translations'] === []) {
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