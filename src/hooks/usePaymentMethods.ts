import { useCustomQuery } from './useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import {
  ELIGIBLE_PAYMENT_METHODS,
  UPDATE_PAYMENT_METHOD,
} from '@/providers/vendure/payment/payment'

export const usePaymentMethods = () => {
  const query = useCustomQuery(ELIGIBLE_PAYMENT_METHODS)
  const mutation = useCustomMutation(UPDATE_PAYMENT_METHOD)

  return { query, mutation }
}
