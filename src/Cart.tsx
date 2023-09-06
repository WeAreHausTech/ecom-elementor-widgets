import { CartContent, CartTotals, CartRemoveItem } from '@haus-tech/ecom-components'

export default function Cart() {
  return (
    <div>
      <h2 className="mb-2 text-left text-gray-900 font-bold text-3xl">Varukorg</h2>
      <div className="flex flex-row gap-20 justify-around items-start">
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
                            <p className="text-gray-700">
                              {product.productVariant.price} {product.productVariant.currencyCode}
                            </p>
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

        <div className="w-2/5 rounded-lg border border-gray-300 p-4">
          <CartTotals>
            {({ totalPrice }) => {
              return (
                <div className="cart-totals">
                  {totalPrice && (
                    <div>
                      <p className="mb-2 text-left text-gray-900 font-bold text-lg">
                        Betala: {totalPrice.totalWithTax} {totalPrice.currencyCode}
                      </p>
                      <p className="mb-2 text-left text-gray-900 text-sm">
                        Varukostnad: {totalPrice.subTotal} {totalPrice.currencyCode}
                      </p>
                      <p className="mb-2 text-left text-gray-900 text-sm">
                        Frakt: {totalPrice.shipping} {totalPrice.currencyCode}
                      </p>
                      <p className="mb-2 text-left text-gray-900 text-sm">
                        Moms: {totalPrice.taxSummary[0]?.taxTotal} {totalPrice.currencyCode}
                      </p>
                    </div>
                  )}
                </div>
              )
            }}
          </CartTotals>
          <div>
            <button
              onClick={() => {
                window.location.href = '/checkout'
              }}
              className="w-full rounded-lg border border-gray-300 p-2 flex justify-center items-center space-x-2 hover:bg-gray-800 hover:text-white"
            >
              Gå till kassan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
