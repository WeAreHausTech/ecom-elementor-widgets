import { ProductList } from './components/product-list/ProductList'
import { CartContent } from '@/components/cart-content/CartContent'
import { CartRemoveItem } from '@/components/cart-remove-item/CartRemoveItem'
import { CartTotals } from '@/components/cart-totals/CartTotals'
import { OrderShippingAddress } from './components/order-shipping-address/OrderShippingAddress'
import { OrderBillingAddress } from './components/order-billing-address/OrderBillingAddress'
import { OrderMessage } from '@/components/order-message/OrderMessage'
import { AddToCart } from '@/components/add-to-cart/AddToCart'
import { useEffect } from 'react'
import { sampleChannel } from './eventbus/channels/sample-channel'
import { ProductSort } from './components/products-sort/ProductSort'
import { SortOrder } from './gql/graphql'
import { Price } from '@/components/price/Price.tsx'
import { Input } from './components/_form-components/Input'
import { SearchProducts } from './components/search-products/SearchProducts'
import { SearchResults } from './components/search-results/SearchResults'
import { PaymentMethods } from './components/payment-methods/PaymentMethods'
import { ShippingMethod } from './components/shipping-method/ShippingMethod'
import { OrderCustomer } from './components/order-customer/OrderCustomer'

import { OrderState } from './components/order-state/OrderState'
import { Login } from './components/account/Login'
import { getError } from './utils/utils'
import { some } from 'lodash'

const infinitePagination = true

