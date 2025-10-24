import ErrandsSvg from "@/assets/svgs/errands.svg";
import GroundSvg from "@/assets/svgs/ground.svg";
import RideSvg from "@/assets/svgs/ride.svg";
import { EmptyState } from "@/components/Custom/EmptyState";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon, SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useAuthenticatedQuery } from "@/lib/api";
import { IAirTripDatum, IAirTripResponse } from "@/types/air-sea/IAirTrip";
import {
  ISeaMaritimeDatum,
  ISeaMaritimeResponse,
} from "@/types/air-sea/ISeaMaritime";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { t } from "i18next";
import { BellIcon, ChevronLeft, MapPin, Plane, Ship } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

dayjs.extend(relativeTime);
export default function TripDelivery() {
  const navigation = useNavigation();
  const router = useRouter();
  const { tripTypeId } = useLocalSearchParams();
  console.log("🚀 ~ TripDelivery ~ tripTypeId:", tripTypeId);
  const [activeTripType, setActiveTripType] = useState<number>(
    tripTypeId ? parseInt(tripTypeId as string, 10) : 2
  );
  const {
    data: airTripData,
    isLoading: airTripLoading,
    refetch: refetchAirTrips,
    isFetching: isFetchingAirTrips,
  } = useAuthenticatedQuery<IAirTripResponse | undefined>(
    ["trips-air", activeTripType === 2],
    "/trip/available/air"
  );
  const {
    data: maritimeData,
    isLoading: maritimeLoading,
    refetch: refetchMaritime,
    isFetching: isFetchingMaritime,
  } = useAuthenticatedQuery<ISeaMaritimeResponse | undefined>(
    ["trips-maritime", activeTripType === 3],
    "/trip/available/maritimes"
  );
  console.log("🚀 ~ TripDelivery ~ tripTypeId:", tripTypeId);
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Trips(
            {activeTripType === 1
              ? "Land"
              : activeTripType === 2
              ? "Air"
              : "Maritime"}
            )
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
  }, [navigation, activeTripType]);

  const tripTypes = [
    { id: 1, name: "Ground", Icon: GroundSvg },
    { id: 2, name: "Air", Icon: ErrandsSvg },
    { id: 3, name: "Maritime", Icon: RideSvg },
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
            {airTripLoading || maritimeLoading ? (
              Array.from({ length: 3 }).map((_: any, index: number) => (
                <ThemedView key={index} className="w-full">
                  <Box className="w-full gap-4 p-3 rounded-md ">
                    <SkeletonText _lines={3} className="h-2" />
                    <HStack className="gap-1 align-middle">
                      <Skeleton
                        variant="circular"
                        className="h-[24px] w-[28px] mr-2"
                      />
                      <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
                    </HStack>
                  </Box>
                </ThemedView>
              ))
            ) : (
              <FlatList
                data={
                  (activeTripType === 2
                    ? airTripData?.data || []
                    : maritimeData?.data || []) as (
                    | IAirTripDatum
                    | ISeaMaritimeDatum
                  )[]
                }
                refreshing={isFetchingAirTrips || isFetchingMaritime}
                scrollEnabled={false}
                onRefresh={() => {
                  if (activeTripType === 2) {
                    refetchAirTrips();
                  } else {
                    refetchMaritime();
                  }
                }}
                ListEmptyComponent={
                  <EmptyState
                    title="No trips available"
                    description="There are no trips available at the moment. Check back later for updates."
                    icon={activeTripType === 2 ? Plane : Ship}
                    className="mt-10"
                  />
                }
                contentContainerClassName=""
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                renderItem={({ item }) => {
                  const departureRaw =
                    item.trip?.departureDate ?? item.trip?.departureDate;
                  const arrivalRaw =
                    item.trip?.arrivalDate ?? item.trip?.arrivalDate;
                  const departure = departureRaw ? dayjs(departureRaw) : null;
                  const arrival = arrivalRaw ? dayjs(arrivalRaw) : null;
                  return (
                    <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
                      <ThemedView className="flex-row gap-3">
                        <ThemedView>
                          <Avatar size="lg">
                            <AvatarFallbackText>
                              {item?.trip.creator.fullName}
                            </AvatarFallbackText>
                            <AvatarImage
                              source={{
                                uri:
                                  item?.trip.creator.profile.profilePicUrl ||
                                  "",
                              }}
                            />
                          </Avatar>
                        </ThemedView>
                        <ThemedView className="flex flex-1 gap-1">
                          <ThemedText
                            type="s2_subtitle"
                            className="text-typography-800"
                          >
                            {item?.trip.creator.fullName}
                          </ThemedText>
                          <ThemedView className="flex-row flex-1 items-center gap-1">
                            <Icon as={MapPin} />
                            <ThemedText type="default">
                              {activeTripType === 2
                                ? `${(item as IAirTripDatum).departureCity}→${
                                    (item as IAirTripDatum).arrivalCity
                                  }`
                                : `${
                                    (item as ISeaMaritimeDatum).departurePort
                                  }→${(item as ISeaMaritimeDatum).arrivalPort}`}
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
                            Departure:
                          </ThemedText>
                          <ThemedText
                            type="default"
                            className="text-typography-500"
                          >
                            {departure ? `${departure.fromNow()}` : "—"}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row gap-2">
                          <ThemedText
                            type="s2_subtitle"
                            className="text-typography-800"
                          >
                            Arrival:
                          </ThemedText>
                          <ThemedText
                            type="default"
                            className="text-typography-500"
                          >
                            {arrival ? `${arrival.format("MMM D, YYYY")}` : "—"}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row gap-2">
                          <ThemedText
                            type="s2_subtitle"
                            className="text-typography-800"
                          >
                            Status:
                          </ThemedText>
                          <ThemedText
                            type="default"
                            className="text-typography-500"
                          >
                            {item.trip?.status || "—"}
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>
                      <Button
                        variant="solid"
                        size="2xl"
                        onPress={() => {
                          router.push({
                            pathname: "/(tabs)/trips/traveler-detail",
                            params: {
                              activeTripType: activeTripType.toString(),
                              tripId: item._id,
                            },
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
                  );
                }}
                keyExtractor={(item, index) => `${item._id}-${index}`}
              />
            )}

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
                    className=" rounded-[12px] mx-1"
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
