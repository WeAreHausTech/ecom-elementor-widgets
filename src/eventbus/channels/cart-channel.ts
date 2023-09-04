import { eventbus } from '../eventbus'

export const cartChannel = eventbus<{
  onUpdateCart: (payload: { message: string }) => void
}>()
