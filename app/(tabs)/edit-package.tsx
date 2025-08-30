import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation, useRouter } from "expo-router";
import { Bell, ChevronLeft, SquarePlus } from "lucide-react-native";
import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function EditPackage() {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Edit My Order",
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "#FFFFFF",
        elevation: 0, // Android
        shadowOpacity: 0, // iOS
        shadowColor: "transparent", // iOS
        borderBottomWidth: 0,
      },
      headerLeft: () => (
        <ThemedView
          style={{
            shadowColor: "#FDEFEB1A",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.102,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <ThemedView
            style={{
              shadowColor: "#0000001A",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.102,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 rounded   flex justify-center items-center"
            >
              <Icon
                as={ChevronLeft}
                size="3xl"
                className="text-typography-900"
              />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => {}} style={{ paddingHorizontal: 0 }}>
          <Icon as={Bell} size="2xl" className="text-typography-900" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedText>Delivery Details (ID2350847391)</ThemedText>
          <ThemedView className="flex-1">
            <ThemedText>Package ID: 12345</ThemedText>
            <ThemedText>Sender: John Doe</ThemedText>
            <ThemedText>Receiver: Jane Smith</ThemedText>
            <ThemedText>Status: In Transit</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView className="flex-row gap-2 justify-center items-center">
          <Icon as={SquarePlus} size="3xl" className="text-primary-600" />
          <ThemedText type="default" className="text-primary-600">
            Add Another Package
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
      <ThemedView className="absolute bottom-10 left-0 right-0 px-5 flex-row justify-center items-center gap-3">
        <Button variant="outline" size="2xl" className=" rounded-[12px] mx-1">
          <ThemedText
            type="s2_subtitle"
            className="text-primary-500 text-center "
          >
            Cancel
          </ThemedText>
        </Button>
        <Button
          variant="solid"
          size="2xl"
          className="flex-1 rounded-[12px] mx-1"
        >
          <ThemedText type="s2_subtitle" className="text-white text-center">
            Update Request
          </ThemedText>
        </Button>
      </ThemedView>
    </>
  );
}
