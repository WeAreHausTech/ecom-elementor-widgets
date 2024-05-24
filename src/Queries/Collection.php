<?php
namespace WeAreHausTech\Queries;

class Collection extends BaseQuery
{
    public function get($rootCollection, $lang)
    {

        $config = require (HAUS_ECOM_PLUGIN_PATH . '/config.php');

        $customFields = $config['productSync']['collections']['customFieldsQuery'] ?? '';

        $options = "(input: {
            take: 9999" . (!empty($rootCollection) ? ",
            collectionId: $rootCollection" : '') . "
        })";


        $this->query =
            "query{
                search $options{
                    collections {
                        collection {
                          id
                        name
                        slug
                        parentId
                        updatedAt
                    $customFields
                        }
                    }
                }
            }";

        $collections = $this->fetch($lang);

        $filteredCollections = array_filter($collections['data']['search']['collections'], function ($collectionWrapper) use ($rootCollection) {
            if (empty ($rootCollection)) {
                return true;
            }

            return $collectionWrapper['collection']['id'] !== $rootCollection;
        });
        return $filteredCollections;
    }
}