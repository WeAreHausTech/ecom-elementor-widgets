import { Button } from '../../button/Button'
import { useState } from 'react'
import {
  usePaymentMethods,
  useShippingMethods,
  useOrderState,
  isError,
  GenericApolloError,
} from '@haus-tech/ecom-components'
import { useEffect } from 'react'
import { useOrderMessage } from '@haus-tech/ecom-components'

interface AddressProps {
  onSuccess: () => void
  selectedCountry?: string
  setSelectedCountry?: (country: string) => void
}

const CompleteOrder = ({ onSuccess }: AddressProps) => {
  const { mutation: paymentMethodMutation } = usePaymentMethods()
  const { mutation: shippingMethodMutation } = useShippingMethods()
  const { mutation: useOrderStateMutation } = useOrderState()
  const [submitError, setSubmitError] = useState('')
  const [orderMessage, setOrderMessage] = useState<string>('')
  const [orgNumber, setOrgNumber] = useState<string>('')
  const { mutation: orderMessageMutation, query: submittedMessage } = useOrderMessage()
  const [acceptConditions, setAcceptConditions] = useState<boolean>(false)

  useEffect(() => {
    if (submittedMessage) {
      const parts = submittedMessage.split('|')
      const orgNumberValue = parts[0].trim()
      const orderMessageValue = parts[1].trim()

      setOrderMessage(orderMessageValue)
      setOrgNumber(orgNumberValue)
    }
  }, [submittedMessage])

  const [
    updateOrderMessageFunc,
    { loading: updateOrderMessageLoading, error: updateOrderMessageError },
  ] = orderMessageMutation

  const [
    updateShippingMethodFunc,
    { loading: updateShippingtMethodLoading, error: updateShippingMethodError },
  ] = shippingMethodMutation

  const [
    updatePaymentMethodFunc,
    { loading: updatePaymentMethodLoading, error: updatePaymentMethodError },
  ] = paymentMethodMutation

  const [updateOrderStateFunc, { loading: updateOrderStateLoading, error: updateOrderStateError }] =
    useOrderStateMutation

  const updateOrderMessage = () => {
    const message = orgNumber + ' | ' + orderMessage
    updateOrderMessageFunc({
      variables: {
        input: {
          customFields: {
            CustomerMessage: message,
          },
        },
      },
    })
  }

  const handleSubmit = async () => {
    if (!acceptConditions) {
      setSubmitError('Du måste godkänna köpvillkoren')
      return
    }

    if (orderMessage !== '') {
      updateOrderMessage()
    }

    const tasks = [
      () =>
        updateShippingMethodFunc({
          variables: { shippingMethodId: '1' }, //standard shipping methodid = 1
        }),
      () =>
        updateOrderStateFunc({
          variables: { input: 'ArrangingPayment' },
        }),
      () =>
        updatePaymentMethodFunc({
          variables: { input: { method: 'pre-payment', metadata: {} } },
        }),
    ]

    for (const task of tasks) {
      const { data } = await task()
      if (isError(data)) {
        setSubmitError((data as GenericApolloError)?.message || 'Error')
        return
      }
    }

    if (
      !(
        updatePaymentMethodError ||
        updateOrderStateError ||
        updateShippingMethodError ||
        submitError ||
        updateOrderMessageError
      )
    ) {
      onSuccess()
    }
  }

  return (
    <div className="completeOrder">
      {submitError && <div className="error">{submitError}</div>}

      <div className="accept-conditions">
        <label>
          <input
            type="checkbox"
            checked={acceptConditions}
            onChange={() => setAcceptConditions(!acceptConditions)}
          />{' '}
          <span>
            Jag godkänner
            <a href={window.location.origin + '/kopvillkor'}> köpvillkoren</a> och intygar att
            angivna uppgifter är korrekt.{' '}
          </span>
        </label>
      </div>
      <div className="order-message">
        <label>Ordermeddelande</label>
        <textarea value={orderMessage} onChange={(e) => setOrderMessage(e.target.value)} />
      </div>
      <Button
        color="blue"
        onClick={handleSubmit}
        disabled={
          updateShippingtMethodLoading ||
          updatePaymentMethodLoading ||
          updateOrderStateLoading ||
          updateOrderMessageLoading
        }
      >
        {updateShippingtMethodLoading ||
        updatePaymentMethodLoading ||
        updateOrderStateLoading ||
        updateOrderMessageLoading
          ? 'Laddar...'
          : 'Slutför beställning'}
      </Button>
    </div>
  )
}

export default CompleteOrder
