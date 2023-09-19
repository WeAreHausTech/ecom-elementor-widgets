import { ApolloProvider } from '@apollo/client'
import { client, changeHttpLinkURI, LANG } from './client'
import { useLayoutEffect } from 'react'

interface VendureApolloProviderProps {
  apiUrl: string
  children: React.ReactNode
}

export const VendureApolloProvider = ({ apiUrl, children }: VendureApolloProviderProps) => {
  if (apiUrl) {
    changeHttpLinkURI(apiUrl)
  }

  useLayoutEffect(() => {
    // Get language code from document and save it to localStorage in ISO 639-1 format
    const lang = document.documentElement.lang
    if (lang) {
      localStorage.setItem(LANG, lang.slice(0, 2))
    }
  }, [])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
