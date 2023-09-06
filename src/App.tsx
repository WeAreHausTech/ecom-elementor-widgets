import './App.css'
import { VendureApolloProvider } from '@haus-tech/ecom-components'
import ProductFilter from './ProductFilter'
import Cart from './Cart'
import Checkout from './Checkout'
import { useState } from 'react'

function App() {
  const [showProductFilter, setShowProductFilter] = useState(true)

  const toggleView = () => {
    setShowProductFilter(!showProductFilter)
  }

  window.location.pathname
  console.log(window.location.pathname)

  return (
    <>
      <VendureApolloProvider apiUrl={import.meta.env.VITE_API_URL}>
        <div className="App p-4 flex flex-col">
          <div className="flex flex-row justify-end ">
            {window.location.pathname === '/' ? (
              <button
                onClick={() => {
                  window.location.href = '/cart'
                }}
                className="text-white font-bold py-2 px-4 rounded"
              >
                <img src="src/Darkcart.png"></img>
              </button>
            ) : (
              <button
                onClick={() => {
                  window.location.href = '/'
                }}
                className="hover:text-grey-400 text-grey-900 py-2 px-4 rounded text-md"
              >
                Tillbaka
              </button>
            )}
          </div>

          {window.location.pathname === '/checkout' && <Checkout />}
          {window.location.pathname === '/cart' && <Cart />}
          {window.location.pathname === '/' && <ProductFilter />}
        </div>
      </VendureApolloProvider>
    </>
  )
}

export default App
