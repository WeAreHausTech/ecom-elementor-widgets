import { CartContent, CartTotals, CartRemoveItem, Price } from '@haus-tech/ecom-components'

export default function Cart() {
  return (
    <div>
      <h2 className="mb-2 text-left text-gray-900 font-bold text-3xl">Varukorg</h2>
      <div className="flex flex-row gap-20 justify-around">
        <div className="w-3/5">
          <CartContent>
            {({ activeProducts }) => {
              return (
                <div className="cart-content">
                  {!activeProducts || activeProducts.length === 0 ? (
                    <div className="text-center py-4 text-gray-600">Varukorgen är tom</div>
                  ) : (
                    <ul className="space-y-4">
                      {(activeProducts ?? []).map((product) => (
                        <li
                          key={product.id}
                          className="flex items-center space-x-4 border-b border-gray-300 p-4 relative"
                        >
                          <div className="w-25 h-25">
                            <img
                              src={product.featuredAsset?.preview + '?preset=thumb'}
                              alt={product.productVariant.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div className="flex flex-col items-start ">
                            <h3 className="text-lg font-semibold">
                              <a
                                key={product.id}
                                href={`/products/${product.productVariant.product.slug}`}
                                className="text-gray-700 hover:underline"
                              >
                                {product.productVariant.name}
                              </a>
                            </h3>
                            <Price
                              className="text-gray-700"
                              price={product.productVariant.price}
                              priceWithTax={product.productVariant.priceWithTax}
                              currencyCode={product.productVariant.currencyCode}
                            >
                              {({ formattedPrice }) => {
                                return <p className="text-gray-700">{formattedPrice} </p>
                              }}
                            </Price>
                            <p className="text-gray-600">
                              {/* Additional information goes here */}
                            </p>
                            <p className="text-gray-500">Antal: {product.quantity}</p>
                          </div>
                          <div className="absolute top-2 right-2">
                            <CartRemoveItem>
                              {({ removeItem }) => (
                                <button
                                  type="submit"
                                  name="removeItem"
                                  value={product.id}
                                  className="text-primary-600 hover:text-primary-500 focus:outline-none"
                                  onClick={() => removeItem(product.id)}
                                >
                                  x
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
        </div>

        <div className="w-2/5">
          <CartTotals>
            {({ totalPrice }) => {
              return (
                <div className="cart-totals">
                  {totalPrice && (
                    <div className="rounded-lg border border-gray-300 p-4">
                      <Price
                        className="text-gray-600"
                        price={totalPrice.totalWithTax}
                        priceWithTax={totalPrice.totalWithTax}
                        currencyCode={totalPrice.currencyCode}
                      >
                        {({ formattedPrice }) => {
                          return (
                            <p className="mb-2 text-left text-gray-900 font-bold text-lg">
                              Betala: {formattedPrice}
                            </p>
                          )
                        }}
                      </Price>

                      <Price
                        className="text-gray-600"
                        price={totalPrice.subTotal}
                        priceWithTax={totalPrice.subTotal}
                        currencyCode={totalPrice.currencyCode}
                      >
                        {({ formattedPrice }) => {
                          return (
                            <p className="mb-2 text-left text-gray-900 text-sm">
                              Varukostnad: {formattedPrice}
                            </p>
                          )
                        }}
                      </Price>

                      <Price
                        className="text-gray-600"
                        price={totalPrice.shipping}
                        priceWithTax={totalPrice.shipping}
                        currencyCode={totalPrice.currencyCode}
                      >
                        {({ formattedPrice }) => {
                          return (
                            <p className="mb-2 text-left text-gray-900 text-sm">
                              Frakt: {formattedPrice}
                            </p>
                          )
                        }}
                      </Price>

                      <Price
                        className="text-gray-600"
                        price={totalPrice.taxSummary[0]?.taxTotal}
                        priceWithTax={totalPrice.taxSummary[0]?.taxTotal}
                        currencyCode={totalPrice.currencyCode}
                      >
                        {({ formattedPrice }) => {
                          return (
                            <p className="mb-2 text-left text-gray-900 text-sm">
                              Moms: {formattedPrice}
                            </p>
                          )
                        }}
                      </Price>
                    </div>
                  )}
                </div>
              )
            }}
          </CartTotals>
        </div>
      </div>
    </div>
  )
}
