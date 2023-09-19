import { CartContent, Price } from '@haus-tech/ecom-components'
import { AdjustOrderLine } from '../adjust-order-line/AdjustOrderLine'

export const Cart = () => {
  return (
    <CartContent className="Cart">
      {({ activeProducts }) => {
        return (
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
              </div>
            ))}
          </>
        )
      }}
    </CartContent>
  )
}
