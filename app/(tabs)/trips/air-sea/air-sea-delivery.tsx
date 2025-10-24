import {
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import AddressPickerComponent, {
  AddressSelection,
} from "@/components/Custom/AddressPicker";
import CustomToast from "@/components/Custom/CustomToast";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { useAuthenticatedPost } from "@/lib/api";
import { Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
// MenuItem type removed (unused)
const waterTransportTypes = [
  { label: "Container ships", value: "container ships" },
  { label: "Bulk carriers", value: "bulk carriers" },
  { label: "Oil tankers", value: "oil tankers" },
  { label: "Fishing vessels", value: "fishing vessels" },
  { label: "Ferries", value: "ferries" },
  { label: "Speedboats", value: "speedboats" },
];
const airTransportTypes = [
  { label: "Cargo planes", value: "cargo planes" },
  { label: "Small freight aircraft", value: "small freight aircraft" },
  { label: "Passenger aircraft", value: "passenger aircraft" },
  { label: "Helicopters", value: "helicopters" },
  { label: "Drones", value: "drones" },
];

export default function AirSeaDeliveryScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { activeTripType, tripId } = useLocalSearchParams();
  console.log("🚀 ~ AirSeaDeliveryScreen ~ tripTypeId:", tripId);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressSelection | null>(null);
  const [selectedDropOffAddress, setSelectedDropOffAddress] =
    useState<AddressSelection | null>(null);
  const toast = useToast();
  const [selectedDistance, setSelectedDistance] = useState<{
    distance: number;
    unit: string;
  }>({
    distance: 0,
    unit: "km",
  });
  const { mutateAsync, error, loading } = useAuthenticatedPost<
    any,
    {
      entityId: string;
      entityType: "air" | "maritime";
      pickUpLocation: {
        lat: number;
        lng: number;
        address: string;
      };
      dropOffLocation: {
        lat: number;
        lng: number;
        address: string;
      };
      weight: string;
      tripOption: string;
    }
  >("/trip/initiate/bid");
  const {
    mutateAsync: calculateDistance,
    error: distanceError,
    loading: distanceLoading,
  } = useAuthenticatedPost<
    any,
    {
      pickUpLocation: {
        lat: number;
        lng: number;
        address: string;
      };
      dropOffLocation: {
        lat: number;
        lng: number;
        address: string;
      };
    }
  >("/trip/caculate/distance");
  const insets = useSafeAreaInsets();
  const validationSchema = Yup.object().shape({
    dropOffLocation: Yup.object()
      .shape({
        lat: Yup.number().required("Latitude is required"),
        lng: Yup.number().required("Longitude is required"),
        address: Yup.string().required("Address is required"),
      })
      .required("Drop-off location is required"),
    pickupAddress: Yup.object()
      .shape({
        lat: Yup.number().required("Latitude is required"),
        lng: Yup.number().required("Longitude is required"),
        address: Yup.string().required("Address is required"),
      })
      .required("Pickup address is required"),
    weight: Yup.string().required("Weight is required"),
    tripOption: Yup.string().required(
      activeTripType === "2"
        ? "Air trip is required"
        : "Maritime trip is required"
    ),
  });
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Enter Your Location
          </ThemedText>
        );
      },
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
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

  // get distance function
  const getDistance = async (
    pickUp: AddressSelection | null,
    dropOff: AddressSelection | null
  ) => {
    if (!pickUp || !dropOff) return null;
    try {
      const payload = {
        pickUpLocation: {
          lat: pickUp.coordinates.lat,
          lng: pickUp.coordinates.lng,
          address: pickUp.address,
        },
        dropOffLocation: {
          lat: dropOff.coordinates.lat,
          lng: dropOff.coordinates.lng,
          address: dropOff.address,
        },
      };
      console.log("Distance payload:", payload);
      const response = await calculateDistance(payload);
      return response.data;
    } catch (err) {
      console.error("Error calculating distance:", err, distanceError);
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (selectedPickupAddress && selectedDropOffAddress) {
        const distance = await getDistance(
          selectedPickupAddress,
          selectedDropOffAddress
        );
        if (distance) {
          console.log("Distance:", distance);
          setSelectedDistance(distance);
        }
      }
    };
    fetchData();

    return () => {
      // Cleanup if needed
    };
  }, [selectedPickupAddress, selectedDropOffAddress]);
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
    pickUpLocation: {
      lat: number;
      lng: number;
      address: string;
    };
    dropOffLocation: {
      lat: number;
      lng: number;
      address: string;
    };
    weight: string;
    tripOption: string;
  }) => {
    let payload = {
      tripOption: values.tripOption,
      pickUpLocation: {
        lat: values.pickUpLocation.lat,
        lng: values.pickUpLocation.lng,
        address: values.pickUpLocation.address,
      },
      dropOffLocation: {
        lat: values.dropOffLocation.lat,
        lng: values.dropOffLocation.lng,
        address: values.dropOffLocation.address,
      },
      weight: values.weight,
      entityId: tripId as string,
      entityType: activeTripType === "2" ? "air" : "maritime",
    };
    console.log("🚀 ~ handleSubmit ~ payload:", payload);
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
      const latDrop = values.dropOffLocation.lat;
      const lngDrop = values.dropOffLocation.lng;
      const addressDrop = values.dropOffLocation.address;
      if (latDrop == null || lngDrop == null || !addressDrop) {
        showNewToast({
          title: "Missing Drop-off Address",
          description: "Please select a drop-off address",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return;
      }

      const response = await mutateAsync({
        entityId: tripId as string,
        entityType: activeTripType === "2" ? "air" : "maritime",
        pickUpLocation: {
          lat,
          lng,
          address,
        },
        dropOffLocation: {
          lat: latDrop,
          lng: lngDrop,
          address: addressDrop,
        },
        weight: values.weight,
        tripOption: values.tripOption,
      });
      showNewToast({
        title: "Success",
        description: `${
          activeTripType === "2" ? "Air" : "Maritime"
        } delivery initiated successfully!`,
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      setTimeout(() => {
        router.push({
          pathname: "/(tabs)/trips/air-sea/add-sea-maritime-package",
          params: {
            tripId: response?.data.id,
            activeTripType: activeTripType,
            entityType: response?.data.entityType,
          },
        });
      }, 1000);
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Sign up failed";
      console.log("🚀 ~ handleSubmit ~ message:", message);
      showNewToast({
        title: "Delivery Process Failed",
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
            <Formik
              initialValues={{
                pickupAddress: {
                  lat: 0,
                  lng: 0,
                  address: "",
                },
                dropOffLocation: {
                  lat: 0,
                  lng: 0,
                  address: "",
                },
                weight: "",
                tripOption: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                console.log("Form submitted:", values);
                // map Formik values to the shape expected by handleSubmit
                const payload = {
                  tripOption: values.tripOption,
                  pickUpLocation: {
                    lat: values.pickupAddress.lat,
                    lng: values.pickupAddress.lng,
                    address: values.pickupAddress.address,
                  },
                  dropOffLocation: {
                    lat: values.dropOffLocation.lat,
                    lng: values.dropOffLocation.lng,
                    address: values.dropOffLocation.address,
                  },
                  weight: values.weight,
                };
                // Handle form submission logic here (e.g., API call)
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
                <ThemedView className="flex gap-4">
                  {/* Address selection */}
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
                    <InputLabelText className="">
                      Drop Off Location
                    </InputLabelText>
                    <AddressPickerComponent
                      value={selectedDropOffAddress}
                      onSelect={(sel) => {
                        setSelectedDropOffAddress(sel);
                        // Reflect selection in Formik values.dropOffLocation
                        setFieldValue("dropOffLocation", {
                          lat: sel.coordinates.lat,
                          lng: sel.coordinates.lng,
                          address: sel.address,
                        });
                      }}
                    />
                    {errors.dropOffLocation && touched.dropOffLocation && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {typeof errors.dropOffLocation === "string"
                          ? errors.dropOffLocation
                          : "Drop-off location is required"}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText className="">Weight</InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.weight && touched.weight)}
                    >
                      <InputField
                        className=""
                        placeholder="Input your weight"
                        value={values.weight}
                        onChangeText={handleChange("weight")}
                        onBlur={handleBlur("weight")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.weight && touched.weight && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.weight}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText>
                      {activeTripType === "2"
                        ? "Air Craft Option"
                        : "Fleet Option"}
                    </InputLabelText>
                    <Select
                      selectedValue={values.tripOption}
                      onValueChange={handleChange("tripOption")}
                    >
                      <SelectTrigger
                        size="xl"
                        className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      >
                        <SelectInput
                          placeholder="Select trip option"
                          className="flex-1"
                        />
                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {activeTripType === "2"
                            ? airTransportTypes.map((type) => (
                                <SelectItem
                                  key={type.value}
                                  value={type.value}
                                  label={type.label}
                                >
                                  {type.label}
                                </SelectItem>
                              ))
                            : waterTransportTypes.map((type) => (
                                <SelectItem
                                  key={type.value}
                                  value={type.value}
                                  label={type.label}
                                >
                                  {type.label}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                    {errors.tripOption && touched.tripOption && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.tripOption}
                      </ThemedText>
                    )}
                  </ThemedView>

                  <ThemedView className="mt-5 flex items-center">
                    {/* Illustrative image */}

                    <Image
                      source={
                        activeTripType === "2"
                          ? require("@/assets/images/home/flight-delivery.png")
                          : require("@/assets/images/home/maritime-delivery.png")
                      }
                      size="2xl"
                      alt={"Delivery Illustration"}
                    />

                    <ThemedText type="default" className="mt-2">
                      Total Distance:{" "}
                      <ThemedText type="btn_giant">
                        {selectedDistance.distance.toFixed(2)}{" "}
                        {selectedDistance.unit}
                      </ThemedText>
                    </ThemedText>
                  </ThemedView>
                  <Button
                    variant="solid"
                    size="2xl"
                    disabled={loading || distanceLoading}
                    className="mt-5 rounded-[12px]"
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText type="s1_subtitle" className="text-white">
                      {loading ? (
                        <ActivityIndicator color="white" />
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
    </KeyboardAvoidingView>
  );
}

// styles removed as they were unused
