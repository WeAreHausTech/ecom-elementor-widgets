import { graphql } from '@/gql'

export const ORDER_ADDRESS_FRAGMNENT = graphql(/* GraphQL */ `
  fragment ListedOrderAdressOrder on OrderAddress {
    fullName
    company
    streetLine1
    streetLine2
    city
    province
    postalCode
    country
    countryCode
    phoneNumber
  }
`)

export const UPDATE_BILLING_ADDRESS = graphql(/* GraphQL */ `
  mutation setOrderBillingAddress($input: CreateAddressInput!) {
    setOrderBillingAddress(input: $input) {
      ... on Order {
        billingAddress {
          ...ListedOrderAdressOrder
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const ACTIVE_ORDER_SHIPPING_ADDRESS = graphql(/* GraphQL */ `
  query ActiveOrderShippingAddress {
    activeOrder {
      shippingAddress {
        ...ListedOrderAdressOrder
      }
    }
  }
`)

export const ACTIVE_ORDER_BILLING_ADDRESS = graphql(/* GraphQL */ `
  query ActiveOrderBillingAddress {
    activeOrder {
      billingAddress {
        ...ListedOrderAdressOrder
      }
    }
  }
`)

export const UPDATE_ORDER_CUSTOM_FIELDS = graphql(/* GraphQL */ `
  mutation setOrderCustomFields($input: UpdateOrderInput!) {
    setOrderCustomFields(input: $input) {
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const ELIGIBLE_ORDER_SHIPPING_METHODS_FRAGMNENT = graphql(/* GraphQL */ `
  fragment EligibleShippingMethods on ShippingMethodQuote {
    id
    name
  }
`)

export const ELIGIBLE_ORDER_SHIPPING_METHODS = graphql(/* GraphQL */ `
  query EligibleShippingMethod {
    eligibleShippingMethods {
      ...EligibleShippingMethods
    }
  }
`)