<?php

/*
 * WP-CLI Command
 * $ wp sync-products sync
 */

use Haus\SyncData\Classes\Products;
use Haus\SyncData\Classes\Taxonomies;
use Haus\SyncData\Classes\Relations;

class SyncProductData extends WP_CLI_Command
{

    public function sync()
    {
        $taxonomiesInstance = new Taxonomies();
        $prooductsInstance = new Products();

        $avalibleTranslations = $this->getAvalibleTranslations();

        // $defaultLanguage = apply_filters('wpml_default_language', null);

        // $facets = (new \Haus\Queries\Facet)->get();

        // if (!isset($facets['data']['facets']['items'])) {
        //     WP_CLI::error('No facets found');
        // }

        // sync taxonomies
        // $taxonomiesInstance->syncTaxonomies($facets);

        $vendureProducts = $prooductsInstance->getAllProductsFromVendure($avalibleTranslations);


        if (!isset($vendureProducts)) {
            WP_CLI::error('No products found in vendure');
        }

        $wpProducts = $prooductsInstance->getAllProductsFromWp($avalibleTranslations);

        // sync products
        $prooductsInstance->syncProductsData($vendureProducts, $wpProducts);

        // // add taxonomies to products
        // (new Relations)->syncRelationships($vendureProducts);

        $productsSummary = sprintf(
            'Products: Created: %d Updated: %d Deleted: %d',
            $prooductsInstance->created,
            $prooductsInstance->updated,
            $prooductsInstance->deleted
        );

        $taxonomiesSummary = sprintf(
            'Taxonomies: Created: %d Updated: %d Deleted: %d',
            $taxonomiesInstance->createdTaxonomies,
            $taxonomiesInstance->updatedTaxonimies,
            $taxonomiesInstance->deletedTaxonomies
        );


        WP_CLI::success("\n" . $productsSummary . "\n" . $taxonomiesSummary);
    }

    public function getAvalibleTranslations()
    {
        $wpmlLanguages = apply_filters('wpml_active_languages', null, 'skip_missing=0');

        if (!isset($wpmlLanguages)) {
           return [];
        }

        foreach ($wpmlLanguages as $lang) {
            $avalibleTranslations[] = $lang['code'];
        }

        return $avalibleTranslations;
    }
}

WP_CLI::add_command('sync-products', 'syncProductData');