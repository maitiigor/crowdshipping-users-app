import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

import { ChevronLeft } from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";

export default function PackageDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id, response, tripTypeId } = useLocalSearchParams();
  const responseObj = response
    ? JSON.parse(decodeURIComponent(String(response)))
    : null;
  console.log("🚀 ~ PackageDetailScreen ~ id:", id);
  console.log("🚀 ~ PackageDetailScreen ~ response:", responseObj);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Add Package(this is not used)
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
      headerRight: () => <NotificationIcon />,
    });
  }, [navigation]);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
    >
      <ThemedView className="flex-1">
        <ThemedView className="flex-1 gap-3  pb-40 mt-3">
          <ThemedView className="flex justify-center items-center">
            <ThemedView className="p-5 border w-[70%] justify-center items-center rounded-2xl border-primary-500">
              <Image
                source={{
                  uri: "https://plus.unsplash.com/premium_photo-1663047788002-765d78050d53?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                size="2xl"
                alt={"image"}
              />
            </ThemedView>
          </ThemedView>

          <ThemedView className="flex">
            <ThemedText>Receiver’s Name</ThemedText>
            <ThemedText
              type="s1_subtitle"
              className="text-typography-900 border rounded-lg p-3 border-primary-100 mt-1"
            >
              John Doe
            </ThemedText>
          </ThemedView>
          <ThemedView className="flex">
            <ThemedText>Receiver’s Phone Number</ThemedText>
            <ThemedText
              type="s1_subtitle"
              className="text-typography-900 border rounded-lg p-3 border-primary-100 mt-1"
            >
              +1 234 567 890
            </ThemedText>
          </ThemedView>
          <ThemedView className="flex">
            <ThemedText>Alternative Phone Number</ThemedText>
            <ThemedText
              type="s1_subtitle"
              className="text-typography-900 border rounded-lg p-3 border-primary-100 mt-1"
            >
              +1 234 567 890
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {tripTypeId === "3" || tripTypeId === "2" ? (
          <Button
            variant="solid"
            size="2xl"
            className="mt-5 rounded-[12px]"
            onPress={() => {
              router.push({
                pathname: "/(tabs)/trips/air-sea/bidding-screen",
                params: { id: id },
              });
            }}
          >
            <ThemedText type="s1_subtitle" className="text-white">
              Continue
            </ThemedText>
          </Button>
        ) : (
          <Button
            variant="solid"
            size="2xl"
            className="mt-5 rounded-[12px]"
            onPress={() => {
              router.push({
                pathname: "/(tabs)/nearby-driver",
                params: {
                  id: id,
                  response: encodeURIComponent(JSON.stringify(response)),
                },
              });
            }}
          >
            <ThemedText type="s1_subtitle" className="text-white">
              Continue
            </ThemedText>
          </Button>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}
