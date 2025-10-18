/**
 * Authentication Usage Examples
 *
 * This file demonstrates how to use the authentication system
 * with the API key and persistent token management.
 */

import React from "react";
import { Alert, Button, Text, View } from "react-native";
import {
  authenticatedApi,
  publicApi,
  useAuth,
  useInitializeAuth,
} from "../lib/api";

/**
 * Example: Login Component
 */
// import { authenticatedApi, publicApi } from "./lib/api";

// // Public endpoint (no auth needed)
// const publicData = await publicApi.get("/public/data");

// // Authenticated endpoint (token automatically included)
// const userProfile = await authenticatedApi.get("/user/profile");
export const LoginExample = () => {
  const { login, isLoading, error, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: "user@example.com",
        password: "password123",
      });
      Alert.alert("Success", "Logged in successfully!");
    } catch {
      Alert.alert("Error", "Login failed");
    }
  };

  

  if (isAuthenticated) {
    return <Text>Already logged in!</Text>;
  }

  return (
    <View>
      <Button
        title={isLoading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={isLoading}
      />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
};

/**
 * Example: Making API calls with authentication
 */
export const ApiCallExamples = {
  // Public API call (no authentication needed)
  getPublicData: async () => {
    try {
      const data = await publicApi.get("/public/data");
      console.log("Public data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching public data:", error);
    }
  },

  // Authenticated API call (automatically includes token)
  getUserProfile: async () => {
    try {
      const profile = await authenticatedApi.get("/user/profile");
      console.log("User profile:", profile);
      return profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },

  // Create a new item (authenticated POST request)
  createUserItem: async (itemData: any) => {
    try {
      const newItem = await authenticatedApi.post("/user/items", itemData);
      console.log("Created item:", newItem);
      return newItem;
    } catch (error) {
      console.error("Error creating item:", error);
    }
  },

  // Update user data (authenticated PUT request)
  updateUserProfile: async (userData: any) => {
    try {
      const updatedUser = await authenticatedApi.put("/user/profile", userData);
      console.log("Updated user:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },

  // Delete an item (authenticated DELETE request)
  deleteUserItem: async (itemId: string) => {
    try {
      await authenticatedApi.delete(`/user/items/${itemId}`);
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  },
};

/**
 * Example: App initialization with auth restoration
 */
export const AppInitializationExample = () => {
  const { isInitializing } = useInitializeAuth();
  const { isAuthenticated, user } = useAuth();

  if (isInitializing) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      {isAuthenticated ? (
        <Text>Welcome back, {user?.name || user?.email}!</Text>
      ) : (
        <Text>Please log in</Text>
      )}
    </View>
  );
};

/**
 * Example: Logout functionality
 */
export const LogoutExample = () => {
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "Logged out successfully!");
    } catch {
      Alert.alert("Error", "Logout failed");
    }
  };

  return (
    <Button
      title={isLoading ? "Logging out..." : "Logout"}
      onPress={handleLogout}
      disabled={isLoading}
    />
  );
};

/**
 * Features implemented:
 *
 * 1. ✅ API Key Integration
 *    - All API requests automatically include x-api-key header
 *    - Value: TTPK_26369a22-f01f-4dcd-b494-3ac058f9ed19
 *
 * 2. ✅ Persistent Token Management
 *    - Tokens are stored securely using AsyncStorage
 *    - Automatically restored when app starts
 *    - Included in authenticated API requests as Bearer token
 *
 * 3. ✅ Authentication State Management
 *    - Redux store manages authentication state
 *    - Hooks provide easy access to auth operations
 *    - Error handling and loading states included
 *
 * 4. ✅ Automatic Token Injection
 *    - authenticatedApi methods automatically include user token
 *    - publicApi methods for endpoints that don't need authentication
 *    - Clean separation of authenticated vs public API calls
 */
