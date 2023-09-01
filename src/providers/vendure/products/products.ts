import { graphql } from '../../../gql'

export const LISTED_PRODUCT_FRAGMENT = graphql(/* GraphQL */ `
  fragment ListedProduct on SearchResult {
    productId
    productName
    slug
    productAsset {
      id
      preview
    }
    currencyCode
    priceWithTax {
      ... on PriceRange {
        min
        max
      }
      ... on SinglePrice {
        value
      }
    }
  }
`)

export const SEARCH_PRODUCTS = graphql(/* GraphQL */ `
  query SearchProducts($input: SearchInput!) {
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
