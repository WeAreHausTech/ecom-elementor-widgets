import { CheckoutItems } from '../components/CheckoutItems'
import { CheckoutPrices } from '../components/CheckoutPrices'

export const CheckoutCart = () => {
  return (
    <div className="SmallCart">
      <h3>Varukorg</h3>
      <CheckoutItems />
      <CheckoutPrices />
    </div>
  )
}
