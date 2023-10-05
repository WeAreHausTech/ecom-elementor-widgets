import ShippingAddress from './ShippingAddress'
import BillingAddress from './BillingAddress'
import AddressFields from './AddressFields'
import { useOrderMessage } from '@haus-tech/ecom-components'
import { useEffect } from 'react'

import { useState } from 'react'
interface AddressProps {
  onSuccess: () => void
}

const Address = ({ onSuccess }: AddressProps) => {
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
    console.log('success');
    // if (!orgNumber) {
    //   setOrgNrError('Vänligen fyll i organisationsnummer')
    //   return
    // }

    // if (orderMessage || orgNumber) {
    //   updateCustomFields()
    // }

    // if (updateOrderMessageLoading && updateOrderMessageError) {
    //   return
    // }

    // if (type === 'billing' && !addBillingAddress) {
    //   onSuccess()
    // }

    // if (type === 'shipping' && addBillingAddress) {
    //   onSuccess()
    // }
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
      <AddressFields onSuccess={() => success('billing')} />

      {/* <AddressFields billingAdress={true} onSuccess={() => success('billing')} /> */}
      {/* <div className="orgnumber-field">
        <label>Organisationsnummer</label>
        <input
          required
          type="text"
          value={orgNumber}
          onChange={(e) => setOrgNumber(e.target.value)}
        />
        {orgNrError && <div className="error">{orgNrError}</div>}
      </div>
      <BillingAddress
        sameBillingAddress={!addBillingAddress}
        onSuccess={() => success('billing')}
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
          <ShippingAddress sameBillingAddress={false} onSuccess={() => success('shipping')} />
        </div>
      )}

      <div className="order-message">
        <label>Ordermeddelande</label>
        <textarea value={orderMessage} onChange={(e) => setOrderMessage(e.target.value)} />
      </div>
      {updateOrderMessageError && <div className="error">{updateOrderMessageError.message}</div>} */}
    </div>
  )
}

export default Address
