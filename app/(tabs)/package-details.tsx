import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation, useRouter } from "expo-router";
import { Bell, SquarePlus } from "lucide-react-native";
import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function PackageDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Add Package",
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20, }, // Increased font size
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ paddingHorizontal: 0 }}
        >
          <Entypo name="chevron-left" size={34} color="#131927" />
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
        <Text>Package Details</Text>
        <ThemedView className="flex-1">
          <Text>Package ID: 12345</Text>
          <Text>Sender: John Doe</Text>
          <Text>Receiver: Jane Smith</Text>
          <Text>Status: In Transit</Text>
        </ThemedView>
      </ThemedView>
      <ThemedView className="flex-row gap-2 justify-center items-center">
        <Icon as={SquarePlus} size="3xl" className="text-primary-600" />
        <ThemedText type="default" className="text-primary-600">
          Add Another Package
        </ThemedText>
      </ThemedView>
      <Button
        variant="solid"
        size="2xl"
        className="mt-5 rounded-[12px]"
        onPress={() => {
          router.push('/(tabs)/nearby-driver')
        }}
      >
        <ThemedText type="s1_subtitle" className="text-white">
          Continue
        </ThemedText>
      </Button>
    </ParallaxScrollView>
  );
}
