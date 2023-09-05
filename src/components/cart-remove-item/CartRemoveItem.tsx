import { ReactNode } from 'react'
import { REMOVE_ORDER_LINE } from '@/providers/vendure/cart/activeOrders'
import { useMutation } from '@apollo/client'
import { cartChannel } from '../../eventbus/channels/cart-channel'
import { CustomHTMLElement } from '@/types'

interface CartRemoveItemProps extends CustomHTMLElement {
  children: (props: {
    removeItem: (id: string) => void
    isError: boolean
    success: boolean
  }) => ReactNode
}

export const CartRemoveItem = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: CartRemoveItemProps) => {
  let success = false
  let isError = false

  const [updateCart, { error, data }] = useMutation(REMOVE_ORDER_LINE)

  if (data) {
    cartChannel.emit('onUpdateCart', { message: 'Cart updated' })
    success = true
  }

  if (error) {
    isError = true
  }

  const removeItem = (productId: string) => {
    updateCart({ variables: { orderLineId: productId } })
  }

  return <Wrapper {...rest}>{children({ removeItem, success, isError })}</Wrapper>
}
