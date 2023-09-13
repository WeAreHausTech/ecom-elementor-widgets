import { CustomLazyQueryResultTuple, GenericApolloError } from "@/types";
import { isErrorResult } from "@/utils/utils";
import { OperationVariables, LazyQueryHookOptions, NoInfer, useLazyQuery, TypedDocumentNode } from "@apollo/client";
import { DocumentNode } from "graphql";
import { useState } from "react";

export const useCustomLazyQuery = <TData = unknown, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: LazyQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>
): CustomLazyQueryResultTuple<TData, TVariables> => {
  const [error, setError] = useState<GenericApolloError>(undefined);

  const [lazyQuery, lazyQueryResult] = useLazyQuery<TData, TVariables>(query, {
    ...options,
    onCompleted: (data) => {
      if (options?.onCompleted) {
        options.onCompleted(data);
      }

      if (isErrorResult(data)) {
        setError(data);
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
      setError(error);
    }
  });

  return [
    lazyQuery,
    {
      ...lazyQueryResult,
      error
    }
  ];
}
