import { ReactNode } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import {
  ACTIVE_ORDER_TOTAL_PRICE,
  TOTAL_PRICE_FRAGMENT,
} from '@/providers/vendure/cart/activeOrders'
import { ListedTotalPriceFragment } from '@/gql/graphql'
import { cartChannel } from '../../eventbus/channels/cart-channel'
import { getFragmentData } from '@/gql'

interface CartContentsProps extends CustomHTMLElement {
  children: (props: {
    totalPrice: null | ListedTotalPriceFragment
    loading: boolean
    error: ApolloError | undefined
  }) => ReactNode
}

export const CartTotals = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: CartContentsProps) => {
  const { loading, error, data, refetch } = useQuery(ACTIVE_ORDER_TOTAL_PRICE)

  cartChannel.on('onUpdateCart', () => {
    refetch()
  })

  const totalPrice = getFragmentData(TOTAL_PRICE_FRAGMENT, data?.activeOrder) ?? null

  return <Wrapper {...rest}>{children({ loading, error, totalPrice })}</Wrapper>
}
