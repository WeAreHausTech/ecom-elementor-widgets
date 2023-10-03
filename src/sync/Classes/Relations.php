<?php
namespace Haus\sync\Classes;

class Relations
{

    public function syncRelationships($vendureProducts)
    {
        $products = $this->getProductIds();
        $facets = $this->getFacetids();
        $collections = $this->getCollectionids();

        foreach ($vendureProducts as $vendureId => $vendureProduct) {
            $wpProductId = $products[$vendureId];
            $this->assignFacetValues($wpProductId, $vendureProduct['facetValueIds'], $facets);
            $this->assignCollectiontValues($wpProductId, $vendureProduct['collectionIds'], $collections);
        }
    }

    public function getProductIds()
    {
        global $wpdb;

        $query = $wpdb->prepare(
            "SELECT p.ID, pm.meta_value as vendure_id
            FROM {$wpdb->prefix}posts p 
            LEFT JOIN {$wpdb->prefix}postmeta pm
                ON p.ID = pm.post_id
                AND pm.meta_key = 'vendure_id'
            WHERE post_type ='produkter'"
        );

        $products = $wpdb->get_results($query, ARRAY_A);

        return array_combine(array_column($products, 'vendure_id'), array_column($products, 'ID'));
    }

    public function getFacetids()
    {
        global $wpdb;

        $termmeta = $wpdb->prefix . 'termmeta';

        $query = $wpdb->prepare(
            "SELECT tt.term_id, tt.taxonomy, tm.meta_value as vendure_term_id
             FROM {$wpdb->prefix}term_taxonomy tt 
             LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
             AND tm.meta_key = 'vendure_term_id'
             WHERE taxonomy IN ('produkter-varumarken', 'produkter-avdelningar')",
        );

        $termsData = $wpdb->get_results($query, ARRAY_A);

        return array_combine(array_column($termsData, 'vendure_term_id'), $termsData);
    }

    public function getCollectionids()
    {
        global $wpdb;

        $termmeta = $wpdb->prefix . 'termmeta';

        $query = $wpdb->prepare(
            "SELECT tt.term_id, tt.taxonomy, tm.meta_value as vendure_term_id
             FROM {$wpdb->prefix}term_taxonomy tt 
             LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
             AND tm.meta_key = 'vendure_collection_id'
             WHERE taxonomy IN ('produkter-kategorier')",
        );

        $termsData = $wpdb->get_results($query, ARRAY_A);

        return array_combine(array_column($termsData, 'vendure_term_id'), array_column($termsData, 'term_id'));
    }


    public function assignCollectiontValues($wpProductId, $collectionIds, $collections)
    {
        $collectionsData = array();
        foreach ($collectionIds as $collectionValueId) {
            if (!isset($collections[$collectionValueId])) {
                continue;
            }

            $collectionsData[] = (int) $collections[$collectionValueId];
        }

        wp_set_object_terms($wpProductId, $collectionsData, 'produkter-kategorier');
    }

    public function assignFacetValues($wpProductId, $facetValuesIds, $facets)
    {
        foreach ($facetValuesIds as $facetValueId) {
            if (!isset($facets[$facetValueId])) {
                continue;
            }

            $wpTerm = $facets[$facetValueId];
            wp_set_object_terms($wpProductId, (int) $wpTerm['term_id'], $wpTerm['taxonomy']);
        }
    }

}