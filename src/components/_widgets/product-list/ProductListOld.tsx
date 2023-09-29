import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'
import { ListedProductFragment, SearchInput, SortOrder } from '@/gql/graphql'
import { LISTED_PRODUCT_FRAGMENT, SEARCH } from '@/providers/vendure/products/products'
import { getFragmentData } from '@/gql'
import { searchFilterChannel } from '@/eventbus/channels/search-filter-channel'
import { isEqual, isNumber, omit } from 'lodash'
import { CustomHTMLElement, GenericApolloError, Loading, Pagination, SearchProduct } from '@/types'
import { usePreviousPersistent } from '@/hooks/usePreviousPersistent'
import { useCustomLazyQuery } from '@/hooks/useCustomLazyQuery'

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

  const previousVariables = usePreviousPersistent(variables)

  const [products, setProducts] = useImmer<SearchProduct[]>([])

  const [pagination, setPagination] = useState<Pagination | undefined>(undefined)

  const [getSearchData, { loading, error, data }] = useCustomLazyQuery(SEARCH)

  const calculatedPagination = useMemo<Pagination | undefined>(() => {
    const { skip } = variables
    const { take } = searchInputProps || {}

    if (data && isNumber(skip) && isNumber(take)) {
      const { search } = data
      const { totalItems } = search
      const calculatedSkip = infinitePagination ? products.length : skip
      const totalPages = Math.ceil(totalItems / take)
      const currentPage = infinitePagination
        ? Math.ceil(calculatedSkip / take)
        : Math.ceil(skip / take) + 1
      const canGoBack = currentPage > 1
      const canGoForward = currentPage < totalPages

      const nextPage = () => {
        if (canGoForward) {
          setVariables((draft) => {
            draft.skip = infinitePagination ? calculatedSkip : skip + take
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
  }, [variables, data, products, infinitePagination, searchInputProps, setVariables])

  useEffect(() => {
    if (
      calculatedPagination &&
      !isEqual(
        omit(calculatedPagination, ['nextPage', 'prevPage']),
        omit(pagination, ['nextPage', 'prevPage']),
      )
    ) {
      setPagination(calculatedPagination)
    }
  }, [calculatedPagination, pagination, setPagination])

  useEffect(() => {
    const unsubscribeFromSort = searchFilterChannel.on('search-filter:sort', (data) => {
      setProducts([])
      setVariables((draft) => {
        draft.sort = data
        if (infinitePagination) {
          draft.skip = 0
          const newTake = pagination?.currentPage ? pagination.currentPage * (take || 100) : take
          draft.take = newTake
        }
      })
    })

    return () => {
      unsubscribeFromSort()
    }
  }, [pagination?.currentPage, infinitePagination, take, setVariables, setProducts])

  const fetchSearchResults = useCallback(() => {
    // Check if we need to refetch the data
    if (previousVariables && variables) {
      const { term, collectionId, facetValueFilters, take, skip, sort } = variables
      const {
        term: prevTerm,
        collectionId: prevCollectionId,
        facetValueFilters: prevFacetValueFilters,
        take: prevTake,
        skip: prevSkip,
        sort: prevSort,
      } = previousVariables

      const initialTake = searchInputProps?.take || 100

      const allVariablesSet =
        isNumber(take) && isNumber(skip) && isNumber(prevTake) && isNumber(prevSkip)
      const variablesChanged =
        term !== prevTerm ||
        collectionId !== prevCollectionId ||
        facetValueFilters !== prevFacetValueFilters ||
        sort !== prevSort

      // If some variables except skip and take changed, we need to refetch and then return
      if (variablesChanged) {
        getSearchData({
          variables: { input: variables },
        })

        setVariables((draft) => {
          draft.take = initialTake
        })
        return
      }

      if (allVariablesSet && take === initialTake && take === prevTake) {
        getSearchData({
          variables: { input: variables },
        })
      }
    } else if (!previousVariables && products.length === 0) {
      // Should be first fetch
      getSearchData({
        variables: { input: variables },
      })
    }
  }, [variables, previousVariables, searchInputProps?.take, products, getSearchData, setVariables])

  useEffect(() => {
    fetchSearchResults()
  }, [fetchSearchResults, variables])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('search')) {
      const searchTerm = searchParams.get('search')
      setVariables((draft) => {
        draft.term = searchTerm
      })
    }
  }, [setVariables])

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
          draft.push(...productItems)
        })
      } else {
        setProducts(productItems)
      }
    }
  }, [data, infinitePagination, setProducts])

  return (
    <Wrapper {...rest}>
      {children({ loading: { 'productList:search': loading }, products, pagination, error })}
    </Wrapper>
  )
}
