import ErrandsSvg from "@/assets/svgs/errands.svg";
import GroundSvg from "@/assets/svgs/ground.svg";
import RideSvg from "@/assets/svgs/ride.svg";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon, SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ChevronLeft, MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

export default function TripDelivery() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  console.log("🚀 ~ TripDelivery ~ id:", id);
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Trips
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

  const [activeTripType, setActiveTripType] = useState<number>(
    id ? parseInt(id as string, 10) : 2
  );
  const tripTypes = [
    { id: 1, name: "Ground", Icon: GroundSvg },
    { id: 2, name: "Maritime", Icon: RideSvg },
    { id: 3, name: "Air", Icon: ErrandsSvg },
  ];
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 pb-20 gap-5">
            <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
              <Input
                size="lg"
                className="h-[55px] rounded-t rounded-2xl"
                variant="outline"
              >
                <InputSlot className="pl-3">
                  <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField placeholder={"Search for jobs..."} />
              </Input>
            </ThemedView>

            <ThemedView className="flex-row gap-3 mt-2">
              {tripTypes.map(({ id, name, Icon: SvgIcon }) => {
                const active = id === activeTripType;
                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => {
                      if (id !== 1) {
                        setActiveTripType(id);
                      } else {
                        router.push({
                          pathname: "/(tabs)/trips/road-delivery",
                        });
                        setActiveTripType(1);
                      }
                    }}
                    className={`flex-1 items-center p-4 rounded-xl border ${
                      active
                        ? "bg-primary-500 border-primary-300"
                        : "border-primary-100"
                    }`}
                    activeOpacity={0.8}
                  >
                    <SvgIcon
                      width={36}
                      height={36}
                      color={active ? "#fff" : "#131927"}
                    />
                    <ThemedText
                      type="b2_body"
                      className={`mt-2 ${
                        active ? "text-white" : "text-typography-900"
                      }`}
                    >
                      {name}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ThemedView>
            {[1, 2].map((_, index) => (
              <ThemedView
                key={index}
                className="border border-primary-50 p-5 rounded-2xl flex gap-5"
              >
                <ThemedView className="flex-row gap-3">
                  <ThemedView>
                    <Avatar size="lg">
                      <AvatarFallbackText>Segun Johnson</AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                        }}
                      />
                    </Avatar>
                  </ThemedView>
                  <ThemedView className="flex flex-1 gap-1">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Segun Johnson
                    </ThemedText>
                    <ThemedView className="flex-row flex-1 items-center gap-1">
                      <Icon as={MapPin} />
                      <ThemedText type="default">
                        Ikeja, Lagos→Canada
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                <ThemedView>
                  <ThemedView className="flex-row gap-2">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Date:
                    </ThemedText>
                    <ThemedText type="default" className="text-typography-500">
                      in 3 days
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row gap-2">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Space:
                    </ThemedText>
                    <ThemedText type="default" className="text-typography-500">
                      10 Pounds
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <Button
                  variant="solid"
                  size="2xl"
                  onPress={() => {
                    router.push({
                      pathname: "/(tabs)/trips/traveler-detail",
                      params: { id: activeTripType },
                    });
                  }}
                  className="flex-1 rounded-[12px] mx-1"
                >
                  <ThemedText
                    type="s2_subtitle"
                    className="text-white text-center"
                  >
                    Bid in Space
                  </ThemedText>
                </Button>
              </ThemedView>
            ))}

            <ThemedView className="mt-5">
              <ThemedText type="h5_header" className="pb-2">
                Your biding
              </ThemedText>
              {[1].map((_, index) => (
                <ThemedView
                  key={index}
                  className="border border-primary-50 p-5 rounded-2xl flex gap-5"
                >
                  <ThemedView>
                    <ThemedView className="flex-row justify-between flex-1 gap-2">
                      <ThemedText
                        type="s1_subtitle"
                        className="text-typography-800 flex-1"
                      >
                        Urgent Documents to VI
                      </ThemedText>
                      <Button variant="solid" className="bg-primary-50">
                        <ThemedText
                          type="btn_medium"
                          className="text-primary-500"
                        >
                          Bidding
                        </ThemedText>
                      </Button>
                    </ThemedView>
                    <ThemedView className="flex-row gap-2">
                      <ThemedText
                        type="s2_subtitle"
                        className="text-typography-800"
                      >
                        From:
                      </ThemedText>
                      <ThemedText
                        type="default"
                        className="text-typography-500"
                      >
                        Ikeja port, Lagos
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row gap-2">
                      <ThemedText
                        type="s2_subtitle"
                        className="text-typography-800"
                      >
                        To:
                      </ThemedText>
                      <ThemedText
                        type="default"
                        className="text-typography-500"
                      >
                        VI, Lagos
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <Button
                    variant="solid"
                    size="2xl"
                    onPress={() => {
                      router.push("/(tabs)/choose-payment-type");
                    }}
                    className="flex-1 rounded-[12px] mx-1"
                  >
                    <ThemedText
                      type="s2_subtitle"
                      className="text-white text-center"
                    >
                      View BIds (3)
                    </ThemedText>
                  </Button>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}
