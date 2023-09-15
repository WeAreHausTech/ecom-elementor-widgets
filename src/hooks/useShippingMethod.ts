import { useCustomQuery } from './useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import {
  ELIGIBLE_ORDER_SHIPPING_METHODS,
  SET_ORDER_SHIPPING_METHODS,
} from '@/providers/vendure/checkout/checkout'

export const useShippingMethods = () => {
  const query = useCustomQuery(ELIGIBLE_ORDER_SHIPPING_METHODS)
  const mutation = useCustomMutation(SET_ORDER_SHIPPING_METHODS)

  return { query, mutation }
}
