import { GenericApolloError } from "@/types"
import { isErrorResult } from "@/utils/utils"
import { OperationVariables, TypedDocumentNode, QueryHookOptions, NoInfer, useQuery, QueryResult } from "@apollo/client"
import { DocumentNode } from "graphql"
import { useState } from "react"

export const useCustomQuery = <
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>
): Omit<QueryResult<TData, TVariables>, 'error'> & { error: GenericApolloError} => {
  const [error, setError] = useState<GenericApolloError>(undefined)

  const queryResult = useQuery(query, {
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

  return {
    ...queryResult,
    error,
  }
}