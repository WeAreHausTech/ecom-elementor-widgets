import { graphql } from '../../../gql'

export const ELIGIBLE_PAYMENT_METHODS_FRAGMNENT = graphql(/* GraphQL */ `
  fragment EligiblePaymentMethods on PaymentMethodQuote {
    id
    name
    description
    code
  }
`)

export const ELIGIBLE_PAYMENT_METHODS = graphql(/* GraphQL */ `
  query EligiblePaymentMethods {
    eligiblePaymentMethods {
      ...EligiblePaymentMethods
    }
  }
`)

export const UPDATE_PAYMENT_METHOD = graphql(/* GraphQL */ `
  mutation addPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder (input: $input) {
        ... on ErrorResult {
            errorCode
            message
          }
    }
  }
`)