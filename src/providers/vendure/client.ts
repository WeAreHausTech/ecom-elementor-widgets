import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const AUTH_TOKEN_KEY = 'auth_token'
export const LANG = 'lang'

let dynamicURI = 'http://localhost:3000/shop-api'

const httpLink = new HttpLink({
  credentials: 'include',
})

const uriMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    uri: `${dynamicURI}?languageCode=${localStorage.getItem(LANG)}`,
  })
  return forward(operation)
})

const changeHttpLinkURI = (newURI: string) => {
  dynamicURI = newURI
}

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext()
    const authHeader = context.response.headers.get('vendure-auth-token')
    if (authHeader) {
      // If the auth token has been returned by the Vendure
      // server, we store it in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, authHeader)
    }
    return response
  })
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const client = new ApolloClient({
  link: ApolloLink.from([
    setContext(() => {
      const authToken = localStorage.getItem(AUTH_TOKEN_KEY)
      if (authToken) {
        // If we have stored the authToken from a previous
        // response, we attach it to all subsequent requests.
        return {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      }

      return {}
    }),
    uriMiddleware,
    afterwareLink,
    errorLink,
    httpLink,
  ]),
  cache: new InMemoryCache(),
})

export { client, changeHttpLinkURI }
