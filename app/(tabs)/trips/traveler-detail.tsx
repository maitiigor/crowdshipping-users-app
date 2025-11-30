import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedQuery } from "@/lib/api";
import { ISingleAirTripResponse } from "@/types/air-sea/IAirTrip";
import { ISingleSeaMaritimeResponse } from "@/types/air-sea/ISeaMaritime";
import { newUserTimeZoneFormatDate, paramToString } from "@/utils/helper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ChevronLeft, MapPin } from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";

import { useTranslation } from "react-i18next";

export default function TravelerDetail() {
  const { t } = useTranslation("trips");
  const navigation = useNavigation();
  const router = useRouter();
  const backroundTopNav = useThemeColor({}, "background");
  const { activeTripType, tripId } = useLocalSearchParams();
  const tripIdStr = paramToString(tripId);
  const activeTripTypeStr = paramToString(activeTripType);
  const isAirTrip = activeTripTypeStr === "2";
  const isMaritimeTrip = !isAirTrip;
  const {
    data: airTripData,
    isLoading: airTripLoading,
    isFetching: airTripFetching,
    refetch: refetchAirTrip,
  } = useAuthenticatedQuery<ISingleAirTripResponse | undefined>(
    ["trips-air", tripIdStr],
    tripIdStr ? `/trip/available/air/${tripIdStr}` : "",
    undefined,
    {
      enabled: isAirTrip && Boolean(tripIdStr),
    }
  );
  const {
    data: maritimeData,
    isLoading: maritimeLoading,
    isFetching: maritimeFetching,
    refetch: refetchMaritime,
  } = useAuthenticatedQuery<ISingleSeaMaritimeResponse | undefined>(
    ["trips-maritime", tripIdStr],
    tripIdStr ? `/trip/available/maritime/${tripIdStr}` : "",
    undefined,
    {
      enabled: isMaritimeTrip && Boolean(tripIdStr),
    }
  );
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            {t("header.traveler_details")}
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
  }, [navigation, backroundTopNav]);

  const airTrip = airTripData?.data;
  const maritimeTrip = maritimeData?.data;
  const baseTrip = isAirTrip ? airTrip?.trip : maritimeTrip?.trip;

  const cleanText = (value?: string | null) => {
    if (!value) {
      return "";
    }
    const trimmed = value.trim();
    return trimmed;
  };

  const formatValue = (value?: string | number | null) => {
    if (value === null || value === undefined) {
      return "—";
    }
    const stringValue = String(value).trim();
    return stringValue.length ? stringValue : "—";
  };

  const formatDate = (value?: string) =>
    value ? newUserTimeZoneFormatDate(value, "MMM D, YYYY") : "—";

  const buildRouteLabel = (
    origin?: string | null,
    destination?: string | null
  ) => {
    const from = cleanText(origin);
    const to = cleanText(destination);
    if (from && to) {
      return `${from} → ${to}`;
    }
    if (from) {
      return from;
    }
    if (to) {
      return to;
    }
    return "—";
  };

  const routeLabel = isAirTrip
    ? buildRouteLabel(airTrip?.departureCity, airTrip?.arrivalCity)
    : buildRouteLabel(maritimeTrip?.departurePort, maritimeTrip?.arrivalPort);

  const airTripTitle = cleanText(airTrip?.airlineName);
  const airTripId = cleanText(airTrip?.trip?.tripId);
  const maritimeTripTitle = cleanText(maritimeTrip?.vesselName);
  const maritimeTripId = cleanText(maritimeTrip?.trip?.tripId);

  const tripTitle = isAirTrip
    ? airTripTitle ||
      (airTripId
        ? `${t("traveler_details.trip_prefix")} ${airTripId}`
        : t("traveler_details.trip_title_air"))
    : maritimeTripTitle ||
      (maritimeTripId
        ? `${t("traveler_details.trip_prefix")} ${maritimeTripId}`
        : t("traveler_details.trip_title_maritime"));

  const detailRows =
    isAirTrip && airTrip
      ? [
          {
            label: t("traveler_details.trip_id"),
            value: formatValue(airTrip.trip?.tripId),
          },
          {
            label: t("traveler_details.airline"),
            value: formatValue(airTrip.airlineName),
          },
          {
            label: t("traveler_details.flight_number"),
            value: formatValue(airTrip.flightNumber),
          },
          {
            label: t("traveler_details.departure_city"),
            value: formatValue(airTrip.departureCity),
          },
          {
            label: t("traveler_details.arrival_city"),
            value: formatValue(airTrip.arrivalCity),
          },
          {
            label: t("traveler_details.departure_date"),
            value: formatDate(airTrip.trip?.departureDate),
          },
          {
            label: t("traveler_details.arrival_date"),
            value: formatDate(airTrip.trip?.arrivalDate),
          },
          {
            label: t("traveler_details.status"),
            value: formatValue(airTrip.trip?.status),
          },
        ]
      : !isAirTrip && maritimeTrip
      ? [
          {
            label: t("traveler_details.trip_id"),
            value: formatValue(maritimeTrip.trip?.tripId),
          },
          {
            label: t("traveler_details.mmsi_number"),
            value: formatValue(maritimeTrip.mmsiNumber),
          },
          {
            label: t("traveler_details.vessel_name"),
            value: formatValue(maritimeTrip.vesselName),
          },
          {
            label: t("traveler_details.vessel_operator"),
            value: formatValue(maritimeTrip.vesselOperator),
          },
          {
            label: t("traveler_details.voyage_number"),
            value: formatValue(maritimeTrip.voyageNumber),
          },
          {
            label: t("traveler_details.container_number"),
            value: formatValue(maritimeTrip.containerNumber),
          },
          {
            label: t("traveler_details.departure_port"),
            value: formatValue(maritimeTrip.departurePort),
          },
          {
            label: t("traveler_details.arrival_port"),
            value: formatValue(maritimeTrip.arrivalPort),
          },
          {
            label: t("traveler_details.departure_date"),
            value: formatDate(maritimeTrip.trip?.departureDate),
          },
          {
            label: t("traveler_details.arrival_date"),
            value: formatDate(maritimeTrip.trip?.arrivalDate),
          },
          {
            label: t("traveler_details.status"),
            value: formatValue(maritimeTrip.trip?.status),
          },
        ]
      : [];

  const creator = baseTrip?.creator;
  const creatorName = cleanText(creator?.fullName);
  const creatorLocation = [
    cleanText(creator?.profile?.city),
    cleanText(creator?.profile?.state),
    cleanText(creator?.profile?.country),
  ]
    .filter(Boolean)
    .join(", ");
  const creatorAddress = cleanText(creator?.profile?.address);

  const isBusy = isAirTrip
    ? airTripLoading || airTripFetching
    : maritimeLoading || maritimeFetching;

  const handleRetry = () => {
    if (isAirTrip) {
      refetchAirTrip();
    } else {
      refetchMaritime();
    }
  };

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 pb-20 gap-5">
            <ThemedView className="border border-primary-50 bg-white p-6 rounded-3xl flex gap-6">
              {isBusy ? (
                <ThemedView className="gap-4">
                  <Skeleton className="h-6 w-1/2 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded-lg" />
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                      key={`trip-detail-skeleton-${index}`}
                      className="h-4 w-full rounded-lg"
                    />
                  ))}
                </ThemedView>
              ) : baseTrip ? (
                <>
                  <ThemedView className="gap-3">
                    <ThemedText
                      type="s1_subtitle"
                      className="text-typography-900"
                    >
                      {tripTitle}
                    </ThemedText>
                    <ThemedView className="flex-row flex-wrap items-center gap-1">
                      <Icon as={MapPin} size="md" />
                      <ThemedText
                        type="default"
                        className="text-typography-600"
                      >
                        {routeLabel}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView className="gap-3">
                    {detailRows.map(({ label, value }) => (
                      <ThemedView
                        key={label}
                        className="flex-row items-start justify-between gap-3"
                      >
                        <ThemedText
                          type="s2_subtitle"
                          className="text-typography-800"
                        >
                          {label}
                        </ThemedText>
                        <ThemedText
                          type="default"
                          className="text-typography-500 flex-1 text-right"
                        >
                          {value}
                        </ThemedText>
                      </ThemedView>
                    ))}
                  </ThemedView>
                  {creatorName ? (
                    <ThemedView className="p-4 border border-primary-100 bg-primary-50/60 rounded-2xl gap-1">
                      <ThemedText
                        type="s2_subtitle"
                        className="text-typography-800"
                      >
                        {creatorName}
                      </ThemedText>
                      {creatorLocation ? (
                        <ThemedText
                          type="default"
                          className="text-typography-600"
                        >
                          {creatorLocation}
                        </ThemedText>
                      ) : null}
                      {creatorAddress ? (
                        <ThemedText
                          type="c1_caption"
                          className="text-typography-500"
                        >
                          {creatorAddress}
                        </ThemedText>
                      ) : null}
                    </ThemedView>
                  ) : null}
                </>
              ) : (
                <ThemedView className="items-center gap-4">
                  <ThemedText
                    type="s2_subtitle"
                    className="text-typography-800 text-center"
                  >
                    {t("traveler_details.unavailable_title")}
                  </ThemedText>
                  <ThemedText
                    type="default"
                    className="text-typography-500 text-center"
                  >
                    {t("traveler_details.unavailable_desc")}
                  </ThemedText>
                  <Button variant="outline" size="lg" onPress={handleRetry}>
                    <ThemedText type="b2_body" className="text-primary-500">
                      {t("traveler_details.retry_button")}
                    </ThemedText>
                  </Button>
                </ThemedView>
              )}
            </ThemedView>
            <Button
              variant="solid"
              size="2xl"
              className="flex-1 rounded-[12px] mx-1"
              isDisabled={
                !baseTrip || !tripIdStr || !activeTripTypeStr || isBusy
              }
              onPress={() => {
                if (!tripIdStr || !activeTripTypeStr || !baseTrip) {
                  return;
                }
                router.push({
                  pathname: "/(tabs)/trips/air-sea/air-sea-delivery",
                  params: { activeTripType: activeTripType, tripId: tripId },
                });
              }}
            >
              <ThemedText
                lightColor="#FFFFFF"
                darkColor="#FFFFFF"
                type="s2_subtitle"
                className="text-white text-center"
              >
                {t("traveler_details.enter_delivery_details")}
              </ThemedText>
            </Button>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}
