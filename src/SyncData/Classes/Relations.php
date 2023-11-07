<?php

namespace Haus\SyncData\Classes;

class Relations
{
    public function syncRelationships($vendureProducts)
    {
        $products = $this->getProductIds();
        $facets = $this->getFacetids();
        $collections = $this->getCollectionids();

        foreach ($vendureProducts as $vendureId => $vendureProduct) {
            $wpProduct = $products[$vendureId];
            $this->assignFacetValues($wpProduct, $vendureProduct['facetValueIds'], $facets);
            $this->assignCollectionValues($wpProduct, $vendureProduct['collectionIds'], $collections);
        }
    }

    public function getProductIds()
    {
        global $wpdb;

        $query = $wpdb->prepare(
            "SELECT p.ID, pm.meta_value as vendure_id, t.language_code as lang
            FROM {$wpdb->prefix}posts p 
            LEFT JOIN {$wpdb->prefix}postmeta pm
                ON p.ID = pm.post_id
                AND pm.meta_key = 'vendure_id'
            LEFT JOIN {$wpdb->prefix}icl_translations t
            ON p.ID = t.element_id
            AND t.element_type = 'post_produkter'
            WHERE post_type ='produkter'"
        );


        $productData = $wpdb->get_results($query, ARRAY_A);

        return $this->combineVendureIds($productData);
    }

    public function getFacetids()
    {
        global $wpdb;

        $termmeta = $wpdb->prefix . 'termmeta';

        $query = $wpdb->prepare(
            "SELECT tt.term_id as ID, tt.taxonomy as taxonomy, tm.meta_value as vendure_id, tr.language_code as lang
             FROM {$wpdb->prefix}term_taxonomy tt 
             LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
             AND tm.meta_key = 'vendure_term_id'
             LEFT JOIN {$wpdb->prefix}icl_translations tr 
             ON tt.term_taxonomy_id = tr.element_id
             WHERE taxonomy IN ('produkter-varumarken', 'produkter-avdelningar')",

        );

        $termsData = $wpdb->get_results($query, ARRAY_A);

        return $this->combineVendureIds($termsData);
    }

    public function getCollectionids()
    {
        global $wpdb;

        $termmeta = $wpdb->prefix . 'termmeta';

        $query = $wpdb->prepare(
            "SELECT tt.term_id as ID, tt.taxonomy, tm.meta_value as vendure_id, tr.language_code as lang
             FROM {$wpdb->prefix}term_taxonomy tt 
             LEFT JOIN $termmeta tm ON tt.term_id = tm.term_id
             AND tm.meta_key = 'vendure_collection_id'
             LEFT JOIN {$wpdb->prefix}icl_translations tr 
             ON tt.term_taxonomy_id = tr.element_id
             WHERE taxonomy IN ('produkter-kategorier')",
        );

        $termsData = $wpdb->get_results($query, ARRAY_A);
        return $this->combineVendureIds($termsData);
    }

    public function combineVendureIds($incomingData)
    {
        $seen = [];
        $returnData = [];

        foreach ($incomingData as $data) {
            $id = $data['vendure_id'];

            if (!in_array($id, $seen)) {
                $seen[] = $id;
                $returnData[$id] = [
                    'vendure_id' => $id,
                    'taxonomy' => isset($data['taxonomy']) ? $data['taxonomy'] : null,
                    'ids' => [
                        $data['lang'] => $data['ID']
                    ]
                ];
            } else {
                $returnData[$id]['ids'][$data['lang']] = $data['ID'];
            }
        }
        return $returnData;
    }


    public function assignCollectionValues($wpProduct, $collectionIds, $collections)
    {
        $collectionsData = array();
        foreach ($collectionIds as $collectionValueId) {
            if (!isset($collections[$collectionValueId])) {
                continue;
            }

            foreach ($wpProduct['ids'] as $lang => $wpProductId) {
                if (!isset($collections[$collectionValueId]["ids"][$lang])) {
                    continue;
                }

                $collectionsData[$wpProductId][] = (int) $collections[$collectionValueId]["ids"][$lang];
            }
        }

        foreach ($collectionsData as $wpProductId => $collectionData) {
            wp_set_object_terms($wpProductId, $collectionData, 'produkter-kategorier');
        }
    }

    public function assignFacetValues($wpProduct, $facetValuesIds, $facets)
    {
        foreach ($facetValuesIds as $facetValueId) {
            if (!isset($facets[$facetValueId])) {
                continue;
            }

            foreach ($wpProduct['ids'] as $lang => $wpProductId) {
                if (!isset($facets[$facetValueId]["ids"][$lang])) {
                    continue;
                }
                $wpTermId = $facets[$facetValueId]["ids"][$lang];
                $taxonomy = $facets[$facetValueId]["taxonomy"];

                wp_set_object_terms($wpProductId, (int) $wpTermId, $taxonomy);
            }
        }
    }

}