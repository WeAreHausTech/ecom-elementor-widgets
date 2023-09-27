import {
  ApolloCache,
  ApolloClient,
  ApolloError,
  DefaultContext,
  FetchResult,
  LazyQueryExecFunction,
  MutationFunctionOptions,
  OperationVariables,
  QueryResult,
} from '@apollo/client'
import { HTMLAttributes, ReactNode } from 'react'
import { ErrorResult, FacetValueResult, ListedProductFragment } from './gql/graphql'

export type Maybe<T> = T | undefined

export interface Pagination {
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
  canGoBack: boolean
  canGoForward: boolean
  infinitePagination: boolean
  nextPage: () => void
  prevPage: () => void
}

type LoadingKey = string | number | symbol
type LoadingMap = Record<LoadingKey, boolean>
export type Loading<T extends keyof LoadingMap> = Record<T, boolean>

export type GenericApolloError = ApolloError | ErrorResult | undefined
interface CustomMutationResult<TData = unknown> {
  data?: TData | null
  error?: GenericApolloError
  loading: boolean
  called: boolean
  client: ApolloClient<object>
  reset(): void
}
export type CustomMutationTuple<
  TData,
  TVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<unknown> = ApolloCache<unknown>,
> = [
  (
    options?: MutationFunctionOptions<TData, TVariables, TContext, TCache>,
  ) => Promise<FetchResult<TData>>,
  CustomMutationResult<TData>,
]

export type CustomLazyQueryResultTuple<TData, TVariables extends OperationVariables> = [
  LazyQueryExecFunction<TData, TVariables>,
  Omit<QueryResult<TData, TVariables>, 'error'> & { error: GenericApolloError },
]

export interface SearchProduct extends ListedProductFragment {
  facetValues: FacetValueResult
}

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

// export type ChildrenProps<T> = ((props: T) => ReactNode | ReactElement) | ReactNode

export type ChildrenProps<ChildProps = object> = ((props: ChildProps) => ReactNode) | ReactNode

export type CustomHTMLElement<T = HTMLOrSVGElement, U = object> = Omit<
  HTMLAttributes<T>,
  'children'
> & {
  wrapperTag?: keyof JSX.IntrinsicElements
} & U

// export interface CustomHTMLElement extends Omit<HTMLAttributes<HTMLOrSVGElement>, 'children'> {
//   wrapperTag?: keyof JSX.IntrinsicElements
// }
