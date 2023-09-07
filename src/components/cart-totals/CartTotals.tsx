import { ReactNode, useEffect } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import {
  ACTIVE_ORDER_TOTAL_PRICE,
  TOTAL_PRICE_FRAGMENT,
} from '@/providers/vendure/cart/activeOrders'
import { ListedTotalPriceFragment } from '@/gql/graphql'
import { cartChannel } from '../../eventbus/channels/cart-channel'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, Loading } from '@/types'

interface CartContentsProps extends CustomHTMLElement {
  children: (props: {
    totalPrice: null | ListedTotalPriceFragment
    loading: Loading
    error: ApolloError | undefined
  }) => ReactNode
}

export const CartTotals = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: CartContentsProps) => {
  const { loading, error, data, refetch } = useQuery(ACTIVE_ORDER_TOTAL_PRICE)

  useEffect(() => {
    const unsubscribeFromCartUpdated = cartChannel.on('cart:updated', () => {
      refetch()
    })

    return () => {
      unsubscribeFromCartUpdated()
    }
  }, [refetch])

  const totalPrice = getFragmentData(TOTAL_PRICE_FRAGMENT, data?.activeOrder) ?? null

  return (
    <Wrapper {...rest}>
      {children({ loading: { 'cart:fetchTotals': loading }, error, totalPrice })}
    </Wrapper>
  )
}
