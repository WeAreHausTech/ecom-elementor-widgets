import { useCustomQuery } from './useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import {
  NEXT_ORDER_STATES,
  TRANSISTION_ORDER_TO_STATE,
} from '@/providers/vendure/order-states/orderStates'

export const useOrderState = () => {
  const query = useCustomQuery(NEXT_ORDER_STATES)
  const mutation = useCustomMutation(TRANSISTION_ORDER_TO_STATE)

  return { query, mutation }
}
