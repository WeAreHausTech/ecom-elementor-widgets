import { graphql } from '../../../gql'

export const ADD_ITEM_TO_ORDER = graphql(/* GraphQL */ `
  mutation addItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ... on Order {
        lines {
          ...ListedOrderLines
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const ACTIVE_ORDER_LINE_FRAGMENT = graphql(/* GraphQL */ `
  fragment ListedOrderLines on OrderLine {
    id
    quantity
    featuredAsset {
      preview
    }
    productVariant {
      name
      price
      currencyCode
      product {
        slug
      }
    }
  }
`)

export const ACTIVE_ORDER_LINES = graphql(/* GraphQL */ `
  query ActiveOrderLines {
    activeOrder {
      lines {
        ...ListedOrderLines
      }
    }
  }
`)

export const TOTAL_PRICE_FRAGMENT = graphql(/* GraphQL */ `
  fragment ListedTotalPrice on Order {
    subTotal
    totalWithTax
    taxSummary {
      taxRate
      taxTotal
      taxBase
    }
    shipping
    currencyCode
  }
`)

export const ACTIVE_ORDER_TOTAL_PRICE = graphql(/* GraphQL */ `
  query ActiveOrderTotalPrice {
    activeOrder {
      ...ListedTotalPrice
    }
  }
`)

export const REMOVE_ORDER_LINE = graphql(/* GraphQL */ `
  mutation removeOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ... on Order {
        lines {
          ...ListedOrderLines
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)
