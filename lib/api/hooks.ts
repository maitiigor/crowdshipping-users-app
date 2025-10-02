import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useAppSelector } from "../../store";
import { apiFetch, type ApiOptions, type Query } from "./client";

// Generic data fetching hooks built on react-query

// Overloads to preserve original signature and add optional fetchOptions
export function useApiQuery<TData = unknown, TError = Error>(
  key: readonly unknown[],
  path: string,
  options?: Omit<
    UseQueryOptions<TData, TError, TData, typeof key>,
    "queryKey" | "queryFn"
  >
): ReturnType<typeof useQuery<TData, TError, TData, typeof key>> & {
  loading: boolean;
  fetching: boolean;
};
export function useApiQuery<TData = unknown, TError = Error>(
  key: readonly unknown[],
  path: string,
  fetchOptions: Omit<ApiOptions, "method"> & { query?: Query },
  options?: Omit<
    UseQueryOptions<TData, TError, TData, typeof key>,
    "queryKey" | "queryFn"
  >
): ReturnType<typeof useQuery<TData, TError, TData, typeof key>> & {
  loading: boolean;
  fetching: boolean;
};
export function useApiQuery<TData = unknown, TError = Error>(
  key: readonly unknown[],
  path: string,
  third?: any,
  fourth?: any
): ReturnType<typeof useQuery<TData, TError, TData, typeof key>> & {
  loading: boolean;
  fetching: boolean;
} {
  const looksLikeFetchOptions = (v: any) =>
    v && ("headers" in v || "query" in v || "token" in v || "body" in v);

  const fetchOptions = looksLikeFetchOptions(third) ? third : undefined;
  const queryOptions = looksLikeFetchOptions(third) ? fourth : third;

  const result = useQuery<TData, TError, TData, typeof key>({
    queryKey: key,
    queryFn: () => apiFetch<TData>(path, fetchOptions),
    ...queryOptions,
  });

  // Add friendly aliases without removing original react-query fields
  return {
    ...result,
    loading: result.isLoading,
    fetching: result.isFetching,
  } as typeof result & { loading: boolean; fetching: boolean };
}

export type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

export function useApiMutation<
  TData = unknown,
  TVariables = unknown,
  TError = Error
>(
  method: MutationMethod,
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>,
  fetchOptions?: Omit<ApiOptions, "method" | "body">
) {
  const result = useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const body = (["POST", "PUT", "PATCH"] as const).includes(method as any)
        ? (variables as unknown)
        : undefined;
      return apiFetch<TData>(path, { method, body, ...fetchOptions });
    },
    ...options,
  });
  // Add 'loading' alias for convenience (maps to isPending in RQ >=5)
  return {
    ...result,
    loading: (result as any).isPending ?? (result as any).isLoading ?? false,
  } as typeof result & { loading: boolean };
}

// Convenience wrappers for common verbs
export const useGet = useApiQuery;

export function usePost<TData = unknown, TVariables = unknown, TError = Error>(
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>,
  fetchOptions?: Omit<ApiOptions, "method" | "body">
) {
  return useApiMutation<TData, TVariables, TError>(
    "POST",
    path,
    options,
    fetchOptions
  );
}

export function usePut<TData = unknown, TVariables = unknown, TError = Error>(
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>,
  fetchOptions?: Omit<ApiOptions, "method" | "body">
) {
  return useApiMutation<TData, TVariables, TError>(
    "PUT",
    path,
    options,
    fetchOptions
  );
}

export function usePatch<TData = unknown, TVariables = unknown, TError = Error>(
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>,
  fetchOptions?: Omit<ApiOptions, "method" | "body">
) {
  return useApiMutation<TData, TVariables, TError>(
    "PATCH",
    path,
    options,
    fetchOptions
  );
}

export function useDelete<
  TData = unknown,
  TVariables = unknown,
  TError = Error
>(
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>,
  fetchOptions?: Omit<ApiOptions, "method" | "body">
) {
  return useApiMutation<TData, TVariables, TError>(
    "DELETE",
    path,
    options,
    fetchOptions
  );
}

// Authenticated variants that automatically include the user's token
export function useAuthenticatedQuery<TData = unknown, TError = Error>(
  key: readonly unknown[],
  path: string,
  fetchOptions?: Omit<ApiOptions, "method" | "token"> & { query?: Query },
  options?: Omit<
    UseQueryOptions<TData, TError, TData, typeof key>,
    "queryKey" | "queryFn"
  >
) {
  const token = useAppSelector((s) => s.auth.token);
  return useApiQuery<TData, TError>(
    key,
    path,
    { ...fetchOptions, token },
    options
  );
}

export function useAuthenticatedMutation<
  TData = unknown,
  TVariables = unknown,
  TError = Error
>(
  method: MutationMethod,
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>,
  fetchOptions?: Omit<ApiOptions, "method" | "body" | "token">
) {
  const token = useAppSelector((s) => s.auth.token);
  return useApiMutation<TData, TVariables, TError>(method, path, options, {
    ...fetchOptions,
    token,
  });
}

export function useAuthenticatedPost<
  TData = unknown,
  TVariables = unknown,
  TError = Error
>(
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>,
  fetchOptions?: Omit<ApiOptions, "method" | "body" | "token">
) {
  return useAuthenticatedMutation<TData, TVariables, TError>(
    "POST",
    path,
    options,
    fetchOptions
  );
}

export function useAuthenticatedPut<
  TData = unknown,
  TVariables = unknown,
  TError = Error
>(
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>,
  fetchOptions?: Omit<ApiOptions, "method" | "body" | "token">
) {
  return useAuthenticatedMutation<TData, TVariables, TError>(
    "PUT",
    path,
    options,
    fetchOptions
  );
}

export function useAuthenticatedPatch<
  TData = unknown,
  TVariables = unknown,
  TError = Error
>(
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>,
  fetchOptions?: Omit<ApiOptions, "method" | "body" | "token">
) {
  return useAuthenticatedMutation<TData, TVariables, TError>(
    "PATCH",
    path,
    options,
    fetchOptions
  );
}

export function useAuthenticatedDelete<
  TData = unknown,
  TVariables = unknown,
  TError = Error
>(
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>,
  fetchOptions?: Omit<ApiOptions, "method" | "body" | "token">
) {
  return useAuthenticatedMutation<TData, TVariables, TError>(
    "DELETE",
    path,
    options,
    fetchOptions
  );
}
