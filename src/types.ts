import {
  ApolloCache,
  ApolloClient,
  ApolloError,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
} from '@apollo/client'
import { HTMLAttributes } from 'react'
import { ErrorResult } from './gql/graphql'

export interface CustomHTMLElement extends Omit<HTMLAttributes<HTMLOrSVGElement>, 'children'> {
  wrapperTag?: keyof JSX.IntrinsicElements
}

export interface Pagination {
  totalItems: number
  totalPages: number
  currentPage: number
  canGoBack: boolean
  canGoForward: boolean
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
