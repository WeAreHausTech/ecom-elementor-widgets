import { CartItemsList } from '../components/CartItemsList'
import { CartTotalPriceList } from '../components/CartTotalPriceList'

export const CheckoutCart = () => {
  return (
    <div className="SmallCart">
      <h3>Varukorg</h3>
      <CartItemsList />
      <CartTotalPriceList />
    </div>
  )
}
