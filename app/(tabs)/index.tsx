import {
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import CustomSidebarMenu from "@/components/Custom/CustomSidebarMenu";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import Feather from "@expo/vector-icons/Feather";
type MenuItem = {
  img: string | ImageSourcePropType | undefined;
  titleKey: "home.land" | "home.air" | "home.sea";
  linkTo: string;
};
const deliveryType: MenuItem[] = [
  {
    img: require("@/assets/images/home/road-delivery.png"),
    titleKey: "home.land",
    linkTo: "/road-delivery",
  },
  {
    img: require("@/assets/images/home/flight-delivery.png"),
    titleKey: "home.air",
    linkTo: "/road-delivery",
  },

  {
    img: require("@/assets/images/home/maritime-delivery.png"),
    titleKey: "home.sea",
    linkTo: "/road-delivery",
  },
];
export default function HomeScreen() {
  const navigation = useNavigation();
  const [showDrawer, setShowDrawer] = useState(false);
  const router = useRouter();
  // const insets = useSafeAreaInsets();

  const { t } = useTranslation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <ThemedView className="flex justify-center items-center">
          <ThemedText className="text-center" type="s1_subtitle">
            {/* Example: Keep static or make dynamic via user profile */}
            Hello, Gbemisola
          </ThemedText>
          <ThemedText className="text-center" type="c2_caption">
            Ikeja Army cantonment,...
          </ThemedText>
        </ThemedView>
      ),
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 0 }}
        >
          <ThemedText className="text-center" type="s1_subtitle">
            NG
          </ThemedText>
        </TouchableOpacity>
      ),
    });
  }, [navigation, t, t]);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      
    >
      <ThemedView className="flex-1">
        <ThemedView>
          <ThemedText className="text-center" type="h4_header">
            {t("home.send_package")}
          </ThemedText>
          <ThemedText
            className="text-center text-typography-700"
            type="default"
          >
            {t("home.subtitle")}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView className="flex-1 gap-3 pb-20 mt-3">
        {deliveryType.map((item, index) => (
          <Pressable
            key={item.titleKey}
            onPress={() => router.push(item.linkTo as any)}
            className="flex items-center gap-2 w-full"
            style={
              {
                backgroundColor: "#FFFFFF",
                padding: 12,
                borderRadius: 8,
                // web shadow (as provided)
                boxShadow:
                  "0px 1px 3px 1px #FDEFEB26, 0px 1px 2px 0px #0000004D",
                // iOS shadow approximation
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
                // Android elevation
                elevation: 2,
              } as any
            }
          >
            <Image source={item.img} size="2xl" alt={t(item.titleKey)} />
            <ThemedText className="text-typography-700" type="h5_header">
              {t(item.titleKey)}
            </ThemedText>
          </Pressable>
        ))}
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
