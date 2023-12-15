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

class DeleteAllPosts extends WP_CLI_Command
{

    public function delete()
    {
        $taxonomiesInstance = new Taxonomies();
        $wpHelper = new WpHelper();

        global $wpdb;
        $query = $wpdb->prepare(
            "SELECT p.ID
             FROM {$wpdb->prefix}posts p
             WHERE p.post_type = 'produkter'"
        );

        $productsToDelete = $wpdb->get_results($query, ARRAY_A);

        if (empty($productsToDelete)) {
            return;
        }

        $productsToExclude = $wpHelper->getProductsToExclude();
        $filteredProductsToDelete = array_filter($productsToDelete, function ($product) use ($productsToExclude) {
            return !in_array(intval($product['ID']), $productsToExclude);
        });

        $productsInstance = new Products();
        foreach ($filteredProductsToDelete as $product) {
            $productsInstance->deleteProduct($product['ID']);
        }

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

WP_CLI::add_command('sync-products', 'deleteAllPosts');