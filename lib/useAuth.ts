import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  loginSuccess,
  logout as logoutAction,
  restoreAuth,
  setError,
  setLoading,
  User,
} from "../store/slices/authSlice";
import { publicApi } from "./api";
import {
  clearAuthData,
  getStoredAuthData,
  storeAuthData,
} from "./auth/tokenStorage";

export interface LoginCredentials {
  email: string;
  password: string;
}

type ApiSuccess<T> = {
  code: number;
  message: string;
  data: T;
};

type ServerUser = {
  _id: string;
  userId?: string;
  fullName?: string;
  email: string;
};

export interface LoginResponseData {
  token: string;
  user: ServerUser;
}

/**
 * Custom hook for authentication operations
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  /**
   * Login function
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      try {
        dispatch(setLoading(true));

        // Call login API endpoint
        const response = await publicApi.post<
          ApiSuccess<LoginResponseData> | LoginResponseData
        >("/auth/sign-in", credentials);

        // Response can be either { code, message, data: { token, user } } or { token, user }
        const maybeData: any = (response as any)?.data ?? response;
        const token: string | undefined = maybeData?.token;
        const serverUser: ServerUser | undefined = maybeData?.user;

        if (!token) {
          throw new Error("No token received from server");
        }
        if (!serverUser) {
          throw new Error("No user received from server");
        }

        const mappedUser: User = {
          id: serverUser._id || serverUser.userId || "",
          email: serverUser.email,
          name: serverUser.fullName || serverUser.email,
        };

        // Store auth data in AsyncStorage
        await storeAuthData(token, mappedUser);

        // Update Redux state
        dispatch(loginSuccess({ token, user: mappedUser }));
      } catch (error) {
        const messageFromServer =
          typeof (error as any)?.data === "object"
            ? (error as any).data?.message || (error as any).data?.error
            : undefined;
        const errorMessage =
          messageFromServer ||
          (error instanceof Error ? error.message : "Login failed");
        dispatch(setError(errorMessage));
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Logout function
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      dispatch(setLoading(true));

      // Clear stored auth data
      await clearAuthData();

      // Update Redux state
      dispatch(logoutAction());
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      dispatch(setError(errorMessage));
      throw error;
    }
  }, [dispatch]);

  /**
   * Restore authentication from stored data
   */
  const restoreAuthentication = useCallback(async (): Promise<void> => {
    try {
      dispatch(setLoading(true));

      const storedAuthData = await getStoredAuthData();

      if (storedAuthData) {
        dispatch(restoreAuth(storedAuthData));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);
      dispatch(setError("Failed to restore authentication"));
    }
  }, [dispatch]);



  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    // State
    ...authState,

    // Actions
    login,
    logout,
    restoreAuthentication,
    clearError,
  };
};

/**
 * Hook to get auth selectors
 */
export const useAuthSelectors = () => {
  const { isAuthenticated, user, token, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  return {
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
  };
};
