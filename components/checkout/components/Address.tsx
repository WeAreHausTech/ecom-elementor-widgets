import ShippingAddress from './ShippingAddress'
import BillingAddress from './BillingAddress'
import { useState } from 'react'
interface AddressProps {
  onSuccess: () => void
}

const Address = ({ onSuccess }: AddressProps) => {
  const [addBillingAddress, setAddBillingAddress] = useState<boolean>(false)

  const success = (type: string) => {
    if (type === 'shipping' && !addBillingAddress) {
      onSuccess()
    }

    if (type === 'billing' && addBillingAddress) {
      onSuccess()
    }
  }
  return (
    <div className="adress">
      <ShippingAddress
        sameBillingAddress={!addBillingAddress}
        onSuccess={() => success('shipping')}
      />

      <label onClick={() => setAddBillingAddress(!addBillingAddress)}>
        <input type="checkbox" /> Jag har separat Faktureringsadress
      </label>

      {addBillingAddress && (
        <div>
          <h2>Faktureringsaddress</h2>
          <BillingAddress onSuccess={() => success('billing')} />
        </div>
      )}
    </div>
  )
}

export default Address