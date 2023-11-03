<?php

namespace Haus\SyncData\Classes;

use Haus\SyncData\Classes\WpmlHelper;

class Taxonomies
{
    public $createdTaxonomies = 0;
    public $updatedTaxonimies = 0;
    public $deletedTaxonomies = 0;
    public $defaultLang = '';
    private $taxonomies = [
        'brand' => [
            'wp' => 'produkter-varumarken',
            'vendure' => 'brand'
        ],
        'department' => [
            'wp' => 'produkter-avdelningar',
            'vendure' => 'department',
        ],
        'collection' => [
            'wp' => 'produkter-kategorier',
            'vendure' => 'category',
        ],
    ];

    public function __construct()
    {
        $wpmlHelper = new WpmlHelper();
        $wpmlHelper->getDefaultLanguage();
        $this->defaultLang = $wpmlHelper->getDefaultLanguage();
    }

    public function syncTaxonomies()
    {
        $facets = [];
        foreach ($this->taxonomies as $taxonomyType => $taxonomyInfo) {

            if ($taxonomyType === 'collection') {
                $vendureValues = $this->getCollectionsFromVendure();
                $wpTerms = $this->getAllCollectionsFromWp($taxonomyInfo['wp']);
                $this->syncAttributes($taxonomyInfo['wp'], $vendureValues, $wpTerms);
            }
            // switch ($taxonomyType) {
            //     case 'collection':
            //         $vendureValues = $this->getCollectionsFromVendure($avalibleTranslations);
            //         $wpTerms = $this->getAllCollectionsFromWp($taxonomyInfo['wp'], $avalibleTranslations);
            //         break;
            //     default:
            //         // $vendureValues = $this->getFacetsFromvendureByType($facets, $taxonomyInfo['vendure']);
            //         // $wpTerms = $this->getAllTermsFromWp($taxonomyInfo['wp']);
            //         break;
            // }

            // $this->syncAttributes($taxonomyInfo['wp'], $vendureValues, $wpTerms);
        }
    }

    public function getFacetsFromvendureByType($facets, $facetType)
    {
        $values = $facets['data']['facets']['items'];
        $matchingValues = null;

        foreach ($values as $value) {
            if ($value['name'] === $facetType) {
                $matchingValues = $value;
                break;
            }
        }

        return array_combine(array_column($matchingValues['values'], 'id'), $matchingValues['values']);
    }

    public function getCollectionsFromVendure()
    {
        $wpmlHelper = new WpmlHelper();
        $avalibleTranslations = $wpmlHelper->getAvalibleTranslations();
        $translations = [];
        $collections = $this->getVendureCollectionData($this->defaultLang);

        foreach ($avalibleTranslations as $lang) {
            if ($lang === $this->defaultLang) {
                continue;
            }
            $translations[$lang] = $this->getVendureCollectionData($lang);
        }

        foreach ($translations as $lang => $translation) {
            foreach ($translation as $key => $value) {
                $collections[$key]['translations'][$lang] = [
                    "name" => $value['name'],
                    "slug" => $value['slug'] . '-en',
                ];
            }
        }

        return $collections;
    }

    public function getVendureCollectionData($lang)
    {
        $collections = (new \Haus\Queries\Collection)->get($lang);

        if (!isset($collections['data']['collections']['items'])) {
            return [];
        }

        $items = $collections['data']['collections']['items'];


        return array_combine(array_column($items, 'id'), $items);
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
            $lang = $term['lang'];

            if (!isset($wpCollections[$vendureCollectionId]) && $lang === $this->defaultLang) {
                $wpCollections[$vendureCollectionId] = array(
                    "term_id" => $term["term_id"],
                    "parent" => $term["parent"],
                    "name" => $term["name"],
                    "slug" => $term["slug"],
                    "vendure_collection_id" => $term["vendure_collection_id"],
                    "lang" => $this->defaultLang,
                );
            }

            if ($lang && $lang !== $this->defaultLang) {
                $wpCollections[$vendureCollectionId]['translations'][$lang] = array(
                    "name" => $term["name"],
                    "slug" => $term["slug"],
                    "term_id" => $term["term_id"],
                );
            }
        }

