<?php

namespace Haus\SyncData\Helpers;

use Haus\SyncData\Helpers\WpmlHelper;

class WpHelper
{

    public $defaultLang = '';

    public function __construct()
    {
        $wpmlHelper = new WpmlHelper();
        $wpmlHelper->getDefaultLanguage();
        $this->defaultLang = $wpmlHelper->getDefaultLanguage();
    }

    public function getAllProductsFromWp()
    {
        $products = $this->getProductsDefaultLang();
        $wpmlHelper = new WpmlHelper();
        $avalibleTranslations = $wpmlHelper->getAvalibleTranslations();

        foreach ($avalibleTranslations as $lang) {
            foreach ($products as $key => $value) {
                if ($lang === $this->defaultLang) {
                    continue;
                }
                if ($products[$key]) {
                    $products[$key]['translations'][$lang] = $this->getProductTranslations($value['id'], $lang);
                }

            }
        }

        return $products;
    }

    public function getProductsDefaultLang()
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

    public function getProductTranslations($postId, $lang)
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

    public function getAllCollectionsFromWp($taxonomy)
    {
        global $wpdb;

        $terms = $wpdb->prefix . 'terms';
        $termmeta = $wpdb->prefix . 'termmeta';
        $wpCollections = [];

        $query = $wpdb->prepare(
            "SELECT tt.term_id, tt.parent, t.name, t.slug, tm.meta_value as vendure_collection_id, tr.language_code as lang
             FROM wp_term_taxonomy tt 
             LEFT JOIN $terms t ON tt.term_id = t.term_id 
             LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
             AND tm.meta_key = 'vendure_collection_id'
             LEFT JOIN {$wpdb->prefix}icl_translations tr 
             ON tt.term_taxonomy_id = tr.element_id
             AND tr.element_type = 'tax_{$taxonomy}'
            WHERE tr.language_code IS NOT NULL
             AND taxonomy = %s",
            $taxonomy
        );

        $terms = $wpdb->get_results($query, ARRAY_A);


        // Add all translations into default lang object
        foreach ($terms as $term) {
            $vendureCollectionId = $term['vendure_collection_id'];

            if ($vendureCollectionId === '0' || $term['lang'] !== $this->defaultLang) {
                continue;
            }

            if (!isset($wpCollections[$vendureCollectionId])) {
                $wpCollections[$vendureCollectionId] = [
                    "term_id" => $term["term_id"],
                    "parent" => $term["parent"],
                    "name" => $term["name"],
                    "slug" => $term["slug"],
                    "vendure_collection_id" => $term["vendure_collection_id"],
                    "lang" => $this->defaultLang,
                    "translations" => [],
                ];
            }
        }

        foreach ($terms as $term) {
            $vendureCollectionId = $term['vendure_collection_id'];

            if ($vendureCollectionId === '0') {
                continue;
            }

            $lang = $term['lang'];
            if ($lang && $lang !== $this->defaultLang) {
                $wpCollections[$vendureCollectionId]['translations'][$lang] = [
                    "name" => $term["name"],
                    "slug" => $term["slug"],
                    "term_id" => $term["term_id"],
                ];
            }
        }

        return $wpCollections;
    }

    public function getAllTermsFromWp($taxonomy)
    {
        global $wpdb;

        $terms = $wpdb->prefix . 'terms';
        $termmeta = $wpdb->prefix . 'termmeta';
        $wpFacets = [];

        $query = $wpdb->prepare(
            "SELECT tt.term_id, t.name, tm.meta_value as vendure_term_id, tr.language_code as lang
            FROM wp_term_taxonomy tt 
            LEFT JOIN $terms t ON tt.term_id = t.term_id 
            LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
                AND tm.meta_key = 'vendure_term_id'
            LEFT JOIN {$wpdb->prefix}icl_translations tr 
                ON tt.term_taxonomy_id = tr.element_id
                AND tr.element_type = 'tax_{$taxonomy}'
                WHERE tr.language_code IS NOT NULL
            AND tm.meta_value IS NOT NULL
            AND taxonomy= %s",
            $taxonomy
        );

        $terms = $wpdb->get_results($query, ARRAY_A);

        foreach ($terms as $term) {
            $vendureFacetId = $term['vendure_term_id'];
            $lang = $term['lang'];

            if (!isset($wpCollections[$vendureFacetId]) && $lang === $this->defaultLang) {
                $wpFacets[$vendureFacetId] = array(
                    "term_id" => $term["term_id"],
                    "name" => $term["name"],
                    "vendure_term_id" => $term["vendure_term_id"],
                    "lang" => $this->defaultLang,
                    "translations" => [],
                );
            }
            ;

            if ($lang && $lang !== $this->defaultLang) {
                $wpFacets[$vendureFacetId]['translations'][$lang] = array(
                    "name" => $term["name"],
                    "term_id" => $term["term_id"],
                );
            }
        }

        return $wpFacets;
    }

    public function deleteTermsWithMissingValues($taxonomy)
    {
        global $wpdb;

        $vendureType = $taxonomy === 'produkter-kategorier' ? 'vendure_collection_id' : 'vendure_term_id';
        $wpmlType = 'tax_' . $taxonomy;

        $query = $wpdb->prepare(
            "SELECT tt.term_id
            FROM wp_term_taxonomy tt
                WHERE taxonomy = %s
                AND (
                    tt.term_id NOT IN (SELECT term_id FROM {$wpdb->prefix}termmeta WHERE meta_key = %s)
                    OR tt.term_id IN (SELECT term_id FROM {$wpdb->prefix}termmeta WHERE meta_key = %s AND (meta_value IS NULL OR meta_value = ''))
                    OR tt.term_id IN (SELECT element_id FROM {$wpdb->prefix}icl_translations WHERE element_type = %s AND language_code = '')
                )",
            $taxonomy,
            $vendureType,
            $vendureType,
            $wpmlType
        );

        return $wpdb->get_results($query, ARRAY_A);
    }
}

