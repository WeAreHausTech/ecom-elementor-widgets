import { ReactNode, useEffect, useState } from 'react'
import { ListedProductFragment, ListedCollectionFragment, SearchInput } from '@/gql/graphql'
import { searchChannel } from '@/eventbus/channels/search-channel'
import { useImmer } from 'use-immer'
import {
  LISTED_PRODUCT_FRAGMENT,
  LISTED_COLLECTION_FRAGMENT,
  TOPSEARCH,
} from '@/providers/vendure/products/products'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, GenericApolloError } from '@/types'
import { useCustomLazyQuery } from '@/hooks/useCustomLazyQuery'

type SearchInputProps = Pick<SearchInput, 'term' | 'take' | 'groupByProduct'>
export interface SearchResultProps extends CustomHTMLElement {
  searchInputProps?: SearchInputProps
  children: (props: {
    loading: boolean
    error: GenericApolloError
    products: ListedProductFragment[]
    collections: ListedCollectionFragment[]
    active: boolean
  }) => ReactNode
}

export const SearchResults = ({
  wrapperTag: Wrapper = 'div',
  searchInputProps,
  children,
  ...rest
}: SearchResultProps) => {
  const { term, groupByProduct = true, take = 3 } = searchInputProps || {}
  const [products, setProducts] = useImmer<ListedProductFragment[]>([])
  const [collections, setCollections] = useImmer<ListedCollectionFragment[]>([])
  const [active, setActive] = useState(false)

  const [variables, setVariables] = useImmer<SearchInput>({
    term,
    groupByProduct,
    take,
  })

  const [getSearchResults, { loading, data, error }] = useCustomLazyQuery(TOPSEARCH, {
    variables: { input: variables },
  })

  useEffect(() => {
    if (data?.search) {
      const { items, collections } = data.search
      const productItems = items.map((item) => getFragmentData(LISTED_PRODUCT_FRAGMENT, item))
      const collectionsData = collections.map((collection) =>
        getFragmentData(LISTED_COLLECTION_FRAGMENT, collection.collection),
      )

      setProducts(productItems)
      setCollections(collectionsData)
    }
  }, [data, setProducts, setCollections])

  useEffect(() => {
    const unsubscribeFromSearch = searchChannel.on('search:term', (data) => {
      setVariables((draft) => {
        draft.term = data
      })
      setActive(true)
      getSearchResults()
    })

    const clearSearch = searchChannel.on('search:clear', () => {
      setProducts([])
      setCollections([])
      setActive(false)
    })

    return () => {
      unsubscribeFromSearch()
      clearSearch()
    }
  }, [getSearchResults, setVariables, setProducts, setCollections])

  return <Wrapper {...rest}>{children({ loading, error, products, collections, active })}</Wrapper>
}
