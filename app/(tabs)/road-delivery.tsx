import { KeyboardAvoidingView, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import AddressPickerComponent, {
  AddressSelection,
} from "@/components/Custom/AddressPicker";
import CustomSidebarMenu from "@/components/Custom/CustomSidebarMenu";
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
import { Formik } from "formik";
import { ChevronLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// MenuItem type removed (unused)
const vehiclesTypes = [
  { label: "Cycle", value: "cycle" },
  { label: "Car", value: "car" },
  { label: "Scooter", value: "scooter" },
];
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
// validationSchema removed (unused)
export default function RoadDeliveryScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressSelection | null>(null);
  const [selectedDropOffAddress, setSelectedDropOffAddress] =
    useState<AddressSelection | null>(null);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
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
                pickupAddress: "",
                dropOffLocation: "",
                weight: "",
                vehicle: "",
              }}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                console.log("Form submitted:", {
                  ...values,
                  selectedPickupAddress,
                  selectedDropOffAddress,
                });
                // Handle form submission logic here (e.g., API call)
                // setShowModal(true);
                router.push({
                  pathname: "/(tabs)/add-package",
                  params: { id: id },
                });
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
                        // also reflect in form values if needed
                        setFieldValue("pickupAddress", sel.address);
                      }}
                    />
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText className="">
                      Drop Off Location
                    </InputLabelText>
                    <AddressPickerComponent
                      value={selectedDropOffAddress}
                      onSelect={(sel) => {
                        setSelectedDropOffAddress(sel);
                        // also reflect in form values if needed
                        setFieldValue("dropOffLocation", sel.address);
                      }}
                    />
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
                        keyboardType="default"
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
                      {id === "3"
                        ? "Air Craft Option"
                        : id === "2"
                        ? "Fleet Option"
                        : "Vehicle Option"}
                    </InputLabelText>
                    <Select
                      selectedValue={values.vehicle}
                      onValueChange={handleChange("vehicle")}
                    >
                      <SelectTrigger
                        size="xl"
                        className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      >
                        <SelectInput
                          placeholder="Select gender"
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
                          {id === "3"
                            ? airTransportTypes.map((type) => (
                                <SelectItem
                                  key={type.value}
                                  value={type.value}
                                  label={type.label}
                                >
                                  {type.label}
                                </SelectItem>
                              ))
                            : id === "2"
                            ? waterTransportTypes.map((type) => (
                                <SelectItem
                                  key={type.value}
                                  value={type.value}
                                  label={type.label}
                                >
                                  {type.label}
                                </SelectItem>
                              ))
                            : vehiclesTypes.map((type) => (
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
                    {errors.vehicle && touched.vehicle && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.vehicle}
                      </ThemedText>
                    )}
                  </ThemedView>

                  <ThemedView className="mt-5 flex items-center">
                    {/* Illustrative image */}

                    <Image
                      source={
                        id === "3"
                          ? require("@/assets/images/home/flight-delivery.png")
                          : id === "2"
                          ? require("@/assets/images/home/maritime-delivery.png")
                          : require("@/assets/images/home/bike.png")
                      }
                      size="2xl"
                      alt={"bike"}
                    />

                    <ThemedText type="default" className="mt-2">
                      Total Distance:
                      <ThemedText type="btn_giant">3420 Miles</ThemedText>
                    </ThemedText>
                  </ThemedView>
                  <Button
                    variant="solid"
                    size="2xl"
                    className="mt-5 rounded-[12px]"
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText type="s1_subtitle" className="text-white">
                      Continue
                    </ThemedText>
                  </Button>
                </ThemedView>
              )}
            </Formik>
          </ThemedView>
        </ThemedView>
        <CustomSidebarMenu
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
        />
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

// styles removed as they were unused
