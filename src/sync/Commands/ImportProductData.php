<?php

/*
 wp sync-products sync
*/

use Haus\sync\Classes\Products;
use Haus\sync\Classes\Taxonomies;
use Haus\sync\Classes\Relations;

class syncProductData extends WP_CLI_Command
{
    public function sync()
    {
        $taxonomiesInstance = new Taxonomies();
        $prooductsInstance = new Products();

        $facets = (new \Haus\Queries\Facet)->get();

        if (!isset($facets['data']['facets']['items'])) {
            WP_CLI::error('No facets found');
        }

        // sync taxonomies
        $taxonomiesInstance->syncTaxonomies($facets);

        $vendureProducts = $prooductsInstance->getAllProductsFromVendure();

        if (!isset($vendureProducts)) {
            WP_CLI::error('No products found in vendure');
        }

        $wpProducts = $prooductsInstance->getAllProductsFromWp();

        // sync products
        $prooductsInstance->syncProductsData($vendureProducts, $wpProducts);

        // add taxonomies to products
        (new Relations)->syncRelationships($vendureProducts);

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
}

WP_CLI::add_command('sync-products', 'syncProductData');