import { CartItems } from '../components/CartItems'
import { CartPrices } from '../components/CartPrices'

export const Cart = () => {
  return (
    <div className="Cart">
      <CartItems />
      <CartPrices />
    </div>
  )
}
