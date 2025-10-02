import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/hooks/useColorScheme";
import "@/styles/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
// global styles already imported above via alias
import { ensureI18n } from "@/lib/i18n";
import { getQueryClient } from "@/lib/queryClient";
import { useInitializeAuth } from "@/lib/useInitializeAuth";
import { store } from "@/store";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
// Note: react-phone-number-input CSS is web-only; avoid importing in native bundles.

// Component that initializes auth and renders the app content
function AppContent() {
  const colorScheme = useColorScheme();
  const { isInitializing } = useInitializeAuth();

  // Show loading state while initializing authentication
  // if (isInitializing) {
  //   return null; // Or return a loading spinner component if you have one
  // }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen
              name="(onboarding)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    // Poppins font family (only variants we actually use)
    "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
  });
  const [i18nReady, setI18nReady] = React.useState(false);

  // Load phone input CSS only on web to show country flags (web only)
  React.useEffect(() => {
    if (Platform.OS === "web") {
      // Dynamic import avoids bundling into native builds
      import("react-phone-number-input/style.css").catch(() => {});
    }
  }, []);

  React.useEffect(() => {
    ensureI18n().finally(() => setI18nReady(true));
  }, []);

  if (!loaded || !i18nReady) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <Provider store={store}>
        <QueryClientProvider client={getQueryClient()}>
          <AppContent />
        </QueryClientProvider>
      </Provider>
    </GluestackUIProvider>
  );
}
