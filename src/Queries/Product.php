<?php
namespace Haus\Queries;

// For productsSync only

class Product extends BaseQuery
{
    public function get()
    {
        $this->query = <<<'GRAPHQL'
            query {
                products {
                    items {
                        id
                        name
                        slug
                        updatedAt
                    }
                }
            }
        GRAPHQL;

        return $this->fetch();
    }
}