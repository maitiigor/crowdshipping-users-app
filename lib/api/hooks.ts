import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { apiFetch } from "./client";

// Generic data fetching hooks built on react-query

export function useApiQuery<TData = unknown, TError = Error>(
  key: readonly unknown[],
  path: string,
  options?: Omit<
    UseQueryOptions<TData, TError, TData, typeof key>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<TData, TError, TData, typeof key>({
    queryKey: key,
    queryFn: () => apiFetch<TData>(path),
    ...options,
  });
}

export type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

export function useApiMutation<
  TData = unknown,
  TVariables = unknown,
  TError = Error
>(
  method: MutationMethod,
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const body = (["POST", "PUT", "PATCH"] as const).includes(method as any)
        ? (variables as unknown)
        : undefined;
      return apiFetch<TData>(path, { method, body });
    },
    ...options,
  });
}

// Convenience wrappers for common verbs
export const useGet = useApiQuery;

export function usePost<TData = unknown, TVariables = unknown, TError = Error>(
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useApiMutation<TData, TVariables, TError>("POST", path, options);
}

export function usePut<TData = unknown, TVariables = unknown, TError = Error>(
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useApiMutation<TData, TVariables, TError>("PUT", path, options);
}

export function usePatch<TData = unknown, TVariables = unknown, TError = Error>(
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useApiMutation<TData, TVariables, TError>("PATCH", path, options);
}

export function useDelete<
  TData = unknown,
  TVariables = unknown,
  TError = Error
>(path: string, options?: UseMutationOptions<TData, TError, TVariables>) {
  return useApiMutation<TData, TVariables, TError>("DELETE", path, options);
}
