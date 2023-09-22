import { CustomHTMLElement } from '@/types'
import { searchChannel } from '@/eventbus/channels/search-channel'
import { debounce, get } from 'lodash'
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

type SearchInputProps = Pick<SearchInput, 'take' | 'groupByProduct'>
interface SearchProps extends CustomHTMLElement {
  searchInputProps?: SearchInputProps
  children: ReactNode | ((props: { term: string }) => ReactNode)
}

export const Search = ({
  wrapperTag: Wrapper = 'div',
  searchInputProps,
  children,
  ...rest
}: SearchProps) => {
  const variables = useStore(variablesStore, (state) => state)
  const { term } = variables
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
    variables: { input: variables },
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
      debounce((term) => {
        if (term) {
          searchChannel.emit('search:term', term)
          getSearchResults()
        }
      }, 500),
    [getSearchResults],
  )

  useEffect(() => {
    debouncedEmitter(term)
  }, [term, debouncedEmitter])

  return (
    <Wrapper {...rest} data-loading={loading} data-open={open}>
      {typeof children === 'function'
        ? children({
            term,
          })
        : children}
    </Wrapper>
  )
}

// Input ==================================================
interface InputProps extends CustomHTMLElement {
  clearElement?: ReactNode
}
const Input = ({ wrapperTag: Wrapper = 'div', clearElement, onChange, ...rest }: InputProps) => {
  const term = useStore(variablesStore, ({ term }) => term)

  const handleChange: ReactEventHandler<HTMLInputElement> = (event) => {
    onChange?.(event)
    setTerm(event.currentTarget.value)
  }

  return (
    <Wrapper style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
        <input
          {...rest}
          value={term}
          onChange={handleChange}
          onFocus={() => store.setState((state) => ({ ...state, open: true }))}
          onBlur={() => store.setState((state) => ({ ...state, open: false }))}
          style={{ width: '100%' }}
        />
        <Clear style={{ position: 'absolute', right: 0 }}>{clearElement}</Clear>
      </div>
    </Wrapper>
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
  children?:
    | ReactNode
    | ((props: {
        term: string
        totalItems: number
        items: ListedProductFragment[]
        collections: ListedCollectionFragment[]
        loading: boolean
      }) => ReactNode)
}
const SearchContent = ({ wrapperTag: Wrapper = 'div', children, ...rest }: SearchContentProps) => {
  const term = useStore(variablesStore, ({ term }) => term)
  const searchResults = useStore(searchResultsStore)
  const { open, loading } = useStore(store, (state) => state)
  const { totalItems, items, collections } = searchResults

  return (
    <Wrapper {...rest} style={{ display: open ? 'inherit' : 'none' }}>
      {typeof children === 'function'
        ? children({
            term,
            totalItems,
            items,
            collections,
            loading,
          })
        : children}
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

  return (
    <img
      src={`${preview}?w=${get(imageSize, [0], '128')}&h=${get(imageSize, [1], '128')}`}
      alt={item.productName}
      {...rest}
    />
  )
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
Search.Content = SearchContent
Search.ContentProductItem = SearchContentProductItem
Search.ProductImage = ProductImage
