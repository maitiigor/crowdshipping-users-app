import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/ui/icon";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ChevronLeft, Phone } from "lucide-react-native";
import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function MessageDriver() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Segun Johnson
          </ThemedText>
        );
      },
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
          <Icon as={Phone} size="2xl" className="text-typography-900" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
    >
      <ThemedView className="flex-1">
        <ThemedView className="flex-1 gap-3 pb-40 mt-3">
          <Text>Message Driver {id}</Text>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
