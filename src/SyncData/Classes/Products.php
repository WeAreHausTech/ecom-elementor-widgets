<?php
namespace Haus\SyncData\Classes;

class Products
{
    public $created = 0;
    public $updated = 0;
    public $deleted = 0;
    public function getAllProductsFromVendure()
    {
        $products = (new \Haus\Queries\Product)->get();

        if (!isset($products['data']['search']['items'])) {
            return [];
        }

        $items = $products['data']['search']['items'];

        return array_combine(array_column($items, 'productId'), $items);
    }

    public function getAllProductsFromWp()
    {
        global $wpdb;

        $query = $wpdb->prepare(
            "SELECT p.ID as id, p.post_title, p.post_name, pm.meta_value as vendure_id, pm2.meta_value as exclude_from_sync
             FROM {$wpdb->prefix}posts p 
             LEFT JOIN  {$wpdb->prefix}postmeta pm
                ON p.ID = pm.post_id
                AND pm.meta_key = 'vendure_id'
            LEFT JOIN {$wpdb->prefix}postmeta pm2
                ON p.ID = pm2.post_id
                AND pm2.meta_key = 'exclude_from_sync'
             WHERE post_type ='produkter'"
        );

        $products = $wpdb->get_results($query, ARRAY_A);

        // Change array key to vendure_id from $wpProducts
        return array_combine(array_column($products, 'vendure_id'), $products);
    }
    public function syncProductsData($vendureProducts, $wpProducts)
    {
        //Exists in WP, not in Vendure
        $delete = array_diff_key($wpProducts, $vendureProducts);

        array_walk($delete, function ($product) {

            $shouldBeExcluded = "1";
            if ($product['exclude_from_sync'] === $shouldBeExcluded){
                return;
            }

            $this->deleteProduct($product['id']);
        });

        //Exists in Vendure, not in WP
        $create = array_diff_key($vendureProducts, $wpProducts);

        array_walk($create, function ($product) {
            $this->createProduct($product);
        });

        //Exists in Vendure and in  WP
        $update = array_intersect_key($vendureProducts, $wpProducts);

        foreach ($update as $vendureId => $vendureProduct) {
            $this->updateProduct($wpProducts[$vendureId], $vendureProduct);
        }

    }

    public function createProduct($product)
    {
        wp_insert_post([
            'post_title' => $product['productName'],
            'post_status' => 'publish',
            'post_type' => 'produkter',
            'post_name' => $product['slug'],
            'meta_input' => [
                'vendure_id' => $product['productId'],
            ]
        ]);

        $this->created++;
    }

    public function deleteProduct($postId)
    {
        wp_delete_post($postId, true);
        $this->deleted++;
    }

    public function updateProduct($wpProduct, $vendureProduct)
    {
        $updateName = wp_specialchars_decode($wpProduct['post_title']) !== $vendureProduct['productName'];
        $updateSlug = $wpProduct['post_name'] !== $vendureProduct['slug'];

        if ($updateName || $updateSlug) {
            wp_update_post([
                'ID' => $wpProduct['id'],
                'post_title' => $vendureProduct['productName'],
                'post_name' => $vendureProduct['slug'],
            ]);

            $this->updated++;
        }
    }
}