import { useQuery } from '@apollo/client'
import { ReactNode, useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { ListedProductFragment, SearchInput, SortOrder } from '@/gql/graphql'
import { LISTED_PRODUCT_FRAGMENT, SEARCH } from '@/providers/vendure/products/products'
import { getFragmentData } from '@/gql'
import { searchFilterChannel } from '@/eventbus/channels/search-filter-channel'
import { isNumber } from 'lodash'
import { CustomHTMLElement, Loading, Pagination } from '@/types'

type SearchInputProps = Pick<
  SearchInput,
  'term' | 'collectionId' | 'facetValueFilters' | 'groupByProduct' | 'sort' | 'take'
>
interface ProductListProps extends CustomHTMLElement {
  searchInputProps?: SearchInputProps
  infinitePagination?: boolean
  children: (props: {
    loading: Loading<'productList:search'>
    products: ListedProductFragment[]
    pagination?: Pagination
  }) => ReactNode
}

export const ProductList = ({
  wrapperTag: Wrapper = 'div',
  searchInputProps,
  infinitePagination = false,
  children,
  ...rest
}: ProductListProps) => {
  const {
    term,
    collectionId,
    facetValueFilters = [{ or: [] }],
    groupByProduct = true,
    sort = { name: SortOrder.Asc },
    take = 100,
  } = searchInputProps || {}

  const [variables, setVariables] = useImmer<SearchInput>({
    term,
    collectionId,
    facetValueFilters,
    groupByProduct,
    sort,
    take,
    skip: 0,
  })

  const [products, setProducts] = useImmer<ListedProductFragment[]>([])

  const { loading, error, data, refetch } = useQuery(SEARCH, {
    variables: { input: variables },
  })

  useEffect(() => {
    const unsubscribeFromSort = searchFilterChannel.on('search-filter:sort', (data) => {
      setProducts([])
      setVariables((draft) => {
        draft.sort = data
      })
    })

    return () => {
      unsubscribeFromSort()
    }
  }, [refetch, setVariables, setProducts])

  useEffect(() => {
    refetch()
  }, [refetch, variables])

  useEffect(() => {
    if (data?.search?.items) {
      const { items } = data.search
      const productItems = items.map((item) => getFragmentData(LISTED_PRODUCT_FRAGMENT, item))
      if (infinitePagination) {
        setProducts((draft) => {
          const existingProducts = draft.map((item) => item.productId)
          const newProducts = productItems.filter(
            (item) => !existingProducts.includes(item.productId),
          )

          draft.push(...newProducts)
        })
      } else {
        setProducts(productItems)
      }
    }
  }, [data, infinitePagination, setProducts])

  const pagination = useMemo<Pagination | undefined>(() => {
    const { take, skip } = variables

    if (data && isNumber(skip) && isNumber(take)) {
      const { search } = data
      const { totalItems } = search
      const totalPages = Math.ceil(totalItems / take)
      const currentPage = Math.ceil(skip / take) + 1
      const canGoBack = currentPage > 1
      const canGoForward = currentPage < totalPages

      const nextPage = () => {
        if (canGoForward) {
          setVariables((draft) => {
            draft.skip = skip + take
          })
        }
      }

      const prevPage = () => {
        if (canGoBack && !infinitePagination) {
          setVariables((draft) => {
            draft.skip = skip - take
          })
        }
      }

      return {
        totalItems,
        totalPages,
        currentPage,
        canGoBack,
        canGoForward,
        nextPage,
        prevPage,
      }
    }
  }, [variables, data, infinitePagination, setVariables])

  if (error) return <div>{error.message}</div>

  return (
    <Wrapper {...rest}>
      {children({ loading: { 'productList:search': loading }, products, pagination })}
    </Wrapper>
  )
}
