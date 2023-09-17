import { graphql } from '../../../gql'

export const TRANSISTION_ORDER_TO_STATE = graphql(/* GraphQL */ `
  mutation transitionOrderToState($input: String!) {
    transitionOrderToState(state: $input) {
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const NEXT_ORDER_STATES = graphql(/* GraphQL */ `
  query nextOrderStates {
    nextOrderStates
  }
`)
