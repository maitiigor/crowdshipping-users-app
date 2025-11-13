import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { EmptyState } from "@/components/Custom/EmptyState";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useAuthenticatedQuery } from "@/lib/api";
import { IBookingHistoryResponse } from "@/types/IBookingHistory";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Book, ChevronLeft, ChevronRight, Dot } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

// dayjs fromNow plugin
dayjs.extend(relativeTime);

const filterList = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "In Progress",
    value: "in-progress",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];
export default function BookingHistoryScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const backroundTopNav = useThemeColor({}, "background");
  // Build fetchOptions conditionally
  const fetchOptions = selectedFilter
    ? { query: { booking_status: selectedFilter.toLowerCase() } }
    : undefined;

  // Include the filter in the query key for proper caching
  const queryKey = selectedFilter
    ? ["booking", selectedFilter.toLowerCase()]
    : ["booking"];

  const { data, isLoading, refetch, isFetching } = useAuthenticatedQuery<
    IBookingHistoryResponse | undefined
  >(queryKey, "/trip/booking/history");
  console.log("🚀 ~ BookingHistoryScreen ~ data:", data);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Booking History
          </ThemedText>
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
      <ThemedView className="flex-1 pb-20 px-[18px] overflow-hidden">
        <ThemedView>
          <FlatList
            data={filterList}
            horizontal
            contentContainerClassName="pb-3"
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedFilter(item.value as string);
                }}
                className={`border-2 w-[140px] p-3 border-primary-500 rounded-xl ${
                  selectedFilter === item.value ? "bg-primary-500" : ""
                }`}
              >
                <ThemedText
                  type="s1_subtitle"
                  className={` text-center ${
                    selectedFilter === item.value
                      ? "text-white"
                      : "text-primary-500"
                  }`}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value}
          />
        </ThemedView>
        <ThemedView className="mt-5">
          {isLoading ? (
            Array.from({ length: 7 }).map((_: any, index: number) => (
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
              data={data?.data || []}
              contentContainerClassName="pb-20"
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              refreshing={isFetching}
              onRefresh={() => {
                refetch();
              }}
              ListEmptyComponent={
                <EmptyState
                  title="No Bookings available"
                  description="There are no bookings available at the moment. Check back later for updates."
                  icon={Book}
                  className="mt-10"
                />
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/(tabs)/booking-history/[id]",
                      params: {
                        selectedFilter: selectedFilter,
                        id: item?._id,
                      },
                    });
                  }}
                  className={`border border-typography-100 flex-row justify-between items-center p-4 rounded-xl`}
                >
                  {/* Make this container flexible and allow children to shrink */}
                  <ThemedView className="flex-row items-center gap-2 flex-1 min-w-0">
                    <Image
                      source={require("@/assets/images/home/cube-icon.png")}
                      alt="cube icon"
                      size="sm"
                      resizeMode="contain"
                      className=""
                    />
                    {/* Ensure the text area can wrap/shrink */}
                    <ThemedView className="flex-1 min-w-0">
                      <ThemedText
                        type="b2_body"
                        className="flex-wrap"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item?.bookingRef}
                      </ThemedText>
                      <ThemedView className="flex-row items-center">
                        <ThemedText
                          type="c1_caption"
                          className="text-typography-700 capitalize"
                        >
                          {selectedFilter}
                        </ThemedText>
                        <Icon
                          as={Dot}
                          size="md"
                          className="text-typography-500"
                        />
                        <ThemedText
                          type="c1_caption"
                          className="text-typography-700 "
                        >
                          {item?.createdAt
                            ? dayjs(item.createdAt).format("MMMM D")
                            : ""}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>

                  <Icon
                    as={ChevronRight}
                    size="3xl"
                    className="text-typography-800"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item?._id.toString()}
            />
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
