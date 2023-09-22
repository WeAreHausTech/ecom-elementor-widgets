import { ReactNode, useEffect } from 'react'
import { ListedOrderLinesFragment } from '@/gql/graphql'
import { cartChannel } from '@/eventbus/channels/cart-channel'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { GET_ACTIVE_ORDER, LISTED_ORDER_LINES_FRAGMENT } from '@/providers/vendure/order/order'

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
  const { loading, error, data, refetch } = useCustomQuery(GET_ACTIVE_ORDER)

  useEffect(() => {
    const unsubscribeFromCartUpdated = cartChannel.on('cart:updated', () => {
      refetch()
    })

    return () => {
      unsubscribeFromCartUpdated()
    }
  }, [refetch])

  const activeProducts =
    getFragmentData(LISTED_ORDER_LINES_FRAGMENT, data?.activeOrder?.lines) ?? []

  return (
    <Wrapper {...rest}>
      {children({ loading: { 'cart:content': loading }, error, activeProducts })}
    </Wrapper>
  )
}
