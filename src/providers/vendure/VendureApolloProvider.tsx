import { ApolloProvider } from '@apollo/client'
import client from './client'

interface VendureApolloProviderProps {
  children: React.ReactNode
}

export const VendureApolloProvider = ({ children }: VendureApolloProviderProps) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
