import { cartChannel, CartAction } from '@/eventbus/channels/cart-channel'
import { ADD_ITEM_TO_ORDER } from '@/providers/vendure/order/order'
import { useCustomMutation } from './useCustomMutation'
import { isError } from '@/utils/utils'

export const useAddItemToOrder = () => {
  const [updateCart, { error, loading }] = useCustomMutation(ADD_ITEM_TO_ORDER)

  const addItemToOrder = async (productVariantId: string, quantity: number) => {
    updateCart({
      variables: { productVariantId: productVariantId, quantity: quantity },
      onCompleted: (data) => {
        cartChannel.emit(`cart:${isError(data) ? 'error' : 'updated'}`, {
          data,
          action: CartAction.ADD,
        })
      },
      onError: (error) => {
        cartChannel.emit('cart:error', { data: error, action: CartAction.ADD })
      },
    })
  }

  return { addItemToOrder, error, loading }
}
