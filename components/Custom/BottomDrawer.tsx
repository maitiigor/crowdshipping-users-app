import React, { useEffect, useMemo } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_H = Dimensions.get("window").height;

type BottomDrawerProps = {
  initialSnap?: number; // fraction of screen height [0..1]
  snapPoints?: number[]; // fractions, ascending (e.g., [0.4, 1])
  onSnapChange?: (snap: number) => void;
  enableBackdrop?: boolean;
  // When provided, the drawer becomes controlled and will animate to the nearest
  // allowed snap point whenever this value changes.
  snap?: number; // fraction [0..1]
  children?: React.ReactNode;
};

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
};

export function BottomDrawer({
  initialSnap = 0.4,
  snapPoints = [0.4, 1],
  onSnapChange,
  enableBackdrop = true,
  snap: controlledSnap,
  children,
}: BottomDrawerProps) {
  const insets = useSafeAreaInsets();
  const screenH = SCREEN_H;

  // Ensure snapPoints are valid and sorted
  const snaps = useMemo(() => {
    const unique = Array.from(
      new Set(snapPoints.filter((n) => n > 0 && n <= 1))
    );
    unique.sort((a, b) => a - b);
    return unique.length ? unique : [0.4, 1];
  }, [snapPoints]);

  const minY = 0; // full screen (1.0)
  const maxY = useMemo(
    () => screenH * (1 - Math.min(...snaps)),
    [screenH, snaps]
  ); // largest visible height

  const initialY = useMemo(
    () => screenH * (1 - Math.max(Math.min(initialSnap, 1), 0.01)),
    [screenH, initialSnap]
  );

  const translateY = useSharedValue(initialY);
  const startY = useSharedValue(initialY);
  const snapsSV = useSharedValue<number[]>(snaps);
  const maxYSV = useSharedValue<number>(maxY);

  useEffect(() => {
    // If dimensions change (rotation), gently re-snap to the same fraction height
    translateY.value = withTiming(initialY, { duration: 150 });
    startY.value = initialY;
  }, [initialY, startY, translateY]);

  useEffect(() => {
    snapsSV.value = snaps;
    maxYSV.value = maxY;
  }, [snaps, maxY, snapsSV, maxYSV]);

  const nearestSnapY = (y: number) => {
    "worklet";
    // Clamp to allowed range (between full and the lowest snap)
    const clamped = Math.max(minY, Math.min(y, maxYSV.value));
    const s = snapsSV.value;
    let bestFraction = s[0] ?? 0.4;
    let bestY = SCREEN_H * (1 - bestFraction);
    let bestDist = Math.abs(clamped - bestY);
    for (let i = 1; i < s.length; i++) {
      const sy = SCREEN_H * (1 - s[i]);
      const d = Math.abs(clamped - sy);
      if (d < bestDist) {
        bestDist = d;
        bestY = sy;
      }
    }
    return bestY;
  };

  const reportSnapIfChanged = (yValue: number) => {
    "worklet";
    if (!onSnapChange) return;
    const frac = 1 - yValue / SCREEN_H;
    const s = snapsSV.value;
    let nearest = s[0] ?? 0.4;
    let dist = Math.abs(nearest - frac);
    for (let i = 1; i < s.length; i++) {
      const d = Math.abs(s[i] - frac);
      if (d < dist) {
        dist = d;
        nearest = s[i];
      }
    }
    runOnJS(onSnapChange)(nearest);
  };

  // If a controlled snap is provided, animate to the nearest allowed snap point
  // whenever it changes. This enables programmatic open/close.
  useEffect(() => {
    if (typeof controlledSnap !== "number") return;
    const s = snaps.length ? snaps : [0.4, 1];
    // Find nearest allowed fraction to the requested controlled snap
    const clamp = (n: number, min = 0.01, max = 1) =>
      Math.max(min, Math.min(n, max));
    const desired = clamp(controlledSnap);
    let nearest = s[0] ?? desired;
    let dist = Math.abs(nearest - desired);
    for (let i = 1; i < s.length; i++) {
      const d = Math.abs(s[i] - desired);
      if (d < dist) {
        dist = d;
        nearest = s[i];
      }
    }
    const targetY = SCREEN_H * (1 - nearest);
    translateY.value = withSpring(targetY, SPRING_CONFIG, (finished) => {
      "worklet";
      if (finished && onSnapChange) {
        // Notify with the nearest snap value chosen
        runOnJS(onSnapChange)(nearest);
      }
    });
    startY.value = targetY;
  }, [controlledSnap, snaps, startY, translateY, onSnapChange]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const next = startY.value + e.translationY;
      // Clamp between full (0) and lowest snap (maxY)
      const clamped = Math.max(minY, Math.min(next, maxYSV.value));
      translateY.value = clamped;
    })
    .onEnd((e) => {
      // Add a small velocity-based projection
      const projected = translateY.value + e.velocityY * 0.1;
      const targetY = nearestSnapY(projected);
      translateY.value = withSpring(targetY, SPRING_CONFIG, (finished) => {
        "worklet";
        if (finished) reportSnapIfChanged(targetY);
      });
    })
    .enabled(Platform.OS !== "web");

  // Panel height = visible portion of the drawer
  const panelStyle = useAnimatedStyle(() => ({
    height: SCREEN_H - translateY.value,
  }));

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [maxYSV.value, minY],
      [0.05, 0.5],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Backdrop is visual-only to keep underlying map interactive

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {enableBackdrop ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "black" },
            backdropStyle,
          ]}
          // Let touches pass through to underlying content like the map
          pointerEvents="none"
        />
      ) : null}

      <Animated.View
        pointerEvents="auto"
        style={[
          styles.panel,
          {
            paddingTop: insets.top ? insets.top : 12,
          },
          { paddingBottom: insets.bottom ? insets.bottom : 12 },
          panelStyle,
        ]}
      >
        {/* Handle (drag area) */}
        <GestureDetector gesture={pan}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
        </GestureDetector>
        {/* Content (allows internal scrolling) */}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100000,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
    overflow: "hidden",
  },
  handleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  handle: {
    width: 100,
    height: 7,
    borderRadius: 3,
    backgroundColor: "#D1D5DB", // gray-300
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default BottomDrawer;
