import { ReactNode } from 'react'
import {
  NEXT_ORDER_STATES,
  TRANSISTION_ORDER_TO_STATE,
} from '@/providers/vendure/order-states/orderStates'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { useCustomQuery } from '@/hooks/useCustomQuery'

export interface OrderStateProps extends CustomHTMLElement {
  children: (props: {
    loading: Loading<'order:changeState' | 'order:nextState'>
    error: GenericApolloError
    nextStates: string[] | null
    changeOrderState: (state: string) => void
  }) => ReactNode
}

export const OrderState = ({ wrapperTag: Wrapper = 'div', children, ...rest }: OrderStateProps) => {
  const {
    loading: nextOrderStateLoading,
    error: nextOrderStateError,
    data: nextOrderStateData,
  } = useCustomQuery(NEXT_ORDER_STATES)

  const [changeToArrangingPaymentState, { error: updateStateError, loading: updateStateLoading }] =
    useCustomMutation(TRANSISTION_ORDER_TO_STATE)

  const changeOrderState = (state: string) => {
    if (state) {
      changeToArrangingPaymentState({
        variables: { input: state },
      })
    }
  }

  const nextStates = nextOrderStateData?.nextOrderStates || null

  return (
    <Wrapper {...rest}>
      {children({
        nextStates: nextStates,
        loading: {
          'order:changeState': updateStateLoading,
          'order:nextState': nextOrderStateLoading,
        },
        error: updateStateError || nextOrderStateError,
        changeOrderState,
      })}
    </Wrapper>
  )
}
