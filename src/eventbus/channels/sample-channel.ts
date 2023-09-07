import { eventbus } from '../eventbus'

export const sampleChannel = eventbus<{
  'sample:message': (payload: { message: string }) => void
  'sample:add': (payload: { sampleId: number }) => void
}>()
