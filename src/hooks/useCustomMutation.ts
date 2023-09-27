import { ErrorResult } from '@/components'
import type { CustomMutationTuple, GenericApolloError } from '@/types'
import { isErrorResult } from '@/utils/utils'
import {
  DocumentNode,
  MutationHookOptions,
  useMutation,
  OperationVariables,
  ApolloCache,
  DefaultContext,
  TypedDocumentNode,
  NoInfer,
  FetchResult,
} from '@apollo/client'
import { useCallback, useState } from 'react'

export const useCustomMutation = <
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<unknown> = ApolloCache<unknown>,
>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: MutationHookOptions<NoInfer<TData>, NoInfer<TVariables>, TContext, TCache>,
): CustomMutationTuple<TData, TVariables, TContext, TCache> => {
  const [error, setError] = useState<GenericApolloError>(undefined)

  const [mutateFunction, mutationResult] = useMutation(mutation, {
    ...options,
  })

  const mutate = useCallback(
    async (
      options?: MutationHookOptions<NoInfer<TData>, NoInfer<TVariables>, TContext, TCache>,
    ): Promise<FetchResult<TData>> => {
      setError(undefined)
      return mutateFunction({
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
    },
    [mutateFunction],
  )

  return [
    mutate,
    {
      ...mutationResult,
      error,
    },
  ]
}
