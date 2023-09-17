import { graphql } from '@/gql'

export const GET_ACTIVE_ORDER = graphql(/* GraphQL */ `
  query GetActiveOrder {
    activeOrder {
      ...OrderDetail
      lines {
        ...ListedOrderLines
      }
      ...OrderPriceData
    }
  }
`)

export const GET_ORDER_BY_CODE = graphql(/* GraphQL */ `
  query GetOrderByCode($code: String!) {
    orderByCode(code: $code) {
      ...OrderDetail
    }
  }
`)

export const SET_CUSTOMER_FOR_ORDER = graphql(/* GraphQL */ `
  mutation setCustomerForOrder($input: CreateCustomerInput!) {
    setCustomerForOrder(input: $input) {
      ...OrderDetail
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const SET_ORDER_SHIPPING_ADDRESS = graphql(/* GraphQL */ `
  mutation setOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ...OrderDetail
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const SET_ORDER_SHIPPING_METHOD = graphql(/* GraphQL */ `
  mutation setOrderShippingMethod($shippingMethodId: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
      ...OrderDetail
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const ADD_PAYMENT_TO_ORDER = graphql(/* GraphQL */ `
  mutation addPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ...OrderDetail
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const ADD_ITEM_TO_ORDER = graphql(/* GraphQL */ `
  mutation addItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ...OrderDetail
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const REMOVE_ORDER_LINE = graphql(/* GraphQL */ `
  mutation removeOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ...OrderDetail
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const ADJUST_ORDER_LINE = graphql(/* GraphQL */ `
  mutation adjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ...OrderDetail
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const LISTED_ORDER_LINES_FRAGMENT = graphql(/* GraphQL */ `
  fragment ListedOrderLines on OrderLine {
    id
    unitPriceWithTax
    linePriceWithTax
    quantity
    featuredAsset {
      id
      preview
    }
    productVariant {
      id
      name
      price
      priceWithTax
      currencyCode
      product {
        id
        slug
      }
    }
  }
`)

export const ORDER_PRICE_DATA_FRAGMENT = graphql(/* GraphQL */ `
  fragment OrderPriceData on Order {
    subTotal
    totalWithTax
    taxSummary {
      description
      taxRate
      taxTotal
      taxBase
    }
    shipping
    shippingWithTax
    currencyCode
  }
`)

export const ORDER_FRAGMENT = graphql(/* GraphQL */ `
  fragment OrderDetail on Order {
    __typename
    id
    code
    active
    createdAt
    state
    totalQuantity
    customer {
      id
      firstName
      lastName
      emailAddress
    }
    shippingAddress {
      fullName
      streetLine1
      streetLine2
      company
      city
      province
      postalCode
      countryCode
      phoneNumber
    }
    shippingLines {
      shippingMethod {
        id
        name
      }
      priceWithTax
    }
    lines {
      ...ListedOrderLines
    }
    payments {
      id
      state
      method
      amount
      metadata
    }
  }
`)
