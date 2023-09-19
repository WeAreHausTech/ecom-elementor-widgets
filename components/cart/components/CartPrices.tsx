import { CartTotals } from '@haus-tech/ecom-components'
import { useNavigate } from '@tanstack/react-router'
import { Spinner } from '../../spinner/Spinner'

// TODO use price component
export const CartPrices = () => {
  const navigate = useNavigate()
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
                    <div className="cart-totals-item total-price">
                      <p>Betala</p>
                      <p>
                        {totalPrice.totalWithTax} {totalPrice.currencyCode}
                      </p>
                    </div>
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
                    {totalPrice && totalPrice.totalWithTax > 0 && (
                      <button className="Button blue" onClick={() => navigate({ to: '/checkout' })}>
                        Gå till kassan
                      </button>
                    )}
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
