import { graphql } from '../../../gql'

export const LISTED_PRODUCT_FRAGMENT = graphql(/* GraphQL */ `
  fragment ListedProduct on SearchResult {
    productId
    productVariantId
    productName
    slug
    description
    score
    inStock
    productAsset {
      id
      preview
    }
    currencyCode
    price {
      ... on PriceRange {
        min
        max
      }
      ... on SinglePrice {
        value
      }
    }
    priceWithTax {
      ... on PriceRange {
        min
        max
      }
      ... on SinglePrice {
        value
      }
    }
    facetIds
    facetValueIds
    collectionIds
  }
`)

export const SEARCH = graphql(/* GraphQL */ `
  query search($input: SearchInput!) {
    search(input: $input) {
      totalItems
      items {
        ...ListedProduct
      }
      facetValues {
        facetValue {
          id
          name
          facet {
            id
            name
          }
        }
        count
      }
    }
  }
`)
