import { Stack } from "expo-router";
import React from "react";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  useColorScheme();
  useTranslation();

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
  //       title: t('tabs.home'),
  //         tabBarIcon: ({ color }) => (
  //           <IconSymbol size={28} name="house.fill" color={color} />
  //         ),
  //       }}
  //     />
  //     <Tabs.Screen
  //       name="explore"
  //       options={{
  //       title: t('tabs.explore'),
  //         tabBarIcon: ({ color }) => (
  //           <IconSymbol size={28} name="paperplane.fill" color={color} />
  //         ),
  //       }}
  //     />
  //     <Tabs.Screen
  //       name="api-demo"
  //       options={{
  //       title: t('tabs.api'),
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
