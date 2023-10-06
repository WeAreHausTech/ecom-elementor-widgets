import { Button } from '../../button/Button'
import { useState } from 'react'
import {
  usePaymentMethods,
  useShippingMethods,
  useOrderState,
  isError,
} from '@haus-tech/ecom-components'

interface AddressProps {
  onSuccess: () => void
}

const CompleteOrder = ({ onSuccess }: AddressProps) => {
  const { mutation: paymentMethodMutation } = usePaymentMethods()
  const { mutation: shippingMethodMutation } = useShippingMethods()
  const { mutation: useOrderStateMutation } = useOrderState()
  const [submitError, setSubmitError] = useState('')

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

  const handleSubmit = async () => {
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
      if (isError(data) || !data) {
        setSubmitError(
          updateShippingMethodError?.message ||
            updateOrderStateError?.message ||
            updatePaymentMethodError?.message ||
            'Error',
        )
        return
      }
    }

    if (
      !(
        updatePaymentMethodError ||
        updateOrderStateError ||
        updateShippingMethodError ||
        submitError
      )
    ) {
      onSuccess()
    }
  }

  return (
    <div className="completeOrder">
      {submitError && <div className="error">{submitError}</div>}
      <Button
        color="blue"
        onClick={handleSubmit}
        disabled={
          updateShippingtMethodLoading || updatePaymentMethodLoading || updateOrderStateLoading
        }
      >
        {updateShippingtMethodLoading || updatePaymentMethodLoading || updateOrderStateLoading
          ? 'Laddar...'
          : 'Slutför beställning'}
      </Button>
    </div>
  )
}

export default CompleteOrder
