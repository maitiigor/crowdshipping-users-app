import {
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import CustomToast from "@/components/Custom/CustomToast";
import FileUploader, { PickedFile } from "@/components/Custom/fileUploader";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
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
import { Textarea, TextareaInput } from "@/components/ui/textarea";
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
import { useThemeColor } from "@/hooks/useThemeColor";

// MenuItem type removed (unused)
const reportTypeList = [
  {
    label: "Customer",
    value: "customer",
  },
  {
    label: "Booking",
    value: "booking",
  },
  {
    label: "Others",
    value: "others",
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
  {
    label: "Others",
    value: "Others",
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
  {
    label: "Others",
    value: "Others",
  },
];

type ReportFormValues = {
  reportType: string;
  natureOfReport: string;
  otherOption: string;
  reportAmount: string;
  trackingId: string;
  description: string;
  evidence: string;
};

export default function AddNewReportScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const backroundTopNav = useThemeColor({}, "background");
  const [file, setFile] = useState<PickedFile | null>(null);
  const insets = useSafeAreaInsets();
  const {
    mutateAsync: uploadFile,
    loading: isUploading,
    error: uploadError,
  } = useAuthenticatedPost<{ url: string }, FormData>("/storage-upload");
  const { mutateAsync, error, loading } = useAuthenticatedPost<
    any,
    {
      reportType: string; //customer | booking | other
      natureOfReport: string;
      otherOption: string;
      reportAmount: number;
      trackingId: string; //if reportType is booking then trackingId is required(e.g PKG-8RLM6TOOO)
      description: string;
      evidence: string; //url of the file uploaded
    }
  >("/issue/log/report");
  const validationSchema = Yup.object().shape({
    reportType: Yup.string().required("Report type is required"),
    natureOfReport: Yup.string().required("Nature of report is required"),
    otherOption: Yup.string().when("natureOfReport", {
      is: "Others", // when natureOfReport is "Others"
      then: (schema) =>
        schema
          .required("Other options are required")
          .min(5, "Other options must be at least 5 characters")
          .max(100, "Other options cannot exceed 100 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),
    reportAmount: Yup.number()
      .transform((value, originalValue) => {
        if (typeof originalValue === "string") {
          const parsed = parseFloat(originalValue.replace(/,/g, ""));
          return Number.isNaN(parsed) ? undefined : parsed;
        }
        return value;
      })
      .typeError("Report amount must be a number")
      .required("Report amount is required")
      .positive("Report amount must be positive"),
    trackingId: Yup.string().when(
      "reportType",
      (reportType: any, schema: any) =>
        reportType === "Booking"
          ? schema.required("Tracking ID is required for bookings")
          : schema
    ),
    description: Yup.string()
      .required("Description is required")
      .min(20, "Description must be at least 20 characters")
      .max(500, "Description cannot exceed 500 characters"),
    attachment: Yup.mixed(),
  });
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

  const handleReportSubmit = async (values: {
    reportType: string;
    natureOfReport: string;
    otherOption: string;
    reportAmount: number;
    trackingId: string;
    description: string;
    evidence: string;
  }) => {
    try {
      await mutateAsync({
        ...values,
        reportType: values.reportType.toLowerCase() || "",
        evidence: values.evidence || "",
      });

      showNewToast({
        title: "Report Submitted",
        description: "Your report has been submitted successfully.",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      // Optionally, navigate back or to another screen
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Sign up failed";

      showNewToast({
        title: "Report Request Failed",
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
            <Formik<ReportFormValues>
              initialValues={{
                reportType: "",
                natureOfReport: "",
                otherOption: "",
                reportAmount: "",
                trackingId: "",
                description: "",
                evidence: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                const numericAmount =
                  typeof values.reportAmount === "string"
                    ? parseFloat(values.reportAmount)
                    : values.reportAmount;

                if (!Number.isFinite(numericAmount)) {
                  showNewToast({
                    title: "Invalid amount",
                    description: "Please enter a valid report amount.",
                    icon: HelpCircleIcon,
                    action: "error",
                    variant: "solid",
                  });
                  return;
                }

                const payload = {
                  reportType: values.reportType,
                  natureOfReport: values.natureOfReport,
                  otherOption: values.otherOption,
                  reportAmount: numericAmount,
                  trackingId: values.trackingId,
                  description: values.description,
                  evidence: values.evidence,
                };
                console.log("Form submitted:", payload);
                handleReportSubmit(payload);
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
                setFieldTouched,
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
                        className="h-[3.4375rem] rounded-lg border-primary-100  bg-primary-inputShade px-2"
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
                      <ThemedText lightColor="#FF3B30" type="b4_body" className="text-error-500">
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
                      onValueChange={(value) => {
                        handleChange("natureOfReport")(value);

                        // Reset otherOption when switching away from "Others"
                        if (value !== "Others") {
                          setFieldValue("otherOption", "");
                          setFieldTouched("otherOption", false);
                        }
                      }}
                    >
                      <SelectTrigger
                        size="xl"
                        className="h-[3.4375rem] rounded-lg border-primary-100 bg-primary-inputShade px-2"
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
                      <ThemedText lightColor="#FF3B30" type="b4_body" className="text-error-500">
                        {errors.natureOfReport}
                      </ThemedText>
                    )}
                  </ThemedView>
                  {values.natureOfReport === "Others" && (
                    <ThemedView>
                      <InputLabelText type="b2_body" className="">
                        Other Options
                      </InputLabelText>
                      <Input
                        size="xl"
                        className="h-[3.4375rem] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                        variant="outline"
                        isInvalid={
                          !!(errors.otherOption && touched.otherOption)
                        }
                      >
                        <InputField
                          className=""
                          placeholder="Enter other options"
                          value={values.otherOption}
                          onChangeText={handleChange("otherOption")}
                          onBlur={handleBlur("otherOption")}
                          keyboardType="default"
                          autoCapitalize="none"
                        />
                      </Input>
                      {errors.otherOption && touched.otherOption && (
                        <ThemedText lightColor="#FF3B30" type="b4_body" className="text-error-500">
                          {errors.otherOption}
                        </ThemedText>
                      )}
                    </ThemedView>
                  )}
                  <ThemedView>
                    <InputLabelText type="b2_body" className="">
                      Report Amount
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[3.4375rem] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={
                        !!(errors.reportAmount && touched.reportAmount)
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
                      <ThemedText lightColor="#FF3B30" type="b4_body" className="text-error-500">
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
                      className="h-[3.4375rem] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.trackingId && touched.trackingId)}
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
                      <ThemedText lightColor="#FF3B30" type="b4_body" className="text-error-500">
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
                      className="w-full h-[9.375rem] border-primary-100 bg-primary-inputShade"
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
                      <ThemedText lightColor="#FF3B30" type="b4_body" className="text-error-500">
                        {String(errors.description)}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <FileUploader
                    value={file}
                    onChange={async (picked) => {
                      setFile(picked);
                      if (!picked) {
                        setFieldValue("evidence", "");
                        return;
                      }
                      try {
                        const form = new FormData();
                        const fileName = picked.name || `upload-${Date.now()}`;
                        const fileType =
                          picked.mimeType || "application/octet-stream";

                        form.append("file", {
                          uri: picked.uri,
                          name: fileName,
                          type: fileType,
                        } as any);

                        const res = await uploadFile(form);
                        const url = (res as any)?.data?.data;
                        if (!url) {
                          throw new Error("Upload failed");
                        }
                        setFieldValue("evidence", url);
                        showNewToast({
                          title: "File uploaded",
                          description: "Your attachment is ready.",
                          icon: CircleCheckIcon,
                          action: "success",
                          variant: "solid",
                        });
                      } catch (err: any) {
                        setFieldValue("evidence", "");
                        setFile(null);
                        const message =
                          err?.data?.message ||
                          err?.message ||
                          (typeof uploadError === "string"
                            ? uploadError
                            : undefined) ||
                          "We couldn't upload your file.";
                        showNewToast({
                          title: "Upload failed",
                          description: message,
                          icon: HelpCircleIcon,
                          action: "error",
                          variant: "solid",
                        });
                      }
                    }}
                    className="w-full flex border-2 justify-center items-center border-dotted border-primary-200 rounded-lg p-4"
                    size={50}
                    previewShape="rounded"
                    label=""
                    helperText="upload photos, videos, receipts, or other relevant files."
                    allowImages
                    allowVideos
                    allowDocuments
                    disabled={isUploading}
                  />
                  <ThemedView className="mt-5 flex-row gap-3">
                    <Button
                      variant="outline"
                      size="2xl"
                      onPress={() => {
                        router.back();
                      }}
                      className={`border-2 flex-1 p-3 border-primary-500 rounded-xl`}
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
                      isDisabled={loading || isUploading}
                      className={`border-2 flex-1 p-3 border-primary-500 rounded-xl 
                               bg-primary-500`}
                    >
                      <ThemedText
                        type="s2_subtitle"
                        lightColor="#FFFFFF"
                        darkColor="#FFFFFF"
                        className={` text-center text-white`}
                      >
                        {loading || isUploading ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          "Submit Report"
                        )}
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
