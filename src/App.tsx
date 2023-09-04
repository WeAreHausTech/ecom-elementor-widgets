import { Product } from './components/product/Product'
import { ProductList } from './components/product-list/ProductList'
import { getPrice } from './utils/utils'
import { CartContent } from '@/components/cart-content/CartContent'
import { CartRemoveItem } from '@/components/cart-remove-item/CartRemoveItem'
import { CartTotals } from '@/components/cart-totals/CartTotals'
import { AddToCart } from '@/components/add-to-cart/addToCart'
import { SampleComponent } from './components/sample-component/SampleComponent'
import { useEffect } from 'react'
import { sampleChannel } from './eventbus/channels/sample-channel'

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
  return (
    <>
      <SampleComponent />
      <ProductList wrapperTag="section" className="product-list-wrapper">
        {({ loading, products }) => {
          return (
            <div className="product-list">
              {!loading && products && products.length > 0 ? (
                <div className="product-list__container">
                  <div className="product-list__grid">
                    {products.map((product, idx) => (
                      <Product key={idx} thumbnailSize={undefined} product={product}>
                        {({ product, thumbnail }) => (
                          <div className="product-list__product">
                            <div className="product-list__product__thumbnail">
                              <img src={thumbnail} alt={product.productName} />
                            </div>
                            <div className="product-list__product__name">{product.productName}</div>
                            <div className="product-list__product__price">
                              {getPrice(product.priceWithTax)} {product.currencyCode}
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
    </>
  )
}
