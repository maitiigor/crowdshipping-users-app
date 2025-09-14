import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ChevronLeft, MapPin } from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";

export default function TravelerDetail() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Traveler Details
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
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 pb-20 gap-5">
            {id === "3" ? (
              <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
                <ThemedView className="flex gap-5">
                  <ThemedView className="flex justify-between flex-1 gap-1 pb-4">
                    <ThemedText
                      type="s1_subtitle"
                      className="text-typography-800 flex-1"
                    >
                      Urgent Documents to VI
                    </ThemedText>
                    <ThemedView className="flex-row flex-1 items-center gap-1">
                      <Icon as={MapPin} />
                      <ThemedText type="default">
                        Ikeja, Lagos→Canada
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Airline Name
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      Ethiopian Airline
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Flight Number
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      ET 786
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Departure Date
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      2023-10-10
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Arrival Dates
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      2024-10-10
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Available Capacity
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      2kg
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Dimension
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      30 x 30 x 30 cm
                    </ThemedText>
                  </ThemedView>
                  <ThemedText
                    type="default"
                    className="text-typography-600 flex-1 text-left"
                  >
                    Posted by Amina Bello  • 35m ago
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            ) : (
              <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
                <ThemedView className="flex gap-5">
                  <ThemedView className="flex justify-between flex-1 gap-1 pb-4">
                    <ThemedText
                      type="s1_subtitle"
                      className="text-typography-800 flex-1"
                    >
                      Urgent Documents to VI
                    </ThemedText>
                    <ThemedView className="flex-row flex-1 items-center gap-1">
                      <Icon as={MapPin} />
                      <ThemedText type="default">
                        Ikeja, Lagos→Canada
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Vessel name
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      MSC Zoe
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 flex-1 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Vessel operator
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      Shipping Company
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Container Number
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      MSCU 123456-7
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Departure Port
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      Lagos Port
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Arrival Port
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      Canada Port
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Voyage Number
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      012W
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Departure Date
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      01/01/2023
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Arrival Date
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      01/01/2023
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2 justify-between">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Available Capacity
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 flex-1 text-right"
                    >
                      20ft Container
                    </ThemedText>
                  </ThemedView>
                  <ThemedText
                    type="default"
                    className="text-typography-600 flex-1 text-left"
                  >
                    Posted by Amina Bello  • 35m ago
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            )}
            <Button
              variant="solid"
              size="2xl"
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/road-delivery",
                  params: { id: id },
                });
              }}
              className="flex-1 rounded-[12px] mx-1"
            >
              <ThemedText type="s2_subtitle" className="text-white text-center">
                Enter Delivery Details
              </ThemedText>
            </Button>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}
