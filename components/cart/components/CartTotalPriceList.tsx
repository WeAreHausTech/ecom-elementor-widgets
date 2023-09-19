import { CartTotals } from '@haus-tech/ecom-components'
import { Spinner } from '../../spinner/Spinner'

// TODO use price component
export const CartTotalPriceList = () => {
  return (
    <CartTotals className="Cart-total-price">
      {({ totalPrice, loading }) => {
        return (
          <>
            {loading['cart:fetchTotals'] ? (
              <Spinner />
            ) : (
              <>
                {totalPrice ? (
                  <div className="cart-totals">
                    <div className="cart-totals-item">
                      <p>Varukostnad</p>
                      <p>
                        {totalPrice.subTotal} {totalPrice.currencyCode}
                      </p>
                    </div>
                    <div className="cart-totals-item">
                      <p>Frakt</p>
                      <p>
                        {totalPrice.shipping} {totalPrice.currencyCode}
                      </p>
                    </div>
                    <div className="cart-totals-item">
                      <p>Moms</p>
                      <p>
                        {totalPrice.taxSummary[0]?.taxTotal} {totalPrice.currencyCode}
                      </p>
                    </div>
                    <div className="cart-totals-item bold">
                      <p>Att betala</p>
                      <p>
                        {totalPrice.totalWithTax} {totalPrice.currencyCode}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>Cart is empty</div>
                )}
              </>
            )}
          </>
        )
      }}
    </CartTotals>
  )
}
