import { Stack } from "expo-router";
import React from "react";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // return (
  //   <Tabs
  //     screenOptions={{
  //       tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
  //       headerShown: false,
  //       tabBarButton: HapticTab,
  //       tabBarBackground: TabBarBackground,
  //       tabBarStyle: Platform.select({
  //         ios: {
  //           // Use a transparent background on iOS to show the blur effect
  //           position: "absolute",
  //         },
  //         default: {},
  //       }),
  //     }}
  //   >
  //     <Tabs.Screen
  //       name="home"
  //       options={{
  //         title: "Home",
  //         tabBarIcon: ({ color }) => (
  //           <IconSymbol size={28} name="house.fill" color={color} />
  //         ),
  //       }}
  //     />
  //     <Tabs.Screen
  //       name="explore"
  //       options={{
  //         title: "Explore",
  //         tabBarIcon: ({ color }) => (
  //           <IconSymbol size={28} name="paperplane.fill" color={color} />
  //         ),
  //       }}
  //     />
  //     <Tabs.Screen
  //       name="api-demo"
  //       options={{
  //         title: "API",
  //         tabBarIcon: ({ color }) => (
  //           <IconSymbol
  //             size={28}
  //             name="antenna.radiowaves.left.and.right"
  //             color={color}
  //           />
  //         ),
  //       }}
  //     />
  //   </Tabs>
  // );
  return <Stack />;
}
