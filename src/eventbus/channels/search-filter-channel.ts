import { SearchResultSortParameter } from '@/gql/graphql'
import { eventbus } from '../eventbus'

export const searchFilterChannel = eventbus<{
  onSort: (payload: SearchResultSortParameter) => void
}>()
