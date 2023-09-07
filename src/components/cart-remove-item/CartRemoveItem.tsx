import { ReactNode } from 'react'
import { REMOVE_ORDER_LINE } from '@/providers/vendure/cart/activeOrders'
import { ApolloError, useMutation } from '@apollo/client'
import { CartAction, cartChannel } from '../../eventbus/channels/cart-channel'
import { CustomHTMLElement, Loading } from '@/types'

interface CartRemoveItemProps extends CustomHTMLElement {
  children: (props: {
    removeItem: (id: string) => void
    error: ApolloError | undefined
    loading: Loading
  }) => ReactNode
}

export const CartRemoveItem = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: CartRemoveItemProps) => {
  const [updateCart, { error, loading }] = useMutation(REMOVE_ORDER_LINE)

  const removeItem = async (productId: string) => {
    const removedItem = await updateCart({ variables: { orderLineId: productId } })
    if (removedItem.data) {
      cartChannel.emit('cart:updated', { data: removedItem.data, action: CartAction.REMOVE })
    }
  }

  return (
    <Wrapper {...rest}>
      {children({ removeItem, error, loading: { 'cart:removeFromCart': loading } })}
    </Wrapper>
  )
}
