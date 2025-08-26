import {
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

import { LinkProps, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import CustomSidebarMenu from "@/components/Custom/CustomSidebarMenu";
import { Icon } from "@/components/ui/icon";
import Feather from "@expo/vector-icons/Feather";
import { Bell } from "lucide-react-native";
type MenuItem = {
  img: string | ImageSourcePropType | undefined;
  title: string;
  linkTo: LinkProps["href"];
};

export default function RoadDeliveryScreen() {
  const navigation = useNavigation();
  const [showDrawer, setShowDrawer] = useState(false);
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Enter Your Location",
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20, fontWeight: "bold" }, // Increased font size
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            setShowDrawer(true);
          }}
          style={{ paddingHorizontal: 0 }}
        >
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => {}} style={{ paddingHorizontal: 0 }}>
          <Icon as={Bell} size="2xl" className="text-typography-900" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
    >
      <ThemedView className="flex-1">
        <ThemedView className="flex-1 gap-3 pb-20 mt-3">
          {/* form */}
        </ThemedView>
      </ThemedView>
      <CustomSidebarMenu
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
