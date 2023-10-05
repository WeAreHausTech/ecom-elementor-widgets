import ShippingAddress from './ShippingAddress'
import BillingAddress from './BillingAddress'
import { useOrderMessage } from '@haus-tech/ecom-components'
import { useEffect } from 'react'

import { useState } from 'react'


interface AddressProps {
  onSuccess: () => void
  selectedCountry?: string
  setSelectedCountry?: (country: string) => void
}

const Address = ({ onSuccess, selectedCountry }: AddressProps) => {
  const { mutation: orderMessageMutation, query: submittedMessage } = useOrderMessage()
  const [addBillingAddress, setAddBillingAddress] = useState<boolean>(false)
  const [orderMessage, setOrderMessage] = useState<string>('')
  const [orgNumber, setOrgNumber] = useState<string>('')
  const [orgNrError, setOrgNrError] = useState<string>('')

  useEffect(() => {
    if (submittedMessage) {
      const parts = submittedMessage.split('|')
      const orgNumberValue = parts[0].trim()
      const orderMessageValue = parts[1].trim()

      setOrderMessage(orderMessageValue)
      setOrgNumber(orgNumberValue)
    }
  }, [submittedMessage])

  const success = (type: string) => {
    if (!orgNumber) {
      setOrgNrError('Vänligen fyll i organisationsnummer')
      return
    }

    if (orderMessage || orgNumber) {
      updateCustomFields()
    }

    if (updateOrderMessageLoading && updateOrderMessageError) {
      return
    }

    if (type === 'shipping' && !addBillingAddress) {
      onSuccess()
    }

    if (type === 'billing' && addBillingAddress) {
      onSuccess()
    }
  }

  const updateCustomFields = () => {
    const message = orgNumber + ' | ' + orderMessage

    updateOrderMessage({
      variables: {
        input: {
          customFields: {
            CustomerMessage: message,
          },
        },
      },
    })
  }

  const [
    updateOrderMessage,
    { loading: updateOrderMessageLoading, error: updateOrderMessageError },
  ] = orderMessageMutation

  return (
    <div className="adress">
      <div className="orgnumber-field">
        <label>Organisationsnummer</label>
        <input
          required
          type="text"
          value={orgNumber}
          onChange={(e) => setOrgNumber(e.target.value)}
        />
        {orgNrError && <div className="error">{orgNrError}</div>}
      </div>
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

      <div className="order-message">
        <label>Ordermeddelande</label>
        <textarea value={orderMessage} onChange={(e) => setOrderMessage(e.target.value)} />
      </div>
      {updateOrderMessageError && <div className="error">{updateOrderMessageError.message}</div>}
    </div>
  )
}

export default Address
