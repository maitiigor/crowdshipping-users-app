import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { useNavigation, useRouter } from "expo-router";
import {
  Bell,
  Calendar,
  ChevronLeft,
  Map,
  MapPin,
  PenLine,
  Phone,
  SquarePlus,
  UserRound,
  Wallet,
} from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";

export default function PackageSummaryScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Package Summary",
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
      // Remove header shadow and bottom border (iOS & Android)
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
          <ThemedView className="flex-1 gap-3 pb-20 mt-3">
            <ThemedView className="flex justify-center items-center">
              <Button
                variant="solid"
                size="2xl"
                className=" w-[60%] mb-5 rounded-[12px]"
                onPress={() => {
                  router.push("/(tabs)/edit-package");
                }}
              >
                <Icon as={PenLine} size="lg" className="text-white" />
                <ThemedText type="default" className="text-white">
                  Modify Package
                </ThemedText>
              </Button>
              <ThemedView className="p-5 border rounded-lg border-primary-500">
                <Image
                  source={{
                    uri: "https://plus.unsplash.com/premium_photo-1663047788002-765d78050d53?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }}
                  size="2xl"
                  alt={"image"}
                />
              </ThemedView>
            </ThemedView>
            <ThemedText className="flex-1 bg-white">
              <ThemedView className="">
                <ThemedView className="flex gap-8">
                  <ThemedView className="flex gap-3">
                    <ThemedText type="btn_giant" className="mt-5 ">
                      Delivery Details (ID2350847391)
                    </ThemedText>
                    <ThemedView className="flex-row items-center gap-2">
                      <Icon as={Map} size="3xl" className="text-primary-500" />
                      <ThemedText className="text-typography-500">
                        Pick up location
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row items-center gap-2">
                      <Icon
                        as={MapPin}
                        size="3xl"
                        className="text-primary-500"
                      />
                      <ThemedText className="text-typography-500">
                        Tangerang City, Banten 15138
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row items-center gap-2">
                      <Icon
                        as={Calendar}
                        size="3xl"
                        className="text-primary-500"
                      />
                      <ThemedText className="text-typography-500">
                        June 5, 2025
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row items-center gap-2">
                      <Icon
                        as={Wallet}
                        size="3xl"
                        className="text-primary-500"
                      />
                      <ThemedText className="text-typography-500">
                        June 5, 2025
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView className="flex gap-3">
                    <ThemedText type="btn_giant" className="">
                      Sender
                    </ThemedText>
                    <ThemedView className="flex-row items-center gap-2">
                      <Icon
                        as={UserRound}
                        size="3xl"
                        className="text-primary-500"
                      />
                      <ThemedText className="text-typography-500">
                        John Doe
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row items-center gap-2">
                      <Icon
                        as={Phone}
                        size="3xl"
                        className="text-primary-500"
                      />
                      <ThemedText className="text-typography-500">
                        0812040737, 0816436275
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView className="flex gap-3">
                    <ThemedText type="btn_giant" className="">
                      Driver
                    </ThemedText>
                    <ThemedView className="flex-row items-center gap-2">
                      <Icon
                        as={UserRound}
                        size="3xl"
                        className="text-primary-500"
                      />
                      <ThemedText className="text-typography-500">
                        Jane Doe
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row items-center gap-2">
                      <Icon
                        as={Phone}
                        size="3xl"
                        className="text-primary-500"
                      />
                      <ThemedText className="text-typography-500">
                        0812040737, 0816436275
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedText>
            <Pressable className="flex-row gap-2 pt-3 pb-10 justify-center items-center">
              <Icon as={SquarePlus} size="3xl" className="text-primary-500" />
              <ThemedText type="default" className="text-primary-500">
                Add Another Package
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      <ThemedView className="absolute bottom-0 pt-5 pb-10 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
        <Button variant="outline" size="2xl" className=" rounded-[12px] mx-1">
          <ThemedText
            type="s2_subtitle"
            className="text-primary-500 text-center "
          >
            Cancel order
          </ThemedText>
        </Button>
        <Button
          variant="solid"
          size="2xl"
          onPress={() => {
            router.push("/(tabs)/confirm-price");
          }}
          className="flex-1 rounded-[12px] mx-1"
        >
          <ThemedText type="s2_subtitle" className="text-white text-center">
            Confirm
          </ThemedText>
        </Button>
      </ThemedView>
    </>
  );
}
