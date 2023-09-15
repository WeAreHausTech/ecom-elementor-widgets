<?php

namespace Haus\Widgets;

use Elementor\Widget_Base;
use GuzzleHttp\Client;

class ProductList extends Widget_Base {

	public function get_name() {
		return 'Product List';
	}

	public function get_title() {
		return esc_html__( 'Product List', 'haus-ecom-widgets' );
	}

	public function get_icon() {
		return 'eicon-code';
	}

	public function get_categories() {
		return [ 'basic' ];
	}

	public function get_keywords() {
		return [ 'hello', 'world' ];
	}

	protected function render() {

        $callStartTime = microtime(true);

        $endPoint = 'https://livv-ecom-test.azurewebsites.net/';

        $query = <<<'GRAPHQL'
        query {
          collections(options: { take: 5 }) {
            items {
              id
              name
            }
          }
        }
        GRAPHQL;

        $response = (new Client([
            'base_uri' => $endPoint,
            'headers' => [
                    'Content-Type' => 'application/json',
                ],
            'body' => json_encode([
                'query' => $query,
            ]),
        ]))->request('POST', 'shop-api');

        echo '<pre>';
        var_dump(json_decode($response->getBody()->getContents(), true));
        echo '</pre>';

        var_dump((microtime(true) - $callStartTime) * 1000);

		?>
		    <p> Haus Tech &gt; Haus Webb </p>
		<?php
	}
}