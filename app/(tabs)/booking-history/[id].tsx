import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CancelBookingModal from "@/components/Trips/CancelBookingModal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedQuery } from "@/lib/api";
import { IBookingDetailsResponse } from "@/types/IBookingHistory";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ChevronLeft, Clock3 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";

export default function BookingDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation("bookingHistory");
  const { id, selectedFilter } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const backroundTopNav = useThemeColor({}, "background");

  console.log("🚀 ~ BookingDetailScreen ~ selectedFilter:", selectedFilter);
  const {
    data: bookingDetailsData,
    isLoading: isLoadingBookingDetails,
    refetch: refetchBookingDetails,
  } = useAuthenticatedQuery<IBookingDetailsResponse | undefined>(
    ["booking", id],
    `/trip/booking/history/${id}`
  );
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            {t("header.details_title")}
          </ThemedText>
        );
      },
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
      // Remove header shadow and bottom border (iOS & Android)
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
  }, [navigation, backroundTopNav, t]);

  if (isLoadingBookingDetails) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText type="btn_medium">{t("labels.loading")}</ThemedText>
      </ThemedView>
    );
  }

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
                    uri:
                      bookingDetailsData?.data?.parcels?.[0]?.productImage ||
                      "https://dummyimage.com/600x400/e3d7e3/000000.png&text=not+found",
                  }}
                  size="2xl"
                  alt={"Product image"}
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
                    {t("labels.booking_summary")}
                  </ThemedText>
                  <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.booking_id")}
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        {bookingDetailsData?.data?.bookingRef || "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.tracking_id")}
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        {bookingDetailsData?.data?.parcelGroup?.trackingId ||
                          "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.pickup_location")}
                      </ThemedText>
                      <ThemedText
                        type="btn_medium"
                        className="flex-1 text-right"
                        numberOfLines={2}
                      >
                        {bookingDetailsData?.data?.parcelGroup?.pickUpLocation
                          ?.address || "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.dropoff_location")}
                      </ThemedText>
                      <ThemedText
                        type="btn_medium"
                        className="flex-1 text-right"
                        numberOfLines={2}
                      >
                        {bookingDetailsData?.data?.parcelGroup?.dropOffLocation
                          ?.address || "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.product_type")}
                      </ThemedText>
                      <ThemedText type="btn_medium" className="capitalize">
                        {bookingDetailsData?.data?.parcels?.[0]?.productType ||
                          "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.weight")}
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        {bookingDetailsData?.data?.parcels?.[0]
                          ?.productWeight || "N/A"}{" "}
                        {bookingDetailsData?.data?.parcels?.[0]?.productUnit ||
                          ""}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between items-center">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.current_status")}
                      </ThemedText>
                      <ThemedText
                        type="b4_body"
                        className="bg-[#CDF5E0] px-4 py-2 rounded-lg capitalize text-[#009A49]"
                      >
                        {bookingDetailsData?.data?.status
                          ? t(
                              `status.${bookingDetailsData.data.status.toLowerCase()}`,
                              {
                                defaultValue: bookingDetailsData.data.status,
                              }
                            )
                          : "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between items-center">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.payment_status")}
                      </ThemedText>
                      <ThemedText
                        type="b4_body"
                        className="bg-[#FEF3E7] px-4 py-2 rounded-lg capitalize text-[#F59E0B]"
                      >
                        {bookingDetailsData?.data?.paymentStatus || "N/A"}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                <ThemedView>
                  <ThemedText
                    type="btn_giant"
                    className="text-typography-800 pb-1"
                  >
                    {t("labels.receiver_information")}
                  </ThemedText>
                  <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.name")}
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        {bookingDetailsData?.data?.parcelGroup?.receiverName ||
                          "N/A"}
                      </ThemedText>
                    </ThemedView>

                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.phone_number")}
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        {bookingDetailsData?.data?.parcelGroup?.receiverPhone ||
                          "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.alternative_phone")}
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        {bookingDetailsData?.data?.parcelGroup
                          ?.alternativePhone || "N/A"}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                <ThemedView>
                  <ThemedText
                    type="btn_giant"
                    className="text-typography-800 pb-1"
                  >
                    {t("labels.sender_information")}
                  </ThemedText>
                  <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.name")}
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        {bookingDetailsData?.data?.sender?.fullName || "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.user_id")}
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        {bookingDetailsData?.data?.sender?.userId || "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.location")}
                      </ThemedText>
                      <ThemedText
                        type="btn_medium"
                        className="flex-1 text-right"
                        numberOfLines={2}
                      >
                        {bookingDetailsData?.data?.sender?.profile?.geoLocation
                          ?.address || "N/A"}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                <ThemedView>
                  <ThemedText
                    type="btn_giant"
                    className="text-typography-800 pb-1"
                  >
                    {t("labels.traveller_information")}
                  </ThemedText>
                  <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.name")}
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        {bookingDetailsData?.data?.traveller?.fullName || "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.user_id")}
                      </ThemedText>
                      <ThemedText type="btn_medium" className="">
                        {bookingDetailsData?.data?.traveller?.userId || "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        {t("labels.location")}
                      </ThemedText>
                      <ThemedText
                        type="btn_medium"
                        className="flex-1 text-right"
                        numberOfLines={2}
                      >
                        {bookingDetailsData?.data?.traveller?.profile
                          ?.geoLocation?.address || "N/A"}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                <ThemedView>
                  <ThemedText
                    type="btn_giant"
                    className="text-typography-800 pb-1"
                  >
                    {t("labels.expected_arrival_time")}
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
                </ThemedView>
              </ThemedView>
            </ThemedText>
            {bookingDetailsData?.data?.status?.toLowerCase() ===
              "delivered" && (
              <ThemedView className="pt-5 pb-10 bg-white left-0 right-0 flex justify-center items-center gap-5">
                <Button
                  onPress={() => {
                    const routeId = Array.isArray(id) ? id[0] : id;
                    if (!routeId) return;
                    router.push({
                      pathname:
                        "/(tabs)/trip-details/driver-customer-feedback/[id]",
                      params: { id: routeId },
                    });
                  }}
                  variant="outline"
                  size="2xl"
                  className="block w-full rounded-[12px]"
                >
                  <ThemedText
                    type="s2_subtitle"
                    className="text-primary-500  text-center "
                  >
                    {t("buttons.rate_driver")}
                  </ThemedText>
                </Button>
                <Button
                  onPress={() => {}}
                  variant="outline"
                  size="2xl"
                  className="block w-full rounded-[12px]"
                >
                  <ThemedText
                    type="s2_subtitle"
                    className="text-primary-500  text-center "
                  >
                    {t("buttons.report_driver")}
                  </ThemedText>
                </Button>
                <Button
                  onPress={() => {}}
                  variant="outline"
                  size="2xl"
                  className="block w-full rounded-[12px]"
                >
                  <ThemedText
                    type="s2_subtitle"
                    className="text-primary-500  text-center "
                  >
                    {t("buttons.file_claim")}
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      {bookingDetailsData?.data?.status?.toLowerCase() !== "delivered" && (
        <ThemedView className="absolute bottom-0 pt-5 pb-10 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
          <Button
            onPress={() => {
              router.back();
            }}
            variant="outline"
            size="2xl"
            className=" rounded-[12px] mx-1"
          >
            <ThemedText
              type="s2_subtitle"
              className="text-primary-500  text-center "
            >
              {t("buttons.back")}
            </ThemedText>
          </Button>
          <Button
            variant="solid"
            size="2xl"
            onPress={() => {
              setShowModal(true);
            }}
            className="flex-1 rounded-[12px] mx-1"
          >
            <ThemedText
              lightColor="#FFFFFF"
              darkColor="#FFFFFF"
              type="s2_subtitle"
              className="text-white text-center"
            >
              {t("buttons.cancel_booking")}
            </ThemedText>
          </Button>
          {showModal && (
            <>
              <CancelBookingModal
                responseId={bookingDetailsData?.data?.parcelGroupId as string}
                showModal={showModal}
                setShowModal={setShowModal}
              />
            </>
          )}
        </ThemedView>
      )}
    </>
  );
}
