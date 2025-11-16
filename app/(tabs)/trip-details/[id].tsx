import { BottomDrawer } from "@/components/Custom/BottomDrawer";
import { CustomModal } from "@/components/Custom/CustomModal";
import CustomToast from "@/components/Custom/CustomToast";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedPost, useAuthenticatedQuery } from "@/lib/api";
import { ILiveTrackingResponse } from "@/types/IBookingHistory";
import { paramToString } from "@/utils/helper";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import {
  Link,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";

import {
  ChevronLeft,
  CircleCheckIcon,
  Clock3,
  Dot,
  Handbag,
  HelpCircleIcon,
  LocateFixed,
  LucideIcon,
  MapPin,
  MessageCircleMore,
  NotepadText,
  Phone,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  AppState,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
const dayjs = require("dayjs");
const durationPlugin = require("dayjs/plugin/duration").default;

const ACTIVE_POLL_INTERVAL_MS = 15000;
const THROTTLE_INTERVAL_MS = 30000;
const MIN_THROTTLE_TOAST_GAP_MS = 5000;

export default function TrackBidOrder() {
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const backroundTopNav = useThemeColor({}, "background");
  const [showModal, setShowModal] = useState(true);
  const [rating, setRating] = useState<number>(0);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [isThrottled, setIsThrottled] = useState(false);
  const [pollingIntervalMs, setPollingIntervalMs] = useState<number | false>(
    ACTIVE_POLL_INTERVAL_MS
  );
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastThrottleToastRef = useRef(0);
  const lastManualRefetchRef = useRef(0);
  const { id, tripType } = useLocalSearchParams();
  const tripTypeStr = paramToString(tripType);
  const idStr = paramToString(id);
  const mapRef = useRef<MapView | null>(null);

  const handleThrottle = useCallback(() => {
    if (throttleTimerRef.current) {
      clearTimeout(throttleTimerRef.current);
    }
    setIsThrottled(true);
    setPollingIntervalMs(false);

    const now = Date.now();
    if (now - lastThrottleToastRef.current > MIN_THROTTLE_TOAST_GAP_MS) {
      // showNewToast({
      //   title: "Tracking paused",
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

  const {
    data: ongoingTripsData,
    isLoading: isLoadingOngoingTrips,
    refetch: refetchOngoingTrips,
    error: trackingError,
  } = useAuthenticatedQuery<ILiveTrackingResponse>(
    ["active-booking", tripTypeStr, idStr],
    `/orders/${tripTypeStr}/${idStr}/locations`,
    undefined, // fetchOptions
    {
      // Core polling
      refetchInterval: pollingIntervalMs,
      refetchIntervalInBackground: false,

      // Prevent duplicate requests within the polling window
      staleTime:
        typeof pollingIntervalMs === "number"
          ? Math.max(pollingIntervalMs - 1000, 0)
          : ACTIVE_POLL_INTERVAL_MS - 1000, // Fresh for almost the full interval

      // Disable when throttled
      enabled: !isThrottled && pollingIntervalMs !== false,

      // Keep these off OR make them respect staleTime
      refetchOnWindowFocus: !isThrottled && pollingIntervalMs !== false, // Will only refetch if data is stale
      refetchOnReconnect: !isThrottled && pollingIntervalMs !== false, // Will only refetch if data is stale

      retry: (failureCount, err: any) => {
        if (err?.status === 429) {
          return false; // Make sure this triggers your throttle state
        }
        return failureCount < 2;
      },

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );
  console.log("🚀 ~ TrackBidOrder ~ ongoingTripsData:", ongoingTripsData);
  const { mutateAsync, error, loading } = useAuthenticatedPost<
    any,
    {
      bookingId: string;
      rating: number;
      review: string;
    }
  >(`/rating/rate/delivery`);
  const handleStarClick = (value: number) => {
    setRating(value);
  };

  // Extract data from API response
  const orderData = ongoingTripsData?.data;
  const traveller = orderData?.traveller;
  const locations = useMemo(
    () => orderData?.locations ?? [],
    [orderData?.locations]
  );
  const coordinates = useMemo(
    () =>
      locations.map((location) => ({
        latitude: location.coords.coordinates[1],
        longitude: location.coords.coordinates[0],
      })),
    [locations]
  );
  const markerIdentifiers = useMemo(
    () => locations.map((location) => location._id),
    [locations]
  );
  const latestLocation = useMemo(() => {
    if (!locations.length) {
      return undefined;
    }

    const getTimestamp = (value?: string) => {
      if (!value) {
        return Number.NEGATIVE_INFINITY;
      }
      const parsed = Date.parse(value);
      return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
    };

    return locations.reduce((currentLatest, candidate) => {
      const currentTime = getTimestamp(currentLatest?.createdAt);
      const candidateTime = getTimestamp(candidate.createdAt);

      return candidateTime > currentTime ? candidate : currentLatest;
    }, locations[0]);
  }, [locations]);
  const latestLocationId = latestLocation?._id ?? null;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }) +
      " | " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  // Get status display text
  const getStatusText = (status: string): string => {
    switch (status) {
      case "GOING_TO_PICKUP":
        return "Going to pickup";
      case "PICKED_UP":
        return "Picked up";
      case "IN_PROGRESS":
        return "In progress";
      case "IN_TRANSIT":
        return "On the way";
      case "ARRIVED_DESTINATION":
        return "Arrived at destination";
      case "DELIVERED":
        return "Delivered";
      case "TOLL_BILL_PENDING":
        return "Toll bill pending";
      case "COMPLETED":
        return "Completed";
      case "PENDING":
        return "Pending";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status || "Pending";
    }
  };
  // Map status codes to the user-facing banner messages
  const getBannerText = (status?: string) => {
    switch (status) {
      case "IN_TRANSIT":
        return "Your Package is on the way";
      case "COMPLETED":
      case "DELIVERED":
        return "Package Delivered";
      case "PENDING":
        return `Waiting for ${
          orderData?.fleetType === "road" ? "Driver" : "Pathfinder"
        }`;
      case "CANCELLED":
        return "Order Cancelled";
      case "GOING_TO_PICKUP":
        return `${
          orderData?.fleetType === "road" ? "Driver" : "Pathfinder"
        } is on the way to pick up your package`;
      case "PICKED_UP":
        return "Package Picked Up";
      case "ARRIVED_DESTINATION":
        return "Arrived at destination";
      case "IN_PROGRESS":
        return "Package in progress";
      case "TOLL_BILL_PENDING":
        return "Toll bill pending";
      default:
        return getStatusText(status ?? "");
    }
  };
  useEffect(() => {
    if (locations.length && !selectedLocationId) {
      setSelectedLocationId(latestLocationId ?? locations[0]._id);
    }
  }, [locations, latestLocationId, selectedLocationId]);

  useEffect(() => {
    if (!mapRef.current || !coordinates.length) {
      return;
    }

    if (coordinates.length === 1) {
      mapRef.current.animateToRegion(
        {
          ...coordinates[0],
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        400
      );
    } else {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 60, right: 40, bottom: 360, left: 40 },
        animated: true,
      });
    }
  }, [coordinates]);

  const handleLocationSelect = (locationId: string) => {
    const selectedLocation = locations.find((loc) => loc._id === locationId);
    if (!selectedLocation) {
      return;
    }
    setSelectedLocationId(locationId);
    if (!mapRef.current || !coordinates.length) {
      return;
    }

    if (coordinates.length === 1) {
      mapRef.current.animateToRegion(
        {
          latitude: selectedLocation.coords.coordinates[1],
          longitude: selectedLocation.coords.coordinates[0],
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        400
      );
    } else {
      mapRef.current.fitToSuppliedMarkers(markerIdentifiers, {
        edgePadding: { top: 60, right: 40, bottom: 360, left: 40 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    const status = ongoingTripsData?.data?.status;
    if (!status) {
      return;
    }

    if (status === "IN_TRANSIT") {
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
  }, [ongoingTripsData?.data?.status, isThrottled]);

  useEffect(() => {
    if ((trackingError as any)?.status === 429) {
      handleThrottle();
    }
  }, [trackingError, handleThrottle]);

  useEffect(() => {
    return () => {
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Trip Details
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
  // Additional refetch when app comes to foreground, but avoid spamming during throttling
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

  // Show modal when order is completed
  useEffect(() => {
    if (orderData?.status === "COMPLETED") {
      setShowModal(true);
    }
  }, [orderData?.status]);
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
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <CustomToast
              uniqueToastId={uniqueToastId}
              icon={icon}
              action={action}
              title={title}
              variant={variant}
              description={description}
            />
          );
        },
      });
    },
    [toast]
  );
  const handleReview = async (ratingParam?: number) => {
    const usedRating = ratingParam ?? rating;
    try {
      await mutateAsync({
        bookingId: idStr!,
        rating: usedRating,
        review: "",
      });
      showNewToast({
        title: "Success",
        description: `${ongoingTripsData?.data?.traveller.fullName} reviewed successfully!`,
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      setShowModal(true);
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Account Update failed";

      showNewToast({
        title: `${ongoingTripsData?.data?.traveller.fullName} Review Failed`,
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };
  const estimatedDeliveryTime = (() => {
    const est = Number((orderData as any)?.estimatedDays ?? NaN);
    if (!Number.isFinite(est)) return "-";

    try {
      // dynamic require so we don't need to add top-level imports here

      dayjs.extend(durationPlugin);

      const ms = est * 24 * 60 * 60 * 1000;
      const dur = dayjs.duration(ms);
      const days = Math.floor(dur.asDays());
      const hours = dur.hours();
      const minutes = dur.minutes();

      const parts: string[] = [];
      if (days) parts.push(`${days}d`);
      if (hours) parts.push(`${hours}h`);
      if (!days && !hours) parts.push(`${minutes}m`);

      return parts.join(" ");
    } catch {
      // fallback if dayjs or plugin isn't available
      const totalMinutes = Math.round(est * 24 * 60);
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes - days * 24 * 60) / 60);
      const minutes = totalMinutes % 60;

      const parts: string[] = [];
      if (days) parts.push(`${days}d`);
      if (hours) parts.push(`${hours}h`);
      if (!days && !hours) parts.push(`${minutes}m`);

      return parts.join(" ");
    }
  })();
  if (isLoadingOngoingTrips) {
    return (
      <ThemedView className="flex-1 bg-white items-center justify-center">
        <ThemedText type="s1_subtitle">Loading trip details...</ThemedText>
      </ThemedView>
    );
  }

  if (!ongoingTripsData?.data) {
    return (
      <ThemedView className="flex-1 bg-white items-center justify-center">
        <ThemedText type="s1_subtitle">No trip data available</ThemedText>
        <Button
          variant="solid"
          size="lg"
          className="mt-5"
          onPress={() => router.back()}
        >
          <ThemedText type="btn_large" className="text-white">
            Go Back
          </ThemedText>
        </Button>
      </ThemedView>
    );
  }
  return (
    <ThemedView className="flex-1 bg-white relative">
      {/* map */}
      <View className="absolute  top-14 left-0 right-0 z-50 items-center">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="bg-white w-[40px] h-[35px] shadow-lg rounded items-center justify-center absolute left-5"
          style={{ paddingHorizontal: 0 }}
        >
          <Entypo name="chevron-left" size={24} color="#131927" />
        </TouchableOpacity>
      </View>
      <MapView
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
        initialRegion={{
          latitude: latestLocation?.coords?.coordinates[1] || 6.5244,
          longitude: latestLocation?.coords?.coordinates[0] || 3.3792,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {locations.map((location) => {
          const isSelected = location._id === selectedLocationId;
          const isLatest = location._id === latestLocationId;
          const markerPinColor = isSelected ? "#E75B3B" : "#0F62FE";
          return (
            <Marker
              key={location._id}
              identifier={location._id}
              coordinate={{
                latitude: location.coords.coordinates[1],
                longitude: location.coords.coordinates[0],
              }}
              title={
                isLatest
                  ? `Current ${
                      orderData?.fleetType === "road" ? "Driver" : "Pathfinder"
                    } Location`
                  : `${
                      orderData?.fleetType === "road" ? "Driver" : "Pathfinder"
                    } Location`
              }
              description={
                location.coords.address ||
                location.coords.coordinates[1].toFixed(4) +
                  ", " +
                  location.coords.coordinates[0].toFixed(4)
              }
              pinColor={isLatest ? undefined : markerPinColor}
              zIndex={isSelected ? 10 : 1}
            >
              {isLatest && (
                <View style={styles.latestMarker}>
                  {/* Paper plane icon to highlight the active driver position */}
                  <Icon as={LocateFixed} size="xl" className="text-white" />
                </View>
              )}
            </Marker>
          );
        })}
        {locations.length > 1 && (
          <Polyline
            coordinates={locations.map((location) => ({
              latitude: location.coords.coordinates[1],
              longitude: location.coords.coordinates[0],
            }))}
            strokeColor="#E75B3B"
            strokeWidth={4}
          />
        )}
      </MapView>
      {isLoadingOngoingTrips ? (
        <>
          {/* Button Skeleton */}
          <ThemedView className="absolute bottom-10 left-0 right-0 px-5 z-10">
            <Skeleton className="h-14 w-full rounded-[12px]" />
          </ThemedView>

          {/* Drawer with Skeleton Content */}
          <BottomDrawer initialSnap={0.4} snapPoints={[0.4, 1]}>
            <ThemedView className="py-3 flex-1">
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {/* Header Section */}
                <ThemedView className="flex justify-center items-center gap-2 mb-4">
                  <SkeletonText _lines={1} className="h-3 w-32" />
                  <HStack className="gap-1 items-center">
                    <SkeletonText _lines={1} className="h-2 w-20" />
                    <Skeleton variant="circular" className="h-1 w-1" />
                    <SkeletonText _lines={1} className="h-2 w-24" />
                  </HStack>
                </ThemedView>

                {/* Driver Card Skeleton */}
                <ThemedView className="p-3 rounded-xl border border-typography-200 mb-3 gap-3">
                  <HStack className="items-center justify-between">
                    <HStack className="gap-3 flex-1">
                      <Skeleton variant="circular" className="h-12 w-12" />
                      <ThemedView className="flex-1">
                        <SkeletonText _lines={1} className="h-3 w-32 mb-2" />
                        <SkeletonText _lines={1} className="h-2 w-24" />
                      </ThemedView>
                    </HStack>
                    <HStack className="gap-3">
                      <Skeleton variant="circular" className="h-6 w-6" />
                      <Skeleton variant="circular" className="h-6 w-6" />
                    </HStack>
                  </HStack>
                </ThemedView>

                {/* Info Cards Skeleton */}
                <HStack space="md" className="items-stretch mt-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ThemedView key={i} className="flex-1 items-center">
                      <Skeleton variant="circular" className="h-11 w-11 mb-3" />
                      <SkeletonText _lines={1} className="h-3 w-16 mb-1" />
                      <SkeletonText _lines={1} className="h-2 w-20" />
                    </ThemedView>
                  ))}
                </HStack>

                {/* Location Timeline Skeleton */}
                <ThemedView className="mt-6 border p-5 rounded-xl border-typography-200">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ThemedView key={i} className="flex-row py-2">
                      <ThemedView className="items-center mr-3">
                        <Skeleton variant="circular" className="h-7 w-7" />
                        {i < 3 && (
                          <ThemedView className="mt-2">
                            {Array.from({ length: 4 }).map((_, j) => (
                              <Skeleton
                                key={j}
                                className="w-1 h-2 rounded-full my-1"
                              />
                            ))}
                          </ThemedView>
                        )}
                      </ThemedView>
                      <ThemedView className="flex-1 pb-4">
                        <SkeletonText _lines={1} className="h-3 w-3/4 mb-1" />
                        <SkeletonText _lines={1} className="h-2 w-1/2 mb-1" />
                        <SkeletonText _lines={1} className="h-2 w-1/3" />
                      </ThemedView>
                    </ThemedView>
                  ))}
                </ThemedView>
              </ScrollView>
            </ThemedView>
          </BottomDrawer>
        </>
      ) : (
        <>
          <ThemedView className="absolute bottom-10 left-0 right-0 px-5">
            {orderData?.status === "PENDING" && (
              <Button
                variant="solid"
                size="2xl"
                className="mt-5 rounded-[12px]"
              >
                <ThemedText type="btn_large" className="text-white">
                  Waiting for{" "}
                  {orderData?.fleetType === "road" ? "Driver" : "Pathfinder"}...
                </ThemedText>
              </Button>
            )}
            {orderData?.status === "IN_TRANSIT" && (
              <Button
                variant="solid"
                size="2xl"
                className="mt-5 rounded-[12px]"
                onPress={() => {
                  // Scroll to top or trigger some action
                }}
              >
                <ThemedText type="btn_large" className="text-white">
                  Tracking Active
                </ThemedText>
              </Button>
            )}
          </ThemedView>
          {/* drawer */}
          <BottomDrawer initialSnap={0.4} snapPoints={[0.4, 1]}>
            <ThemedView className="py-3 flex-1">
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                <ThemedView className="flex justify-center items-center gap-2 mb-4">
                  <ThemedText type="s1_subtitle">
                    {getBannerText(orderData?.status)}
                  </ThemedText>
                  <ThemedView className="flex-row items-center">
                    <ThemedText
                      type="c1_caption"
                      className="text-typography-700 "
                    >
                      {getStatusText(orderData?.status || "")}{" "}
                    </ThemedText>
                    <Icon as={Dot} size="lg" className="text-typography-500" />
                    <ThemedText
                      type="c1_caption"
                      className="text-typography-700 "
                    >
                      {orderData?.createdAt
                        ? formatDate(orderData.createdAt)
                        : "N/A"}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedView className="gap-3">
                  <ThemedView
                    className={`flex-row items-center justify-between p-3 rounded-xl bg-primary-inputShade border border-typography-200 `}
                  >
                    <ThemedView className="flex-row gap-3">
                      <Link href={"/(tabs)/inbox/chats"}>
                        <Avatar size="lg">
                          <AvatarFallbackText>
                            {traveller?.fullName ||
                              `${
                                orderData?.fleetType === "road"
                                  ? "Driver"
                                  : "Pathfinder"
                              }`}
                          </AvatarFallbackText>
                          <AvatarImage
                            source={{
                              uri:
                                traveller?.profile?.profilePicUrl ||
                                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                            }}
                          />
                        </Avatar>
                      </Link>
                      <ThemedView className="flex gap-1">
                        <ThemedText
                          type="s2_subtitle"
                          className="text-typography-800"
                        >
                          {traveller?.fullName || "Loading..."}
                        </ThemedText>
                        <ThemedText type="c1_caption">
                          {orderData?.fleetType}
                        </ThemedText>
                        {/* <ThemedText type="default">⭐ 4.8 (243)</ThemedText> */}
                      </ThemedView>
                    </ThemedView>

                    <ThemedView className="flex-row gap-3">
                      <TouchableOpacity
                        onPress={() => {
                          // Handle press
                          router.push({
                            pathname: "/(tabs)/inbox/chats",
                          });
                        }}
                      >
                        <Icon
                          as={MessageCircleMore}
                          size="2xl"
                          className="text-primary-500"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          router.push({
                            pathname: "/(tabs)/inbox/calls/call-details",
                            params: {
                              id: Array.isArray(id) ? id[0] : id ?? "",
                            },
                          });
                        }}
                      >
                        <Icon
                          as={Phone}
                          size="2xl"
                          className="text-primary-500"
                        />
                      </TouchableOpacity>
                    </ThemedView>
                  </ThemedView>
                  <HStack
                    space="md"
                    reversed={false}
                    className="items-stretch mt-5"
                  >
                    <ThemedView className="flex-1 min-w-0  rounded-lg overflow-hidden">
                      <View className=" items-center">
                        <ThemedView className="bg-primary-50  w-[44px] h-[44px] rounded-full flex justify-center items-center mb-3">
                          <Icon
                            as={Clock3}
                            size="2xl"
                            className="text-primary-500"
                          />
                        </ThemedView>
                        <ThemedView className="flex justify-center items-center">
                          <ThemedText type="b4_body" className="">
                            {estimatedDeliveryTime}
                          </ThemedText>
                          <ThemedText
                            type="c1_caption"
                            className="text-typography-600 text-center"
                          >
                            Estimated Time
                          </ThemedText>
                        </ThemedView>
                      </View>
                    </ThemedView>
                    <ThemedView className="flex-1 min-w-0  rounded-lg overflow-hidden">
                      <View className=" items-center">
                        <ThemedView className="bg-primary-50  w-[44px] h-[44px] rounded-full flex justify-center items-center mb-3">
                          <Icon
                            as={Handbag}
                            size="2xl"
                            className="text-primary-500"
                          />
                        </ThemedView>
                        <ThemedView className="flex justify-center items-center">
                          <ThemedText type="b4_body" className="">
                            {(orderData as any)?.weight || "-"} Kg
                          </ThemedText>
                          <ThemedText
                            type="c1_caption"
                            className="text-typography-600 text-center"
                          >
                            Package Weight
                          </ThemedText>
                        </ThemedView>
                      </View>
                    </ThemedView>
                    <ThemedView className="flex-1 min-w-0 rounded-lg overflow-hidden">
                      <View className=" flex justify-center items-center">
                        <ThemedView className="bg-primary-50 w-[44px] h-[44px] rounded-full flex justify-center items-center mb-3">
                          <Icon
                            as={NotepadText}
                            size="2xl"
                            className="text-primary-500"
                          />
                        </ThemedView>
                        <ThemedView className="flex justify-center items-center">
                          <ThemedText type="b4_body" className="text-center">
                            {orderData?.bookingRef || "#N/A"}
                          </ThemedText>
                          <ThemedText
                            type="c1_caption"
                            className="text-typography-600 text-center"
                          >
                            Track ID
                          </ThemedText>
                        </ThemedView>
                      </View>
                    </ThemedView>
                  </HStack>
                </ThemedView>
                {/* delivery timeline (vertical) */}
                <ThemedView className="mt-6 border p-5 rounded-xl border-typography-200">
                  {/* Location tracking */}
                  {locations.length > 0 ? (
                    locations.map((location, i) => {
                      const isLastItem = i === locations.length - 1;
                      const isFirstItem = i === 0;
                      const isSelected = location._id === selectedLocationId;
                      return (
                        <TouchableOpacity
                          key={`location-${location._id}`}
                          onPress={() => handleLocationSelect(location._id)}
                          activeOpacity={0.85}
                        >
                          <ThemedView className="flex-row py-2">
                            <ThemedView className="items-center mr-3">
                              {isFirstItem ? (
                                <Icon
                                  as={MapPin}
                                  size="2xl"
                                  className={
                                    isSelected
                                      ? "text-primary-600"
                                      : "text-typography-500"
                                  }
                                />
                              ) : (
                                <ThemedView
                                  className={`w-7 h-7 border-2 rounded-full flex justify-center items-center ${
                                    isSelected
                                      ? "border-primary-600"
                                      : "border-typography-400"
                                  }`}
                                >
                                  <ThemedView
                                    className={`w-3 h-3 rounded-full ${
                                      isSelected
                                        ? "bg-primary-600"
                                        : "bg-typography-400"
                                    }`}
                                  />
                                </ThemedView>
                              )}
                              {/* connector */}
                              {!isLastItem && (
                                <ThemedView className="mt-2">
                                  {Array.from({ length: 4 }).map((_, i) => (
                                    <ThemedView
                                      key={`v-sep-${i}`}
                                      className="w-1 h-2 rounded-full bg-typography-300 my-1"
                                    />
                                  ))}
                                </ThemedView>
                              )}
                            </ThemedView>
                            <ThemedView
                              className={`flex-1 pb-4 ${
                                isSelected
                                  ? "bg-primary-50 rounded-lg px-3"
                                  : ""
                              }`}
                            >
                              <ThemedText
                                type="s2_subtitle"
                                className={
                                  isSelected
                                    ? "text-primary-900"
                                    : "text-typography-900"
                                }
                              >
                                {location.coords.address ||
                                  coordinates[i].latitude.toFixed(4) +
                                    ", " +
                                    coordinates[i].longitude.toFixed(4)}
                              </ThemedText>
                              <ThemedText
                                type="c1_caption"
                                className={
                                  isSelected
                                    ? "text-primary-700"
                                    : "text-typography-600"
                                }
                              >
                                {formatDateTime(location.createdAt)}
                              </ThemedText>
                              {location.speed && (
                                <ThemedText
                                  type="c1_caption"
                                  className={
                                    isSelected
                                      ? "text-primary-600"
                                      : "text-typography-500"
                                  }
                                >
                                  Speed: {location.speed} km/h
                                </ThemedText>
                              )}
                            </ThemedView>
                          </ThemedView>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <ThemedText
                      type="b4_body"
                      className="text-center text-typography-600"
                    >
                      No location data available yet
                    </ThemedText>
                  )}
                </ThemedView>
              </ScrollView>
            </ThemedView>
          </BottomDrawer>
        </>
      )}
      {showModal && ongoingTripsData?.data?.status === "COMPLETED" && (
        <>
          <CustomModal
            description={
              rating > 0
                ? `Thank you, You rated our ${
                    orderData?.fleetType === "road" ? "Driver" : "Pathfinder"
                  } ${
                    rating === 1
                      ? "one"
                      : rating === 2
                      ? "two"
                      : rating === 3
                      ? "three"
                      : rating === 4
                      ? "four"
                      : "five"
                  } star`
                : "Please leave a star review for your courier"
            }
            title="Shipping Completed"
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={""}
            firstBtnText=""
            secondBtnLink={""}
            secondBtnText=""
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          >
            {/* create a star review component */}
            <ThemedView className="flex flex-col items-center mt-5">
              <ThemedView className="flex flex-row">
                {Array.from({ length: 5 }).map((_, i) => {
                  const idx = i + 1;
                  const filled = idx <= rating;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        handleStarClick(idx);
                        handleReview(idx);
                      }}
                      key={`star-${i}`}
                      className="mx-1"
                    >
                      <AntDesign
                        name={filled ? "star" : "staro"}
                        size={40}
                        color={filled ? "#E75B3B" : "#C8C8C8"}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ThemedView>
              <VStack space="lg" className="w-full relative mt-5">
                <Link
                  href={{
                    pathname:
                      "/(tabs)/trip-details/driver-customer-feedback/[id]",
                    params: {
                      id: ongoingTripsData?.data._id,
                      rating: rating,
                      travellerName: ongoingTripsData?.data.traveller.fullName,
                    },
                  }}
                  asChild
                  className="flex-grow rounded-xl py-4 w-full bg-primary-500"
                >
                  <Pressable
                    onPress={() => {
                      setShowModal(false);
                    }}
                    className="flex justify-center items-center"
                  >
                    {loading ? (
                      <ActivityIndicator color={"#fff"} />
                    ) : (
                      <ThemedText
                        type="btn_large"
                        className="text-white w-full text-center flex"
                      >
                        Write a review
                      </ThemedText>
                    )}
                  </Pressable>
                </Link>

                <Link
                  href={"/(tabs)"}
                  className="flex-grow border-2 border-primary-500 py-4 rounded-xl w-full text-primary-500"
                  asChild
                >
                  <Pressable onPress={() => setShowModal(false)}>
                    <ThemedText
                      type="btn_large"
                      className="text-primary-500 w-full text-center"
                    >
                      Cancel
                    </ThemedText>
                  </Pressable>
                </Link>
              </VStack>
            </ThemedView>
          </CustomModal>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  latestMarker: {
    backgroundColor: "#E75B3B",
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
