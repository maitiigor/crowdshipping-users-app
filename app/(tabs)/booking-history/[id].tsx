import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CancelBookingModal from "@/components/Trips/CancelBookingModal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { useAuthenticatedQuery } from "@/lib/api";
import { IBookingDetailsResponse } from "@/types/IBookingHistory";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ChevronLeft, Clock3 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

export default function BookingDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id, selectedFilter } = useLocalSearchParams();
    const [showModal, setShowModal] = useState(false);
  
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
            Booking Details
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

  if (isLoadingBookingDetails) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText type="btn_medium">Loading booking details...</ThemedText>
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
                      "https://plus.unsplash.com/premium_photo-1663047788002-765d78050d53?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
                        {bookingDetailsData?.data?.bookingRef || "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        Tracking ID
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
                        Pickup Location
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
                        Dropoff Location
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
                        Product Type
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
                        Weight
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
                        Current Status
                      </ThemedText>
                      <ThemedText
                        type="b4_body"
                        className="bg-[#CDF5E0] px-4 py-2 rounded-lg capitalize text-[#009A49]"
                      >
                        {bookingDetailsData?.data?.status?.toLowerCase() ||
                          "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between items-center">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        Payment Status
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
                        {bookingDetailsData?.data?.parcelGroup?.receiverName ||
                          "N/A"}
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
                        {bookingDetailsData?.data?.parcelGroup?.receiverPhone ||
                          "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        Alternative Phone
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
                    Sender Information
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
                        {bookingDetailsData?.data?.sender?.fullName || "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        User ID
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
                        Location
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
                    Traveller Information
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
                        {bookingDetailsData?.data?.traveller?.fullName || "N/A"}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_medium"
                        className="text-typography-600"
                      >
                        User ID
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
                        Location
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
                    Rate Driver
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
                    Report Driver
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
                    File a Claim
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
              Back
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
            <ThemedText type="s2_subtitle" className="text-white text-center">
              Cancel Booking
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
