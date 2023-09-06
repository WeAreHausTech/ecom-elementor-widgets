import './App.css'
import { VendureApolloProvider } from '@haus-tech/ecom-components'
import ProductFilter from './ProductFilter'
import Cart from './Cart'
import { useState } from 'react'

function App() {
  const [showProductFilter, setShowProductFilter] = useState(true)

  const toggleView = () => {
    setShowProductFilter(!showProductFilter)
  }

  return (
    <>
      <VendureApolloProvider apiUrl={import.meta.env.VITE_API_URL}>
        <div className="App p-4 flex flex-col">
          <div className="flex flex-row justify-end ">
            {showProductFilter ? (
              <button onClick={toggleView} className="text-white font-bold py-2 px-4 rounded">
                <img src="src/Darkcart.png"></img>
              </button>
            ) : (
              <button
                onClick={toggleView}
                className="hover:text-grey-400 text-grey-900 py-2 px-4 rounded text-md"
              >
                Tillbaka
              </button>
            )}
          </div>
          <div className="mt-4">{showProductFilter ? <ProductFilter /> : <Cart />}</div>
        </div>
      </VendureApolloProvider>
    </>
  )
}

export default App
