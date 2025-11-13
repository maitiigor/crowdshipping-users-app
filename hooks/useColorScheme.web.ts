import { useEffect, useState } from "react";
import { ColorSchemeName } from "react-native";

const THEME_STORAGE_KEY = "@user_theme_preference";

// Global state to track theme preference
let cachedTheme: string | null = null;

// Event listeners for theme changes
const themeChangeListeners = new Set<(theme: string | null) => void>();

function notifyThemeChange(theme: string | null) {
  cachedTheme = theme;
  themeChangeListeners.forEach((listener) => listener(theme));
}

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme(): ColorSchemeName {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [userPreference, setUserPreference] = useState<string | null>(
    cachedTheme
  );

  // Get system preference using matchMedia
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  };

  const [systemColorScheme, setSystemColorScheme] = useState<"light" | "dark">(
    getSystemTheme()
  );

  useEffect(() => {
    setHasHydrated(true);

    // Load user preference from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      cachedTheme = stored;
      setUserPreference(stored);
    }

    // Listen for system theme changes
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemColorScheme(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleChange);

      // Listen for user preference changes
      const listener = (theme: string | null) => {
        setUserPreference(theme);
      };
      themeChangeListeners.add(listener);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
        themeChangeListeners.delete(listener);
      };
    }
  }, []);

  if (!hasHydrated) {
    return "light";
  }

  // If no preference or "system", use system color scheme
  if (!userPreference || userPreference === "system") {
    return systemColorScheme;
  }

  // Return user preference
  return userPreference as "light" | "dark";
}

// Helper function to save theme preference (web version)
export async function saveThemePreference(theme: string): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      notifyThemeChange(theme);
    }
  } catch (error) {
    console.error("Error saving theme preference:", error);
    throw error;
  }
}

// Helper function to get theme preference (web version)
export async function getThemePreference(): Promise<string | null> {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem(THEME_STORAGE_KEY);
    }
    return null;
  } catch (error) {
    console.error("Error getting theme preference:", error);
    return null;
  }
}

// Helper to clear theme preference (web version)
export async function clearThemePreference(): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(THEME_STORAGE_KEY);
      notifyThemeChange(null);
    }
  } catch (error) {
    console.error("Error clearing theme preference:", error);
    throw error;
  }
}
