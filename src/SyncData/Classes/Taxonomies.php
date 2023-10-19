<?php

namespace Haus\SyncData\Classes;

class Taxonomies
{
    public $createdTaxonomies = 0;
    public $updatedTaxonimies = 0;
    public $deletedTaxonomies = 0;
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

    public function syncTaxonomies($facets)
    {

        foreach ($this->taxonomies as $taxonomyType => $taxonomyInfo) {
            switch ($taxonomyType) {
                case 'collection':
                    $vendureValues = $this->getCollectionsFromVendure();
                    $wpTerms = $this->getAllCollectionsFromWp($taxonomyInfo['wp']);
                    break;
                default:
                    $vendureValues = $this->getFacetsFromvendureByType($facets, $taxonomyInfo['vendure']);
                    $wpTerms = $this->getAllTermsFromWp($taxonomyInfo['wp']);
                    break;
            }

            $this->syncAttributes($taxonomyInfo['wp'], $vendureValues, $wpTerms);
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
        $collections = (new \Haus\Queries\Collection)->get();

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

        $query = $wpdb->prepare(
            "SELECT tt.term_id, tt.parent, t.name, t.slug, tm.meta_value as vendure_collection_id
             FROM wp_term_taxonomy tt 
             LEFT JOIN $terms t ON tt.term_id = t.term_id 
             LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
             AND tm.meta_key = 'vendure_collection_id'
             WHERE taxonomy = %s",
            $taxonomy
        );

        $terms = $wpdb->get_results($query, ARRAY_A);

        return array_combine(array_column($terms, 'vendure_collection_id'), $terms);
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
        $vendureSlug = $this->getVendureTermSlug($vendureTerm);

        $updateSlug = $wpTerm['slug'] !== $vendureSlug;
        $updateName = wp_specialchars_decode($wpTerm['name']) !== $vendureTerm['name'];

        if ($updateName || $updateSlug) {
            $args = array(
                'name' => $vendureTerm['name'],
                'slug' => $vendureSlug,
            );

            wp_update_term($wpTerm['term_id'], $taxonomy, $args);

            $this->updatedTaxonimies++;
        }
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
            $term = wp_insert_term($value['name'], $taxonomy, ['slug' => $value['slug']]);

            if (is_wp_error($term)) {
                //TODO log error somewhere
                error_log($term->get_error_message());
                return;
            }

            add_term_meta($term['term_id'], 'vendure_collection_id', $value['id'], true);
        } else {
            $term = wp_insert_term($value['name'], $taxonomy, ['slug' => $this->getVendureTermSlug($value)]);
            add_term_meta($term['term_id'], 'vendure_term_id', $value['id'], true);
        }

        $this->createdTaxonomies++;
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

        return $wpdb->get_var($query);
    }

    public function getParentTermId($vendureParentId)
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

            return $wpdb->get_var($query);
        }
    }

    public function syncCollectionParents($vendureId, $vendureParentId, $taxonomy)
    {
        $termId = $this->getTermIdByVendureId($vendureId);
        $parentId = $this->getParentTermId($vendureParentId);

        wp_update_term($termId, $taxonomy, ['parent' => $parentId]);
    }
}