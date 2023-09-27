import { ChildrenProps, CustomHTMLElement } from '@/types'
import { searchChannel } from '@/eventbus/channels/search-channel'
import { debounce } from 'lodash'
import {
  HTMLAttributes,
  ReactEventHandler,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react'
import { Store, useStore } from '@tanstack/react-store'
import { useCustomLazyQuery } from '@/hooks/useCustomLazyQuery'
import {
  LISTED_COLLECTION_FRAGMENT,
  LISTED_PRODUCT_FRAGMENT,
  SEARCH,
} from '@/providers/vendure/products/products'
import { ListedProductFragment, ListedCollectionFragment, SearchInput } from '@/gql/graphql'
import { getFragmentData } from '@/gql'
import { renderChildren } from '@/utils/utils'
import { VendureImage } from '@/components'

type SearchInputProps = Pick<SearchInput, 'take' | 'groupByProduct'>
export interface SearchProps extends CustomHTMLElement {
  searchInputProps?: SearchInputProps
  children: ChildrenProps<{ term: string }>
}

export const Search = ({
  wrapperTag: Wrapper = 'div',
  searchInputProps,
  children,
  ...rest
}: SearchProps) => {
  const variables = useStore(variablesStore, (state) => state)
  const open = useStore(store, (state) => state.open)
  const { groupByProduct, take } = searchInputProps || { groupByProduct: true, take: 3 }

  useLayoutEffect(() => {
    variablesStore.setState((state) => ({
      ...state,
      groupByProduct: groupByProduct || true,
      take: take || 3,
    }))
  }, [groupByProduct, take])

  const [getSearchResults, { loading }] = useCustomLazyQuery(SEARCH, {
    onCompleted: (data) => {
      const { items, collections, totalItems } = data.search
      const productItems = items.map((item) => getFragmentData(LISTED_PRODUCT_FRAGMENT, item))
      const collectionsData = collections.map((collection) =>
        getFragmentData(LISTED_COLLECTION_FRAGMENT, collection.collection),
      )

      searchResultsStore.setState((state) => ({
        ...state,
        collections: collectionsData,
        items: productItems,
        totalItems,
      }))
    },
  })

  useEffect(() => {
    store.setState((state) => ({ ...state, loading }))
  }, [loading])

  const debouncedEmitter = useMemo(
    () =>
      debounce((variables) => {
        if (variables.term && variables.term.length > 2) {
          searchChannel.emit('search:term', variables.term)
          getSearchResults({ variables: { input: variables } })
        } else {
          searchResultsStore.setState((state) => ({
            ...state,
            collections: [],
            items: [],
            totalItems: 0,
          }))
        }
      }, 500),
    [getSearchResults],
  )

  useEffect(() => {
    debouncedEmitter(variables)
  }, [variables, debouncedEmitter])

  return (
    <Wrapper {...rest} data-loading={loading} data-open={open}>
      {renderChildren(children, { term: variables.term })}
    </Wrapper>
  )
}

// Input ==================================================
type InputProps = CustomHTMLElement<HTMLInputElement>
const Input = ({ onChange, ...rest }: InputProps) => {
  const term = useStore(variablesStore, ({ term }) => term)

  const handleChange: ReactEventHandler<HTMLInputElement> = (event) => {
    onChange?.(event)
    setTerm(event.currentTarget.value)
  }

  const debouncedOnBlur = useMemo(
    () =>
      debounce(() => {
        store.setState((state) => ({ ...state, open: false }))
      }, 250),
    [],
  )

  const handleOnFocus = () => {
    store.setState((state) => ({ ...state, open: true }))
  }

  return (
    <input
      {...rest}
      value={term}
      onChange={handleChange}
      onFocus={handleOnFocus}
      onBlur={debouncedOnBlur}
    />
  )
}

// Clear ==================================================

interface ClearProps extends HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}
const Clear = ({ children = 'X', onClick, ...rest }: ClearProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    searchChannel.emit('search:clear')
    onClick?.(event)
    setTerm('')
  }

  return (
    <button data-element="clear" {...rest} aria-label="Clear search term" onClick={handleClick}>
      {children}
    </button>
  )
}

// Search Content =========================================

interface SearchContentProps extends CustomHTMLElement {
  children?: ChildrenProps<{
    term: string
    totalItems: number
    items: ListedProductFragment[]
    collections: ListedCollectionFragment[]
    loading: boolean
  }>
}
const SearchContent = ({ wrapperTag: Wrapper = 'div', children, ...rest }: SearchContentProps) => {
  const term = useStore(variablesStore, ({ term }) => term)
  const searchResults = useStore(searchResultsStore)
  const { open, loading } = useStore(store, (state) => state)
  const { totalItems, items, collections } = searchResults

  return (
    <Wrapper {...rest} style={{ display: open ? 'inherit' : 'none' }}>
      {renderChildren(children, {
        term,
        totalItems,
        items,
        collections,
        loading,
      })}
    </Wrapper>
  )
}

// Search Content Product Item ============================

interface SearchContentProductItemProps extends HTMLAttributes<HTMLAnchorElement> {
  item: ListedProductFragment
  children: ReactNode
}
const SearchContentProductItem = ({
  item,
  onClick,
  children,
  ...rest
}: SearchContentProductItemProps) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    store.setState((state) => ({ ...state, open: false }))
  }

  return (
    <a href={`/products/${item.slug}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

interface ProductImageProps extends HTMLAttributes<HTMLImageElement> {
  item: ListedProductFragment
  imageSize?: [number, number]
}

const ProductImage = ({ item, imageSize, ...rest }: ProductImageProps) => {
  const { productAsset } = item
  const { preview } = productAsset || { preview: '' }

  return <VendureImage src={preview} alt={item.productName} imageSize={imageSize} {...rest} />
}

interface SearchContentCollectionItemProps extends HTMLAttributes<HTMLAnchorElement> {
  item: ListedCollectionFragment
  children: ReactNode
}
const SearchContentCollectionItem = ({
  item,
  onClick,
  children,
  ...rest
}: SearchContentCollectionItemProps) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    store.setState((state) => ({ ...state, open: false }))
  }

  return (
    <a href={`/collections/${item.slug}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

interface CollectionImageProps extends HTMLAttributes<HTMLImageElement> {
  item: ListedCollectionFragment
  imageSize?: [number, number]
}

const CollectionImage = ({ item, imageSize, ...rest }: CollectionImageProps) => {
  const { featuredAsset } = item
  const { preview } = featuredAsset || { preview: '' }

  return <VendureImage src={preview} alt={item.name} imageSize={imageSize} {...rest} />
}

// Store ==================================================
const store = new Store({
  open: false,
  loading: false,
})

const variablesStore = new Store({
  term: '',
  groupByProduct: true,
  take: 3,
})

const setTerm = (term: string) => {
  variablesStore.setState((state) => {
    return {
      ...state,
      term,
    }
  })
}

interface SearchResultsStoreProps {
  collections: ListedCollectionFragment[]
  items: ListedProductFragment[]
  totalItems: number
}
const searchResultsStore = new Store<SearchResultsStoreProps>({
  collections: [],
  items: [],
  totalItems: 0,
})

Search.Input = Input
Search.Clear = Clear
Search.Content = SearchContent
Search.ContentProductItem = SearchContentProductItem
Search.ProductImage = ProductImage
Search.ContentCollectionItem = SearchContentCollectionItem
Search.CollectionImage = CollectionImage
