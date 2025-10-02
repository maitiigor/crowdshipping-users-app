import { store } from "../../store";
import * as apiClient from "./client";
import { Query } from "./client";

/**
 * Get the current authentication token from the store
 */
const getAuthToken = (): string | null => {
  const state = store.getState();
  return state.auth.token;
};

/**
 * Authenticated API methods that automatically include the user's token
 */
export const authenticatedApi = {
  get: <T = unknown>(
    path: string,
    query?: Query,
    headers?: Record<string, string>
  ) => {
    const token = getAuthToken();
    return apiClient.get<T>(path, query, headers, token);
  },

  post: <T = unknown>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ) => {
    const token = getAuthToken();
    return apiClient.post<T>(path, body, headers, token);
  },

  put: <T = unknown>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ) => {
    const token = getAuthToken();
    return apiClient.put<T>(path, body, headers, token);
  },

  patch: <T = unknown>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ) => {
    const token = getAuthToken();
    return apiClient.patch<T>(path, body, headers, token);
  },

  delete: <T = unknown>(path: string, headers?: Record<string, string>) => {
    const token = getAuthToken();
    return apiClient.del<T>(path, headers, token);
  },
};

/**
 * Public API methods (no authentication required)
 */
export const publicApi = {
  get: apiClient.get,
  post: apiClient.post,
  put: apiClient.put,
  patch: apiClient.patch,
  delete: apiClient.del,
};

// Export the core client for backwards compatibility
export * from "./client";
export * from "./hooks";

// Export authentication utilities
export { useAuth, useAuthSelectors } from "../useAuth";
export { useInitializeAuth } from "../useInitializeAuth";
