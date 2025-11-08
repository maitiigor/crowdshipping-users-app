import {
  AppState,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { useNavigation, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { BottomDrawer } from "@/components/Custom/BottomDrawer";
import { CountrySelector } from "@/components/Custom/CountrySelector";
import CustomSidebarMenu from "@/components/Custom/CustomSidebarMenu";
import CustomToast from "@/components/Custom/CustomToast";
import { StatusBadge } from "@/components/Custom/StatusBadge";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useAuthenticatedQuery } from "@/lib/api";
import { IActiveBookingsResponse } from "@/types/IBookingHistory";
import { IUserProfileResponse } from "@/types/IUserProfile";
import Feather from "@expo/vector-icons/Feather";
import {
  ChevronDown,
  HelpCircleIcon,
  LucideIcon,
  MapPin,
  RefreshCw,
} from "lucide-react-native";
import MapView, { Marker } from "react-native-maps";

const deliveryType = [
  {
    img: require("@/assets/images/home/road-delivery.png"),
    id: "1",
    titleKey: "home.land",
    linkTo: "/(tabs)/trips/road-delivery",
  },
  {
    img: require("@/assets/images/home/flight-delivery.png"),
    id: "2",
    titleKey: "home.air",
    linkTo: "/(tabs)/trips",
  },

  {
    img: require("@/assets/images/home/maritime-delivery.png"),
    titleKey: "home.sea",
    id: "3",
    linkTo: "/(tabs)/trips",
  },
] as const;
const ACTIVE_POLL_INTERVAL_MS = 15000;
const THROTTLE_INTERVAL_MS = 30000;
const MIN_THROTTLE_TOAST_GAP_MS = 5000;
const ACTIVE_TRACKING_STATUSES = [
  "GOING_TO_PICKUP",
  "PICKED_UP",
  "IN_PROGRESS",
  "IN_TRANSIT",
];
export default function HomeScreen() {
  const navigation = useNavigation();
  const toast = useToast();
  const showNewToast = useCallback(
    ({
      title,
      description,
      icon,
      action = "error",
      variant = "solid",
    }: {
      title: string;
      description: string;
      icon: LucideIcon;
      action: "error" | "success" | "info" | "muted" | "warning";
      variant: "solid" | "outline";
    }) => {
      const newId = Math.random();
      toast.show({
        id: newId.toString(),
        placement: "top",
        duration: 3000,
        render: ({ id }) => (
          <CustomToast
            uniqueToastId={`toast-${id}`}
            icon={icon}
            action={action}
            title={title}
            variant={variant}
            description={description}
          />
        ),
      });
    },
    [toast]
  );
  const [showDrawer, setShowDrawer] = useState(false);
  const [snap, setSnap] = useState(0.4);
  const [isThrottled, setIsThrottled] = useState(false);
  const [pollingIntervalMs, setPollingIntervalMs] = useState<number | false>(
    ACTIVE_POLL_INTERVAL_MS
  );
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastThrottleToastRef = useRef(0);
  const lastManualRefetchRef = useRef(0);
  const { data, isLoading } = useAuthenticatedQuery<IUserProfileResponse>(
    ["me"],
    "/user/profile"
  );

  // Real-time status updates: refetch every 5 seconds and when app comes to foreground
  const {
    data: ongoingTripsData,
    isLoading: isLoadingOngoingTrips,
    refetch: refetchOngoingTrips,
    error: ongoingTripsError,
  } = useAuthenticatedQuery<IActiveBookingsResponse>(
    ["active-booking"],
    "/trip/active/bookings",
    undefined, // fetchOptions
    {
      // Core polling
      refetchInterval: !isThrottled ? ACTIVE_POLL_INTERVAL_MS : false,
      refetchIntervalInBackground: false,

      // Prevent duplicate requests within the polling window
      staleTime: ACTIVE_POLL_INTERVAL_MS - 1000, // Fresh for almost the full interval

      // Disable when throttled
      enabled: !isThrottled,

      // Keep these off OR make them respect staleTime
      refetchOnWindowFocus: !isThrottled, // Will only refetch if data is stale
      refetchOnReconnect: !isThrottled, // Will only refetch if data is stale

      retry: (failureCount, err: any) => {
        if (err?.status === 429) {
          return false; // Make sure this triggers your throttle state
        }
        return failureCount < 2;
      },

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Handle 429 properly
    }
  );
  // if status is IN_PROGRESS take it to the last in the array
  const sortedOngoingTripsData = ongoingTripsData
    ? {
        ...ongoingTripsData,
        data: [
          ...ongoingTripsData?.data.filter(
            (trip) => trip.status !== "IN_PROGRESS"
          ),
          ...ongoingTripsData?.data.filter(
            (trip) => trip.status === "IN_PROGRESS"
          ),
        ],
      }
    : ongoingTripsData;
  const handleThrottle = useCallback(() => {
    if (throttleTimerRef.current) {
      clearTimeout(throttleTimerRef.current);
    }
    setIsThrottled(true);
    setPollingIntervalMs(false);

    const now = Date.now();
    if (now - lastThrottleToastRef.current > MIN_THROTTLE_TOAST_GAP_MS) {
      // showNewToast({
      //   title: "Live updates paused",
      //   description:
      //     "We hit the live tracking limit. We'll retry in a few moments.",
      //   icon: HelpCircleIcon,
      //   action: "warning",
      //   variant: "solid",
      // });
      lastThrottleToastRef.current = now;
    }

    throttleTimerRef.current = setTimeout(() => {
      setIsThrottled(false);
      setPollingIntervalMs(ACTIVE_POLL_INTERVAL_MS);
      throttleTimerRef.current = null;
    }, THROTTLE_INTERVAL_MS);
  }, []);

  const liveTripExists = useMemo(() => {
    const trips = ongoingTripsData?.data ?? [];
    return trips.some((trip) =>
      ACTIVE_TRACKING_STATUSES.includes(trip.status as string)
    );
  }, [ongoingTripsData?.data]);

  const pollingStatusLabel = useMemo(() => {
    if (isThrottled) {
      return "Live updates paused while we cool down.";
    }
    if (pollingIntervalMs && pollingIntervalMs > 0) {
      return `Auto-updates every ${Math.round(
        pollingIntervalMs / 1000
      )} seconds`;
    }
    if (liveTripExists) {
      return "Auto-updates resume shortly.";
    }
    return "Auto-updates idle until a trip goes live.";
  }, [isThrottled, pollingIntervalMs, liveTripExists]);

  const manualRefreshDisabled = isThrottled || isLoadingOngoingTrips;

  useEffect(() => {
    if (liveTripExists) {
      if (!isThrottled) {
        setPollingIntervalMs((current) =>
          current === ACTIVE_POLL_INTERVAL_MS
            ? current
            : ACTIVE_POLL_INTERVAL_MS
        );
      }
    } else {
      setPollingIntervalMs((current) => (current === false ? current : false));
    }
  }, [liveTripExists, isThrottled]);

  useEffect(() => {
    if ((ongoingTripsError as any)?.status === 429) {
      handleThrottle();
    }
  }, [ongoingTripsError, handleThrottle]);

  useEffect(() => {
    return () => {
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, []);

  // Additional refetch when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && !isThrottled) {
        const now = Date.now();
        if (now - lastManualRefetchRef.current > 3000) {
          lastManualRefetchRef.current = now;
          refetchOngoingTrips();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refetchOngoingTrips, isThrottled]);

  // const { country, countryCode, countryFlag, callingCode, language, selectByCode} = useCountry();

  // country.name, country.currencies, country.callingCodes, etc.
  const router = useRouter();

  const { t } = useTranslation();
  useEffect(() => {
    const fullName =
      (data as any)?.data?.fullName ?? (data as any)?.fullName ?? "User";
    const address = data?.data?.profile.address ?? "No address set";
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "#FFFFFF",
        elevation: 0, // Android
        shadowOpacity: 0, // iOS
        shadowColor: "transparent", // iOS
        borderBottomWidth: 0,
      },
      headerTitle: () => (
        <ThemedView className="flex justify-center items-center">
          <ThemedText className="text-center" type="s1_subtitle">
            {/* Example: Keep static or make dynamic via user profile */}
            Hello, {isLoading ? "..." : fullName}
          </ThemedText>
          <ThemedView className="flex-row gap-2 items-center bottom-1">
            <Icon as={MapPin} size="lg" className="text-primary-500" />
            <ThemedText className="text-center" type="c2_caption">
              {address.length > 25
                ? address.substring(0, 25) + "..."
                : address || "No address set"}
            </ThemedText>
            <Icon as={ChevronDown} size="2xl" className="text-typography-600" />
          </ThemedView>
        </ThemedView>
      ),
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            setShowDrawer(true);
          }}
          className="shadow"
          style={{ paddingHorizontal: 0 }}
        >
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <CountrySelector
          showCountryName={false}
          flagSize={42}
          flagClassName="bottom-5"
          textSize="s1_subtitle"
        />
      ),
    });
  }, [navigation, t, data, isLoading]);
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView>
            <ThemedText className="text-center mt-5" type="h4_header">
              {t("home.send_package")}
            </ThemedText>
            <ThemedText
              className="text-center text-typography-700"
              type="default"
            >
              {t("home.subtitle")}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView
          className={`flex-1 gap-5 pb-20 mt-3 ${
            ongoingTripsData?.data?.length! > 0 ? "mb-96" : ""
          }`}
        >
          {deliveryType.map((item, index) => (
            <Pressable
              key={item.titleKey}
              onPress={() =>
                router.push({
                  pathname: item.linkTo,
                  params: { tripTypeId: item.id },
                })
              }
              className="flex items-center gap-2 h-[165px] w-full"
              style={
                {
                  backgroundColor: "#FFFFFF",
                  padding: 12,
                  borderRadius: 8,
                  // web shadow (as provided)
                  boxShadow:
                    "0px 1px 3px 1px #FDEFEB26, 0px 1px 2px 0px #0000004D",
                  // iOS shadow approximation
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  // Android elevation
                  elevation: 2,
                } as any
              }
            >
              <Image
                source={item.img}
                className="h-[100px] w-[100px] object-contain"
                alt={t(item.titleKey)}
              />
              <ThemedText className="text-typography-700" type="h5_header">
                {t(item.titleKey)}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
        <CustomSidebarMenu
          userProfileData={data as IUserProfileResponse}
          isLoading={isLoading}
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
        />
      </ParallaxScrollView>
      {isLoadingOngoingTrips ? (
        <BottomDrawer
          initialSnap={0.4}
          snapPoints={[0.4, 1]}
          onSnapChange={setSnap}
          snap={snap}
        >
          <View className="py-3 flex-1">
            <ThemedView className={`gap-3 flex-1 ${snap === 1 ? "mt-10" : ""}`}>
              {/* Header Skeleton */}
              <ThemedView className="flex-row justify-between items-center px-4 pb-2">
                <ThemedView className="flex-1">
                  <SkeletonText _lines={1} className="h-4 w-32 mb-1" />
                  <SkeletonText _lines={1} className="h-2 w-40" />
                </ThemedView>
                <Skeleton variant="circular" className="h-10 w-10" />
              </ThemedView>

              {/* Trips List Skeleton */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                className="flex-1"
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <ThemedView key={index} className="mx-4 mb-3">
                    <ThemedView
                      className="p-4 bg-white rounded-2xl"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3,
                      }}
                    >
                      {/* Card Header */}
                      <ThemedView className="flex-row justify-between items-start pb-3">
                        <ThemedView className="flex-1 gap-2">
                          <SkeletonText _lines={1} className="h-4 w-28 mb-1" />
                          <Skeleton className="h-6 w-24 rounded-full" />
                          <HStack className="gap-2 items-center mt-1">
                            <SkeletonText _lines={1} className="h-2 w-24" />
                            <Skeleton variant="circular" className="h-1 w-1" />
                            <SkeletonText _lines={1} className="h-2 w-20" />
                          </HStack>
                        </ThemedView>
                        <Skeleton className="h-10 w-20 rounded-xl" />
                      </ThemedView>

                      {/* Map Skeleton */}
                      <Skeleton
                        className="h-[180px] w-full rounded-xl mt-2"
                        style={{
                          backgroundColor: "#F3F4F6",
                        }}
                      />
                    </ThemedView>
                  </ThemedView>
                ))}
              </ScrollView>
            </ThemedView>
          </View>

          {/* Close Button Skeleton (when drawer is expanded) */}
          {snap === 1 && (
            <ThemedView className="absolute bottom-0 left-0 right-0 px-5">
              <Button
                onPress={() => {
                  setSnap(0.4);
                }}
                variant="solid"
                size="2xl"
                className="mt-5 rounded-[12px]"
              >
                <ThemedText type="s1_subtitle" className="text-white">
                  Close
                </ThemedText>
              </Button>
            </ThemedView>
          )}
        </BottomDrawer>
      ) : ongoingTripsData?.data?.length! > 0 ? (
        <BottomDrawer
          initialSnap={0.4}
          snapPoints={[0.4, 1]}
          onSnapChange={setSnap}
          snap={snap}
        >
          <View className="py-3 flex-1">
            <ThemedView className={`gap-3 flex-1 ${snap === 1 ? "mt-10" : ""}`}>
              {/* Header with refresh button */}
              <ThemedView className="flex-row justify-between items-center px-4 pb-2">
                <ThemedView>
                  <ThemedText type="h5_header" className="text-typography-900">
                    Ongoing Trips
                  </ThemedText>
                  <ThemedText type="c1_caption" className="text-typography-600">
                    {pollingStatusLabel}
                  </ThemedText>
                </ThemedView>
                <Pressable
                  disabled={manualRefreshDisabled}
                  onPress={() => {
                    if (isThrottled) {
                      showNewToast({
                        title: "Please wait",
                        description:
                          "We're retrying updates shortly due to rate limits.",
                        icon: HelpCircleIcon,
                        action: "info",
                        variant: "solid",
                      });
                      return;
                    }
                    lastManualRefetchRef.current = Date.now();
                    refetchOngoingTrips();
                  }}
                  className="p-2 rounded-full bg-primary-50"
                  style={{
                    opacity: manualRefreshDisabled ? 0.5 : 1,
                  }}
                >
                  <Icon
                    as={RefreshCw}
                    size="lg"
                    className="text-primary-500"
                    style={{
                      transform: [
                        { rotate: isLoadingOngoingTrips ? "180deg" : "0deg" },
                      ],
                    }}
                  />
                </Pressable>
              </ThemedView>

              {/* Trips list */}
              <FlatList
                data={sortedOngoingTripsData?.data || []}
                nestedScrollEnabled
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
                renderItem={({ item, index }) => (
                  <ThemedView
                    key={item._id}
                    className="p-4 bg-white rounded-2xl"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 3,
                    }}
                  >
                    <ThemedView className="flex-row justify-between items-start pb-3">
                      <ThemedView className="flex-1 gap-2">
                        <ThemedText
                          type="s1_subtitle"
                          className="text-typography-900"
                        >
                          {item.bookingRef}
                        </ThemedText>
                        <StatusBadge status={item.status as any} size="md" />
                        <ThemedView className="flex-row items-center gap-2 mt-1">
                          <ThemedText
                            type="c1_caption"
                            className="text-typography-600 capitalize"
                          >
                            {item.fleetType} Delivery
                          </ThemedText>
                          <ThemedView
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: "#9CA3AF",
                            }}
                          />
                          <ThemedText
                            type="c1_caption"
                            className="text-typography-600"
                          >
                            {new Date(item.createdAt).toLocaleDateString()}
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>
                      {(() => {
                        const isDisabled =
                          item.status === "DELIVERED" ||
                          item.status === "IN_PROGRESS";
                        return (
                          <Pressable
                            disabled={isDisabled}
                            onPress={() => {
                              if (!isDisabled) {
                                router.push({
                                  pathname: "/(tabs)/trip-details/[id]",
                                  params: {
                                    id: item._id,
                                    tripType: item?.fleetType,
                                  },
                                });
                              }
                            }}
                            className={`rounded-xl px-5 py-2.5 ${
                              isDisabled ? "bg-gray-400" : "bg-primary-500"
                            }`}
                            style={isDisabled ? { opacity: 0.7 } : undefined}
                          >
                            <ThemedText
                              type="btn_medium"
                              className="text-white font-semibold"
                            >
                              View
                            </ThemedText>
                          </Pressable>
                        );
                      })()}
                    </ThemedView>
                    <MapView
                      style={{
                        height: 180,
                        width: "100%",
                        borderRadius: 12,
                        marginTop: 8,
                      }}
                      initialRegion={{
                        latitude: item.last_location
                          ? item.last_location.coords.coordinates[1]
                          : 37.78825,
                        longitude: item.last_location
                          ? item.last_location.coords.coordinates[0]
                          : -122.4324,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                      }}
                      showsUserLocation
                    >
                      {item.last_location && (
                        <Marker
                          coordinate={{
                            latitude: item.last_location.coords.coordinates[1],
                            longitude: item.last_location.coords.coordinates[0],
                          }}
                          title={item.last_location.coords.address}
                          pinColor="green"
                          onPress={() => {}}
                          description={
                            item.last_location.speed
                              ? `Speed: ${item.last_location.speed} m/s`
                              : undefined
                          }
                        />
                      )}
                    </MapView>
                  </ThemedView>
                )}
                keyExtractor={(item, index) => `${item._id}-${index}`}
                contentContainerStyle={{ paddingBottom: 50 }}
                ItemSeparatorComponent={() => <View className="h-3" />}
              />
            </ThemedView>
          </View>
          {snap === 1 && (
            <ThemedView className="absolute bottom-0 left-0 right-0 px-5">
              <Button
                onPress={() => {
                  setSnap(0.4);
                }}
                variant="solid"
                size="2xl"
                className="mt-5 rounded-[12px]"
              >
                <ThemedText type="s1_subtitle" className="text-white">
                  Close
                </ThemedText>
              </Button>
            </ThemedView>
          )}
        </BottomDrawer>
      ) : null}
    </>
  );
}

// styles removed (unused)
