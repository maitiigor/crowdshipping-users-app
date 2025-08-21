import { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    });
  }
  return queryClient;
};

export type AppQueryClient = QueryClient;
