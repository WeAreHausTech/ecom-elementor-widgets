import { ReactNode, useEffect } from 'react'
import {
  ACTIVE_ORDER_LINES,
  ACTIVE_ORDER_LINE_FRAGMENT,
} from '@/providers/vendure/cart/activeOrders'
import { ListedOrderLinesFragment } from '@/gql/graphql'
import { cartChannel } from '../../eventbus/channels/cart-channel'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomQuery } from '@/hooks/useCustomQuery'

export interface CartContentsProps extends CustomHTMLElement {
  children: (props: {
    activeProducts: readonly ListedOrderLinesFragment[]
    loading: Loading<'cart:content'>
    error: GenericApolloError
  }) => ReactNode
}

export const CartContent = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: CartContentsProps) => {
  const { loading, error, data, refetch } = useCustomQuery(ACTIVE_ORDER_LINES)

  useEffect(() => {
    const unsubscribeFromCartUpdated = cartChannel.on('cart:updated', () => {
      refetch()
    })

    return () => {
      unsubscribeFromCartUpdated()
    }
  }, [refetch])

  const activeProducts = getFragmentData(ACTIVE_ORDER_LINE_FRAGMENT, data?.activeOrder?.lines) ?? []

  return (
    <Wrapper {...rest}>
      {children({ loading: { 'cart:content': loading }, error, activeProducts })}
    </Wrapper>
  )
}
