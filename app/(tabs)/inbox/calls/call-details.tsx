import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";

import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ChevronLeft, PhoneMissed, Volume1 } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function CallDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const backroundTopNav = useThemeColor({}, "background");

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center"></ThemedText>
        );
      },
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: backroundTopNav,
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
              onLongPress={() => router.push("/(tabs)")}
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
  }, [navigation, router, backroundTopNav]);

  return (
    <ThemedView className="flex-1 bg-white pt-3">
      <ThemedView className="flex-1 pb-20 px-[18px] justify-center items-center overflow-hidden">
        <ThemedView className="mt-5 flex gap-3">
          <Avatar
            style={{
              width: 220,
              height: 220,
              borderRadius: 500,
            }}
            size="2xl"
          >
            <AvatarFallbackText>User Image</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
              }}
            />
          </Avatar>
          <ThemedText type="h4_header" className="text-center mt-2">
            Segun Johnson
          </ThemedText>
          <ThemedText type="default" className="text-center mt-2 text-gray-500">
            03:23 minutes
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView className="absolute bottom-10 flex-row justify-center gap-5 left-0 right-0 px-5">
        <Button
          variant="solid"
          size="2xl"
          className="mt-5 bg-[#2490A9] rounded-full h-20 w-20 flex justify-center items-center"
        >
          <Icon as={Volume1} size="5xl" className="text-white ml-2" />
          {/* <VolumeX /> */}
        </Button>
        <Button
          variant="solid"
          size="2xl"
          className="mt-5 bg-red-500 rounded-full h-20 w-20 flex justify-center items-center"
        >
          <Icon as={PhoneMissed} size="4xl" className="text-white " />
        </Button>
      </ThemedView>
    </ThemedView>
  );
}
