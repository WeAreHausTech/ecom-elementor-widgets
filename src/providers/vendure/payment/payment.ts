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
