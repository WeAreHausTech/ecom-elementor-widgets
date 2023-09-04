/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment ListedProduct on SearchResult {\n    productId\n    productName\n    slug\n    description\n    score\n    productAsset {\n      id\n      preview\n    }\n    currencyCode\n    price {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n    priceWithTax {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n  }\n": types.ListedProductFragmentDoc,
    "\n  query search($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        ...ListedProduct\n      }\n      facetValues {\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n        count\n      }\n    }\n  }\n": types.SearchDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListedProduct on SearchResult {\n    productId\n    productName\n    slug\n    description\n    score\n    productAsset {\n      id\n      preview\n    }\n    currencyCode\n    price {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n    priceWithTax {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ListedProduct on SearchResult {\n    productId\n    productName\n    slug\n    description\n    score\n    productAsset {\n      id\n      preview\n    }\n    currencyCode\n    price {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n    priceWithTax {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query search($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        ...ListedProduct\n      }\n      facetValues {\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n        count\n      }\n    }\n  }\n"): (typeof documents)["\n  query search($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        ...ListedProduct\n      }\n      facetValues {\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n        count\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;