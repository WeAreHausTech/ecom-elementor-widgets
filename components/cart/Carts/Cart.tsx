import { CartContentItems } from '../components/CartContentItems'
import { CartTotalPrice } from '../components/CartTotalPrice'

export const Cart = () => {
  return (
    <div className="Cart">
      <CartContentItems />
      <CartTotalPrice />
    </div>
  )
}
