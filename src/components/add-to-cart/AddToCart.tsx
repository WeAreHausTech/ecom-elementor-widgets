import { ReactNode } from 'react'
import { CartAction, cartChannel } from '../../eventbus/channels/cart-channel'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { ADD_ITEM_TO_ORDER } from '@/providers/vendure/order/order'

export interface AddToCartProps extends CustomHTMLElement {
  children: (props: {
    addProductToCart: (productVariantId: string, quantity: number) => void
    error: GenericApolloError
    loading: Loading<'cart:addToCart'>
  }) => ReactNode
}

export const AddToCart = ({ wrapperTag: Wrapper = 'div', children, ...rest }: AddToCartProps) => {
  const [updateCart, { error, loading }] = useCustomMutation(ADD_ITEM_TO_ORDER)

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
