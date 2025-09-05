import { KeyboardAvoidingView, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

import { Link, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import AddressPickerComponent, {
  AddressSelection,
} from "@/components/Custom/AddressPicker";
import InputLabelText from "@/components/Custom/InputLabelText";
import PhoneNumberInput from "@/components/Custom/PhoneNumberInput";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Formik } from "formik";
import {
  Bell,
  ChevronLeft,
  CircleAlert,
  SquarePlus,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// MenuItem type removed (unused)

export default function EditPackageScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const phoneInputRef = useRef<any>(null);

  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressSelection | null>(null);
  const [selectedDropOffAddress, setSelectedDropOffAddress] =
    useState<AddressSelection | null>(null);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Edit My Order
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded   flex justify-center items-center"
        >
          <Icon as={ChevronLeft} size="3xl" className="text-typography-900" />
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
                receiver_name: "",
                receiver_phone: "",
                alt_receiver_phone: "",
                dropOffLocation: "",
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
                router.back();
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
                    <InputLabelText className="">
                      Receiver’s Name
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={
                        !!(errors.receiver_name && touched.receiver_name)
                      }
                    >
                      <InputField
                        className=""
                        placeholder="Input your receiver's name"
                        value={values.receiver_name}
                        onChangeText={handleChange("receiver_name")}
                        onBlur={handleBlur("receiver_name")}
                        keyboardType="default"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.receiver_name && touched.receiver_name && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.receiver_name}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText className="">
                      Receiver’s Phone Number
                    </InputLabelText>
                    <PhoneNumberInput
                      ref={phoneInputRef}
                      value={values.receiver_phone}
                      onChangeFormattedText={handleChange("receiver_phone")}
                    />
                    {errors.receiver_phone && touched.receiver_phone && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.receiver_phone}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText className="">
                      Alternative Phone Number
                    </InputLabelText>
                    <PhoneNumberInput
                      ref={phoneInputRef}
                      value={values.alt_receiver_phone}
                      onChangeFormattedText={handleChange("alt_receiver_phone")}
                    />
                    {errors.alt_receiver_phone &&
                      touched.alt_receiver_phone && (
                        <ThemedText
                          type="b4_body"
                          className="text-error-500 mb-4"
                        >
                          {errors.alt_receiver_phone}
                        </ThemedText>
                      )}
                  </ThemedView>
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

                  <Link
                    href={"/(tabs)/add-package"}
                    asChild
                    className="flex-row gap-2 justify-center mt-5 mb-2 items-center"
                  >
                    <ThemedView className="flex-row gap-2 justify-center items-center">
                      <Icon
                        as={SquarePlus}
                        size="3xl"
                        className="text-primary-600"
                      />
                      <ThemedText type="default" className="text-primary-600">
                        Add Another Package
                      </ThemedText>
                    </ThemedView>
                  </Link>
                  <ThemedView className="flex-row gap-2 bg-[#FDF6EB] mx-2 p-4 rounded items-center">
                    <Icon
                      as={CircleAlert}
                      size="3xl"
                      style={{ color: "#938D24", width: 28, height: 28 }}
                    />
                    <ThemedText
                      type="default"
                      className="text-[#938D24] flex-1"
                    >
                      Please note: Changes may affect the final price
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="py-10 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
                    <Button
                      variant="outline"
                      size="2xl"
                      className=" rounded-[12px] mx-1"
                      onPress={() => router.back()}
                    >
                      <ThemedText
                        type="s2_subtitle"
                        className="text-primary-500 text-center "
                      >
                        Cancel
                      </ThemedText>
                    </Button>
                    <Button
                      variant="solid"
                      size="2xl"
                      onPress={() => handleSubmit()}
                      className="flex-1 rounded-[12px] mx-1"
                    >
                      <ThemedText
                        type="s2_subtitle"
                        className="text-white text-center"
                      >
                        Update Request
                      </ThemedText>
                    </Button>
                  </ThemedView>
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
