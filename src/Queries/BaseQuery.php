<?php
namespace Haus\Queries;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;


class BaseQuery
{
  protected $query = '';

  function fetch()
  {
    try {
      $response = (new Client([
      'base_uri' => HAUS_ECOM_VENDURE_API_URL,
      'headers' => [
        'Content-Type' => 'application/json',
        ],
      'body' => json_encode([
          'query' => $this->query,
        ]),
      ]))->request('POST', 'shop-api');

      $statusCode = $response->getStatusCode();
      $responseBody = $response->getBody()->getContents();

      if ($statusCode === 200 && $responseBody) {
        return json_decode($responseBody, true);
      }
      return null;
    } catch (RequestException $e) {
      return null;
    } catch (GuzzleException $e) {
      return null;
    } catch (\Exception $e) {
      return null;
    }
  }
}