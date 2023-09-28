<?php

/*
 wp sync-products sync
*/

class syncProducts extends WP_CLI_Command
{
    private $created = 0;
    private $updated = 0;
    private $deleted = 0;

    public function sync()
    {
        $vendureProducts = $this->getAllProductsFromVendure();

        $wpProducts = $this->getAllProductsFromWp();

        if (!$vendureProducts || count($vendureProducts) === 0) {
            return WP_CLI::error('No products found');
        }

        $this->syncProducts($vendureProducts, $wpProducts);

        WP_CLI::success('Updated: ' . $this->updated . ', Deleted: ' . $this->deleted . ', Created: ' . $this->created);
    }

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
            "SELECT p.ID as id, p.post_title, p.post_name, pm.meta_value as vendure_id
             FROM {$wpdb->prefix}posts p 
             LEFT JOIN  {$wpdb->prefix}postmeta pm
                ON p.ID = pm.post_id
                AND pm.meta_key = 'vendure_id'
             WHERE post_type ='produkter'"
        );

        $products = $wpdb->get_results($query, ARRAY_A);

        // Change array key to vendure_id from $wpProducts
        return array_combine(array_column($products, 'vendure_id'), $products);
    }


    public function syncProducts($vendureProducts, $wpProducts)
    {
        //Exists in WP, not in Vendure
        $delete = array_diff($wpProducts, $vendureProducts);

        array_walk($delete, function ($product) {
            $this->deleteProduct($product['id']);
        });

        //Exists in Vendure, not in WP
        $create = array_diff($vendureProducts, $wpProducts);

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
            $my_post = array(
                'ID' => $wpProduct['id'],
                'post_title' => $vendureProduct['productName'],
                'post_name' => $vendureProduct['slug'],
            );

            wp_update_post($my_post);

            $this->updated++;
        }
    }

    public function syncTaxonomies()
    {
        $facets = (new \Haus\Queries\Facet)->get();

        if (!$facets) {
            WP_CLI::error('No facets found');
            return;
        }

        $vendureBrands = $this->getFacetsFromVednureByType($facets, 'varumärke');
        $wpBrands = $this->getAllTermsFromWp('produkter-varumarken');
        $this->syncAttributes('produkter-varumarken', $vendureBrands, $wpBrands);

        $vendureCategories = $this->getFacetsFromVednureByType($facets, 'category');
        $wpTerms = $this->getAllTermsFromWp('produkter-kategorier');
        $this->syncAttributes('produkter-kategorier', $vendureCategories, $wpTerms);

        WP_CLI::success('syncTaxonomies success');
    }

    public function getFacetsFromVednureByType($facets, $facetType)
    {
        $values = $facets['data']['facets']['items'];
        $matchingValues = null;

        foreach ($values as $value) {
            if ($value['name'] === $facetType) {
                $matchingValues = $value;
                break;
            }
        }

        return array_combine(array_column($matchingValues['values'], 'id'), $matchingValues['values']);
    }

    public function getAllTermsFromWp($taxonomy)
    {
        global $wpdb;

        $table_name_posts = $wpdb->prefix . 'terms';
        $table_name_postmeta = $wpdb->prefix . 'termmeta';

        $query = $wpdb->prepare(
            "SELECT tt.term_id, t.name, t.slug, tm.meta_value as vendure_term_id
             FROM wp_term_taxonomy tt 
             LEFT JOIN $table_name_posts t ON tt.term_id = t.term_id 
             LEFT JOIN $table_name_postmeta tm ON tt.term_id = tm.term_id
             AND tm.meta_key = 'vendure_term_id'
             WHERE taxonomy = %s",
            $taxonomy
        );

        $terms = $wpdb->get_results($query, ARRAY_A);

        return array_combine(array_column($terms, 'vendure_term_id'), $terms);
    }

    public function syncAttributes($taxonomy, $vednureTerms, $wpTerms)
    {
        //Exists in WP, not in Vendure
        $delete = array_diff($wpTerms, $vednureTerms);

        array_walk($delete, function ($term) use ($taxonomy) {
            $this->deleteTerm($term['id'], $taxonomy);
        });

        //Exists in Vendure, not in WP
        $create = array_diff($vednureTerms, $wpTerms);

        array_walk($create, function ($term) use ($taxonomy) {
            $this->addNewTerm($term, $taxonomy);
        });

        //Exists in Vendure and in  WP 
        $update = array_intersect_key($vednureTerms, $wpTerms);

        foreach ($update as $vendureId => $vednureTerm) {
            $this->updateTerm($wpTerms[$vendureId], $vednureTerm, $taxonomy);

        }
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
}

WP_CLI::add_command('sync-products', 'syncProducts');