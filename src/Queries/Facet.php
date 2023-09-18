<?php
namespace Haus\Queries;

class Facet extends BaseQuery
{
  public function get()
  {

    $this->query = <<<'GRAPHQL'
      query {
          facets {
              items {
                id
                name
                values{
                  id
                  name
                }
              }
          }
      }
    GRAPHQL;

    $data = $this->fetch();

    return $data;
  }
}