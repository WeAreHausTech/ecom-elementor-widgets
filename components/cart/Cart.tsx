import { CartOrderLines } from '../cart-order-lines/CartOrderLines'
import { CartPrice } from '../cart-price/CartPrice'

export const Cart = () => {
  return (
    <div className="CartPage">
      <div>
        <div>
          <CartOrderLines className="cart-page" edit price remove />
        </div>
        <div>
          <CartPrice className="cart-page-price" subTotal tax shipping totalWithTax />
        </div>
      </div>
    </div>
  )
}
