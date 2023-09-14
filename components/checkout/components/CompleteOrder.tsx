import { Button } from '../../button/Button'
import { useCallback, useEffect, useState } from 'react'
import {
  usePaymentMethods,
  useShippingMethods,
  useOrderState,
  isErrorResult,
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
    await updatePaymentMethodFunc({
      variables: { input: { method: 'pre-payment', metadata: {} } },
    }).then((res) => {
      if (res === null) return
      if (isErrorResult(res?.data?.addPaymentToOrder)) {
        const errorCode = res?.data?.addPaymentToOrder.errorCode ?? ''
        setSubmitError(errorCode)
        return
      }

      if (!updatePaymentMethodError || updateOrderStateError || updateShippingMethodError) {
        onSuccess()
      }
    })
  }

  const finish = useCallback(async () => {
    await updateShippingMethodFunc({
      variables: { shippingMethodId: '1' }, //standard shipping methodid = 1
    })

    await updateOrderStateFunc({
      variables: { input: 'ArrangingPayment' },
    })
  }, [])

  useEffect(() => {
    finish()
  }, [finish])

  return (
    <div className="completeOrder">
      {submitError && <div className="error">Errorcode: {submitError}</div>}
      <Button
        color="blue"
        onClick={() => handleSubmit()}
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
