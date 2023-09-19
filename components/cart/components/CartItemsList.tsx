import { CartContent, Price } from '@haus-tech/ecom-components'
import { AdjustOrderLine } from '../../adjust-order-line/AdjustOrderLine'
import { Spinner } from '../../spinner/Spinner'

export const CartItemsList = () => {
  return (
    <CartContent className="Cart-content">
      {({ activeProducts, loading }) => {
        return (
          <>
            {loading['cart:content'] ? (
              <Spinner />
            ) : (
              <>
                {activeProducts.map((product) => (
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
                      </div>
                    </div>
                    <div>
                      <p>{product.quantity} st </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )
      }}
    </CartContent>
  )
}
