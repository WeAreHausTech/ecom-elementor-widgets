<?php
namespace WeAreHausTech\Queries;

class CollectionQuery extends BaseQuery
{
    public function get($lang, $skip, $take)
    {

        $config = require(HAUS_ECOM_PLUGIN_PATH . '/config.php');

        $customFields = $config['productSync']['collections']['customFieldsQuery'] ?? '';


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
                    updatedAt
                    $customFields
                    }
                }
            }";

        return $this->fetch($lang);
    }
}