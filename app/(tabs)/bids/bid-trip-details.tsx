import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CancelAirSeaBookingModal from "@/components/Trips/CancelAirSeaBookingModal";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedQuery } from "@/lib/api";
import { ISingleBidDetailsResponse } from "@/types/IBids";
import { paramToString } from "@/utils/helper";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  Clock,
  DollarSign,
  MapPin,
  MapPinned,
  Package,
  Plane,
  Ship,
  User,
  Weight,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";

export default function BidDetails() {
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation("bids");
  const { bidId, tripTypeId } = useLocalSearchParams();
  const bidIdStr = paramToString(bidId);
  console.log("🚀 ~ BidDetails ~ bidIdStr:", bidIdStr);
  const tripTypeIdNum = Number(paramToString(tripTypeId));
  const activeTripType = isNaN(tripTypeIdNum) ? 2 : tripTypeIdNum; // Default to 2 (Air) if not provided
  const [showModal, setShowModal] = useState(false);
  const backroundTopNav = useThemeColor({}, "background");
  const {
    data: airDetailsData,
    isLoading: airDetailsLoading,
    isFetching: airDetailsFetching,
    refetch: refetchAirDetails,
  } = useAuthenticatedQuery<ISingleBidDetailsResponse | undefined>(
    ["trips-bid-details", activeTripType === 1 ? "sea" : "air", bidIdStr],
    `/trip/bid/detail/${bidIdStr}`,
    undefined,
    {
      enabled: !!bidIdStr,
    }
  );
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            {t("header.bid_details")} (
            {activeTripType === 2 ? t("header.air") : t("header.maritime")})
          </ThemedText>
        );
      },
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 },
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: backroundTopNav,
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
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
              className="p-2 rounded flex justify-center items-center"
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
  }, [navigation, activeTripType, backroundTopNav, t, router]);

  const isBusy = airDetailsLoading || airDetailsFetching;
  const bidData = airDetailsData?.data;
  console.log("🚀 ~ BidDetails ~ bidData:", bidData?._id);
  const pickupLabel =
    bidData?.parcelGroup?.pickUpLocation?.address?.split(",")[0];
  const dropOffLabel =
    bidData?.parcelGroup?.dropOffLocation?.address?.split(",")[0];

  // Format date helper
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value?: number | null, currency?: string) => {
    if (value === undefined || value === null) return "-";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      const formatted = value.toLocaleString();
      return currency ? `${currency} ${formatted}` : formatted;
    }
  };

  const InfoRow = ({
    icon,
    label,
    value,
    accent,
  }: {
    icon: React.ComponentType<any>;
    label: string;
    value?: string | number | null;
    accent?: "primary" | "muted";
  }) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    const baseContainer =
      accent === "primary"
        ? "bg-primary-50 border border-primary-200"
        : "bg-typography-50/40";

    const iconColor =
      accent === "primary" ? "text-primary-600" : "text-primary-500";

    return (
      <ThemedView className="flex-row items-start gap-3">
        <ThemedView className={`p-3 rounded-2xl ${baseContainer}`}>
          <Icon as={icon} size="lg" className={iconColor} />
        </ThemedView>
        <ThemedView className="flex-1 gap-1">
          <ThemedText type="c2_caption" className="text-typography-500">
            {label}
          </ThemedText>
          <ThemedText type="b3_body" className="text-typography-900">
            {String(value)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  };

  // refetch when the page is focused
  useFocusEffect(
    React.useCallback(() => {
      refetchAirDetails();
    }, [refetchAirDetails])
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
    >
      <ThemedView className="flex-1 pb-20 gap-5 pt-2">
        {isBusy ? (
          <ThemedView className="gap-5">
            <ThemedView className="border border-primary-50 bg-white p-6 rounded-3xl gap-4">
              <Skeleton className="h-8 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </ThemedView>
            <ThemedView className="border border-primary-50 bg-white p-6 rounded-3xl gap-4">
              <Skeleton className="h-6 w-1/3 rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </ThemedView>
          </ThemedView>
        ) : bidData ? (
          <ThemedView className="gap-5">
            <ThemedView className="bg-primary-500 rounded-3xl p-5 gap-3">
              <ThemedText type="c2_caption" className="text-primary-100">
                {t("labels.bid_amount")}
              </ThemedText>
              <ThemedText
                type="s1_subtitle"
                className="text-white text-3xl font-semibold"
              >
                {formatCurrency(bidData.amount, bidData.currency)}
              </ThemedText>
              <ThemedText type="c2_caption" className="text-primary-100">
                {bidData.currency} • Ref: {bidData.bidId}
              </ThemedText>
            </ThemedView>

            <ThemedView className="flex-row items-center justify-between">
              <ThemedView className="gap-1">
                <ThemedText type="c2_caption" className="text-typography-500">
                  {t("labels.parcel_tracking_id")}
                </ThemedText>
                <ThemedText type="b2_body" className="text-typography-900">
                  {bidData.parcelGroup?.trackingId || "-"}
                </ThemedText>
              </ThemedView>
              <ThemedView
                className={`px-3 py-1 rounded-full ${
                  bidData.parcelGroup?.status.toLowerCase() === "accepted"
                    ? "border border-green-600"
                    : "border border-primary-200"
                }`}
              >
                <ThemedText
                  type="c2_caption"
                  className={`${
                    bidData.parcelGroup?.status.toLowerCase() === "accepted"
                      ? "text-green-600"
                      : "text-primary-600"
                  }`}
                >
                  {bidData.parcelGroup?.status
                    ? t(`status.${bidData.parcelGroup.status.toLowerCase()}`, {
                        defaultValue: bidData.parcelGroup.status,
                      })
                    : t("status.pending")}
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView className="flex-row flex-wrap gap-4">
              <ThemedView className="flex-1 min-w-[46%]">
                <InfoRow
                  icon={Weight}
                  label={t("labels.total_weight")}
                  value={`${bidData.parcelGroup?.weight ?? 0} kg`}
                  accent="primary"
                />
              </ThemedView>
              <ThemedView className="flex-1 min-w-[46%]">
                <InfoRow
                  icon={Package}
                  label={t("labels.parcel_group")}
                  value={bidData.parcelGroup?._id}
                />
              </ThemedView>
              <ThemedView className="flex-1 min-w-[46%]">
                <InfoRow
                  icon={activeTripType === 2 ? Plane : Ship}
                  label={t("labels.trip_mode")}
                  value={
                    activeTripType === 2
                      ? t("labels.air_freight")
                      : t("labels.maritime_freight")
                  }
                />
              </ThemedView>
            </ThemedView>

            <ThemedView className="bg-white border border-primary-50 rounded-3xl p-6 gap-5">
              <ThemedText type="s2_subtitle" className="text-typography-900">
                {t("labels.bidder")}
              </ThemedText>
              <ThemedView className="flex-row gap-4 items-center">
                <Avatar size="lg" className="border border-primary-100">
                  {bidData.bidder?.profile?.profilePicUrl ? (
                    <AvatarImage
                      source={{ uri: bidData.bidder.profile.profilePicUrl }}
                      alt={bidData.bidder.fullName}
                    />
                  ) : (
                    <AvatarFallbackText>
                      {bidData.bidder?.fullName?.charAt(0)?.toUpperCase() ||
                        "?"}
                    </AvatarFallbackText>
                  )}
                </Avatar>
                <ThemedView className="flex-1 gap-1">
                  <ThemedText type="b2_body" className="text-typography-900">
                    {bidData.bidder?.fullName}
                  </ThemedText>
                  <ThemedText type="c2_caption" className="text-typography-500">
                    {bidData.bidder?.profile?.geoLocation?.address ||
                      "Location not provided"}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedView className="gap-4">
                <InfoRow
                  icon={User}
                  label={t("labels.user_id")}
                  value={bidData.bidder?.userId}
                />
                <InfoRow
                  icon={MapPin}
                  label={t("labels.city")}
                  value={[
                    bidData.bidder?.profile?.city,
                    bidData.bidder?.profile?.state,
                    bidData.bidder?.profile?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />
              </ThemedView>
            </ThemedView>

            <ThemedView className="bg-white border border-primary-50 rounded-3xl p-6 gap-6">
              <ThemedText type="s2_subtitle" className="text-typography-900">
                {t("labels.parcel_journey")}
              </ThemedText>
              <ThemedView className="gap-6">
                <ThemedView className="gap-4">
                  <InfoRow
                    icon={MapPinned}
                    label={t("labels.pick_up")}
                    value={bidData.parcelGroup?.pickUpLocation?.address}
                    accent="primary"
                  />
                  <InfoRow
                    icon={ArrowRight}
                    label={t("labels.distance")}
                    value={`From ${pickupLabel || "pickup point"} to ${
                      dropOffLabel || "destination"
                    }`}
                  />
                  <InfoRow
                    icon={MapPin}
                    label={t("labels.drop_off")}
                    value={bidData.parcelGroup?.dropOffLocation?.address}
                  />
                </ThemedView>
              </ThemedView>
            </ThemedView>

            <ThemedView className="bg-white border border-primary-50 rounded-3xl p-6 gap-6">
              <ThemedText type="s2_subtitle" className="text-typography-900">
                {t("labels.trip_timeline")}
              </ThemedText>
              <ThemedView className="gap-5">
                <InfoRow
                  icon={Calendar}
                  label={t("labels.departure")}
                  value={formatDate(bidData.parcelGroup?.trip?.departureDate)}
                />
                <InfoRow
                  icon={Clock}
                  label={t("labels.arrival")}
                  value={formatDate(bidData.parcelGroup?.trip?.arrivalDate)}
                />
                <InfoRow
                  icon={DollarSign}
                  label={t("labels.trip_status")}
                  value={bidData.parcelGroup?.trip?.status}
                />
              </ThemedView>

              <ThemedView className="border border-primary-50 rounded-2xl p-4 gap-4">
                <ThemedText type="c2_caption" className="text-typography-500">
                  {t("labels.trip_created_by")}
                </ThemedText>
                <ThemedView className="flex-row gap-3 items-center">
                  <Avatar size="md" className="border border-primary-100">
                    {bidData.parcelGroup?.trip?.creator?.profile
                      ?.profilePicUrl ? (
                      <AvatarImage
                        source={{
                          uri: bidData.parcelGroup.trip.creator.profile
                            .profilePicUrl,
                        }}
                        alt={bidData.parcelGroup.trip.creator.fullName}
                      />
                    ) : (
                      <AvatarFallbackText>
                        {bidData.parcelGroup?.trip?.creator?.fullName
                          ?.charAt(0)
                          ?.toUpperCase() || "?"}
                      </AvatarFallbackText>
                    )}
                  </Avatar>
                  <ThemedView className="flex-1 gap-1">
                    <ThemedText type="b2_body" className="text-typography-900">
                      {bidData.parcelGroup?.trip?.creator?.fullName || "-"}
                    </ThemedText>
                    <ThemedText
                      type="c2_caption"
                      className="text-typography-500"
                    >
                      {bidData.parcelGroup?.trip?.creator?.profile?.geoLocation
                        ?.address || "No address information"}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>
            {bidData.parcelGroup?.status.toLowerCase() !== "cancelled" && (
              <ThemedView className="flex-row justify-between flex-1 gap-3">
                <Button
                  variant="outline"
                  size="2xl"
                  className="mt-5 rounded-[12px] "
                  onPress={() => {
                    setShowModal(true);
                  }}
                >
                  <ThemedText type="s1_subtitle" className="text-primary-500">
                    {t("buttons.cancel_bid")}
                  </ThemedText>
                </Button>
                <Button
                  variant="solid"
                  size="2xl"
                  className="mt-5 rounded-[12px] flex-1"
                  onPress={() => {
                    if (
                      bidData.parcelGroup?.status.toLowerCase() === "accepted"
                    ) {
                      router.push({
                        pathname: "/(tabs)/choose-payment-type",
                        params: {
                          amount: bidData.amount || 0,
                          responseId: bidData._id || "",
                          entityType: activeTripType === 2 ? "air" : "maritime",
                          bidRef: bidData.bidId || "",
                        },
                      });
                    } else {
                      router.push({
                        pathname: "/(tabs)/trips/air-sea/track-bid-order",
                        params: {
                          tripId: bidData.parcelGroup?.trip?.tripId || "",
                          bidId: bidData._id || "",
                          entityType: activeTripType === 2 ? "air" : "maritime",
                          bidAmount: bidData.amount || 0,
                          bidRef: bidData.bidId || "",
                        },
                      });
                    }
                  }}
                >
                  <ThemedText type="s1_subtitle" className="text-white">
                    {bidData.parcelGroup?.status.toLowerCase() === "accepted"
                      ? t("buttons.pay")
                      : t("buttons.renegotiate")}
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </ThemedView>
        ) : (
          <ThemedView className="border border-primary-50 bg-white p-8 rounded-3xl items-center gap-4">
            <ThemedView className="bg-primary-100 rounded-full p-6">
              <Icon as={Package} size="3xl" className="text-primary-400" />
            </ThemedView>
            <ThemedText
              type="s1_subtitle"
              className="text-typography-800 text-center"
            >
              {t("labels.bid_details_unavailable")}
            </ThemedText>
            <ThemedText
              type="default"
              className="text-typography-500 text-center"
            >
              {t("labels.bid_details_error")}
            </ThemedText>
            <Button
              variant="outline"
              size="lg"
              onPress={() => refetchAirDetails()}
              className="mt-2"
            >
              <ThemedText type="b2_body" className="text-primary-500">
                {t("buttons.retry")}
              </ThemedText>
            </Button>
          </ThemedView>
        )}
      </ThemedView>
      {showModal && (
        <CancelAirSeaBookingModal
          responseId={bidIdStr!}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </ParallaxScrollView>
  );
}
