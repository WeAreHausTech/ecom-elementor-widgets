import './App.css'
import { VendureApolloProvider, ProductList, AddToCart, Product } from '@haus-tech/ecom-components'

function App() {
  return (
    <>
      <VendureApolloProvider>
        <ProductList wrapperTag="section" className="product-list-wrapper">
          {({ loading, products }) => {
            return (
              <div className="product-list">
                {!loading && products && products.length > 0 ? (
                  <div className="grid grid-cols-4 gap-8">
                    {products.map((product, idx) => (
                      <Product key={idx} thumbnailSize={[200, 200]} product={product}>
                        {({ product, thumbnail }) => (
                          <div className="transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:scale-105 hover:shadow-lg">
                            <img
                              className="w-full h-auto object-cover object-center"
                              src={thumbnail}
                              alt="Product Image"
                            />
                            <div className="p-4">
                              <h2 className="mb-2 text-lg font-medium dark:text-white text-gray-900">
                                {product.productName}
                              </h2>
                              <p className="mb-2 text-base dark:text-gray-300 text-gray-700">
                                Product description goes here.
                              </p>
                              <div className="flex items-center justify-center">
                                <p className="mr-2 text-lg font-semibold text-gray-900 dark:text-white text-center">
                                  {'0'} {product.currencyCode}
                                </p>
                              </div>
                            </div>
                            <AddToCart>
                              {({ addProductToCart }) => {
                                return (
                                  <button
                                    type="submit"
                                    name="addToCart"
                                    value={'1'}
                                    className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none mb-4"
                                    onClick={() => addProductToCart(product.productVariantId, 1)}
                                  >
                                    Add to cart
                                  </button>
                                )
                              }}
                            </AddToCart>
                          </div>
                        )}
                      </Product>
                    ))}
                  </div>
                ) : (
                  <div className="product-list__no-products">No products found</div>
                )}
              </div>
            )
          }}
        </ProductList>
      </VendureApolloProvider>
    </>
  )
}

export default App
