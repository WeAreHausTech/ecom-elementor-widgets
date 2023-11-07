<?php

/*
 * WP-CLI Command
 * $ wp sync-products sync
 */

use Haus\SyncData\Classes\Products;
use Haus\SyncData\Classes\Taxonomies;
use Haus\SyncData\Classes\Relations;
use Haus\SyncData\Helpers\WpHelper;
use Haus\SyncData\Helpers\VendureHelper;

class SyncProductData extends WP_CLI_Command
{

    public function sync()
    {
        $taxonomiesInstance = new Taxonomies();
        $productsInstance = new Products();
        $wpHelper = new WpHelper();
        $VendureHelper = new VendureHelper();

        // sync taxonomies
        $taxonomiesInstance->syncTaxonomies();

        $vendureProducts = $VendureHelper->getAllProductsFromVendure();

        if (!isset($vendureProducts)) {
            WP_CLI::error('No products found in vendure');
        }

        $wpProducts = $wpHelper->getAllProductsFromWp();

        // sync products
        $productsInstance->syncProductsData($vendureProducts, $wpProducts);

        // // add taxonomies to products
        (new Relations)->syncRelationships($vendureProducts);

        $productsSummary = sprintf(
            'Products: Created: %d Updated: %d Deleted: %d',
            $productsInstance->created,
            $productsInstance->updated,
            $productsInstance->deleted
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