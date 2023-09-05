import { useQuery } from '@apollo/client'
import { ReactNode, useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { ListedProductFragment, SearchInput, SortOrder } from '@/gql/graphql'
import { LISTED_PRODUCT_FRAGMENT, SEARCH } from '@/providers/vendure/products/products'
import { getFragmentData } from '@/gql'
import { searchFilterChannel } from '@/eventbus/channels/search-filter-channel'
import { CustomHTMLElement } from '@/types'

type SearchInputProps = Pick<
  SearchInput,
  'term' | 'collectionId' | 'facetValueFilters' | 'groupByProduct' | 'sort' | 'take'
>
interface ProductListProps extends CustomHTMLElement {
  searchInputProps?: SearchInputProps
  children: (props: { loading: boolean; products?: ListedProductFragment[] }) => ReactNode
}

export const ProductList = ({
  wrapperTag: Wrapper = 'div',
  searchInputProps,
  children,
  ...rest
}: ProductListProps) => {
  const {
    term,
    collectionId,
    facetValueFilters = [{ or: [] }],
    groupByProduct = true,
    sort = { name: SortOrder.Asc },
    take = -1,
  } = searchInputProps || {}
  const [variables, setVariables] = useImmer<SearchInput>({
    term,
    collectionId,
    facetValueFilters,
    groupByProduct,
    sort,
    take,
  })

  const { loading, error, data, refetch } = useQuery(SEARCH, {
    variables: { input: variables },
  })

  useEffect(() => {
    const unsubscribeFromSort = searchFilterChannel.on('onSort', (data) => {
      setVariables((draft) => {
        draft.sort = data
        console.log(draft.sort, data)
      })
    })
    refetch()

    return () => {
      unsubscribeFromSort()
    }
  }, [refetch, setVariables])

  const products = useMemo(() => {
    return data?.search.items.map((item) => getFragmentData(LISTED_PRODUCT_FRAGMENT, item))
  }, [data?.search.items])

  if (error) return <div>{error.message}</div>

  return <Wrapper {...rest}>{children({ loading, products })}</Wrapper>
}
