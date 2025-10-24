import CustomImage from "@/components/Custom/CustomImage";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CancelBookingModal from "@/components/Trips/CancelBookingModal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAuthenticatedQuery } from "@/lib/api";
import { IPickupTripDetailsResponse } from "@/types/IPickupByDriver";
import { paramToString } from "@/utils/helper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  Calendar,
  ChevronLeft,
  Mail,
  Map,
  MapPin,
  Package,
  PenLine,
  Phone,
  UserRound,
  Weight,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

export default function PackageSummaryScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { tripId, amount } = useLocalSearchParams();
  const tripIdStr = paramToString(tripId);
  const { data, refetch, isLoading } = useAuthenticatedQuery<
    IPickupTripDetailsResponse | undefined
  >(["pickup-details", tripId], `/trip/packages/${tripId}`);
  const [showModal, setShowModal] = useState(false);
  console.log("🚀 ~ PackageSummaryScreen ~ data:", data);
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Package Summary
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
  // i want to refetch the notifications when the user comes back to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      refetch();
    });

    return unsubscribe;
  }, [navigation, refetch]);
  if (isLoading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText type="btn_medium">Loading package details...</ThemedText>
      </ThemedView>
    );
  }
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1 gap-20 pb-60">
          {data?.data.packages.map((pkg) => {
            return (
              <ThemedView key={pkg?._id} className="flex-1 gap-3  mt-3">
                <ThemedView className="flex justify-center items-center">
                  <Button
                    variant="solid"
                    size="2xl"
                    className=" w-[60%] mb-5 rounded-[12px]"
                    onPress={() => {
                      router.push({
                        pathname: "/(tabs)/edit-package",
                        params: { tripId: tripId },
                      });
                    }}
                  >
                    <Icon as={PenLine} size="lg" className="text-white" />
                    <ThemedText type="default" className="text-white">
                      Modify Package
                    </ThemedText>
                  </Button>
                  <ThemedView className="p-5 border rounded-lg border-primary-500">
                    <CustomImage
                      uri={pkg.productImage}
                      size="2xl"
                      alt={"image"}
                    />
                  </ThemedView>
                </ThemedView>

                {/* Package Details Section */}
                <ThemedView className="flex gap-3 mt-3 rounded-lg p-5 border border-typography-300 shadow-md">
                  <ThemedText type="btn_giant" className="">
                    Package Details
                  </ThemedText>
                  <ThemedView className="flex-row items-center gap-2">
                    <Icon
                      as={Package}
                      size="3xl"
                      className="text-primary-500"
                    />
                    <ThemedText className="text-typography-500 capitalize">
                      Category: {pkg.productCategory}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row items-center gap-2">
                    <Icon
                      as={Package}
                      size="3xl"
                      className="text-primary-500"
                    />
                    <ThemedText className="text-typography-500">
                      Type: {pkg.productType}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row items-center gap-2">
                    <Icon as={Weight} size="3xl" className="text-primary-500" />
                    <ThemedText className="text-typography-500">
                      Weight: {pkg.productWeight} {pkg.productUnit}
                    </ThemedText>
                  </ThemedView>
                  {pkg.productDescription && (
                    <ThemedView className="flex-row items-start gap-2">
                      <Icon
                        as={PenLine}
                        size="3xl"
                        className="text-primary-500"
                      />
                      <ThemedText className="text-typography-500 flex-1">
                        Description: {pkg.productDescription}
                      </ThemedText>
                    </ThemedView>
                  )}
                </ThemedView>

                <ThemedText className="flex-1 bg-white">
                  <ThemedView className="">
                    <ThemedView className="flex gap-8">
                      <ThemedView className="flex gap-3">
                        <ThemedText type="btn_giant" className="mt-5 ">
                          Delivery Details {data?.data?.trackingId}
                        </ThemedText>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={Map}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500 flex-1">
                            Pick up: {data?.data?.pickUpLocation.address}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={MapPin}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500 flex-1">
                            Drop off: {data?.data?.dropOffLocation.address}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={Calendar}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500">
                            {data?.data?.bookingType === "schedule" &&
                            data?.data?.scheduleDate
                              ? new Date(
                                  data.data.scheduleDate
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Immediate"}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={Weight}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500">
                            Weight: {data?.data?.weight} kg
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>
                      <ThemedView className="flex gap-3">
                        <ThemedText type="btn_giant" className="">
                          Sender
                        </ThemedText>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={UserRound}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500">
                            {data?.data?.sender?.fullName}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={Phone}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500">
                            {data?.data?.sender?.phoneNumber}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={Mail}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500">
                            {data?.data?.sender?.email}
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>
                      <ThemedView className="flex gap-3">
                        <ThemedText type="btn_giant" className="">
                          Driver
                        </ThemedText>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={UserRound}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500">
                            {data?.data?.driver?.fullName}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={Phone}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500">
                            {data?.data?.driver?.phoneNumber}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={Mail}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500">
                            {data?.data?.driver?.email}
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>
                      <ThemedView className="flex gap-3">
                        <ThemedText type="btn_giant" className="">
                          Receiver
                        </ThemedText>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={UserRound}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500">
                            {data?.data?.reciver?.receiverName}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row items-center gap-2">
                          <Icon
                            as={Phone}
                            size="3xl"
                            className="text-primary-500"
                          />
                          <ThemedText className="text-typography-500">
                            {data?.data?.reciver?.receiverPhone}
                          </ThemedText>
                        </ThemedView>
                        {data?.data?.reciver?.alternativePhone && (
                          <ThemedView className="flex-row items-center gap-2">
                            <Icon
                              as={Phone}
                              size="3xl"
                              className="text-primary-500"
                            />
                            <ThemedText className="text-typography-500">
                              Alt: {data?.data?.reciver?.alternativePhone}
                            </ThemedText>
                          </ThemedView>
                        )}
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                </ThemedText>
              </ThemedView>
            );
          })}
        </ThemedView>
      </ParallaxScrollView>
      <ThemedView className="absolute bottom-0 pt-5 pb-10 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
        <Button variant="outline" size="2xl" className=" rounded-[12px] mx-1">
          <ThemedText
            type="s2_subtitle"
            className="text-primary-500 text-center "
            onPress={() => setShowModal(true)}
          >
            Cancel order
          </ThemedText>
        </Button>
        <Button
          variant="solid"
          size="2xl"
          onPress={() => {
            router.push({
              pathname: "/(tabs)/confirm-price",
              params: { amount: amount, tripId: tripId },
            });
          }}
          className="flex-1 rounded-[12px] mx-1"
        >
          <ThemedText type="s2_subtitle" className="text-white text-center">
            Confirm
          </ThemedText>
        </Button>
      </ThemedView>
      {showModal && (
        <>
          <CancelBookingModal
            responseId={tripIdStr!}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        </>
      )}
    </>
  );
}
