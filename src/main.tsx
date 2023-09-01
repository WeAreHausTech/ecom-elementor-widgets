import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import { VendureApolloProvider } from './providers/vendure/VendureApolloProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VendureApolloProvider>
      <App />
    </VendureApolloProvider>
  </React.StrictMode>,
)
