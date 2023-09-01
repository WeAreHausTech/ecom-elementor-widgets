import { useQuery } from '@apollo/client'
import { ReactNode, useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { ListedProductFragment, SearchInput, SortOrder } from '@/gql/graphql'
import { LISTED_PRODUCT_FRAGMENT, SEARCH_PRODUCTS } from '@/providers/vendure/products/products'
import { getFragmentData } from '@/gql'

type SearchInputProps = Pick<
  SearchInput,
  'collectionId' | 'facetValueFilters' | 'groupByProduct' | 'sort' | 'take'
>
interface ProductListProps extends SearchInputProps, CustomHTMLElement {
  children: (props: { loading: boolean; products?: ListedProductFragment[] }) => ReactNode
}

export const ProductList = ({
  wrapperTag: Wrapper = 'div',
  children,
  collectionId,
  ...rest
}: ProductListProps) => {
  const [variables] = useImmer<SearchInput>({
    collectionId: collectionId,
    facetValueFilters: [{ or: [] }],
    groupByProduct: true,
    sort: { name: SortOrder.Asc },
    take: -1,
  })

  const { loading, error, data, refetch } = useQuery(SEARCH_PRODUCTS, {
    variables: { input: variables },
  })

  useEffect(() => {
    refetch()
  }, [variables, refetch])

  const products = useMemo(() => {
    return data?.search.items.map((item) => getFragmentData(LISTED_PRODUCT_FRAGMENT, item))
  }, [data?.search.items])

  if (error) return <div>{error.message}</div>

  return <Wrapper {...rest}>{children({ loading, products })}</Wrapper>
}
