import { searchFilterChannel } from '@/eventbus/channels/search-filter-channel'
import { SearchResultSortParameter } from '@/gql/graphql'
import { CustomHTMLElement } from '@/types'
import { ReactNode, useCallback } from 'react'

interface ProductSortProps extends CustomHTMLElement {
  children: (props: {
    handleSortOptionChange: (sortOption: SearchResultSortParameter) => void
  }) => ReactNode
}

export const ProductSort = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: ProductSortProps) => {
  const handleSortOptionChange = useCallback((sortOption: SearchResultSortParameter) => {
    searchFilterChannel.emit('search-filter:sort', sortOption)
  }, [])

  return <Wrapper {...rest}>{children({ handleSortOptionChange })}</Wrapper>
}
