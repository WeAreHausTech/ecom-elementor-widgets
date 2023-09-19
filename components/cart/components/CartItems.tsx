import { CartContent, Price, CartRemoveItem } from '@haus-tech/ecom-components'
import { AdjustOrderLine } from '../../adjust-order-line/AdjustOrderLine'
import { Spinner } from '../../spinner/Spinner'

export const CartItems = () => {
  return (
    <CartContent className="Cart-content">
      {({ activeProducts, loading }) => {
        return (
          <>
            {loading['cart:content'] ? (
              <Spinner />
            ) : (
              <>
                {activeProducts &&
                  activeProducts.map((product) => (
                    <div key={product.id} className="cart-product">
                      <img
                        src={product.featuredAsset?.preview + '?w=128&h=128'}
                        alt={product.productVariant.name}
                        className="cart-product-image rounded-md"
                      />
                      <div className="cart-product-details">
                        <div>
                          <p className="brand">Brand</p>
                          <p className="product-name">{product.productVariant.name}</p>
                          <p className="product-extra">320 ml</p>
                        </div>
                        <div className="flex gap-8">
                          <AdjustOrderLine product={product} />
                        </div>
                      </div>
                      <Price
                        className="cart-product-price"
                        price={product.productVariant.price}
                        priceWithTax={product.productVariant.priceWithTax}
                        currencyCode={product.productVariant.currencyCode}
                      >
                        {({ formattedPrice }) => <>{formattedPrice}</>}
                      </Price>
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
                  ))}
                {!activeProducts || (activeProducts.length === 0 && <div>Din varukorg är tom</div>)}
              </>
            )}
          </>
        )
      }}
    </CartContent>
  )
}
