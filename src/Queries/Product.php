<?php
namespace WeAreHausTech\Queries;

// For productsSync only

class Product extends BaseQuery
{
  public function get($lang, $skip = 0, $take = 100)
  {

    $options = "(options: {
            take: $take,
            skip: $skip
        })";

    $customFields = "
      customFields {
        productImg{
          source
        }
        backgroundImgPage{
          source
        }
        backgroundAnimationPage
        backgroundColor
      }
        ";

    $this->query =
      "query {
            products $options {
              items {
                id
                updatedAt
                name
                description
                slug
                facetValues {
                  id
                }
                collections{
                  id
                }
                $customFields
              }
              totalItems
            }
          }";

    return $this->fetch($lang);
  }
}
