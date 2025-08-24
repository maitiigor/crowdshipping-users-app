import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";

export default function TermsOfService() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Terms of Service",
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20, fontWeight: "bold" }, // Increased font size
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 0 }}
        >
          <Entypo name="chevron-left" size={34} color="#E75B3B" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1  ">
          <ThemedText type="h4_header" className="mt-5">
            Welcome Back
          </ThemedText>
          <ThemedText type="default" className="pt-2 text-typography-800">
            Please sign in to access your Crowdshipping account and manage your
            deliveries.
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
      <ThemedView className="absolute bottom-10 left-0 right-0 px-5">
        <Button variant="solid" size="2xl" className="mt-5 rounded-[12px]">
          <ThemedText type="s1_subtitle" className="text-white">
            Accept
          </ThemedText>
        </Button>

        <Button variant="outline" size="2xl" className="mt-5 rounded-[12px]">
          <ThemedText type="s1_subtitle" className="text-primary-500">
            Decline
          </ThemedText>
        </Button>
      </ThemedView>
    </>
  );
}
