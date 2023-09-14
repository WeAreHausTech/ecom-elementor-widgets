import { PaymentMethods as PaymentMethodWrapper, isErrorResult } from '@haus-tech/ecom-components'
import { some } from 'lodash'
import { useState } from 'react'

import { Button } from '../../button/Button'

interface PaymentMethodsProps {
  onSuccess: () => void
}

const PaymentMethod = ({ onSuccess }: PaymentMethodsProps) => {
  const [submitError, setSubmitError] = useState('')
  return (
    <>
      <PaymentMethodWrapper className="PaymentMethod" paymentMethod="pre-payment">
        {({ updatePaymentMethod, loading, error }) => {
          const handleSubmit = async () => {
            await updatePaymentMethod().then((res) => {
              if (res === null) return
              if (isErrorResult(res?.data?.addPaymentToOrder)) {
                const errorCode = res?.data?.addPaymentToOrder.errorCode ?? ''
                setSubmitError(errorCode)
                return
              }

              if (!error) {
                onSuccess()
              }
            })
          }

          return (
            <div>
              {error && <div className="error">{error.message}</div>}
              {submitError && <div className="error">Errorcode: {submitError}</div>}
              <Button
                color="blue"
                onClick={() => handleSubmit()}
                disabled={some(loading, (value) => value === true)}
              >
                {some(loading, (value) => value === true) ? 'Laddar...' : 'Slutför beställning'}
              </Button>
            </div>
          )
        }}
      </PaymentMethodWrapper>
    </>
  )
}
export default PaymentMethod
