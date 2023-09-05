import { ReactNode } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import {
  ACTIVE_ORDER_LINES,
  ACTIVE_ORDER_LINE_FRAGMENT,
} from '@/providers/vendure/cart/activeOrders'
import { ListedOrderLinesFragment } from '@/gql/graphql'
import { cartChannel } from '../../eventbus/channels/cart-channel'
import { getFragmentData } from '@/gql'

interface CartContentsProps extends CustomHTMLElement {
  children: (props: {
    activeProducts: readonly ListedOrderLinesFragment[]
    loading: boolean
    error: ApolloError | undefined
  }) => ReactNode
}

export const CartContent = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: CartContentsProps) => {
  const { loading, error, data, refetch } = useQuery(ACTIVE_ORDER_LINES)

  cartChannel.on('onUpdateCart', () => {
    refetch()
  })

  const activeProducts = getFragmentData(ACTIVE_ORDER_LINE_FRAGMENT, data?.activeOrder?.lines) ?? []

  return <Wrapper {...rest}>{children({ loading, error, activeProducts })}</Wrapper>
}
