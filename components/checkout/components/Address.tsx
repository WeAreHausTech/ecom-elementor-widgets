import AddressFields from './AddressFields'
import { useOrderMessage } from '@haus-tech/ecom-components'
import { useEffect } from 'react'
import { Button } from '../../button/Button'

import { useState } from 'react'


interface AddressProps {
  onSuccess: () => void
  selectedCountry?: string
  setSelectedCountry?: (country: string) => void
}

const Address = ({ onSuccess, selectedCountry }: AddressProps) => {
  const { mutation: orderMessageMutation, query: submittedMessage } = useOrderMessage()
  const [orderMessage, setOrderMessage] = useState<string>('')
  const [orgNumber, setOrgNumber] = useState<string>('')
  const [orgNrError, setOrgNrError] = useState<string>('')
  const [submitAddress, setSubmitAddress] = useState<boolean>(false)

  useEffect(() => {
    if (submittedMessage) {
      const parts = submittedMessage.split('|')
      const orgNumberValue = parts[0].trim()
      const orderMessageValue = parts[1].trim()

      setOrderMessage(orderMessageValue)
      setOrgNumber(orgNumberValue)
    }
  }, [submittedMessage])

  const success = () => {
    onSuccess()
  }

  const handleSubmit = () => {
    if (!orgNumber) {
      setOrgNrError('Vänligen fyll i organisationsnummer')
      return
    }

    updateCustomFields()

    if (updateOrderMessageLoading && updateOrderMessageError) {
      return
    }

    setSubmitAddress(true)
  }

  const updateCustomFields = () => {
    const message = orgNumber + ' | ' + orderMessage;
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

      <AddressFields
        onSuccess={() => success()}
        submitAddress={submitAddress}
        setSubmitAddress={setSubmitAddress}
        selectedCountry={selectedCountry}
      />

      <Button color="blue" className="button" onClick={handleSubmit}>
        Fortsätt
      </Button>
    </div>
  )
}

export default Address
