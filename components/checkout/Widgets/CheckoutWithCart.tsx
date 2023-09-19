import { Checkout } from './Checkout'
import { CheckoutCart } from '../../cart/Widgets/CheckoutCart'

export const CheckoutWithCart = () => {
  return (
    <div className="CheckoutCart">
      <Checkout />
      <CheckoutCart />
    </div>
  )
}
