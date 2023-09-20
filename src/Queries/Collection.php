<?php
namespace Haus\Queries;

class Collection extends BaseQuery
{
    public function get()
    {

        $this->query = <<<'GRAPHQL'
      query {
          collections {
            items {
              id
              name
            }
          }
      }
    GRAPHQL;


        return $this->fetch();
    }
}