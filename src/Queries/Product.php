<?php
namespace Haus\Queries;

// For productsSync only

class Product extends BaseQuery
{
    public function get($languageCode)
    {

        $this->query = <<<GRAPHQL
        query  {
            search (input: {take: 9999}) {
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

        return $this->fetch($languageCode);
    }
}
