import { KeyboardAvoidingView, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";

import AddressPickerComponent, {
  AddressSelection,
} from "@/components/Custom/AddressPicker";
import CustomSidebarMenu from "@/components/Custom/CustomSidebarMenu";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Icon } from "@/components/ui/icon";
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
import Feather from "@expo/vector-icons/Feather";
import { Formik } from "formik";
import { Bell } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// MenuItem type removed (unused)

export default function RoadDeliveryScreen() {
  const navigation = useNavigation();
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressSelection | null>(null);
  const [selectedDropOffAddress, setSelectedDropOffAddress] =
    useState<AddressSelection | null>(null);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Enter Your Location",
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20, fontWeight: "bold" }, // Increased font size
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            setShowDrawer(true);
          }}
          style={{ paddingHorizontal: 0 }}
        >
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => {}} style={{ paddingHorizontal: 0 }}>
          <Icon as={Bell} size="2xl" className="text-typography-900" />
        </TouchableOpacity>
      ),
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
                <ThemedView className="flex gap-2">
                  {/* Address selection */}
                  <ThemedText className="mt-2">Pickup Address</ThemedText>
                  <AddressPickerComponent
                    value={selectedPickupAddress}
                    onSelect={(sel) => {
                      setSelectedPickupAddress(sel);
                      // also reflect in form values if needed
                      setFieldValue("pickupAddress", sel.address);
                    }}
                  />
                  <ThemedText className="mt-2">Drop Off Location</ThemedText>
                  <AddressPickerComponent
                    value={selectedDropOffAddress}
                    onSelect={(sel) => {
                      setSelectedDropOffAddress(sel);
                      // also reflect in form values if needed
                      setFieldValue("dropOffLocation", sel.address);
                    }}
                  />
                  <ThemedText className="mt-3">Weight</ThemedText>
                  <Input
                    size="xl"
                    className="h-[55px] rounded-lg mb-2 bg-primary-0 px-2"
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
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.weight}
                    </ThemedText>
                  )}

                  <ThemedText>Vehicle</ThemedText>
                  <Select
                    selectedValue={values.vehicle}
                    onValueChange={handleChange("vehicle")}
                  >
                    <SelectTrigger
                      size="xl"
                      className="h-[55px] rounded-lg mb-2 bg-primary-0 px-2"
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
                        <SelectItem label="Cycle" value="cycle" />
                        <SelectItem label="Car" value="car" />
                        <SelectItem label="Scooter" value="scooter" />
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  {errors.vehicle && touched.vehicle && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.vehicle}
                    </ThemedText>
                  )}

                  <Button
                    variant="solid"
                    size="2xl"
                    className="mt-5 rounded-[12px]"
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText type="s1_subtitle" className="text-white">
                      Update
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
