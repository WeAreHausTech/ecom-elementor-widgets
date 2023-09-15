import { useCustomQuery } from './useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import {
  UPDATE_BILLING_ADDRESS,
  ACTIVE_ORDER_BILLING_ADDRESS
  } from '@/providers/vendure/checkout/checkout'

export const useBillingAddress = () => {
  const query = useCustomQuery(ACTIVE_ORDER_BILLING_ADDRESS)
  const mutation = useCustomMutation(UPDATE_BILLING_ADDRESS)

  return { query, mutation }
}
