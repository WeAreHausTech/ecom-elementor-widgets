<?php
namespace Haus\Queries;

// For productsSync only

class Product extends BaseQuery
{
    public function get($skip)
    {

        $this->query = <<<GRAPHQL
            query {
                products  (options: {skip: $skip, sort: { id: ASC }}) {
                    items {
                        id
                        name
                        slug
                        updatedAt
                    }
                    totalItems
                }
          
            }
        GRAPHQL;

        return $this->fetch();
    }
}