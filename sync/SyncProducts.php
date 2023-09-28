<?php

/*
 wp sync-products sync
*/

class syncProducts extends WP_CLI_Command
{
    private $created = 0;
    private $updated = 0;
    private $total = 0;
    private $deleted = 0;

    public function sync()
    {
        $vendureProducts = $this->getAllProductsFromVendure();

        $wpProducts = $this->getAllProductsFromWp();

        if (!$vendureProducts || count($vendureProducts) === 0) {
            WP_CLI::error('No products found');
            return;
        }

        $this->syncProducts($vendureProducts, $wpProducts);

        WP_CLI::success(', updated: ' . $this->updated . ' deleted: ' . $this->deleted . ', created: ' . $this->created);
    }

    public function getAllProductsFromVendure($allProducts = [])
    {

        $products = (new \Haus\Queries\Product)->get();
        if (!isset($products['data']['search']['items'])) {
            return $allProducts;
        }

        return $products['data']['search']['items'];
    }

    public function getAllProductsFromWp()
    {
        global $wpdb;

        $table_name_posts = $wpdb->prefix . 'posts';
        $table_name_postmeta = $wpdb->prefix . 'postmeta';
        $post_type = 'produkter';

        $query = $wpdb->prepare(
            "SELECT p.ID, p.post_title, p.post_name, pm.meta_key, pm.meta_value
             FROM $table_name_posts p 
             LEFT JOIN $table_name_postmeta pm ON p.ID = pm.post_id
             WHERE post_type = %s",
            $post_type
        );

        $products = $wpdb->get_results($query, ARRAY_A);
        $productsData = [];

        foreach ($products as $product) {
            $productId = $product['ID'];

            if (!isset($productsData[$productId])) {
                $productsData[$productId] = array(
                    'id' => $productId,
                    'post_title' => $product['post_title'],
                    'post_name' => $product['post_name'],
                );
            }

            $productsData[$productId][$product['meta_key']] = $product['meta_value'];
        }

        return $productsData;
    }


    public function syncProducts($vendureProducts, $wpProducts)
    {
        foreach ($wpProducts as $wpProduct) {
            $foundInVendure = false;

            if (!isset($wpProduct['vendure_id'])) {
                $this->deleteProduct($wpProduct['id']);
                continue;
            }

            foreach ($vendureProducts as $vendureProduct) {
                if ($wpProduct['vendure_id'] === $vendureProduct['productId']) {
                    $foundInVendure = true;
                    $this->updateProduct($wpProduct, $vendureProduct);
                    break;
                }
            }

            if (!$foundInVendure) {
                $this->deleteProduct($wpProduct['id']);
            }
        }

        foreach ($vendureProducts as $vendureProduct) {
            $foundInWordPress = false;

            foreach ($wpProducts as $wpProduct) {
                if (!isset($wpProduct['vendure_id'])) {
                    return;
                }

                if ($vendureProduct['productId'] === $wpProduct['vendure_id']) {
                    $foundInWordPress = true;
                    break;
                }
            }

            if (!$foundInWordPress) {
                $this->createProduct($vendureProduct);
            }
        }
    }

    public function deleteProduct($postId)
    {
        global $wpdb;
        $wpdb->query(
            $wpdb->prepare("DELETE FROM $wpdb->posts WHERE ID = %d", $postId)
        );

        $wpdb->query(
            $wpdb->prepare("DELETE FROM $wpdb->postmeta WHERE post_id = %d", $postId)
        );

        $this->deleted++;
    }

    public function updateProduct($wpProduct, $vendureProduct)
    {
        $updateName = $wpProduct['post_title'] !== $vendureProduct['productName'];
        $updateSlug = $wpProduct['post_name'] !== $vendureProduct['slug'];

        if ($updateName || $updateSlug) {
            $my_post = array(
                'ID' => $wpProduct['id'],
                'post_title' => $vendureProduct['productName'],
                'post_name' => $vendureProduct['slug'],
            );

            wp_insert_post($my_post);

            $this->updated++;
        }
    }

    public function createProduct($product)
    {
        $productPost = [
            'post_title' => $product['productName'],
            'post_status' => 'publish',
            'post_type' => 'produkter',
            'post_name' => $product['slug'],
            'meta_input' => [
                'vendure_id' => $product['productId'],
            ]
        ];

        wp_insert_post($productPost);

        $this->created++;
    }
}

WP_CLI::add_command('sync-products', 'syncProducts');