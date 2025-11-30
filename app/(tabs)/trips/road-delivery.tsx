import {
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

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
  SelectFlatList,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedPost, useAuthenticatedQuery } from "@/lib/api";
import { IVehicleCategoriesResponse } from "@/types/ITripsCategories";
import { Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

import { useTranslation } from "react-i18next";

export default function RoadDeliveryScreen() {
  const { t } = useTranslation("trips");

  const validationSchema = Yup.object().shape({
    vehicleCategoryId: Yup.string().required(
      t("road_delivery.validation.vehicle_required")
    ),
    dropOffLocation: Yup.object()
      .shape({
        lat: Yup.number().required(t("road_delivery.validation.lat_required")),
        lng: Yup.number().required(t("road_delivery.validation.lng_required")),
        address: Yup.string().required(
          t("road_delivery.validation.address_required")
        ),
      })
      .required(t("road_delivery.validation.dropoff_required")),
    pickupAddress: Yup.object()
      .shape({
        lat: Yup.number().required(t("road_delivery.validation.lat_required")),
        lng: Yup.number().required(t("road_delivery.validation.lng_required")),
        address: Yup.string().required(
          t("road_delivery.validation.address_required")
        ),
      })
      .required(t("road_delivery.validation.pickup_required")),
    weight: Yup.string().required(
      t("road_delivery.validation.weight_required")
    ),
  });
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const backroundTopNav = useThemeColor({}, "background");
  const [search, setSearch] = useState("");
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressSelection | null>(null);
  const { data, isLoading, refetch } = useAuthenticatedQuery<
    IVehicleCategoriesResponse | undefined
  >(["road-trip"], "/trip/vehicle/categories");
  const [selectedDropOffAddress, setSelectedDropOffAddress] =
    useState<AddressSelection | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<{
    distance: number;
    unit: string;
  }>({
    distance: 0,
    unit: "km",
  });
  console.log("🚀 ~ RoadDeliveryScreen ~ selectedDistance:", selectedDistance);

  const { mutateAsync, error, loading } = useAuthenticatedPost<
    any,
    {
      vehicleCategoryId: string;
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
    }
  >("/trip/initiate/pickup");
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
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            {t("header.enter_location")}
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

  const filteredTrips = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data?.data || [];
    return data?.data.filter((c) => c.name.toLowerCase().includes(q));
  }, [data, search]);
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
  const handleSubmit = async (values: {
    vehicleCategoryId: string;
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
  }) => {
    try {
      // Ensure location coordinates are present
      const lat = values.pickUpLocation.lat;
      const lng = values.pickUpLocation.lng;
      const address = values.pickUpLocation.address;
      if (lat == null || lng == null || !address) {
        showNewToast({
          title: t("road_delivery.toast.missing_pickup_title"),
          description: t("road_delivery.toast.missing_pickup_desc"),
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
          title: t("road_delivery.toast.missing_dropoff_title"),
          description: t("road_delivery.toast.missing_dropoff_desc"),
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return;
      }

      const response = await mutateAsync({
        vehicleCategoryId: values.vehicleCategoryId,
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
      });
      showNewToast({
        title: t("road_delivery.toast.success_title"),
        description: t("road_delivery.toast.success_desc"),
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      setTimeout(() => {
        router.push({
          pathname: "/(tabs)/add-package",
          params: { id: response?.data.id },
        });
      }, 1000);
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        t("road_delivery.toast.failed_default");
      console.log("🚀 ~ handleSubmit ~ message:", message);
      showNewToast({
        title: t("road_delivery.toast.failed_title"),
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
                vehicleCategoryId: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                console.log("Form submitted:", values);
                // map Formik values to the shape expected by handleSubmit
                const payload = {
                  vehicleCategoryId: values.vehicleCategoryId,
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
                    <InputLabelText className="">
                      {t("road_delivery.pickup_address")}
                    </InputLabelText>
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
                        lightColor="#FF3B30"
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {typeof errors.pickupAddress === "string"
                          ? errors.pickupAddress
                          : t("road_delivery.validation.pickup_required")}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText className="">
                      {t("road_delivery.dropoff_location")}
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
                        lightColor="#FF3B30"
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {typeof errors.dropOffLocation === "string"
                          ? errors.dropOffLocation
                          : t("road_delivery.validation.dropoff_required")}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText className="">
                      {t("road_delivery.weight")}
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.weight && touched.weight)}
                    >
                      <InputField
                        className=""
                        placeholder={t("road_delivery.weight_placeholder")}
                        value={values.weight}
                        onChangeText={handleChange("weight")}
                        onBlur={handleBlur("weight")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.weight && touched.weight && (
                      <ThemedText
                        lightColor="#FF3B30"
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.weight}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText>
                      {t("road_delivery.vehicle_option")}
                    </InputLabelText>
                    <Select
                      selectedValue={values.vehicleCategoryId}
                      onValueChange={handleChange("vehicleCategoryId")}
                    >
                      <SelectTrigger
                        size="xl"
                        className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                      >
                        <SelectInput
                          placeholder={t("road_delivery.vehicle_placeholder")}
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
                          {/* Search box inside the dropdown */}
                          <ThemedView className="w-full px-3 pb-2">
                            <Input
                              size="lg"
                              className="rounded-md bg-primary-inputShade"
                            >
                              <InputField
                                placeholder={t("search.vehicle_placeholder")}
                                value={search}
                                onChangeText={setSearch}
                                autoFocus={false}
                              />
                            </Input>
                          </ThemedView>
                          <SelectFlatList
                            className="max-h-80"
                            data={filteredTrips as unknown as any[]}
                            keyExtractor={(item: any, index: number) =>
                              item?._id ?? String(index)
                            }
                            renderItem={({ item }: any) => (
                              <SelectItem label={item.name} value={item._id} />
                            )}
                          />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                    {errors.vehicleCategoryId && touched.vehicleCategoryId && (
                      <ThemedText
                        lightColor="#FF3B30"
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.vehicleCategoryId}
                      </ThemedText>
                    )}
                  </ThemedView>

                  <ThemedView className="mt-5 flex items-center">
                    {/* Illustrative image */}
                    <Image
                      source={require("@/assets/images/home/bike.png")}
                      size="2xl"
                      alt={"bike"}
                    />

                    <ThemedText type="default" className="mt-2">
                      {t("road_delivery.total_distance")}{" "}
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
                    <ThemedText
                      lightColor="#FFFFFF"
                      darkColor="#FFFFFF"
                      type="s1_subtitle"
                      className="text-white"
                    >
                      {loading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        t("road_delivery.continue_button")
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
