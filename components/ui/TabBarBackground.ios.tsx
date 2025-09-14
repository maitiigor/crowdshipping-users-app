import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BlurTabBarBackground() {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  // When used within a Bottom Tab Navigator, return the real height.
  // Outside of tabs (e.g., onboarding screens), gracefully fall back to the safe-area bottom inset or 0.
  const insets = useSafeAreaInsets();
  try {
    return useBottomTabBarHeight();
  } catch {
    return insets.bottom ?? 0;
  }
}
