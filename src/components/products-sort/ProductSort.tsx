import { searchFilterChannel } from '@/eventbus/channels/search-filter-channel'
import { SearchResultSortParameter } from '@/gql/graphql'
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
    searchFilterChannel.emit('onSort', sortOption)
  }, [])

  return <Wrapper {...rest}>{children({ handleSortOptionChange })}</Wrapper>
}
