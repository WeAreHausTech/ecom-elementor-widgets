import { useCustomQuery } from './useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { ADD_PAYMENT_TO_ORDER } from '@/providers/vendure/order/order'
import { ELIGIBLE_PAYMENT_METHODS } from '@/providers/vendure/payment/payment'

export const usePaymentMethods = () => {
  const query = useCustomQuery(ELIGIBLE_PAYMENT_METHODS)
  const mutation = useCustomMutation(ADD_PAYMENT_TO_ORDER)

  return { query, mutation }
}
