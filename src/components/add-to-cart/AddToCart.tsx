import { ApolloError, useMutation } from '@apollo/client'
import { ADD_ITEM_TO_ORDER } from '@/providers/vendure/cart/activeOrders'
import { ReactNode } from 'react'
import { CartAction, cartChannel } from '../../eventbus/channels/cart-channel'
import { CustomHTMLElement, Loading } from '@/types'

interface AddToCartProps extends CustomHTMLElement {
  children: (props: {
    addProductToCart: (productVariantId: string, quantity: number) => void
    error: ApolloError | undefined
    loading: Loading
  }) => ReactNode
}

export const AddToCart = ({ wrapperTag: Wrapper = 'div', children, ...rest }: AddToCartProps) => {
  const [updateCart, { error, loading }] = useMutation(ADD_ITEM_TO_ORDER)

  const addProductToCart = async (productVariantId: string, quantity: number) => {
    const addedProduct = await updateCart({
      variables: { productVariantId: productVariantId, quantity: quantity },
    })
    if (addedProduct.data) {
      cartChannel.emit('cart:updated', { data: addedProduct.data, action: CartAction.ADD })
    }
  }

  return (
    <Wrapper {...rest}>
      {children({
        addProductToCart,
        error,
        loading: { 'cart:addToCart': loading },
      })}
    </Wrapper>
  )
}
