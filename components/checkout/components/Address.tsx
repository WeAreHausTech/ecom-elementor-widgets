import ShippingAddress from './ShippingAddress'
import BillingAddress from './BillingAddress'
import { useState } from 'react'


interface AddressProps {
  onSuccess: () => void
  selectedCountry?: string
  setSelectedCountry?: (country: string) => void
}

const Address = ({ onSuccess, selectedCountry }: AddressProps) => {
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
      selectedCountry={selectedCountry}
        sameBillingAddress={!addBillingAddress}
        onSuccess={() => success('shipping')}
      />

      <div className="addressCheckbox">
        <label>
          <input
            type="checkbox"
            checked={addBillingAddress}
            onChange={() => setAddBillingAddress(!addBillingAddress)}
          />{' '}
          Jag har separat faktureringsadress
        </label>
      </div>

      {addBillingAddress && (
        <div className="billingAddress">
          <h2>Faktureringsaddress</h2>
          <BillingAddress selectedCountry={selectedCountry} onSuccess={() => success('billing')} />
        </div>
      )}
    </div>
  )
}

export default Address
