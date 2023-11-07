<?php
namespace Haus\Queries;

class Collection extends BaseQuery
{
    public function get($lang, $skip, $take)
    {
        $options = "(options: {
            take: $take,
            skip: $skip
        })";

        $this->query = 
           "query{
                collections $options{
                    totalItems
                    items {
                    id
                    name
                    slug
                    parentId
                    }
                }
            }";

        return $this->fetch($lang);
    }
}