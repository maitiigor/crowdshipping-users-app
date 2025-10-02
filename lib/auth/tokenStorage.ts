import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../../store/slices/authSlice";

// Storage keys
const TOKEN_STORAGE_KEY = "@crowdshipping/auth_token";
const USER_STORAGE_KEY = "@crowdshipping/user_data";

export interface StoredAuthData {
  token: string;
  user: User;
}

/**
 * Store authentication data securely
 */
export const storeAuthData = async (
  token: string,
  user: User
): Promise<void> => {
  try {
    if (!token) {
      throw new Error("Cannot store empty auth token");
    }
    await Promise.all([
      AsyncStorage.setItem(TOKEN_STORAGE_KEY, token),
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
    ]);
  } catch (error) {
    console.error("Error storing authentication data:", error);
    throw new Error("Failed to store authentication data");
  }
};

/**
 * Retrieve stored authentication data
 */
export const getStoredAuthData = async (): Promise<StoredAuthData | null> => {
  try {
    const [token, userJson] = await Promise.all([
      AsyncStorage.getItem(TOKEN_STORAGE_KEY),
      AsyncStorage.getItem(USER_STORAGE_KEY),
    ]);

    if (!token || !userJson) {
      return null;
    }

    const user: User = JSON.parse(userJson);
    return { token, user };
  } catch (error) {
    console.error("Error retrieving authentication data:", error);
    return null;
  }
};

/**
 * Get only the stored token
 */
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

/**
 * Clear all stored authentication data
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_STORAGE_KEY),
      AsyncStorage.removeItem(USER_STORAGE_KEY),
    ]);
  } catch (error) {
    console.error("Error clearing authentication data:", error);
    throw new Error("Failed to clear authentication data");
  }
};

/**
 * Update stored user data
 */
export const updateStoredUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error updating user data:", error);
    throw new Error("Failed to update user data");
  }
};

/**
 * Check if user is authenticated by verifying stored token
 */
export const isTokenStored = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    return !!token;
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
};
