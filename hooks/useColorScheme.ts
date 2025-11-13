import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ColorSchemeName,
  useColorScheme as useRNColorScheme,
} from "react-native";

const THEME_STORAGE_KEY = "@user_theme_preference";

// Global state to track theme preference
let cachedTheme: string | null = null;
let themeLoadedPromise: Promise<void> | null = null;

// Event listeners for theme changes
const themeChangeListeners = new Set<(theme: string | null) => void>();

// Initialize theme from storage
async function initializeTheme() {
  if (!themeLoadedPromise) {
    themeLoadedPromise = AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((value) => {
        cachedTheme = value;
      })
      .catch(() => {
        cachedTheme = null;
      });
  }
  return themeLoadedPromise;
}

function notifyThemeChange(theme: string | null) {
  cachedTheme = theme;
  themeChangeListeners.forEach((listener) => listener(theme));
}

// Hook to get the effective color scheme based on user preference
export function useColorScheme(): ColorSchemeName {
  const systemColorScheme = useRNColorScheme();
  const [userPreference, setUserPreference] = useState<string | null>(
    cachedTheme
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize theme on mount
    initializeTheme().then(() => {
      setUserPreference(cachedTheme);
      setIsInitialized(true);
    });

    // Listen for theme changes
    const listener = (theme: string | null) => {
      setUserPreference(theme);
    };

    themeChangeListeners.add(listener);

    return () => {
      themeChangeListeners.delete(listener);
    };
  }, []);

  // While initializing, use system default
  if (!isInitialized) {
    return systemColorScheme;
  }

  // If no preference or "system", use system color scheme
  if (!userPreference || userPreference === "system") {
    return systemColorScheme;
  }

  // Return user preference (light or dark)
  return userPreference as "light" | "dark";
}

// Helper function to save theme preference
export async function saveThemePreference(theme: string): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    notifyThemeChange(theme);
  } catch (error) {
    console.error("Error saving theme preference:", error);
    throw error;
  }
}

// Helper function to get theme preference
export async function getThemePreference(): Promise<string | null> {
  try {
    if (cachedTheme !== null) {
      return cachedTheme;
    }
    const value = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    cachedTheme = value;
    return value;
  } catch (error) {
    console.error("Error getting theme preference:", error);
    return null;
  }
}

// Helper to clear theme preference (reset to system default)
export async function clearThemePreference(): Promise<void> {
  try {
    await AsyncStorage.removeItem(THEME_STORAGE_KEY);
    notifyThemeChange(null);
  } catch (error) {
    console.error("Error clearing theme preference:", error);
    throw error;
  }
}
