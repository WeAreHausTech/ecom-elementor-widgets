import {
  AddItemToOrderMutation,
  AdjustOrderLineMutation,
  ListedOrderLinesFragment,
  RemoveOrderLineMutation,
} from '@/gql/graphql'
import { GenericApolloError } from '@/types'
import { eventbus } from '../eventbus'

export enum CartAction {
  ADD = 'add',
  REMOVE = 'remove',
  UPDATE = 'update',
  CLEAR = 'clear',
}

interface CartChannelPayload {
  data:
    | AddItemToOrderMutation
    | RemoveOrderLineMutation
    | AdjustOrderLineMutation
    | ListedOrderLinesFragment
  action: CartAction
}

interface CartChannelPayloadWithError {
  data:
    | AddItemToOrderMutation
    | RemoveOrderLineMutation
    | AdjustOrderLineMutation
    | GenericApolloError
  action: CartAction
}

export const cartChannel = eventbus<{
  'cart:updating': (payload: CartChannelPayload) => void
  'cart:updated': (payload: CartChannelPayload) => void
  'cart:error': (payload: CartChannelPayloadWithError) => void
}>()
