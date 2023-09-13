import { eventbus } from '../eventbus'

export const searchChannel = eventbus<{
  'search:term': (payload: string) => void
  'search:clear': () => void
}>()
