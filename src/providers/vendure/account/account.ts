import { graphql } from '@/gql'

export const LOGIN = graphql(/* GraphQL */ `
  mutation login($email: String!, $password: String!, $rememberMe: Boolean) {
    login(username: $email, password: $password, rememberMe: $rememberMe) {
      __typename
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const LOGOUT = graphql(/* GraphQL */ `
  mutation logout {
    logout {
      success
    }
  }
`)
