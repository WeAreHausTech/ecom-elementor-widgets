import { useCustomQuery } from './useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { ELIGIBLE_ORDER_SHIPPING_METHODS } from '@/providers/vendure/checkout/checkout'
import { SET_ORDER_SHIPPING_METHOD } from '@/providers/vendure/order/order'

export const useShippingMethods = () => {
  const query = useCustomQuery(ELIGIBLE_ORDER_SHIPPING_METHODS)
  const mutation = useCustomMutation(SET_ORDER_SHIPPING_METHOD)

  return { query, mutation }
}
