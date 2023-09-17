import { ReactNode, useEffect } from 'react'
import { cartChannel } from '../../eventbus/channels/cart-channel'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { GET_ACTIVE_ORDER, ORDER_PRICE_DATA_FRAGMENT } from '@/providers/vendure/order/order'
import { OrderPriceDataFragment } from '..'

export interface CartTotalsProps extends CustomHTMLElement {
  children: (props: {
    totalPrice: null | OrderPriceDataFragment
    loading: Loading<'cart:fetchTotals'>
    error: GenericApolloError
  }) => ReactNode
}

export const CartTotals = ({ wrapperTag: Wrapper = 'div', children, ...rest }: CartTotalsProps) => {
  const { loading, error, data, refetch } = useCustomQuery(GET_ACTIVE_ORDER)

  useEffect(() => {
    const unsubscribeFromCartUpdated = cartChannel.on('cart:updated', () => {
      refetch()
    })

    return () => {
      unsubscribeFromCartUpdated()
    }
  }, [refetch])

  const totalPrice = getFragmentData(ORDER_PRICE_DATA_FRAGMENT, data?.activeOrder) ?? null

  return (
    <Wrapper {...rest}>
      {children({ loading: { 'cart:fetchTotals': loading }, error, totalPrice })}
    </Wrapper>
  )
}
