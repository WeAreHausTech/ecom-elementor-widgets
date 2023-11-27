<?php

namespace Haus\SyncData\Classes;

use Haus\SyncData\Helpers\WpmlHelper;
use Haus\SyncData\Helpers\WpHelper;
use Haus\SyncData\Helpers\VendureHelper;

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
        $wpHelper = new WpHelper();
        $vendureHelper = new VendureHelper();
        $facets = $vendureHelper->getfacets();
        foreach ($this->taxonomies as $taxonomyType => $taxonomyInfo) {

            // Delete taxonomies with no vendure id and taxonomies with no translation language
            $termsToDelete = $wpHelper->deleteTermsWithMissingValues($taxonomyInfo['wp']);

            if (isset($termsToDelete) && count($termsToDelete) > 0) {
                foreach ($termsToDelete as $term) {
                    $this->deleteTerm($term['term_id'], $taxonomyInfo['wp']);
                }
            }

            if ($taxonomyType === 'collection') {
                $vendureValues = $vendureHelper->getCollectionsFromVendure();
                $wpTerms = $wpHelper->getAllCollectionsFromWp($taxonomyInfo['wp']);
                $this->findMissMatchedTaxonomies($taxonomyInfo['wp'], $vendureValues, $wpTerms);
                $this->syncAttributes($taxonomyInfo['wp'], $vendureValues, $wpTerms);
                continue;
            } else {
                $vendureValues = $facets[$taxonomyInfo['vendure']];
                $wpTerms = $wpHelper->getAllTermsFromWp($taxonomyInfo['wp']);
                $this->findMissMatchedTaxonomies($taxonomyInfo['wp'], $vendureValues, $wpTerms);
                $this->syncAttributes($taxonomyInfo['wp'], $vendureValues, $wpTerms);
            }
        }
    }

    public function findMissMatchedTaxonomies($taxonomy, $vendureTerms, $wpTerms)
    {
        foreach ($vendureTerms as $vendureId => $vendureTerm) {
            foreach ($wpTerms as $wpId => $wpTerm) {
                $decodedWpName = html_entity_decode($wpTerm['name']);
                if ($wpId === $vendureId && $decodedWpName !== $vendureTerm['name']) {
                    $this->deleteTerm($wpTerm['term_id'], $taxonomy);
                    $this->deleteTranslation($taxonomy, $wpTerm);
                    WpHelper::log(['Deleted taxonomy missmatch', $taxonomy, $vendureTerm['name'], $decodedWpName]);
                }
            }
        }
    }

    public function syncAttributes($taxonomy, $vendureTerms, $wpTerms)
    {

        //Exists in WP, not in Vendure
        $delete = array_diff_key($wpTerms, $vendureTerms);

        array_walk($delete, function ($term) use ($taxonomy) {
            $this->deleteTerm($term['term_id'], $taxonomy);

            $this->deleteTranslation($taxonomy, $term);
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

        // Add parents for collections, needs to be done after all terms are created
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
                $data = $vendureTerm['translations'][$lang];

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

        WpHelper::log(['Updating taxonomy', $taxonomy, $name, $slug]);

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

        WpHelper::log(['Deleting taxonomy', $taxonomy, $id]);

        $this->deletedTaxonomies++;
    }

    public function deleteTranslation($taxonomy, $term)
    {
        foreach ($term['translations'] as $lang => $translation) {
            if ($translation && $translation['term_id']) {
                $this->deleteTerm($translation['term_id'], $taxonomy);
            }
        }
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

        WpHelper::log(['Creating taxonomy', $lang, $taxonomy, $value['name'], $slug]);
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

        WpHelper::log(['Creating taxonomy', $taxonomy, $name, $slug]);

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