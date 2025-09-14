import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon, InfoIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ChevronLeft, Clock3 } from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";

export default function ConfirmPayScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Confirm & Pay
          </ThemedText>
        );
      },
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
      headerRight: () => <NotificationIcon />,
    });
  }, [navigation]);
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 gap-3 pb-40 mt-3">
            <ThemedView className="flex justify-center items-center">
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
            <ThemedText className="flex-1 bg-white mt-6">
              <ThemedView className="flex gap-8 w-full">
                <ThemedView className="">
                  <ThemedText
                    type="btn_giant"
                    className="text-typography-800 pb-1"
                  >
                    Booking Summary
                  </ThemedText>
                  <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        Booking ID
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        ID2350847391
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        Date of Booking
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        June 12. 2025 | 10:00 am
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        Pickup Location
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        123 Main St, Springfield
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        Weight
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        5000 Kg
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                <ThemedView>
                  <ThemedText
                    type="btn_giant"
                    className="text-typography-800 pb-1"
                  >
                    Receiver Information
                  </ThemedText>
                  <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        Name
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        John Doe
                      </ThemedText>
                    </ThemedView>

                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        Phone Number
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        +234 0390 942 9428
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                <ThemedView>
                  <ThemedText
                    type="btn_giant"
                    className="text-typography-800 pb-1"
                  >
                    Expected Arrival Time
                  </ThemedText>
                  <ThemedView className="border  border-primary-50 px-5 py-10 rounded-2xl flex justify-center items-center gap-5">
                    <ThemedView className="flex-row justify-center items-center gap-3">
                      <ThemedView className="">
                        <Icon
                          as={Clock3}
                          size="4xl"
                          className="text-typography-500"
                        />
                      </ThemedView>
                      <ThemedText
                        type="b2_body"
                        className="text-typography-800"
                      >
                        5 - 9 Days
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>

                  <ThemedView>
                    <Alert action="error" variant="solid" className="mt-5 p-4 flex-2">
                      <AlertIcon
                        size="xl"
                        as={InfoIcon}
                        className="text-error-600"
                      />
                      
                        <ThemedText type="b3_body" className="text-error-600 w-[90%]">
                          Once payment is completed, this booking cannot be
                          modified. Your booking will only be confirmed upon
                          successful payment.
                        </ThemedText>
                      
                    </Alert>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>

      <ThemedView className="absolute bottom-0 pt-5 pb-10 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
        <Button
          variant="solid"
          size="2xl"
          onPress={() => {
              router.push("/(tabs)/confirm-price");
          }}
          className="flex-1 rounded-[12px] mx-1"
        >
          <ThemedText type="s2_subtitle" className="text-white text-center">
            Book
          </ThemedText>
        </Button>
      </ThemedView>
    </>
  );
}
