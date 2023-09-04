import { useMutation } from '@apollo/client'
import { ADD_ITEM_TO_ORDER } from '@/providers/vendure/cart/activeOrders'
import { ReactNode } from 'react'
import { cartChannel } from '../../eventbus/channels/cart-channel'

interface AddToCartProps extends CustomHTMLElement {
  children: (props: {
    addProductToCart: (productVariantId: string, quantity: number) => void
    isError: boolean
    success: boolean
  }) => ReactNode
}

export const AddToCart = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: AddToCartProps) => {
  let success = false
  let isError = false

  const [updateCart, { error, data }] = useMutation(ADD_ITEM_TO_ORDER)

  if (error) {
    isError = true
  }

  if (data) {
    cartChannel.emit('onUpdateCart', { message: 'Cart updated' })
    success = true
  }

  const addProductToCart = (productVariantId: string, quantity: number) => {
    updateCart({ variables: { productVariantId: productVariantId, quantity: quantity } })
  }

  return <Wrapper {...rest}>{children({ addProductToCart, success, isError })}</Wrapper>
}
