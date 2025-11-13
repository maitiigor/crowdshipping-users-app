import { BottomDrawer } from "@/components/Custom/BottomDrawer";
import CustomToast from "@/components/Custom/CustomToast";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CancelAirSeaBookingModal from "@/components/Trips/CancelAirSeaBookingModal";
import { Alert, AlertIcon } from "@/components/ui/alert";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon, InfoIcon } from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useCountry } from "@/hooks/useCountry";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedPatch, useAuthenticatedQuery } from "@/lib/api";
import { useAppSelector } from "@/store";
import { ISingleBidDetailsResponse } from "@/types/IBids";
import { formatCurrency, paramToString } from "@/utils/helper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";

import {
  Activity,
  ChevronLeft,
  CircleCheckIcon,
  Clock3,
  HelpCircleIcon,
  LucideIcon,
  MapPin,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import MapView from "react-native-maps";
import * as Yup from "yup";

export default function TripBidsNegotiationScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const backroundTopNav = useThemeColor({}, "background");
  const toast = useToast();
  const [snap, setSnap] = useState(0.5);
  console.log("🚀 ~ TripBidsNegotiationScreen ~ snap:", snap);
  const [rating, setRating] = useState<number>(0);
  const { bidRef, bidAmount, entityType, tripId, bidId } =
    useLocalSearchParams();
  const bidIdStr = paramToString(bidId);
  const tripIdStr = paramToString(tripId);
  const entityTypeStr = paramToString(entityType);
  const bidAmountNum = Number(paramToString(bidAmount));
  const activeTripType =
    entityTypeStr === "maritime" ? 1 : entityTypeStr === "air" ? 2 : 2;

  // Fetch air/maritime details
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

  const { country, countryCode } = useCountry();
  const [showModal, setShowModal] = useState(false);
  // Get the selected country from Redux
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );
  const currency = selectedCountry?.currencies?.[0];
  const selectedCurrency = currency?.code || "NGN";
  const selectedCurrencyCode = currency?.symbol || "₦";
  const validationSchema = () => {
    return Yup.object().shape({
      bidAmount: Yup.number()
        .typeError("Bid amount must be a number")
        .required("Bid amount is required")
        .min(
          selectedCurrency === "NGN" ? 5000 : 100,
          selectedCurrency === "NGN"
            ? "Bid amount must be at least 5,000 NGN"
            : "Bid amount must be at least 100"
        ),
      note: Yup.string().nullable().optional(),
    });
  };
  const { mutateAsync, error, loading } = useAuthenticatedPatch<
    any,
    {
      amount: number;
      note: string;
    }
  >(`/trip/new/bid/${bidId}`);
  const {
    mutateAsync: acceptBid,
    error: acceptBidError,
    loading: acceptBidLoading,
  } = useAuthenticatedPatch<any, {}>(`/trip/user/accept/bid/${bidId}`);
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
  const showNewToast = ({
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
  };
  const handleSubmit = async (values: { amount: string; note: string }) => {
    try {
      if (
        airDetailsData?.data?.parcelGroup?.status.toLowerCase() === "cancelled"
      ) {
        showNewToast({
          title: "Bidding Re-Negotiation Process Failed",
          description: "Cannot renegotiate bid for a cancelled trip.",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return;
      }
      const response = await mutateAsync({
        amount: Number(values.amount),
        note: values.note,
      });

      console.log("🚀 ~ handleSubmit ~ response:", response);
      showNewToast({
        title: "Success",
        description: "Bid renegotiated successfully!",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      refetchAirDetails();
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Sign up failed";
      showNewToast({
        title: "Bidding Re-Negotiation Process Failed",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };
  const handleAcceptSubmit = async () => {
    try {
      if (
        airDetailsData?.data?.parcelGroup?.status.toLowerCase() === "cancelled"
      ) {
        showNewToast({
          title: "Bidding Re-Negotiation Process Failed",
          description: "Cannot renegotiate bid for a cancelled trip.",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return;
      }
      const response = await acceptBid({});

      console.log("🚀 ~ handleSubmit ~ response:", response);
      showNewToast({
        title: "Success",
        description: "Bid accepted successfully!",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      refetchAirDetails();
      router.push({
        pathname: "/(tabs)/choose-payment-type",
        params: {
          responseId: response.data.id as string,
          amount: response.data.amount as string,
        },
      });
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Sign up failed";
      showNewToast({
        title: "Bidding Re-Negotiation Process Failed",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };
  return (
    <ThemedView className="flex-1 bg-white relative">
      {/* map */}
      <View className="absolute top-14 left-0 right-0 z-50 items-center">
        {airDetailsLoading || airDetailsFetching ? (
          <ActivityIndicator />
        ) : (
          <ThemedView className=" w-[90%]  p-3 rounded-lg  bg-white">
            <ThemedView
              className={`flex-row items-center
             justify-between
          `}
            >
              <ThemedView className="flex-row gap-3">
                <Avatar size="lg">
                  <AvatarFallbackText>
                    {airDetailsData?.data?.parcelGroup?.trip.creator.fullName}
                  </AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri:
                        airDetailsData?.data?.parcelGroup?.trip.creator.profile
                          .profilePicUrl || "",
                    }}
                  />
                </Avatar>
                <ThemedView className="flex gap-1">
                  <ThemedText
                    type="s2_subtitle"
                    className="text-typography-800"
                  >
                    {airDetailsData?.data?.parcelGroup?.trip.creator.fullName}
                  </ThemedText>

                  <ThemedView className="flex-row flex-1 items-center gap-1 w-[80%]">
                    <Icon as={Clock3} />
                    <ThemedText type="btn_small">
                      {airDetailsData?.data.parcelGroup.pickUpLocation
                        .address || "-"}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="flex-row flex-1 items-center gap-1 w-[80%]">
                    <Icon as={MapPin} />
                    <ThemedText type="btn_small">
                      {airDetailsData?.data.parcelGroup.dropOffLocation
                        .address || "-"}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>

              {/* <ThemedView className="flex gap-1">
              <ThemedText type="s2_subtitle">2km</ThemedText>
              <ThemedText type="default" className="text-typography-500">
                Away
              </ThemedText>
            </ThemedView> */}
            </ThemedView>
            <ThemedView className="flex-row mt-5 justify-between items-center  gap-3">
              <ThemedText type="b2_body" className="text-typography-900">
                {/* this will be updated to the driver re-negotiation price */}
                {formatCurrency(
                  airDetailsData?.data?.amount,
                  airDetailsData?.data?.currency,
                  `en-${countryCode}`
                )}
              </ThemedText>
              <ThemedView className="flex-row w-[60%] justify-between gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className=" rounded-[12px] "
                  onPress={() => {
                    router.back();
                  }}
                >
                  <ThemedText type="btn_medium" className="text-primary-500">
                    Decline
                  </ThemedText>
                </Button>
                <Button
                  variant="solid"
                  size="lg"
                  className=" rounded-[12px] flex-1"
                  onPress={() => {
                    handleAcceptSubmit();
                  }}
                >
                  <ThemedText type="btn_medium" className="text-white">
                    {airDetailsData?.data.parcelGroup?.status.toLowerCase() ===
                    "accepted"
                      ? "Accepted"
                      : "Accept"}
                  </ThemedText>
                </Button>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}
      </View>
      <MapView
        style={{ height: "100%", width: "100%" }}
        initialRegion={{
          latitude: 6.5244,
          longitude: 3.3792,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      />

      {/* <ThemedView className="absolute bottom-10 left-0 right-0 px-5">
        <Button variant="solid" size="2xl" className="mt-5 rounded-[12px]">
          <ThemedText type="btn_large" className="text-white">
            Select Driver
          </ThemedText>
        </Button>
      </ThemedView> */}
      {/* drawer */}
      <BottomDrawer
        initialSnap={0.5}
        snapPoints={[0.5, 1]}
        onSnapChange={setSnap}
        snap={snap}
      >
        <ThemedView className="py-3 flex-1">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <Formik
              initialValues={{
                amount: bidAmount ? String(bidAmount) : "",
                note: "",
              }}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                  amount: values?.amount ?? "",
                };
                handleSubmit(payload);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <ThemedView className="flex gap-4 mt-5">
                  <ThemedView>
                    <InputLabelText className="">
                      Your Bid Amount (in {selectedCurrency})
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.amount && touched.amount)}
                    >
                      <InputField
                        className=""
                        placeholder="Input your bid amount"
                        value={values.amount}
                        onChangeText={handleChange("amount")}
                        onBlur={handleBlur("amount")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                      <InputSlot className="pl-3">
                        {selectedCurrencyCode}
                      </InputSlot>
                    </Input>
                    {errors.amount && touched.amount && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.amount}
                      </ThemedText>
                    )}
                  </ThemedView>
                  {
                    // open note field
                    snap < 1 && (
                      <Button
                        variant="link"
                        size="md"
                        className="p-0"
                        onPress={() => {
                          setSnap(1); // Expand drawer to full height
                          setFieldValue("note", values.note ? "" : ""); // Toggle note field
                        }}
                      >
                        <ThemedText type="b2_body" className="text-primary-500">
                          {values.note
                            ? "Remove Note"
                            : "Add a Note (optional)"}
                        </ThemedText>
                      </Button>
                    )
                  }
                  {snap === 1 && (
                    <ThemedView>
                      <InputLabelText type="b2_body" className="pb-1">
                        Note
                      </InputLabelText>
                      <Textarea
                        size="lg"
                        isReadOnly={false}
                        isInvalid={!!(errors.note && touched.note)}
                        isDisabled={false}
                        className="w-full h-[5.375rem] border-primary-100 bg-primary-inputShade"
                      >
                        <TextareaInput
                          clearButtonMode="while-editing"
                          value={values.note}
                          onChangeText={handleChange("note")}
                          onBlur={handleBlur("note")}
                          placeholder="Enter note here..."
                          multiline
                          maxLength={500}
                          numberOfLines={10}
                          style={{ textAlignVertical: "top" }}
                        />
                        {/* clear button */}
                      </Textarea>
                      {errors.note && touched.note && (
                        <ThemedText
                          type="b4_body"
                          className="text-error-500 mt-2"
                        >
                          {errors.note}
                        </ThemedText>
                      )}
                    </ThemedView>
                  )}

                  <ThemedView>
                    <Alert action="error" variant="solid" className=" p-2">
                      <AlertIcon
                        size="xl"
                        as={InfoIcon}
                        className="text-error-600"
                      />

                      <ThemedText
                        type="b3_body"
                        className="text-error-600 flex-1 w-[80%]"
                      >
                        Please note: Once the booking is accepted and payment is
                        completed, no modifications are allowed for Maritime and
                        Air deliveries.
                      </ThemedText>
                    </Alert>
                  </ThemedView>

                  <ThemedView className="flex-row justify-between flex-1 gap-3">
                    <Button
                      variant="outline"
                      size="2xl"
                      className="mt-5 rounded-[12px] "
                      onPress={() => {
                        setShowModal(true);
                      }}
                    >
                      <ThemedText
                        type="s1_subtitle"
                        className="text-primary-500"
                      >
                        Cancel Bid
                      </ThemedText>
                    </Button>
                    <Button
                      variant="solid"
                      size="2xl"
                      disabled={!values.amount}
                      className="mt-5 rounded-[12px] flex-1"
                      onPress={() => handleSubmit()}
                    >
                      <ThemedText type="s1_subtitle" className="text-white">
                        {loading ? <Activity /> : "Send Bid"}
                      </ThemedText>
                    </Button>
                  </ThemedView>
                </ThemedView>
              )}
            </Formik>

            <ThemedView className="border border-primary-50 p-5 rounded-2xl mt-10 flex gap-5">
              <ThemedView className="flex gap-5">
                <ThemedView className="flex justify-between flex-1 gap-1 pb-4">
                  <ThemedText
                    type="s1_subtitle"
                    className="text-typography-800 flex-1"
                  >
                    {airDetailsData?.data.bidId}
                  </ThemedText>
                  <ThemedView className="flex-row flex-1 items-center gap-1">
                    <Icon as={MapPin} />
                    <ThemedText type="default">
                      {airDetailsData?.data.parcelGroup.pickUpLocation
                        .address || "-"}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedView className="flex-row gap-2 justify-between">
                  <ThemedText
                    type="s2_subtitle"
                    className="text-typography-800"
                  >
                    Weight
                  </ThemedText>
                  <ThemedText
                    type="default"
                    className="text-typography-500 flex-1 text-right"
                  >
                    {airDetailsData?.data.parcelGroup.weight || "-"} kg
                  </ThemedText>
                </ThemedView>
                <ThemedView className="flex-row gap-2 justify-between">
                  <ThemedText
                    type="s2_subtitle"
                    className="text-typography-800"
                  >
                    Amount
                  </ThemedText>
                  <ThemedText
                    type="default"
                    className="text-typography-500 flex-1 text-right"
                  >
                    {formatCurrency(
                      airDetailsData?.data.amount,
                      airDetailsData?.data.currency,
                      `en-${countryCode}`
                    ) || "-"}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </BottomDrawer>
      {showModal && (
        <CancelAirSeaBookingModal
          responseId={bidIdStr!}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </ThemedView>
  );
}
