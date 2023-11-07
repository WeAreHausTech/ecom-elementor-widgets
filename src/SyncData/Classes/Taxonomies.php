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
            'vendure' => 'brand',
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

        $facets = $this->getfacets();
        foreach ($this->taxonomies as $taxonomyType => $taxonomyInfo) {
            if ($taxonomyType === 'collection') {
                $this->deleteTermsWithMissingValues($taxonomyInfo['wp']);
                $vendureValues = $this->getCollectionsFromVendure();
                $wpTerms = $this->getAllCollectionsFromWp($taxonomyInfo['wp']);
                $this->syncAttributes($taxonomyInfo['wp'], $vendureValues, $wpTerms);
                continue;
            } else {
                $this->deleteTermsWithMissingValues($taxonomyInfo['wp']);
                $vendureValues = $facets[$taxonomyInfo['vendure']];
                $wpTerms = $this->getAllTermsFromWp($taxonomyInfo['wp']);
                $this->syncAttributes($taxonomyInfo['wp'], $vendureValues, $wpTerms);
            }
        }
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


        //TO remove when vendure bug is fixed
        foreach ($collections as $coll) {
            if (!$coll['name']){
                $collections[$coll['id']]['name'] = 'Saknar namn ' . rand();
                $collections[$coll['id']]['slug'] = 'saknar-namn-' . rand();
            }
        }

        foreach ($translations as $lang => $translation) {
            foreach ($translation as $key => $value) {

                $collections[$key]['translations'][$lang] = [
                       //TO remove custom name when vendure bug is fixed
                    "name" => $value['name'] ? $value['name'] : 'Missing name ' . rand(),
                    "slug" => $value['slug'] ? $value['slug'] . '-' . $lang : 'missing-name-' . rand() . '-' . $lang,
                ];
            }
        }
        return $collections;
    }

    public function getfacets()
    {
        $wpmlHelper = new WpmlHelper();
        $avalibleTranslations = $wpmlHelper->getAvalibleTranslations();
        $translations = [];
        $facets = $this->getFacetsFromVendure($this->defaultLang);

        foreach ($avalibleTranslations as $lang) {
            if ($lang === $this->defaultLang) {
                continue;
            }
            $translations[$lang] = $this->getFacetsFromVendure($lang);
        }

        foreach ($translations as $lang => $translation) {
            foreach ($translation as $key => $facet) {
                foreach ($facet as $facetValues) {
                    $facets[$key][$facetValues['id']]['translations'][$lang] = [
                        "name" => $facetValues['name'],
                    ];
                }
            }
        }

        return $facets;
    }

    public function getFacetsFromVendure($lang)
    {
        $facets = (new \Haus\Queries\Facet)->get($lang);

        if (!isset($facets['data']['facets']['items'])) {
            return [];
        }

        $items = $facets['data']['facets']['items'];
        $sorted = [];

        foreach ($items as $facetType) {
            $sorted[$facetType['name']] = array_combine(array_column($facetType['values'], 'id'), $facetType['values']);
        }

        return $sorted;
    }

    public function getVendureCollectionData($lang, $data = [], $skip = 0, $take = 100)
    {
        $collections = (new \Haus\Queries\Collection)->get($lang, $skip, $take);

        if (!isset($collections['data']['collections']['items'])) {
            return [];
        }

        $items = $collections['data']['collections']['items'];
        $totalItems = $collections['data']['collections']['totalItems'];

        $data = array_merge($data, $items);
        
        if (count($data) === $totalItems) {
            return array_combine(array_column($data, 'id'), $data);
        } else {
            return $this->getVendureCollectionData($lang, $data, $skip + 100, $take);
        }

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
                    "translations" => [],
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

    public function deleteTermsWithMissingValues($taxonomy)
    {
        // Delete taxonomies with no vendure id and taxonomies with no translation language
        global $wpdb;
        $terms = $wpdb->prefix . 'terms';

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

        $termsToDelete = $wpdb->get_results($query, ARRAY_A);

        if (isset($termsToDelete) && count($termsToDelete) > 0) {
            foreach ($termsToDelete as $term) {
                $this->deleteTerm($term['term_id'], $taxonomy);
            }
        }
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
        if (isset($vendureTerm['slug'])) {
            return $vendureTerm['slug'];
        } else {
            return sanitize_title($vendureTerm['name']);
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

            if (isset($wpTerm['translations'][$lang]['term_id'])) {
                $translatedTermId = (int) $wpTerm['translations'][$lang]['term_id'];
                $translatedName = $vendureTerm['translations'][$lang]['name'];
                $name = $vendureTerm['translations'][$lang]['name'];
                $data =  $vendureTerm['translations'][$lang];

                $translatedSlug = $this->getSlugForTranslations($name, $data, $lang);
                $this->updateTaxonomy($translatedTermId, $taxonomy, $translatedName, $translatedSlug);
            } else {
                $vendureType = $taxonomy === 'produkter-kategorier' ? 'vendure_collection_id' : 'vendure_term_id';
                $this->createTranslatedTerm($vendureTerm, $taxonomy, $wpTerm['term_id'], $lang, $vendureType);
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
        $slug = $this->getSlugForTranslations($vendureTerm['name'], $vendureTerm['translations'][$lang], $lang);

        $term = $this->insertTerm($vendureTerm['id'], $name, $slug, $taxonomy, $vendureType);

        $translations[$lang] = $term;
        $wmplType = 'tax_' . $taxonomy;
        $originalIdInt = (int) $originalId;

        $wpmlHelper = new WpmlHelper();

        $wpmlHelper->setLanguageDetails($originalIdInt, $translations, $wmplType);
        $this->createdTaxonomies++;
    }


    public function isUpdatedInVendure($wpTerm, $vendureTerm)
    {
        $updateLang = [];
        $vendureSlug = $this->getVendureTermSlug($vendureTerm);
        $updateSlug = false;
        $updateName = wp_specialchars_decode($wpTerm['name']) !== $vendureTerm['name'];

        if (isset($wpTerm['slug'])) {
            $updateSlug = $wpTerm['slug'] !== $vendureSlug;
        }

        if ($updateName || $updateSlug) {
            $updateLang[] = $this->defaultLang;
        }

        if ($wpTerm['translations'] === []) {
            if ($vendureTerm['translations'] !== []) {
                $updateLang[] = array_keys($vendureTerm['translations'])[0];
            }

            return $updateLang;
        }

        foreach ($wpTerm['translations'] as $lang => $translation) {
            if ($translation === []) {
                $updateLang[] = $lang;
                continue;
            }
            $updateTranslationSlug = false;
            $updateTranslationName = wp_specialchars_decode($translation['name']) !== $vendureTerm['translations'][$lang]['name'];

            if (isset($translation['slug'])) {
                $updateTranslationSlug = $translation['slug'] !== $this->getVendureTermSlug($vendureTerm['translations'][$lang]);
            }

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
        $vendureType = $taxonomy === 'produkter-kategorier' ? 'vendure_collection_id' : 'vendure_term_id';
        $wmplType = 'tax_' . $taxonomy;

        $original = $this->addNewTermOriginal($value, $taxonomy, $vendureType);
        $translations = $this->addNewTermTranslations($value, $taxonomy, $vendureType);


        if ($original && $translations) {
            $wpmlHelper = new WpmlHelper();
            $wpmlHelper->setLanguageDetails($original, $translations, $wmplType);
        }

        $this->createdTaxonomies++;
    }

    public function addNewTermOriginal($value, $taxonomy, $vendureType)
    {
        $slug = isset($value['slug']) ? $value['slug'] : sanitize_title($value['name']);

        $term = $this->insertTerm($value['id'], $value['name'], $slug, $taxonomy, $vendureType);
        return $term;
    }

    public function addNewTermTranslations($value, $taxonomy, $vendureType)
    {
        $translations = [];

        foreach ($value['translations'] as $lang => $translation) {

            $slug = $this->getSlugForTranslations($value['name'], $translation, $lang);

            $term = $this->insertTerm($value['id'], $translation['name'], $slug, $taxonomy, $vendureType);
            $translations[$lang] = $term;
        }
        return $translations;
    }

    public function getSlugForTranslations($defaultName, $translation, $lang)
    {
        //slug only exists for collections. Slugs for facets are generated from name, if name is same for different languages it will add langcode to make it unique. 
        if (isset($translation['slug'])) {
            return $translation['slug'];
        } else {
            if ($defaultName === $translation['name']) {
                return sanitize_title($translation['name']) . '-' . $lang;
            } else {
                return sanitize_title($translation['name']);
            }
        }
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