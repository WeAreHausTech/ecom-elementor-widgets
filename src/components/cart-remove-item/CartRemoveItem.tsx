import { ReactNode } from 'react'
import { CartAction, cartChannel } from '../../eventbus/channels/cart-channel'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { REMOVE_ORDER_LINE } from '@/providers/vendure/order/order'

export interface CartRemoveItemProps extends CustomHTMLElement {
  children: (props: {
    removeItem: (id: string) => void
    error: GenericApolloError
    loading: Loading<'cart:removeFromCart'>
  }) => ReactNode
}

export const CartRemoveItem = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: CartRemoveItemProps) => {
  const [updateCart, { error, loading }] = useCustomMutation(REMOVE_ORDER_LINE)

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
