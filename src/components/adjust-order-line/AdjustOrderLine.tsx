import { CartAction, cartChannel } from '@/eventbus/channels/cart-channel'
import { getFragmentData } from '@/gql'
import { ListedOrderLinesFragment } from '@/gql/graphql'
import { useActiveOrder } from '@/hooks/useActiveOrder'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { ADJUST_ORDER_LINE, LISTED_ORDER_LINES_FRAGMENT } from '@/providers/vendure/order/order'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { ReactNode, useCallback } from 'react'

export interface AdjustOrderLineProps extends CustomHTMLElement {
  children: (props: {
    orderLines: readonly ListedOrderLinesFragment[]
    adjustOrderLine: (id: string, qty: number) => void
    error: GenericApolloError
    loading: Loading<'cart:adjustOrderLine'>
  }) => ReactNode
}

export const AdjustOrderLine = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: AdjustOrderLineProps) => {
  const { data } = useActiveOrder()
  const activeOrderLines =
    getFragmentData(LISTED_ORDER_LINES_FRAGMENT, data?.activeOrder?.lines) ?? []
  const [adjustOrderLineFunc, { error, loading }] = useCustomMutation(ADJUST_ORDER_LINE)

  const adjustOrderLine = useCallback(
    async (productId: string, quantity: number) => {
      const adjustedItem = await adjustOrderLineFunc({
        variables: { orderLineId: productId, quantity },
      })
      if (adjustedItem.data) {
        cartChannel.emit('cart:updated', { data: adjustedItem.data, action: CartAction.UPDATE })
      }
    },
    [adjustOrderLineFunc],
  )

  return (
    <Wrapper {...rest}>
      {children({
        orderLines: activeOrderLines,
        adjustOrderLine,
        error,
        loading: { 'cart:adjustOrderLine': loading },
      })}
    </Wrapper>
  )
}
