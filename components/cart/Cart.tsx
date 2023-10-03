import { CartOrderLines } from '../cart-order-lines/CartOrderLines'
import { CartPrice } from '../cart-price/CartPrice'
import { Button } from '../button/Button'
import { CartTotals } from '@haus-tech/ecom-components'
import { useNavigate } from '@tanstack/react-router'

export const Cart = () => {
  const navigate = useNavigate()
  const order = {
    totalWithTax: 1,
    subTotal: 2,
    shipping: 3,
    tax: 4,
  }

  return (
    <div className="CartPage">
      <div className="cart-orderlines">
        <CartOrderLines className="cart-page" edit price remove />
      </div>
      <div className="cart-summary-mobile">
        <div className="cart-totals-col-1">
          <CartTotals>
            {({ totalPrice }) => {
              return (
                <>
                  <CartTotals.Item
                    className="total-price"
                    item={{ label: '', value: totalPrice.subTotal }}
                  />
                </>
              )
            }}
          </CartTotals>
        </div>

        <Button color="blue" type="submit" className="cart-page-button"  onClick={() => navigate({ to: '/kassa' })}>
          Gå till kassan
        </Button>
      </div>

      <div className="cart-summary">
        <CartPrice className="cart-page-price" subTotal tax shipping totalWithTax order={order} />
        <Button color="blue" type="submit" className="mt-4 cart-page-button" onClick={() => navigate({ to: '/kassa' })}>
          Gå till kassan
        </Button>
      </div>
    </div>
  )
}
