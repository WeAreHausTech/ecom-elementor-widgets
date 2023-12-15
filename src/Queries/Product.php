<?php
namespace Haus\Queries;

// For productsSync only

class Product extends BaseQuery
{
    public function get($lang)
    {
        $this->query = <<<GRAPHQL
        query  {
            search (input: {take: 9999, groupByProduct: true}) {
                items {
                    productId
                    productName
                    slug
                    facetValueIds
                    collectionIds
                }
                totalItems
            }
        }
        GRAPHQL;

        return $this->fetch($lang);
    }
}