        return $wpCollections;
    }

    public function getAllTermsFromWp($taxonomy)
    {
        global $wpdb;

        $terms = $wpdb->prefix . 'terms';
        $termmeta = $wpdb->prefix . 'termmeta';

        $query = $wpdb->prepare(
            "SELECT tt.term_id, tt.parent, t.name, t.slug, tm.meta_value as vendure_term_id
             FROM wp_term_taxonomy tt 
             LEFT JOIN $terms t ON tt.term_id = t.term_id 
             LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
             AND tm.meta_key = 'vendure_term_id'
             LEFT JOIN {$wpdb->prefix}icl_translations t2
                ON t.term_id = t2.element_id
                AND t2.element_type = 'tax_produkter_kategorier'
                AND t2.language_code IS NOT NULL
             WHERE taxonomy = %s",
            $taxonomy
        );

        $terms = $wpdb->get_results($query, ARRAY_A);

        return array_combine(array_column($terms, 'vendure_term_id'), $terms);
    }

    public function syncAttributes($taxonomy, $vendureTerms, $wpTerms)
    {
        //Exists in WP, not in Vendure
        $delete = array_diff_key($wpTerms, $vendureTerms);

        array_walk($delete, function ($term) use ($taxonomy) {
            $this->deleteTerm($term['term_id'], $taxonomy);

            foreach ($term['translations'] as $lang => $translation) {

                if ($translation && $translation['term_id']) {
                    $this->deleteTerm($translation['term_id'], $taxonomy);
                }
            }
        });

        //Exists in Vendure, not in WP
        $create = array_diff_key($vendureTerms, $wpTerms);

        array_walk($create, function ($term) use ($taxonomy) {
            $this->addNewTerm($term, $taxonomy);
        });

        //Exists in Vendure and in  WP 
        $update = array_intersect_key($vendureTerms, $wpTerms);

        foreach ($update as $vendureId => $vendureTerm) {
            $this->updateTerm($wpTerms[$vendureId], $vendureTerm, $taxonomy);
        }

        // Add parents, only for collections, needs to be done after all terms are created/updated
        if ($taxonomy === 'produkter-kategorier') {
            foreach ($vendureTerms as $vendureId => $vendureTerm) {
                $this->syncCollectionParents($vendureId, $vendureTerm['parentId'], $taxonomy);
            }
        }
    }

    public function getVendureTermSlug($vendureTerm)
    {
        // Different key if collection or facet
        if (isset($vendureTerm['code'])) {
            return $vendureTerm['code'];
        }

        if (isset($vendureTerm['slug'])) {
            return $vendureTerm['slug'];
        }

        return null;
    }

    public function updateTerm($wpTerm, $vendureTerm, $taxonomy)
    {

        $update = $this->isUpdatedInVendure($wpTerm, $vendureTerm);

        if ($update === []) {
            return;
        }

        foreach ($update as $lang) {
            $vendureSlug = $this->getVendureTermSlug($vendureTerm);
            if ($lang === $this->defaultLang) {
                $this->updateTaxonomy($wpTerm['term_id'], $taxonomy, $vendureTerm['name'], $vendureSlug);
                continue;
            }

            $langExistsInWp = $wpTerm['translations'][$lang];

            if ($langExistsInWp && $langExistsInWp['term_id']) {
                $translatedTermId = $langExistsInWp['term_id'];
                $translatedName = $vendureTerm['translations'][$lang]['name'];
                $translatedSlug = $vendureTerm['translations'][$lang]['slug'];

                $this->updateTaxonomy($translatedTermId, $taxonomy, $translatedName, $translatedSlug);
            } else {
                $this->createTranslatedTerm($vendureTerm, $taxonomy, $wpTerm['term_id'], $lang, 'vendure_collection_id');
            }

        }
    }

    public function updateTaxonomy($termID, $taxonomy, $name, $slug)
    {
        $args = array(
            'name' => $name,
            'slug' => $slug,
        );

        wp_update_term($termID, $taxonomy, $args);

        $this->updatedTaxonimies++;
    }

    public function createTranslatedTerm($vendureTerm, $taxonomy, $originalId, $lang, $vendureType)
    {

        $name = $vendureTerm['translations'][$lang]['name'];
        $slug = $this->getVendureTermSlug($vendureTerm['translations'][$lang]);
        $this->getVendureTermSlug($vendureTerm);

        $term = $this->insertTerm($vendureTerm['id'], $name, $slug, $taxonomy, $vendureType);
        $translations[$lang] = $term;

        $wpmlHelper = new WpmlHelper();
        $wpmlHelper->setLanguageDetails($originalId, $translations, 'tax_produkter-kategorier');
        $this->createdTaxonomies++;
    }

    public function isUpdatedInVendure($wpTerm, $vendureTerm)
    {
        $updateLang = [];
        $vendureSlug = $this->getVendureTermSlug($vendureTerm);
        $updateSlug = $wpTerm['slug'] !== $vendureSlug;
        $updateName = wp_specialchars_decode($wpTerm['name']) !== $vendureTerm['name'];

        if ($updateName || $updateSlug) {
            $updateLang[] = $this->defaultLang;
        }

        foreach ($wpTerm['translations'] as $lang => $translation) {
            if ($translation === []) {
                $updateLang[] = $lang;
                continue;
            }

            $updateTranslationName = wp_specialchars_decode($translation['name']) !== $vendureTerm['translations'][$lang]['name'];
            $updateTranslationSlug = $translation['slug'] !== $this->getVendureTermSlug($vendureTerm['translations'][$lang]);

            if ($updateTranslationName || $updateTranslationSlug) {
                $updateLang[] = $lang;
            }
        }

        return $updateLang;

    }

    public function deleteTerm($id, $taxonomy)
    {
        //TODO use this SQL to make it safer:
        //TODO 'DELETE FROM termmeta WHERE term_id NOT IN (SELECT term_id FROM terms)'
        delete_term_meta($id, 'vendure_collection_id');
        delete_term_meta($id, 'vendure_term_id');
        wp_delete_term($id, $taxonomy);

        $this->deletedTaxonomies++;
    }

    public function addNewTerm($value, $taxonomy)
    {
        if ($taxonomy === 'produkter-kategorier') {
            $original = $this->addNewTermOriginal($value, $taxonomy, 'vendure_collection_id', $value['slug']);
            $translations = $this->addNewTermTranslations($value, $taxonomy, 'vendure_collection_id');

            $wpmlHelper = new WpmlHelper();
            $wpmlHelper->setLanguageDetails($original, $translations, 'tax_produkter-kategorier');
        } else {
            //TODO fix this to insertTerm  function
            $term = wp_insert_term($value['name'], $taxonomy, ['slug' => $this->getVendureTermSlug($value)]);
            add_term_meta($term['term_id'], 'vendure_term_id', $value['id'], true);
        }

        $this->createdTaxonomies++;
    }

    public function addNewTermOriginal($value, $taxonomy, $vendureType, $slug)
    {
        $term = $this->insertTerm($value['id'], $value['name'], $slug, $taxonomy, $vendureType);
        return $term;
    }

    public function addNewTermTranslations($value, $taxonomy, $vendureType)
    {
        $translations = [];

        foreach ($value['translations'] as $lang => $translation) {
            $term = $this->insertTerm($value['id'], $translation['name'], $translation['slug'], $taxonomy, $vendureType);
            $translations[$lang] = $term;
        }

        return $translations;
    }

    public function insertTerm($vendureId, $name, $slug, $taxonomy, $vendureType)
    {

        $term = wp_insert_term($name, $taxonomy, ['slug' => $slug]);

        if (is_wp_error($term)) {
            //TODO log error somewhere
            error_log($term->get_error_message());
            return;
        }

        add_term_meta($term['term_id'], $vendureType, $vendureId, true);

        return $term['term_id'];
    }

    public function getTermIdByVendureId($vendureId)
    {
        global $wpdb;

        $query = $wpdb->prepare(
            "SELECT term_id 
            FROM {$wpdb->prefix}termmeta
            WHERE meta_key = 'vendure_collection_id' 
            AND meta_value = $vendureId"
        );

        return $wpdb->get_col($query);
    }

    public function getParentTermId($vendureParentId, $taxonomy)
    {
        global $wpdb;
        // Vendure parentId is 1 if root collection
        if ($vendureParentId === "1") {
            return 0;
        } else {
            global $wpdb;
            $query = $wpdb->prepare(
                "SELECT term_id 
                FROM {$wpdb->prefix}termmeta
                WHERE meta_key = 'vendure_collection_id' 
                AND meta_value = $vendureParentId"
            );

            $ids = $wpdb->get_col($query);
            $terms = [];

            foreach ($ids as $id) {
                $wpmlHelper = new WpmlHelper();
                $lang = $wpmlHelper->getTermLanguage($id, $taxonomy);
                $terms[$lang] = $id;
            }

            return $terms;
        }
    }

    public function syncCollectionParents($vendureId, $vendureParentId, $taxonomy)
    {
        $collectionTermIds = $this->getTermIdByVendureId($vendureId);
        $collectionParentIds = $this->getParentTermId($vendureParentId, $taxonomy);

        $parentData = [];

        foreach ($collectionTermIds as $id) {
            $wpmlHelper = new WpmlHelper();
            $lang = $wpmlHelper->getTermLanguage($id, $taxonomy);
            $parentId = $collectionParentIds === 0 ? 0 : $collectionParentIds[$lang];
            $parentData[$lang] = [
                'id' => $id,
                'parentId' => $parentId
            ];
        }

        foreach ($parentData as $id) {
            wp_update_term((int) $id['id'], $taxonomy, ['parent' => (int) $id['parentId']]);
        }
    }
}