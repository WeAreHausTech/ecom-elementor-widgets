<?php

namespace Haus\SyncData\Helpers;

use Haus\SyncData\Helpers\WpmlHelper;

class VendureHelper
{
    public $defaultLang = '';
    public $useWpml = false;

    public function __construct()
    {
        $wpmlHelper = new WpmlHelper();
        $this->useWpml = $wpmlHelper->hasWpml();
        $this->defaultLang = $wpmlHelper->getDefaultLanguage();
    }

    public function getAllProductsFromVendure()
    {
        $wpmlHelper = new WpmlHelper();
        $avalibleTranslations = $wpmlHelper->getAvalibleTranslations();

        $products = $this->getProductsByLang($this->defaultLang);
        $translations = [];

        foreach ($avalibleTranslations as $lang) {
            if ($lang === $this->defaultLang) {
                continue;
            }
            $translations[$lang] = $this->getProductsByLang($lang);
        }

        foreach ($translations as $lang => $translation) {
            foreach ($translation as $key => $value) {
                $products[$key]['translations'][$lang] = [
                    'productName' => $value['productName'],
                    'slug' => $value['slug'],
                ];
            }
        }

        return $products;
    }

    public function getProductsByLang($lang)
    {
        $products = (new \Haus\Queries\Product)->get($lang);

        if (!isset($products['data']['search']['items'])) {
            return [];
        }

        $items = $products['data']['search']['items'];

        $unique = $this->getFirstUniqueTranslation($items);

        return array_combine(array_column($unique, 'productId'), $unique);
    }

    public function getFirstUniqueTranslation($translations)
    {
        $seenProductIds = array();
        $products = [];

        foreach ($translations as $translation) {
            $productId = $translation['productId'];

            if (!in_array($productId, $seenProductIds)) {
                $seenProductIds[] = $productId;
                $products[] = $translation;
            }
        }

        return $products;
    }

    public function getCollectionsFromVendure()
    {
        $wpmlHelper = new WpmlHelper();
        $avalibleTranslations = $wpmlHelper->getAvalibleTranslations();
        $translations = [];
        $collections = $this->getVendureCollectionData($this->defaultLang);

        foreach ($avalibleTranslations as $lang) {
            if ($lang === $this->defaultLang) {
                continue;
            }
            $translations[$lang] = $this->getVendureCollectionData($lang);
        }
        //TO remove when vendure bug is fixed
        foreach ($collections as $coll) {
            if (!$coll['name']) {
                $collections[$coll['id']]['name'] = 'Saknar namn ' . rand();
                $collections[$coll['id']]['slug'] = 'saknar-namn-' . rand();
            }
        }

        foreach ($translations as $lang => $translation) {
            foreach ($translation as $key => $value) {

                $collections[$key]['translations'][$lang] = [
                    //TO remove custom name when vendure bug is fixed
                    "name" => $value['name'] ? $value['name'] : 'Missing name ' . rand(),
                    "slug" => $value['slug'] ? $value['slug'] . '-' . $lang : 'missing-name-' . rand() . '-' . $lang,
                ];
            }
        }
        return $collections;
    }

    public function getVendureCollectionData($lang, $data = [], $skip = 0, $take = 100)
    {
        $collections = (new \Haus\Queries\Collection)->get($lang, $skip, $take);

        if (!isset($collections['data']['collections']['items'])) {
            return [];
        }

        $items = $collections['data']['collections']['items'];
        $totalItems = $collections['data']['collections']['totalItems'];

        $data = array_merge($data, $items);

        if (count($data) === $totalItems) {
            return array_combine(array_column($data, 'id'), $data);
        } else {
            return $this->getVendureCollectionData($lang, $data, $skip + 100, $take);
        }
    }

    public function getfacets()
    {
        $wpmlHelper = new WpmlHelper();
        $avalibleTranslations = $wpmlHelper->getAvalibleTranslations();
        $translations = [];
        $facets = $this->getFacetsFromVendure($this->defaultLang);

        foreach ($avalibleTranslations as $lang) {
            if ($lang === $this->defaultLang) {
                continue;
            }
            $translations[$lang] = $this->getFacetsFromVendure($lang);
        }

        foreach ($translations as $lang => $translation) {
            foreach ($translation as $key => $facet) {
                foreach ($facet as $facetValues) {
                    $facets[$key][$facetValues['id']]['translations'][$lang] = [
                        "name" => $facetValues['name'],
                    ];
                }
            }
        }

        return $facets;
    }

    public function getFacetsFromVendure($lang)
    {
        $facets = (new \Haus\Queries\Facet)->get($lang);

        if (!isset($facets['data']['facets']['items'])) {
            return [];
        }

        $items = $facets['data']['facets']['items'];
        $sorted = [];

        foreach ($items as $facetType) {
            $sorted[$facetType['code']] = array_combine(array_column($facetType['values'], 'id'), $facetType['values']);
        }

        return $sorted;
    }
}