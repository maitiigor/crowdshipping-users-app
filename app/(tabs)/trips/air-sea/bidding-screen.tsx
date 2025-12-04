import AddressPickerComponent, {
  AddressSelection,
} from "@/components/Custom/AddressPicker";
import { CustomModal } from "@/components/Custom/CustomModal";
import CustomToast from "@/components/Custom/CustomToast";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Alert, AlertIcon } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon, InfoIcon } from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useCountry } from "@/hooks/useCountry";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedPatch } from "@/lib/api";
import { useAppSelector } from "@/store";
import { paramToString } from "@/utils/helper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

interface IFormValues {
  entityType: "air" | "maritime";
  bidAmount: number;
  currency: string;
  pickUpLocation: {
    lat: number;
    lng: number;
    address: string;
  };
}
interface ISubmittedFormValues {
  entityType: "air" | "maritime";
  bidAmount: number;
  currency: string;
  pickUpLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  bidRef: string;
  bidId: string;
}

export default function BiddingScreen() {
  const { t } = useTranslation("trips");
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const backroundTopNav = useThemeColor({}, "background");
  const { tripId, entityType, pickupLat, pickupLng, pickupAddress } =
    useLocalSearchParams();
  const tripIdStr = paramToString(tripId);
  const entitityTypeStr = paramToString(entityType);
  const pickupLatStr = paramToString(pickupLat);
  const pickupLngStr = paramToString(pickupLng);
  const pickupAddressStr = paramToString(pickupAddress);
  console.log("🚀 ~ BiddingScreen ~ entitityTypeStr:", entitityTypeStr);
  const insets = useSafeAreaInsets();
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressSelection | null>(
      pickupLatStr && pickupLngStr && pickupAddressStr
        ? {
            address: pickupAddressStr,
            coordinates: {
              lat: Number(pickupLatStr),
              lng: Number(pickupLngStr),
            },
          }
        : null
    );
  const [submittedValues, setSubmittedValues] =
    useState<ISubmittedFormValues | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { country, countryCode } = useCountry();
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
      pickupAddress: Yup.object().shape({
        lat: Yup.number()
          .typeError("Latitude must be a number")
          .required("Pickup address is required"),
        lng: Yup.number()
          .typeError("Longitude must be a number")
          .required("Pickup address is required"),
        address: Yup.string().required("Pickup address is required"),
      }),
    });
  };
  const { mutateAsync, error, loading } = useAuthenticatedPatch<
    any,
    IFormValues
  >(`/trip/submit/bid/${tripId}`);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Enter Your Bid
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
  const handleSubmit = async (values: {
    bidAmount: string;
    currency: string;
    pickUpLocation: {
      lat: number;
      lng: number;
      address: string;
    };
  }) => {
    try {
      // Ensure location coordinates are present
      const lat = values.pickUpLocation.lat;
      const lng = values.pickUpLocation.lng;
      const address = values.pickUpLocation.address;
      if (lat == null || lng == null || !address) {
        showNewToast({
          title: "Missing Pickup Address",
          description: "Please select a pickup address",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return;
      }

      const response = await mutateAsync({
        entityType:
          entitityTypeStr!.toLowerCase() === "air" ? "air" : "maritime",
        bidAmount: Number(values.bidAmount),
        currency: selectedCurrency, //NGN | USD
        pickUpLocation: {
          lat,
          lng,
          address,
        },
      });
      setSubmittedValues({
        entityType:
          entitityTypeStr!.toLowerCase() === "air" ? "air" : "maritime",
        bidAmount: Number(values.bidAmount),
        currency: selectedCurrency, //NGN | USD
        pickUpLocation: {
          lat,
          lng,
          address,
        },
        bidRef: response?.data?.bidRef || "",
        bidId: response?.data?._id || "",
      });
      console.log("🚀 ~ handleSubmit ~ response:", response);
      showNewToast({
        title: "Success",
        description: "Bid Initiated successfully!",
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
        "Sign up failed";
      showNewToast({
        title: "Bidding Process Failed",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={"padding"}
      keyboardVerticalOffset={insets.top}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 gap-3 pb-20 mt-3">
            <ThemedText type="default" className="text-typography-700">
              Enter the amount you are willing to pay for this delivery. Drivers
              will review your bid.
            </ThemedText>
            <ThemedText type="default" className="text-typography-700">
              This is a bidding process. Higher bids may attract drivers faster.
            </ThemedText>
            {/* <ThemedText type="default" className="text-typography-700">
              Minimum bid amount: $300
            </ThemedText> */}
            <Formik
              initialValues={{
                pickupAddress: {
                  lat: pickupLatStr ? Number(pickupLatStr) : 0,
                  lng: pickupLngStr ? Number(pickupLngStr) : 0,
                  address: pickupAddressStr || "",
                },
                bidAmount: "",
                currency: selectedCurrency,
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  bidAmount: values.bidAmount,
                  currency: selectedCurrency,
                  pickUpLocation: {
                    lat: values.pickupAddress.lat,
                    lng: values.pickupAddress.lng,
                    address: values.pickupAddress.address,
                  },
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
                      isInvalid={!!(errors.bidAmount && touched.bidAmount)}
                    >
                      <InputField
                        className=""
                        placeholder="Input your bid amount"
                        value={values.bidAmount}
                        onChangeText={handleChange("bidAmount")}
                        onBlur={handleBlur("bidAmount")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                      <InputSlot className="pl-3">
                        {selectedCurrencyCode}
                      </InputSlot>
                    </Input>
                    {errors.bidAmount && touched.bidAmount && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.bidAmount}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText className="">Pickup Address</InputLabelText>
                    <AddressPickerComponent
                      value={selectedPickupAddress}
                      onSelect={(sel) => {
                        setSelectedPickupAddress(sel);
                        // Reflect selection in Formik values.pickupAddress
                        setFieldValue("pickupAddress", {
                          lat: sel.coordinates.lat,
                          lng: sel.coordinates.lng,
                          address: sel.address,
                        });
                      }}
                    />
                    {errors.pickupAddress && touched.pickupAddress && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {typeof errors.pickupAddress === "string"
                          ? errors.pickupAddress
                          : "Pickup address is required"}
                      </ThemedText>
                    )}
                  </ThemedView>
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
                  {/* <ThemedText type="default" className="mt-2 text-center">
                    Total Distance:
                    <ThemedText type="btn_giant"> 3420 Miles</ThemedText>
                  </ThemedText> */}
                  <Button
                    variant="solid"
                    size="2xl"
                    className="mt-5 rounded-[12px]"
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText type="s1_subtitle" className="text-white">
                      {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        "Continue"
                      )}
                    </ThemedText>
                  </Button>
                </ThemedView>
              )}
            </Formik>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      {showModal && (
        <>
          <CustomModal
            description="Your package will be picked up by the courier, please wait a moment"
            title="Your Bid Submitted!"
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={""}
            onFirstClick={() => {
              router.push({
                // pathname: "/(tabs)/trips/air-sea/track-bid-order",
                pathname: "/(tabs)/trips/air-sea/track-bid-order",
                params: {
                  tripId: tripIdStr,
                  tripTypeId:
                    entitityTypeStr?.toLocaleLowerCase() === "air" ? "2" : "3",
                  bidAmount: submittedValues?.bidAmount || 0,
                  bidId: submittedValues?.bidId || "",
                  bidRef: submittedValues?.bidRef || "",
                },
              });
              setShowModal(false);
            }}
            firstBtnText="Okay"
            secondBtnLink={""}
            secondBtnText=""
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          >
            <ThemedView className="flex gap-5 justify-center items-center mt-3">
              <ThemedText type="default" className="text-typography-500">
                Your bid of{" "}
                <ThemedText type="s1_subtitle">{`${selectedCurrencyCode} ${submittedValues?.bidAmount}`}</ThemedText>
              </ThemedText>
              <ThemedText type="default" className="text-typography-500">
                for bidRef{" "}
                {submittedValues?.bidRef ? (
                  <ThemedText
                    type="s1_subtitle"
                    className="text-typography-700 font-medium"
                  >
                    {submittedValues?.bidRef}
                  </ThemedText>
                ) : (
                  ""
                )}
              </ThemedText>
              <ThemedText type="default" className="text-typography-500">
                from{" "}
                <ThemedText type="s1_subtitle">{`${submittedValues?.pickUpLocation?.address}`}</ThemedText>
              </ThemedText>
              {/* <ThemedText type="default" className="text-typography-500">
                to {` ${submittedValues?.dropOffLocation?.address} `}
              </ThemedText> */}
              <ThemedText type="default" className="text-typography-500">
                has been submitted.
              </ThemedText>
            </ThemedView>
          </CustomModal>
        </>
      )}
    </KeyboardAvoidingView>
  );
}
