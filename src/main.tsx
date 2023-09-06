import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import { VendureApolloProvider } from './providers/vendure/VendureApolloProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VendureApolloProvider apiUrl="http://localhost:3000/shop-api">
      <App />
    </VendureApolloProvider>
  </React.StrictMode>,
)
