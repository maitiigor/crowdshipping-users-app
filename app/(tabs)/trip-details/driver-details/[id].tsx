import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Link,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import {
  Bell,
  ChevronLeft,
  Clock3,
  MessageCircleMore,
  Navigation,
  Phone,
} from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, TouchableOpacity } from "react-native";

export default function DriverDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Driver Details
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
          <Icon as={Bell} size="2xl" className="text-typography-900" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 pb-56 gap-5">
            {/* res of the code */}
            <ThemedView className="flex justify-center items-center border-b border-primary-50 mb-5">
              <Avatar size="2xl" className="self-center">
                <AvatarFallbackText>Segun Johnson</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                  }}
                />
              </Avatar>
              <ThemedView className="flex-row gap-3 my-5">
                <TouchableOpacity
                  onPress={() => {
                    // Handle press
                    router.push({
                      pathname:
                        "/(tabs)/trip-details/driver-details/message-driver",
                      params: { id: Array.isArray(id) ? id[0] : id ?? "" },
                    });
                  }}
                  className="p-4 rounded-full bg-primary-50"
                >
                  <Icon
                    as={MessageCircleMore}
                    size="4xl"
                    className="text-primary-500"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // router.push({
                    //   pathname: "/(tabs)/trip-details/driver-details/call-driver",
                    //   params: { id },
                    // });
                  }}
                  className="p-4 rounded-full bg-primary-50"
                >
                  <Icon as={Phone} size="4xl" className="text-primary-500" />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
            <ThemedView>
              <ThemedText type="btn_giant" className="text-typography-600 pb-1">
                Driver Information
              </ThemedText>
              <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
                <ThemedView className="flex-row justify-between">
                  <ThemedText type="btn_large" className="text-typography-600">
                    Receiver’s Name
                  </ThemedText>
                  <ThemedText type="btn_large" className="">
                    John Doe
                  </ThemedText>
                </ThemedView>
                <ThemedView className="flex-row justify-between">
                  <ThemedText type="btn_large" className="text-typography-600">
                    Receiver’s Number
                  </ThemedText>
                  <ThemedText type="btn_large" className="">
                    +234 974 828 144
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
            <ThemedView>
              <ThemedText type="btn_giant" className="text-typography-600 pb-1">
                Vehicle Information
              </ThemedText>
              <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
                <ThemedView className="flex-row justify-between">
                  <ThemedText type="btn_large" className="text-typography-600">
                    Vehicle Type
                  </ThemedText>
                  <ThemedText type="btn_large" className="">
                    Sedan
                  </ThemedText>
                </ThemedView>
                <ThemedView className="flex-row justify-between">
                  <ThemedText type="btn_large" className="text-typography-600">
                    Vehicle Make/Model
                  </ThemedText>
                  <ThemedText type="btn_large" className="">
                    Toyota Camry
                  </ThemedText>
                </ThemedView>
                <ThemedView className="flex-row justify-between">
                  <ThemedText type="btn_large" className="text-typography-600">
                    License Plate
                  </ThemedText>
                  <ThemedText type="btn_large" className="">
                    ABC-1234
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
            <ThemedView>
              <ThemedText type="btn_giant" className="text-typography-600 pb-1">
                Live Tracking Link/Map
              </ThemedText>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/trip-details/[id]",
                    params: { id: Array.isArray(id) ? id[0] : id ?? "" },
                  });
                }}
                className="border border-primary-50 px-5 py-10 rounded-2xl flex gap-5"
              >
                <ThemedView className="flex-row justify-center items-center gap-3">
                  <ThemedView className="rounded-full border-1 border-[#0a7ea4]">
                    <Icon
                      as={Navigation}
                      size="4xl"
                      className="text-[#0a7ea4]"
                    />
                  </ThemedView>
                  <ThemedText type="link" className="">
                    Navigate
                  </ThemedText>
                </ThemedView>
              </Pressable>
            </ThemedView>
            <ThemedView>
              <ThemedText type="btn_giant" className="text-typography-600 pb-1">
                Live Tracking Link/Map
              </ThemedText>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/trip-details/[id]",
                    params: { id: Array.isArray(id) ? id[0] : id ?? "" },
                  });
                }}
                className="border  border-primary-50 px-5 py-10 rounded-2xl flex justify-center items-center gap-5"
              >
                <ThemedView className="flex-row justify-center items-center gap-3">
                  <ThemedView className="">
                    <Icon
                      as={Clock3}
                      size="4xl"
                      className="text-typography-500"
                    />
                  </ThemedView>
                  <ThemedText type="b2_body" className="text-typography-800">
                    5 mins
                  </ThemedText>
                </ThemedView>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      <ThemedView className="absolute bottom-0 pt-5 pb-10 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
        <Button variant="outline" size="2xl" className=" rounded-[12px] mx-1">
          <ThemedText
            type="s2_subtitle"
            className="text-primary-500 text-center "
          >
            Cancel Booking
          </ThemedText>
        </Button>
        <Button
          variant="solid"
          size="2xl"
          onPress={() => {}}
          className="flex-1 rounded-[12px] mx-1"
        >
          <ThemedText type="s2_subtitle" className="text-white text-center">
            Report Driver
          </ThemedText>
        </Button>
      </ThemedView>
    </>
  );
}
