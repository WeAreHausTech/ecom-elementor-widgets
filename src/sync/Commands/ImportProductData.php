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

        $facets = (new \Haus\Queries\Facet)->get();

        if (!isset($facets['data']['facets']['items'])) {
            WP_CLI::error('No facets found');
        }

        // sync taxonomies
        (new Taxonomies)->syncTaxonomies($facets);

        $vendureProducts = (new Products)->getAllProductsFromVendure();

        if (!isset($vendureProducts)) {
            WP_CLI::error('No products found in vendure');
        }

        $wpProducts = (new Products)->getAllProductsFromWp();

        // sync products
        (new Products)->syncProductsData($vendureProducts, $wpProducts);

        // add taxonomies to products
        (new Relations)->syncRelationships($vendureProducts);

        $productsSummary = sprintf(
            'Products: Created: %d Updated: %d Deleted: %d',
            (new Products)->created,
            (new Products)->updated,
            (new Products)->deleted
        );

        $taxonomiesSummary = sprintf(
            'Taxonomies: Created: %d Updated: %d Deleted: %d',
            (new Taxonomies)->created,
            (new Taxonomies)->updated,
            (new Taxonomies)->deleted
        );

        WP_CLI::success("\n" . $productsSummary . "\n" . $taxonomiesSummary);
    }
}

WP_CLI::add_command('sync-products', 'syncProductData');