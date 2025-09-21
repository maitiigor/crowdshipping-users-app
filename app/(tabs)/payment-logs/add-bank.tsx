import { AddressSelection } from "@/components/Custom/AddressPicker";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Icon, SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
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
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function AddBank() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressSelection | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Add New Bank
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
                bankName: "",
                accountName: "",
                accountNumber: "",
              }}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                  // force date to null if booking type is instant

                  selectedPickupAddress,
                };
                console.log("Form submitted:", payload);
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
                <ThemedView className="flex gap-4 mt-5">
                  <ThemedView>
                    <InputLabelText type="b2_body">
                      Select Bank Name
                    </InputLabelText>
                    <Select
                      selectedValue={values.bankName}
                      onValueChange={handleChange("bankName")}
                    >
                      <SelectTrigger
                        size="xl"
                        className="h-[55px] rounded-lg border-primary-100  bg-primary-inputShade px-2"
                      >
                        <SelectInput
                          placeholder="Select a bank"
                          value={values.bankName}
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
                          <Input
                            size="lg"
                            className="h-[55px] m-3 rounded-t rounded-2xl"
                            variant="outline"
                          >
                            <InputSlot className="pl-3">
                              <InputIcon as={SearchIcon} />
                            </InputSlot>
                            <InputField placeholder={"Search..."} />
                          </Input>
                          {[
                            {
                              label: "Access Bank",
                              value: "access_bank",
                            },
                            {
                              label: "Citibank",
                              value: "citibank",
                            },
                          ].map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                              label={category.label}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                    {errors.bankName && touched.bankName && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {errors.bankName}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView className="flex flex-1 gap-3 w-full">
                    <ThemedView className="flex-1 w-full">
                      <InputLabelText className="">Account Name</InputLabelText>
                      <Input
                        size="xl"
                        className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                        variant="outline"
                        isInvalid={
                          !!(errors.accountName && touched.accountName)
                        }
                      >
                        <InputField
                          className=""
                          placeholder="Enter Account Name"
                          value={values.accountName}
                          onChangeText={handleChange("accountName")}
                          onBlur={handleBlur("accountName")}
                          keyboardType="default"
                          autoCapitalize="none"
                        />
                      </Input>
                      {errors.accountName && touched.accountName && (
                        <ThemedText
                          type="b4_body"
                          className="text-error-500 mb-4"
                        >
                          {errors.accountName}
                        </ThemedText>
                      )}
                    </ThemedView>
                  </ThemedView>

                  <ThemedView>
                    <InputLabelText className="">Account Number</InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={
                        !!(errors.accountNumber && touched.accountNumber)
                      }
                    >
                      <InputField
                        className=""
                        placeholder="Enter Account Number"
                        value={values.accountNumber}
                        onChangeText={handleChange("accountNumber")}
                        onBlur={handleBlur("accountNumber")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.accountNumber && touched.accountNumber && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.accountNumber}
                      </ThemedText>
                    )}
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
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}
