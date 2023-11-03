<?php
namespace Haus\Queries;

class Collection extends BaseQuery
{
    public function get($lang)
    {
        $this->query = <<<'GRAPHQL'
            query {
                collections {
                    items {
                    id
                    name
                    slug
                    parentId
                    }
                }
            }
        GRAPHQL;

        return $this->fetch($lang);
    }
}