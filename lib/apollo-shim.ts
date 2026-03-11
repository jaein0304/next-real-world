// Shim for Apollo Client 4 compatibility with graphql-codegen output.
// In Apollo 4, hooks and hook types moved from @apollo/client to @apollo/client/react.
export * from '@apollo/client';

// Re-export hooks from @apollo/client/react (these were removed from @apollo/client in v4)
export { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';

// Re-export hook option types
export type {
  QueryHookOptions,
  LazyQueryHookOptions,
  MutationHookOptions,
  QueryResult,
  MutationResult,
} from '@apollo/client/react';

// Types removed in Apollo Client 4 but still referenced by graphql-codegen output
import type { OperationVariables } from '@apollo/client';

export type MutationFunction<TData = any, TVariables extends OperationVariables = OperationVariables> = (
  options?: any
) => Promise<any>;

export type BaseMutationOptions<TData = any, TVariables extends OperationVariables = OperationVariables> =
  Record<string, any>;
