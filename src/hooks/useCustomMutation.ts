import type { CustomMutationTuple, GenericApolloError } from '@/types'
import { isErrorResult } from '@/utils/utils'
import {
  DocumentNode,
  MutationHookOptions,
  useMutation,
  OperationVariables,
  MutationUpdaterFunction,
  ApolloCache,
  DefaultContext,
  TypedDocumentNode,
  NoInfer,
} from '@apollo/client'
import { useState } from 'react'

export const useCustomMutation = <
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<unknown> = ApolloCache<unknown>,
>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: Omit<
    MutationHookOptions<NoInfer<TData>, NoInfer<TVariables>, TContext, TCache>,
    'update'
  > & {
    update?: MutationUpdaterFunction<unknown, OperationVariables, TContext, TCache>
  },
): CustomMutationTuple<TData, TVariables, TContext, TCache> => {
  const [error, setError] = useState<GenericApolloError>(undefined)

  const [mutateFunction, mutationResult] = useMutation(mutation, {
    ...options,
    onCompleted: (data) => {
      if (options?.onCompleted) {
        options.onCompleted(data)
      }

      if (isErrorResult(data)) {
        setError(data)
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error)
      }
      setError(error)
    },
  })

  return [
    mutateFunction,
    {
      ...mutationResult,
      error,
    },
  ]
}