export const App = () => {
  useEffect(() => {
    console.log('SampleComponent mounted')

    const unsubscribeSampleEventListener = sampleChannel.on('sample:message', (data) => {
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
      <SearchProducts>
        {({ term, setTerm, clear }) => {
          return (
            <div className="mb-4">
              <label className="block mb-4">
                <Input
                  type="text"
                  name="search"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="bg-gray-100 rounded-full px-4 py-2 outline-none w-full  max-w-screen-sm"
                  placeholder="Search..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      window.location.href = `?search=${term}`
                    }
                  }}
                />
                <button onClick={() => clear()}> x</button>
              </label>
            </div>
          )
        }}
      </SearchProducts>
      <SearchResults searchInputProps={{ take: 3 }}>
        {({ loading, products, collections }) => {
          if (loading) return <div>Loading...</div>
          if (products.length === 0 && collections.length === 0) return <div>No results</div>

          console.log(collections)
          const collectionWithLowestLevel = collections[collections.length - 1]

          return (
            <div className="mb-4">
              <div className="flex flex-col max-w-screen-sm gap-4">
                {collectionWithLowestLevel && (
                  <a href={collectionWithLowestLevel.slug}>
                    <div className="flex flex-row w-full h-16 gap-4">
                      <img
                        className="w-16 h-object-cover object-center rounded-lg"
                        src={collectionWithLowestLevel.featuredAsset?.preview}
                        alt="Product Image"
                      />
                      <div className="flex flex-col">
                        <p> {collectionWithLowestLevel.name} </p>
                        <p className="font-bold">{collectionWithLowestLevel.parent?.name}</p>
                      </div>
                    </div>
                  </a>
                )}
                <div className="flex flex-col gap-4">
                  {products.map((product) => (
                    <a href={`/products/${product.slug}`} key={product.productId}>
                      <div className="flex flex-row w-full h-16 justify-between">
                        <div className="flex flex-row gap-4">
                          <img
                            className=" w-16 h-object-cover object-center rounded-lg"
                            src={product.productAsset?.preview}
                            alt="Product Image"
                          />

                          <p> {product.productName} </p>
                        </div>
                        <div>
                          <Price
                            price={product.price}
                            priceWithTax={product.priceWithTax}
                            currencyCode={product.currencyCode}
                          >
                            {({ formattedPrice }) => {
                              return <p className="font-bold">{formattedPrice}</p>
                            }}
                          </Price>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )
        }}
      </SearchResults>
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
      <ProductList
        wrapperTag="section"
        searchInputProps={{ take: 4 }}
        infinitePagination={infinitePagination}
        className="product-list-wrapper"
      >
        {({ loading, products, pagination }) => {
          if (some(loading, i => i === true) && !infinitePagination) return <div>Loading...</div>
          return (
            <div className="product-list">
              {products && products.length > 0 ? (
                <div className="grid grid-cols-4">
                  {products.map((product) => (
                    <div key={product.productId}>
                      <div className="mx-auto mt-11 w-80 transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:scale-105 hover:shadow-lg">
                        <img
                          className="h-48 w-full object-cover object-center"
                          src={product.productAsset?.preview + '?preset=thumb'}
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
                            <Price
                              price={product.price}
                              priceWithTax={product.priceWithTax}
                              currencyCode={product.currencyCode}
                            >
                              {({ formattedPrice }) => {
                                return <div>{formattedPrice}</div>
                              }}
                            </Price>
                          </div>
                        </div>
                        <AddToCart>
                          {({ addProductToCart }) => {
                            return (
                              <div>
                                {product.inStock ? (
                                  <button
                                    type="submit"
                                    name="addToCart"
                                    value={'1'}
                                    className="font-medium text-primary-600 hover:text-primary-500"
                                    onClick={() => addProductToCart(product.productVariantId, 1)}
                                  >
                                    Add to cart
                                  </button>
                                ) : (
                                  <div className="text-red-500">Out of stock</div>
                                )}
                              </div>
                            )
                          }}
                        </AddToCart>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="product-list__no-products">No products found</div>
              )}
              <div className="pagination w-100 mt-4 flex justify-center items-center">
                {infinitePagination ? (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => pagination?.nextPage()}
                    disabled={!pagination?.canGoForward}
                  >
                    Load more
                  </button>
                ) : (
                  <>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => pagination?.prevPage()}
                      disabled={!pagination?.canGoBack}
                    >
                      Previous
                    </button>
                    <div className="mx-4">
                      {pagination?.currentPage} / {pagination?.totalPages}
                    </div>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => pagination?.nextPage()}
                      disabled={!pagination?.canGoForward}
                    >
                      Next
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        }}
      </ProductList>
      <h2 className="text-2xl font-semibold mb-4">Cart</h2>
      <CartContent>
        {({ activeProducts }) => {
          return (
            <div className="cart-content">
              {!activeProducts ? (
                <div className="text-center py-4 text-gray-600">Cart is empty</div>
              ) : (
                <ul className="space-y-4">
                  {(activeProducts ?? []).map((product) => (
                    <li key={product.id} className="flex items-center space-x-4">
                      <div className="w-20 h-20">
                        <img
                          src={product.featuredAsset?.preview + '?preset=thumb'}
                          alt={product.productVariant.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          <a
                            key={product.id}
                            href={`/products/${product.productVariant.product.slug}`}
                            className="text-blue-500 hover:underline"
                          >
                            {product.productVariant.name}
                          </a>
                        </h3>
                        <Price
                          className="text-gray-600"
                          price={product.productVariant.price}
                          priceWithTax={product.productVariant.priceWithTax}
                          currencyCode={product.productVariant.currencyCode}
                        >
                          {({ formattedPrice }) => {
                            return <div>{formattedPrice}</div>
                          }}
                        </Price>
                        <p className="text-gray-500">Antal: {product.quantity}</p>
                        <CartRemoveItem>
                          {({ removeItem }) => (
                            <button
                              type="submit"
                              name="removeItem"
                              value={product.id}
                              className="text-primary-600 hover:text-primary-500 focus:outline-none"
                              onClick={() => removeItem(product.id)}
                            >
                              Remove
                            </button>
                          )}
                        </CartRemoveItem>
                      </div>
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
                <div className="bg-white p-4 rounded-md shadow-md">
                  <p className="mb-2">
                    Varukostnad: {totalPrice.subTotal} {totalPrice.currencyCode}
                  </p>
                  <p className="mb-2">
                    Frakt: {totalPrice.shipping} {totalPrice.currencyCode}
                  </p>
                  <p className="mb-2">
                    Moms: {totalPrice.taxSummary[0]?.taxTotal} {totalPrice.currencyCode}
                  </p>
                  <p>
                    Att betala: {totalPrice.totalWithTax} {totalPrice.currencyCode}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-600">Cart is empty</div>
              )}
            </div>
          )
        }}
      </CartTotals>

      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      <OrderShippingAddress>
        {({ update }) => {
          return (
            <div className="cart-totals">
              <button
                type="submit"
                name="removeItem"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() =>
                  update({
                    fullName: 'Test Testsson',
                    company: 'Testbolaget',
                    streetLine1: 'Testgatan 1',
                    streetLine2: 'Testgatan 12',
                    city: 'Teststaden',
                    province: 'Testlän',
                    postalCode: '12345',
                    countryCode: 'SE',
                    phoneNumber: '0701234567',
                  })
                }
              >
                Update shipping address
              </button>
            </div>
          )
        }}
      </OrderShippingAddress>
      <OrderBillingAddress>
        {({ update }) => {
          return (
            <div className="cart-totals">
              <button
                type="submit"
                name="removeItem"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() =>
                  update({
                    fullName: 'Test Testsson',
                    company: 'Testbolaget',
                    streetLine1: 'Testgatan 1',
                    streetLine2: 'Testgatan 12',
                    city: 'Teststaden',
                    province: 'Testlän',
                    postalCode: '12345',
                    countryCode: 'SE',
                    phoneNumber: '0701234567',
                  })
                }
              >
                Update billing address
              </button>
            </div>
          )
        }}
      </OrderBillingAddress>

      <OrderCustomer>
        {({ update }) => {
        
        return (
          <div className="cart-totals">
            <button
              type="submit"
              name="removeItem"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() =>
                update({
                  emailAddress: 'test@test.se',
                  firstName: 'Test',
                  lastName: 'testsson',
                  phoneNumber: '0701223344',
                  title: 'Ekonomiansvarig',
                })
              }
            >
              Update customer
            </button>
          </div>
        )
        }}
      </OrderCustomer>
      <OrderMessage>
        {({ message, setMessage, addMessageToOrder }) => {
          return (
            <div className="cart-totals">
              <label className="block mb-4">
                Write a message
                <Input
                  type="text"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={addMessageToOrder}
                  className="mt-1 block w-full border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300 px-3 py-2"
                />
              </label>
            </div>
          )
        }}
      </OrderMessage>

      <ShippingMethod>
        {({ eligibleShippingMethods, setSelectedshippingMethod, updateShippingMethod }) => {
          return (
            <div>
              <h3 className="text-lg font-semibold mb-2"> 3. Shipping method</h3>
              <form
                onSubmit={updateShippingMethod}
                className="bg-white p-6 rounded-md shadow-md max-w-md"
              >
                {eligibleShippingMethods &&
                  eligibleShippingMethods.map((method) => (
                    <div key={method.id}>
                      <input
                        type="radio"
                        id={method.id}
                        name="shippingMethod"
                        value={method.id}
                        onChange={(e) => setSelectedshippingMethod(e.target.value)}
                      />
                      <label htmlFor={method.id}>{method.name}</label>
                    </div>
                  ))}
                <button type="submit">Save shipping method</button>
              </form>
            </div>
          )
        }}
      </ShippingMethod>

      <h2 className="text-2xl font-semibold mb-4">4. Payment methods</h2>
      <OrderState>
        {({ changeOrderState }) => {
          return (
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => changeOrderState('ArrangingPayment')}
              >
                {' '}
                Change to ArrangingPayment state
              </button>
            </div>
          )
        }}
      </OrderState>

      <PaymentMethods paymentMethod="pre-payment">
        {({ updatePaymentMethod }) => {
          return (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={updatePaymentMethod}
            >
              Place order
            </button>
          )
        }}
      </PaymentMethods>

      <OrderState>
        {({ changeOrderState }) => {
          return (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => changeOrderState('Cancelled')}
            >
              {' '}
              Cancel order
            </button>
          )
        }}
      </OrderState>
      <div className="mt-4">
        <h1>Customer</h1>
        <Login>
          {({ loading, error, formData, setFormData, authenticate }) => {
            return (
              <div>
                {loading['auth:login'] && <div>Loading...</div>}
                {error && <div>Error: {getError(error)?.message}</div>}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const test = authenticate()
                    test.then((res) => {
                      console.log('res', res)
                    })
                  }}
                >
                  <label className="block mb-4">
                    Email:
                    <Input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                    />
                  </label>
                  <label className="block mb-4">
                    Password:
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                    />
                  </label>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                  >
                    Login
                  </button>
                </form>
              </div>
            )
          }}
        </Login>
      </div>
    </div>
  )
}
