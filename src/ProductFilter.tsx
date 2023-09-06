import { ProductList, AddToCart, Product, ProductSort } from '@haus-tech/ecom-components'
import React, { useState, useEffect } from 'react'

export default function ProductFilter() {
  const SortOrder = {
    Asc: 'ASC',
    Desc: 'DESC',
  }

  const availableSortOptions = [
    { label: 'Namn', value: { name: SortOrder.Asc } },
    { label: 'Pris fallande', value: { price: SortOrder.Asc } },
    { label: 'Pris stigande', value: { price: SortOrder.Desc } },
  ]

  const infinitePagination = false

  return (
    <>
      <ProductSort>
        {({ handleSortOptionChange }) => (
          <div className="flex items-center mb-6">
            <select
              onChange={(e) => handleSortOptionChange(JSON.parse(e.target.value))}
              defaultValue={JSON.stringify(availableSortOptions[0].value)}
              className="py-2 pl-3 pr-10 leading-5 rounded-full border border-gray-600 bg-transparent focus:border-gray-400 focus:ring focus:ring-opacity-50"
            >
              {availableSortOptions.map((option, idx) => (
                <option key={idx} value={JSON.stringify(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </ProductSort>
      <ProductList
        wrapperTag="section"
        className="product-list-wrapper"
        infinitePagination={infinitePagination}
        searchInputProps={{ take: 8 }}
      >
        {({ loading, products, pagination }) => {
          if (loading && !infinitePagination) return <div>Loading...</div>
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
                            {({ addProductToCart, success }) => {
                              const [successMessage, setSuccessMessage] = useState(false)

                              useEffect(() => {
                                let timeoutId

                                if (success) {
                                  setSuccessMessage(true)
                                  timeoutId = setTimeout(() => {
                                    setSuccessMessage(false)
                                  }, 1000)
                                }
                              }, [success])
                              return (
                                <>
                                  <button
                                    type="submit"
                                    name="addToCart"
                                    value={'1'}
                                    className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none mb-4"
                                    onClick={() => addProductToCart(product.productVariantId, 1)}
                                  >
                                    {successMessage ? 'Tillagd i varukorgen' : 'köp'}
                                  </button>
                                </>
                              )
                            }}
                          </AddToCart>
                        </div>
                      )}
                    </Product>
                  ))}
                </div>
              ) : (
                <div className="product-list__no-products">Inga produkter hittades</div>
              )}
              <div className="pagination w-100 mt-10 flex justify-center items-center">
                {infinitePagination ? (
                  <button
                    className="min-w-[180px] rounded-lg border border-gray-300 p-2 flex justify-center items-center space-x-2 hover:bg-gray-800 hover:text-white"
                    onClick={() => pagination?.nextPage()}
                    disabled={!pagination?.canGoForward}
                  >
                    Visa mer
                  </button>
                ) : (
                  <>
                    <button
                      className="min-w-[120px] rounded-lg border border-gray-300 p-2 flex justify-center items-center space-x-2 hover:bg-gray-800 hover:text-white"
                      onClick={() => pagination?.prevPage()}
                      disabled={!pagination?.canGoBack}
                    >
                      Föregående
                    </button>
                    <div className="mx-4">
                      {pagination?.currentPage} / {pagination?.totalPages}
                    </div>
                    <button
                      className="min-w-[120px] rounded-lg border border-gray-300 p-2 flex justify-center items-center space-x-2 hover:bg-gray-800 hover:text-white"
                      onClick={() => pagination?.nextPage()}
                      disabled={!pagination?.canGoForward}
                    >
                      Nästa
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        }}
      </ProductList>
    </>
  )
}
