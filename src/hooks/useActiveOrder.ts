import { GET_ACTIVE_ORDER } from '@/providers/vendure/order/order'
import { useCustomQuery } from './useCustomQuery'

export const useActiveOrder = () => {
  return useCustomQuery(GET_ACTIVE_ORDER)
}
