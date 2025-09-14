import { KeyboardAvoidingView, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import CustomSidebarMenu from "@/components/Custom/CustomSidebarMenu";
import FileUploader, { PickedFile } from "@/components/Custom/fileUploader";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
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
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Formik } from "formik";
import { ChevronLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
// MenuItem type removed (unused)
const reportTypeList = [
  {
    label: "Against a Customer",
    value: "Against a Customer",
  },
  {
    label: "Against a Booking",
    value: "Against a Booking",
  },
];
const againstCustomerList = [
  {
    label: "Item not exactly what was described",
    value: "Item not exactly what was described",
  },
  {
    label: "Customer too rude",
    value: "Customer too rude",
  },
  {
    label: "Wrong address",
    value: "Wrong address",
  },
];
const againstBookingList = [
  {
    label: "Damage during transit",
    value: "Damage during transit",
  },
  {
    label: "Lost parcel",
    value: "Lost parcel",
  },
  {
    label: "Incorrect fare charged",
    value: "Incorrect fare charged",
  },
  {
    label: "Late delivery resulting in loss",
    value: "Late delivery resulting in loss",
  },
];
export default function AddNewReportScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [showDrawer, setShowDrawer] = useState(false);
  const [file, setFile] = useState<PickedFile | null>(null);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            New Report
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
                reportType: "",
                natureOfReport: "",
                otherOptions: "",
                reportAmount: "",
                trackingId: "",
                description: "",
                attachment: "",
              }}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                  attachment: file,
                };
                console.log("Form submitted:", payload);
                router.push({
                  pathname: "/(tabs)/reports/list",
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
                  <ThemedView>
                    <InputLabelText type="b2_body">Report Type</InputLabelText>
                    <Select
                      selectedValue={values.reportType}
                      onValueChange={handleChange("reportType")}
                    >
                      <SelectTrigger
                        size="xl"
                        className="h-[55px] rounded-lg border-primary-100  bg-primary-inputShade px-2"
                      >
                        <SelectInput
                          placeholder="Select type"
                          value={values.reportType}
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
                          {reportTypeList.map((type) => (
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
                    {errors.reportType && touched.reportType && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {errors.reportType}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body">
                      Nature of Report
                    </InputLabelText>
                    <Select
                      selectedValue={values.natureOfReport}
                      onValueChange={handleChange("natureOfReport")}
                    >
                      <SelectTrigger
                        size="xl"
                        className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      >
                        <SelectInput
                          placeholder=""
                          value={values.natureOfReport}
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
                          {values.reportType === "Against a Customer"
                            ? againstCustomerList.map((type) => (
                                <SelectItem
                                  key={type.value}
                                  value={type.value}
                                  label={type.label}
                                >
                                  {type.label}
                                </SelectItem>
                              ))
                            : againstBookingList.map((type) => (
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
                    {errors.natureOfReport && touched.natureOfReport && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {errors.natureOfReport}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body" className="">
                      Other Options
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={
                        !!(errors.otherOptions && touched.otherOptions)
                      }
                    >
                      <InputField
                        className=""
                        placeholder="Enter other options"
                        value={values.otherOptions}
                        onChangeText={handleChange("otherOptions")}
                        onBlur={handleBlur("otherOptions")}
                        keyboardType="default"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.otherOptions && touched.otherOptions && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {errors.otherOptions}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body" className="">
                      Report Amount
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={
                        !!(errors.otherOptions && touched.otherOptions)
                      }
                    >
                      <InputField
                        className=""
                        placeholder="Enter amount"
                        value={values.reportAmount}
                        onChangeText={handleChange("reportAmount")}
                        onBlur={handleBlur("reportAmount")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.reportAmount && touched.reportAmount && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {errors.reportAmount}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body" className="">
                      Tracking ID
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={
                        !!(errors.otherOptions && touched.otherOptions)
                      }
                    >
                      <InputField
                        className=""
                        placeholder="Enter Tracking ID"
                        value={values.trackingId}
                        onChangeText={handleChange("trackingId")}
                        onBlur={handleBlur("trackingId")}
                        keyboardType="default"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.trackingId && touched.trackingId && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {errors.trackingId}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body" className="pb-1">
                      Detailed Description
                    </InputLabelText>
                    <Textarea
                      size="lg"
                      isReadOnly={false}
                      isInvalid={!!(errors.description && touched.description)}
                      isDisabled={false}
                      className="w-full h-[150px] border-primary-100 bg-primary-inputShade"
                    >
                      <TextareaInput
                        clearButtonMode="while-editing"
                        value={values.description}
                        onChangeText={handleChange("description")}
                        onBlur={handleBlur("description")}
                        placeholder="Enter Product Description"
                        multiline
                        maxLength={500}
                        numberOfLines={10}
                        style={{ textAlignVertical: "top" }}
                      />
                      {/* clear button */}
                    </Textarea>
                    <ThemedText type="c1_caption" className="text-right pt-1">
                      {String(values.description?.length ?? 0)}/500
                    </ThemedText>
                    {errors.description && touched.description && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {String(errors.description)}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <FileUploader
                    value={file}
                    onChange={setFile}
                    className="w-full flex border-2 justify-center items-center border-dotted border-primary-200 rounded-lg p-4"
                    size={50}
                    previewShape="rounded"
                    label=""
                    helperText="upload photos, videos, receipts, or other relevant files."
                    allowImages
                    allowVideos
                    allowDocuments
                  />
                  <ThemedView className="mt-5 flex-row gap-3">
                    <Button
                      variant="outline"
                      size="2xl"
                      onPress={() => {
                        router.back();
                      }}
                      className={`border-2 flex-1 p-3 border-primary-500 rounded-xl 
                              
                                 `}
                    >
                      <ThemedText
                        type="s2_subtitle"
                        className={` text-center text-primary-500`}
                      >
                        Cancel
                      </ThemedText>
                    </Button>
                    <Button
                      onPress={() => handleSubmit()}
                      size="2xl"
                      variant="solid"
                      className={`border-2 flex-1 p-3 border-primary-500 rounded-xl 
                               bg-primary-500`}
                    >
                      <ThemedText
                        type="s2_subtitle"
                        className={` text-center text-white`}
                      >
                        Submit Report
                      </ThemedText>
                    </Button>
                  </ThemedView>
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
