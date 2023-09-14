import { OrderState as OrderStateWrapper } from '@haus-tech/ecom-components'
import { some } from 'lodash'

import { Button } from '../../button/Button'

interface OrderStateProps {
  onSuccess: () => void
  state: string
}

const OrderState = ({ onSuccess, state }: OrderStateProps) => {
  return (
    <OrderStateWrapper className="OrderState">
      {({ changeOrderState, loading, error }) => {
        const handleSubmit = async () => {
          await changeOrderState(state)

          if (!error) {
            onSuccess()
          }
        }

        return (
          <div>
            {error && <div className="error">{error.message}</div>}
            <Button
              color="blue"
              onClick={() => handleSubmit()}
              disabled={some(loading, (value) => value === true)}
            >
              {some(loading, (value) => value === true) ? 'Laddar...' : 'Till betalning'}
            </Button>
          </div>
        )
      }}
    </OrderStateWrapper>
  )
}
export default OrderState
