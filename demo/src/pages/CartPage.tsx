import { Cart } from '../../../components/cart/Cart'

export const CartPage = () => {
  return (
    <div className="CartPage">
      <div className="p-20">
        <Cart className="cart-page" edit price remove />
      </div>
    </div>
  )
}
