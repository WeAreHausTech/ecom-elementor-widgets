import { CartOrderLines } from '../../../components/cart-order-lines/CartOrderLines'
import { CartPrice } from '../../../components/cart-price/CartPrice'
import { useNavigate } from '@tanstack/react-router'

export const CartPage = () => {
  const navigate = useNavigate()
  return (
    <div className="CartPage">
      <div className=" flex flex-col gap-20 sm:flex-row">
        <div className="w-full sm:w-2/3">
          <CartOrderLines className="cart-page" edit price remove />
        </div>
        <div className="w-full sm:w-1/3">
          <CartPrice className="cart-page-price" subTotal tax shipping totalWithTax />
        </div>
      </div>
      <button className="Button blue" onClick={() => navigate({ to: '/checkout' })}>
        Gå till checkout
      </button>
    </div>
  )
}
