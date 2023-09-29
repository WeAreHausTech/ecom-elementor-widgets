import { searchFilterChannel } from '@/eventbus/channels/search-filter-channel'
import { getFragmentData } from '@/gql'
import { ListedProductFragment, SearchInput, SearchQuery, SortOrder } from '@/gql/graphql'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { LISTED_PRODUCT_FRAGMENT, SEARCH } from '@/providers/vendure/products/products'
import {
  ChildrenProps,
  CustomHTMLElement,
  GenericApolloError,
  Pagination,
  SearchProduct,
} from '@/types'
import { getPrice, renderChildren } from '@/utils/utils'
import { isNumber } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

type SearchInputProps = Pick<
  SearchInput,
  'term' | 'collectionId' | 'facetValueFilters' | 'groupByProduct' | 'sort' | 'take'
>
export interface ProductListProps extends CustomHTMLElement {
  searchInputProps?: SearchInputProps
  infinitePagination?: boolean
  frontEndPagination?: boolean
  children: ChildrenProps<{
    loading: boolean
    error: GenericApolloError
    products: ListedProductFragment[]
    pagination?: Pagination
  }>
}

export const ProductList = ({
  wrapperTag: Wrapper = 'div',
  searchInputProps,
  infinitePagination = true,
  frontEndPagination = true,
  children,
  ...rest
}: ProductListProps) => {
  const {
    term,
    collectionId,
    facetValueFilters = [{ or: [] }],
    groupByProduct = true,
    sort = { name: SortOrder.Asc },
    take = 25,
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

  const [pagination, setPagination] = useState<Pagination | undefined>(undefined)

  const setupProductItems = useCallback((data: SearchQuery) => {
    const productItems = data.search.items.map((item) => {
      const productItem = getFragmentData(LISTED_PRODUCT_FRAGMENT, item) as SearchProduct
      // TODO: Append facet values to product item
      return productItem
    })

    return productItems
  }, [])

  const { loading, error, data } = useCustomQuery(SEARCH, {
    variables: {
      input: frontEndPagination
        ? { term, collectionId, facetValueFilters, groupByProduct, sort, take: 99999999 }
        : variables,
    },
    onCompleted: (data) => {
      if (frontEndPagination) return
      const productItems = setupProductItems(data)

      setProducts((draft) => {
        infinitePagination ? draft.push(...productItems) : (draft = productItems)
        calculatePagination(data, draft)
        return draft
      })
    },
  })

  const calculatePagination = useCallback(
    (data: SearchQuery, products: SearchProduct[]) => {
      const skip = variables.skip || 0
      const take = searchInputProps?.take || 25
      const { totalItems } = data.search
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
            draft.take = take
          })
        }
      }

      const prevPage = () => {
        if (canGoBack && !infinitePagination) {
          setVariables((draft) => {
            draft.skip = skip - take
            draft.take = take
          })
        }
      }

      setPagination({
        totalItems,
        totalPages,
        currentPage,
        canGoBack,
        canGoForward,
        itemsPerPage: take,
        infinitePagination,
        nextPage,
        prevPage,
      })
    },
    [searchInputProps?.take, variables.skip, infinitePagination, setVariables],
  )

  // Setup data for frontend pagination
  useEffect(() => {
    if (!frontEndPagination || !data || !isNumber(variables.skip) || !isNumber(variables.take))
      return

    // productItems is all items that exist
    const allProductItems = setupProductItems(data)
    allProductItems.sort((a, b) => {
      if (variables.sort?.name === SortOrder.Asc) {
        return a.productName.localeCompare(b.productName)
      }
      if (variables.sort?.name === SortOrder.Desc) {
        return b.productName.localeCompare(a.productName)
      }
      if (variables.sort?.price === SortOrder.Asc) {
        return getPrice(a.price) - getPrice(b.price)
      }
      if (variables.sort?.price === SortOrder.Desc) {
        return getPrice(b.price) - getPrice(a.price)
      }
      return 0
    })

    const productItems = allProductItems.slice(variables.skip, variables.skip + variables.take)

    // Set products
    setProducts((draft) => {
      infinitePagination ? draft.push(...productItems) : (draft = productItems)
      calculatePagination(data, draft)
      return draft
    })
  }, [
    data,
    frontEndPagination,
    take,
    variables.skip,
    variables.take,
    variables.sort,
    infinitePagination,
    setProducts,
    calculatePagination,
    setupProductItems,
  ])

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

  return (
    <Wrapper {...rest}>
      {renderChildren(children, {
        loading: loading || false,
        error,
        products,
        pagination,
      })}
    </Wrapper>
  )
}
