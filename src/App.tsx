import { Product } from './components/product/Product'
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
import { Login } from './components/account/Login'
import { getError } from './utils/utils'

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
          if (loading && !infinitePagination) return <div>Loading...</div>
          return (
            <div className="product-list">
              {products && products.length > 0 ? (
                <div className="grid grid-cols-4">
                  {products.map((product) => (
                    <Product key={product.productId} thumbnailSize={undefined} product={product}>
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
                      )}
                    </Product>
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
        {({ formData, handleChange, handleSubmit }) => {
          return !formData ? (
            <div>Loading...</div>
          ) : (
            <div className="shipping-address bg-white p-4 rounded-md shadow-m">
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md max-w-md">
                <h3 className="text-lg font-semibold mb-2">Company information</h3>
                <label className="block mb-4">
                  Company:
                  <Input
                    type="text"
                    name="company"
                    value={formData.company!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Street Line 1:
                  <Input
                    type="text"
                    name="streetLine1"
                    value={formData.streetLine1!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  City:
                  <Input
                    type="text"
                    name="city"
                    value={formData.city!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Street Line 2:
                  <Input
                    type="text"
                    name="streetLine2"
                    value={formData.streetLine2!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Province:
                  <Input
                    type="text"
                    name="province"
                    value={formData.province!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Postal Code:
                  <Input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Country Code:
                  <Input
                    type="text"
                    name="countryCode"
                    value={formData.countryCode!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <br />
                <h3 className="text-lg font-semibold mb-2">Contact information</h3>
                <label className="block mb-4">
                  Full Name:
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <label className="block mb-4">
                  Phone Number:
                  <Input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber!}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                  />
                </label>

                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Uppdatera uppgifter
                </button>
              </form>
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
