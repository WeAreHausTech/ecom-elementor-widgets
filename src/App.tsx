import { Product } from './components/product/Product'
import { ProductList } from './components/product-list/ProductList'
import { getPrice } from './utils/utils'
import { CartContent } from '@/components/cart-content/CartContent'
import { CartRemoveItem } from '@/components/cart-remove-item/CartRemoveItem'
import { CartTotals } from '@/components/cart-totals/CartTotals'
import { AddToCart } from '@/components/add-to-cart/addToCart'
import { useEffect } from 'react'
import { sampleChannel } from './eventbus/channels/sample-channel'
import { ProductSort } from './components/products-sort/ProductSort'
import { SortOrder } from './gql/graphql'

export const App = () => {
  useEffect(() => {
    console.log('SampleComponent mounted')

    const unsubscribeSampleEventListener = sampleChannel.on('onSample', (data) => {
      console.log('SampleComponent received sample-event', data)
    })

    return () => {
      console.log('SampleComponent unmounted')
      unsubscribeSampleEventListener()
    }
  }, [])

  const availableSortOptions = [
    { label: 'Name (A-Z)', value: { name: SortOrder.Asc } },
    { label: 'Name (Z-A)', value: { name: SortOrder.Desc } },
    { label: 'Price (low to high)', value: { price: SortOrder.Asc } },
    { label: 'Price (high to low)', value: { price: SortOrder.Desc } },
  ]

  return (
    <div className="m-4">
      <ProductSort>
        {({ handleSortOptionChange }) => (
          <select
            onChange={(e) => handleSortOptionChange(JSON.parse(e.target.value))}
            defaultValue={JSON.stringify(availableSortOptions[0].value)}
          >
            {availableSortOptions.map((option, idx) => (
              <option key={idx} value={JSON.stringify(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </ProductSort>
      <ProductList wrapperTag="section" className="product-list-wrapper">
        {({ loading, products }) => {
          return (
            <div className="product-list">
              {!loading && products && products.length > 0 ? (
                <div className="grid grid-cols-4">
                  {products.map((product, idx) => (
                    <Product key={idx} thumbnailSize={undefined} product={product}>
                      {({ product, thumbnail }) => (
                        <div className="mx-auto mt-11 w-80 transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:scale-105 hover:shadow-lg">
                          <img
                            className="h-48 w-full object-cover object-center"
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
                            <div className="flex items-center">
                              <p className="mr-2 text-lg font-semibold text-gray-900 dark:text-white">
                                {getPrice(product.priceWithTax)} {product.currencyCode}
                              </p>
                            </div>
                          </div>
                          <AddToCart>
                            {({ addProductToCart }) => {
                              return (
                                <div>
                                  <button
                                    type="submit"
                                    name="addToCart"
                                    value={'1'}
                                    className="font-medium text-primary-600 hover:text-primary-500"
                                    onClick={() => addProductToCart(product.productVariantId, 1)}
                                  >
                                    Add to cart
                                  </button>
                                </div>
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
      <h2>Cart</h2>
      <CartContent>
        {({ activeProducts }) => {
          return (
            <div className="cart-content">
              {!activeProducts ? (
                <div> Cart is empty </div>
              ) : (
                <ul>
                  {(activeProducts ?? []).map((product) => (
                    <li key={product.id}>
                      <div>
                        <img
                          src={product.featuredAsset?.preview + '?preset=thumb'}
                          alt={product.productVariant.name}
                        />
                      </div>
                      <h3>
                        <a
                          key={product.id}
                          href={`/products/${product.productVariant.product.slug}`}
                        >
                          {product.productVariant.name}
                        </a>
                      </h3>
                      <p>
                        {' '}
                        {product.productVariant.price} {product.productVariant.currencyCode}{' '}
                      </p>
                      <p>Antal: {product.quantity}</p>

                      <CartRemoveItem>
                        {({ removeItem }) => {
                          return (
                            <div>
                              <button
                                type="submit"
                                name="removeItem"
                                value={product.id}
                                className="font-medium text-primary-600 hover:text-primary-500"
                                onClick={() => removeItem(product.id)}
                              >
                                Remove
                              </button>
                            </div>
                          )
                        }}
                      </CartRemoveItem>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        }}
      </CartContent>
      <CartTotals>
        {({ totalPrice }) => {
          return (
            <div className="cart-totals">
              {totalPrice ? (
                <div>
                  <p>
                    Varukostnad: {totalPrice.subTotal} {totalPrice.currencyCode}{' '}
                  </p>
                  <p>
                    Frakt: {totalPrice.shipping} {totalPrice.currencyCode}
                  </p>
                  <p>
                    Moms: {totalPrice.taxSummary[0]?.taxTotal} {totalPrice.currencyCode}
                  </p>
                  <p>
                    Att betala: {totalPrice.totalWithTax} {totalPrice.currencyCode}
                  </p>
                </div>
              ) : (
                <div> Cart is empty </div>
              )}
            </div>
          )
        }}
      </CartTotals>
    </div>
  )
}
