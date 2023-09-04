import { eventbus } from '../eventbus'

export const sampleChannel = eventbus<{
  onSample: (payload: { message: string }) => void
  addSample: (payload: { sampleId: number }) => void
}>()
