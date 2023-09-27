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

        if (!$vendureProducts) {
            WP_CLI::error('No products found');
            return;
        }

        $this->syncProducts($vendureProducts, $wpProducts);

        WP_CLI::success(', updated: ' . $this->updated . ' deleted: ' . $this->deleted . ', created: ' . $this->created);
    }

    public function getAllProductsFromVendure($allProducts = [], int $skipCount = 0)
    {

        $products = (new \Haus\Queries\Product)->get($skipCount);

        if (!isset($products['data']['products']['items'])) {
            return $allProducts;
        }

        $data = $products['data']['products'];
        $allProducts = array_merge($allProducts, $data['items']);

        if (count($allProducts) < $data['totalItems']) {
            $skip = $skipCount + count($data['items']);
            return $this->getAllProductsFromVendure($allProducts, $skip);
        }

        return $allProducts;
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
                if ($wpProduct['vendure_id'] === $vendureProduct['id']) {
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

                if ($vendureProduct['id'] === $wpProduct['vendure_id']) {
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
        $updateName = $wpProduct['post_title'] !== $vendureProduct['name'];
        $updateSlug = $wpProduct['post_name'] !== $vendureProduct['slug'];

        if ($updateName || $updateSlug) {
            $my_post = array(
                'ID' => $wpProduct['id'],
                'post_title' => $vendureProduct['name'],
                'post_name' => $vendureProduct['slug'],
            );

            wp_insert_post($my_post);

            $this->updated++;
        }
    }

    public function createProduct($product)
    {
        $productPost = [
            'post_title' => $product['name'],
            'post_status' => 'publish',
            'post_type' => 'produkter',
            'post_name' => $product['slug'],
            'meta_input' => [
                'vendure_id' => $product['id'],
            ]
        ];

        wp_insert_post($productPost);

        $this->created++;
    }

    public function syncTaxonomies()
    {

        $facets = (new \Haus\Queries\Facet)->get();

        if (!$facets) {
            WP_CLI::error('No facets found');
            return;
        }

        $categories = $this->getfacets($facets, 'category');
        $brands = $this->getfacets($facets, 'brand');

        $this->syncAttributes('produkter-kategorier', $categories);


        WP_CLI::success('syncTaxonomies success');
    }

    public function syncAttributes($taxonomy, $data)
    {
        global $wpdb;

        foreach ($data['values'] as $value) {
            $term_name = $value['name'];

            $existing_term = $wpdb->get_row(
                $wpdb->prepare("SELECT * FROM {$wpdb->terms} WHERE name = %s", $term_name)
            );

            if ($existing_term) {
                continue;
            }

            $this->addNewTerm($term_name, $taxonomy);
        }

        //TODO DELETE IF NOT EXISTS
    }

    public function addNewTerm($term_name, $taxonomy)
    {
        global $wpdb;

        $wpdb->insert(
            $wpdb->terms,
            array(
                'name' => $term_name,
                'slug' => sanitize_title($term_name),
                'term_group' => 0,
            ),
            array('%s', '%s', '%d')
        );

        $term_id = $wpdb->insert_id;

        $wpdb->insert(
            $wpdb->term_taxonomy,
            array(
                'term_id' => $term_id,
                'taxonomy' => $taxonomy,
                'description' => '',
                'parent' => 0,
                'count' => 0,
            ),
            array('%d', '%s', '%s', '%d', '%d')
        );
    }

    public function getfacets($facets, $facetType)
    {
        $values = $facets['data']['facets']['items'];

        foreach ($values as $value) {
            if ($value['name'] === $facetType) {
                return $value;
            }
        }
        return null;
    }
}

WP_CLI::add_command('sync-products', 'syncProducts');