<?php
namespace Haus\Queries;

use GuzzleHttp\Client;

class BaseQuery
{
  protected $query = '';

  protected $endPoint = 'https://livv-ecom-test.azurewebsites.net/';

  function fetch()
  {
    $response = (new Client([
    'base_uri' => $this->endPoint,
    'headers' => [
      'Content-Type' => 'application/json',
      ],
    'body' => json_encode([
        'query' => $this->query,
      ]),
    ]))->request('POST', 'shop-api');

    return json_decode($response->getBody()->getContents(), true);
  }
}