import { useApiQuery, useAuthenticatedQuery, usePost } from "@/lib/api";
import React from "react";
import { StyleSheet } from "react-native";

export default function ApiHooksExampleScreen() {
  // Public GET that runs automatically
  const countries = useApiQuery<{ countries: string[] }, Error>(
    ["countries"],
    "/public/countries",
    { query: { limit: 5 } },
    { staleTime: 30_000 }
  );
  const {
    data: countriesData,
    error: countriesError,
    isLoading: countriesLoading,
    isFetching: countriesFetching,
    refetch: countriesRefetch,
    status: countriesStatus,
    // convenience aliases added by our wrapper:
    loading: countriesLoadings, // alias of isLoading
    fetching: countriesFetchings, // alias of isFetching
  } = useApiQuery<{ countries: string[] }, Error>(
    ["countries"],
    "/public/countries"
  );
  // Public mutations
  const {
    mutate,
    mutateAsync,
    isPending,
    isSuccess,
    isError,
    error: mutateError,
    loading: mutateLoading,
  } = usePost<{ id: string }, { name: string }>("/items");

  //   GET with query params and react-query options
  // You can pass fetchOptions (headers, query, token) and react-query options (enabled, staleTime, etc.).

  // Overload 1: no fetchOptions
  useApiQuery(["packages"], "/packages", { enabled: true, staleTime: 30_000 });

  // Overload 2: with fetchOptions + rq options
  useApiQuery(
    ["packages", page, q],
    "/packages",
    { query: { page, q } }, // fetchOptions
    { enabled: !!q, refetchOnMount: "always" } // react-query options
  );

  // ==========================================================
  // Authenticated GET (token auto-included)
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    loading, // alias
    fetching, // alias
  } = useAuthenticatedQuery<{ user: { id: string; email: string } }>(
    ["me"],
    "/user/profile"
  );
  // You can still pass fetchOptions (e.g., extra headers) and react-query options:
  useAuthenticatedQuery(
    ["me"],
    "/user/profile",
    { headers: { "x-foo": "bar" } }, // merged with token
    { enabled: true }
  );
  // Public POST
  const postEcho = usePost<{ echoed: string }, { message: string }>(
    "/demo/echo"
  );

  return <></>;
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  card: {
    gap: 8,
    marginBottom: 8,
  },
});
