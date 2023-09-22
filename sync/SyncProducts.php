<?php

/*
 wp sync-products sync
*/


class syncProducts extends WP_CLI_Command
{

    private $created = 0;

    private $updated = 0;

    public function sync()
    {
        $products = $this->getAllProducts();

        if (!$products) {
            WP_CLI::error('No products found');
            return;
        }

        foreach ($products as $product) {
            $this->syncProduct($product);
        }

        WP_CLI::success('Created: ' . $this->created . ', updated: ' . $this->updated);
    }

    public function getAllProducts()
    {
        $products = (new \Haus\Queries\Product)->get();

        if (!isset($products['data']['products']['items'])) {
            return false;
        }
        return $products['data']['products']['items'];
    }

    public function syncProduct($product)
    {
        $id = $product['id'];

        global $wpdb;
        $exists = $wpdb->get_results("SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'vendure_id' AND meta_value LIKE '%$id%'", ARRAY_A);

        $existingId = empty($exists) ? false : $exists[0];

        if ($existingId) {
            $this->updateProduct($existingId, $product);
        } else {
            $this->createProduct($product);
        }
    }

    public function updateProduct($postId, $product)
    {
        global $wpdb;

        $titleInWp = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT post_title
                FROM $wpdb->posts
                WHERE ID = %d",
                $postId
            )
        );

        $slugInWp = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT meta_value
                FROM $wpdb->postmeta
                WHERE post_id = %d AND meta_key = 'vendure_slug'",
                $postId
            )
        );

        $updateName = $titleInWp !== $product['name'];
        $updateSlug = $slugInWp !== $product['slug'];

        if ($updateName) {

            // funkar inte ???

            $new = $product['name']; 
            wp_update_post (array(
                'ID'           => $postId,
                'post_title'   => $new, // new title
            ));            
        }

        if ($updateSlug) {
            update_post_meta($postId, 'vendure_slug', $product['slug']);
        }

        if ($updateName || $updateSlug) {
      

            $this->updated++;
        }
        // update_post_meta($postId, 'vendure_updatedAt', $product['updatedAt']);
    }

    public function createProduct($product)
    {
        $productPost = [
            'post_title' => $product['name'],
            'post_status' => 'publish',
            'post_type' => 'produkter',
            'meta_input' => [
                'vendure_id' => $product['id'],
                'vendure_slug' => $product['slug'],
                // 'vendure_updatedAt' => $product['updatedAt'],
            ]
        ];

        wp_insert_post($productPost);

        $this->created++;
    }
}


WP_CLI::add_command('sync-products', 'syncProducts');