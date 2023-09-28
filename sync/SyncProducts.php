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

        // $this->syncProducts($vendureProducts, $wpProducts);

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

    public function syncTaxonomies()
    {

        $facets = (new \Haus\Queries\Facet)->get();

        if (!$facets) {
            WP_CLI::error('No facets found');
            return;
        }

        $vendureBrands = $this->getfacets($facets, 'varumärke');
        $wpBrands = $this->getAllTermsFromWp('produkter-varumarken');

        $this->syncAttributes('produkter-varumarken', $vendureBrands, $wpBrands);

        // $vendureCategories = $this->getfacets($facets, 'category');
        // $wpTerms = $this->getAllTermsFromWp('produkter-kategorier');
        // $this->syncAttributes('produkter-kategorier', $vendureCategories, $wpTerms);

        WP_CLI::success('syncTaxonomies success');
    }

    public function syncAttributes($taxonomy, $vednureTerms, $wpTerms)
    {

        if (!$wpTerms) {
            // foreach ($vednureTerms['values'] as $vednureTerm) {
            //     $this->addNewTerm($vednureTerm, $taxonomy);
            // }
        }

        foreach ($wpTerms as $wpTerm) {
            $foundInVendure = false;

            if (!isset($wpTerm['vendure_term_id'])) {
                $this->deleteTerm($wpTerm['id'], $taxonomy);
                continue;
            }

            foreach ($vednureTerms['values'] as $vednureTerm) {
                if ($wpTerm['vendure_term_id'] === $vednureTerm['id']) {
                    $foundInVendure = true;
                    $this->updateTerm($wpTerm, $vednureTerm, $taxonomy);
                    break;
                }
            }

            if (!$foundInVendure) {
                $this->deleteTerm($wpTerm['id'], $taxonomy);
            }
        }

        foreach ($vednureTerms['values'] as $vednureTerm) {
            $foundInWordPress = false;

            foreach ($wpTerms as $wpTerm) {
                if (!isset($wpTerm['vendure_term_id'])) {
                    return;
                }

                if ($vednureTerm['id'] === $wpTerm['vendure_term_id']) {
                    $foundInWordPress = true;
                    break;
                }
            }

            if (!$foundInWordPress) {
                $this->addNewTerm($vednureTerm, $taxonomy);
            }
        }
    }

    public function getAllTermsFromWp($taxonomy)
    {
        global $wpdb;

        $table_name_posts = $wpdb->prefix . 'terms';
        $table_name_postmeta = $wpdb->prefix . 'termmeta';

        $query = $wpdb->prepare(
            "SELECT tt.term_id, t.name, t.slug, tm.meta_key, tm.meta_value
             FROM wp_term_taxonomy tt
             LEFT JOIN $table_name_posts t ON tt.term_id = t.term_id
             LEFT JOIN $table_name_postmeta tm ON tt.term_id = tm.term_id
             WHERE taxonomy = %s",
            $taxonomy
        );

        $terms = $wpdb->get_results($query, ARRAY_A);
        $termData = [];

        foreach ($terms as $term) {
            $termId = $term['term_id'];

            if (!isset($productsData[$termId])) {
                $termData[$termId] = array(
                    'id' => $termId,
                    'name' => $term['name'],
                    'slug' => $term['slug'],
                );
            }

            $termData[$termId][$term['meta_key']] = $term['meta_value'];
        }

        return $termData;
    }


    public function updateTerm($wpTerm, $vednureTerm, $taxonomy)
    {
        $updateName = wp_specialchars_decode($wpTerm['name']) !== $vednureTerm['name'];
        $updateSlug = $wpTerm['slug'] !== $vednureTerm['code'];

        if ($updateName || $updateSlug) {
            $args = array(
                'name' => $vednureTerm['name'],
                'slug' => $vednureTerm['code'],
            );

            wp_update_term($wpTerm['id'], $taxonomy, $args);
        }
    }

    public function deleteTerm($id, $taxonomy)
    {
        wp_delete_term($id, $taxonomy);
    }

    public function addNewTerm($value, $taxonomy)
    {
        $term = wp_insert_term($value['name'], $taxonomy, ['slug' => $value['code']]);

        if ($term['term_id']) {
            add_term_meta($term['term_id'], 'vendure_term_id', $value['id'], true);
        }

        $this->created++;
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