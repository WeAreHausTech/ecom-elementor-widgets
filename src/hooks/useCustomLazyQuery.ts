import { ErrorResult } from '@/components'
import { CustomLazyQueryResultTuple, GenericApolloError } from '@/types'
import { isErrorResult } from '@/utils/utils'
import {
  OperationVariables,
  LazyQueryHookOptions,
  NoInfer,
  useLazyQuery,
  TypedDocumentNode,
  QueryResult,
} from '@apollo/client'
import { DocumentNode } from 'graphql'
import { useCallback, useState } from 'react'

export const useCustomLazyQuery = <
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: LazyQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>,
): CustomLazyQueryResultTuple<TData, TVariables> => {
  const [error, setError] = useState<GenericApolloError>(undefined)

  const [lazyQuery, lazyQueryResult] = useLazyQuery<TData, TVariables>(query, {
    ...options,
    onCompleted: (data) => {
      if (options?.onCompleted) {
        options.onCompleted(data)
      }

      if (isErrorResult(data)) {
        for (const key in data as { [key: string]: ErrorResult }) {
          if ((data as { [key: string]: ErrorResult })[key].hasOwnProperty('errorCode')) {
            const err = (data as { [key: string]: ErrorResult })[key]
            setError(err)
            break
          }
        }
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error)
      }
      setError(error)
    },
  })

  const q = useCallback(
    (
      options?: LazyQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>,
    ): Promise<QueryResult<TData, TVariables>> => {
      setError(undefined)
      return lazyQuery(options)
    },
    [lazyQuery],
  )

  return [
    q,
    {
      ...lazyQueryResult,
      error,
    },
  ]
}