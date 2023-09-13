import { ReactNode, useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { ListedProductFragment, SearchInput, SortOrder } from '@/gql/graphql'
import { LISTED_PRODUCT_FRAGMENT, SEARCH } from '@/providers/vendure/products/products'
import { getFragmentData } from '@/gql'
import { searchFilterChannel } from '@/eventbus/channels/search-filter-channel'
import { isNumber } from 'lodash'
import { CustomHTMLElement, GenericApolloError, Loading, Pagination, SearchProduct } from '@/types'
import { useCustomQuery } from '@/hooks/useCustomQuery'

type SearchInputProps = Pick<
  SearchInput,
  'term' | 'collectionId' | 'facetValueFilters' | 'groupByProduct' | 'sort' | 'take'
>
export interface ProductListProps extends CustomHTMLElement {
  searchInputProps?: SearchInputProps
  infinitePagination?: boolean
  children: (props: {
    loading: Loading<'productList:search'>
    error: GenericApolloError
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

  const [products, setProducts] = useImmer<SearchProduct[]>([])

  const { loading, error, data, refetch } = useCustomQuery(SEARCH, {
    variables: { input: variables },
  })

  useEffect(() => {
    const unsubscribeFromSort = searchFilterChannel.on('search-filter:sort', (data) => {
      setProducts([])
      setVariables((draft) => {
        draft.sort = data
        draft.skip = 0
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
      const productItems = items.map((item) => {
        const productItem = getFragmentData(LISTED_PRODUCT_FRAGMENT, item) as SearchProduct
        // TODO: Append facet values to product item


        return productItem
      })
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
        itemsPerPage: take,
        infinitePagination,
        nextPage,
        prevPage,
      }
    }
  }, [variables, data, infinitePagination, setVariables])

  return (
    <Wrapper {...rest}>
      {children({ loading: { 'productList:search': loading }, products, pagination, error })}
    </Wrapper>
  )
}
