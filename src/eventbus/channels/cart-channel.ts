import {
  AddItemToOrderMutation,
  AdjustOrderLineMutation,
  RemoveOrderLineMutation,
} from '@/gql/graphql'
import { eventbus } from '../eventbus'

export enum CartAction {
  ADD = 'add',
  REMOVE = 'remove',
  UPDATE = 'update',
  CLEAR = 'clear',
}

interface CartChannelPayload {
  data: AddItemToOrderMutation | RemoveOrderLineMutation | AdjustOrderLineMutation
  action: CartAction
}

export const cartChannel = eventbus<{
  'cart:updated': (payload: CartChannelPayload) => void
}>()
