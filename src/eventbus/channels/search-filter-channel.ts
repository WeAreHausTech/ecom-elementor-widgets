import { SearchResultSortParameter } from '@/gql/graphql'
import { eventbus } from '../eventbus'

export const searchFilterChannel = eventbus<{
  'search-filter:sort': (payload: SearchResultSortParameter) => void
}>()
