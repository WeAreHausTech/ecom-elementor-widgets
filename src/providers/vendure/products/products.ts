import { graphql } from '../../../gql'

export const LISTED_PRODUCT_FRAGMENT = graphql(/* GraphQL */ `
  fragment ListedProduct on SearchResult {
    sku
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

export const LISTED_COLLECTION_FRAGMENT = graphql(/* GraphQL */ `
  fragment ListedCollection on Collection {
    id
    name
    slug
    parentId
    parent {
      id
      name
      slug
    }
    productVariants {
      totalItems
    }
    featuredAsset {
      id
      preview
    }
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
      collections {
        collection {
          ...ListedCollection
        }
        count
      }
    }
  }
`)

export const TOPSEARCH = graphql(/* GraphQL */ `
  query topSearch($input: SearchInput!) {
    search(input: $input) {
      totalItems
      items {
        ...ListedProduct
      }
      collections {
        collection {
          ...ListedCollection
        }
        count
      }
    }
  }
`)

export const PRODUCT = graphql(/* GraphQL */ `
  query product($slug: String, $id: ID) {
    product(slug: $slug, id: $id) {
      ...DetailedProduct
    }
  }
`)

export const DETAILED_PRODUCT = graphql(/* GraphQL */ `
  fragment DetailedProduct on Product {
    id
    name
    description
    collections {
      id
      slug
      name
      breadcrumbs {
        id
        name
        slug
      }
    }
    facetValues {
      facet {
        id
        code
        name
      }
      id
      code
      name
    }
    featuredAsset {
      id
      preview
    }
    assets {
      id
      preview
    }
    variants {
      ...DetailedProductVariant
    }
  }
`)

export const DETAILED_PRODUCT_VARIANT = graphql(/* GraphQL */ `
  fragment DetailedProductVariant on ProductVariant {
    id
    name
    price
    priceWithTax
    currencyCode
    sku
    stockLevel
    featuredAsset {
      id
      preview
    }
    assets {
      id
      preview
    }
  }
`)
