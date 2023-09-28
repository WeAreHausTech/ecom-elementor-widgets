<?php
namespace Haus\Queries;

// For productsSync only

class Product extends BaseQuery
{
    public function get()
    {

        $this->query = <<<GRAPHQL
        query  {
            search (input: {take: 9999}) {
                items {
                    productId
                    productName
                    slug
                    facetValueIds
                }
                totalItems
            }
      
        }
        GRAPHQL;

        return $this->fetch();
    }
}
