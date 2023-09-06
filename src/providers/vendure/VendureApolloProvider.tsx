import { ApolloProvider } from '@apollo/client'
import { client, changeHttpLinkURI } from './client'

interface VendureApolloProviderProps {
  apiUrl: string
  children: React.ReactNode
}

export const VendureApolloProvider = ({ apiUrl, children }: VendureApolloProviderProps) => {
  if (apiUrl) {
    changeHttpLinkURI(apiUrl)
  }
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
