import { Product } from './components/product/Product'
import { ProductList } from './components/product-list/ProductList'
import { getPrice } from './utils/utils'
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
    </>
  )
}
