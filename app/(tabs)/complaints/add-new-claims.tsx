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
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedPost } from "@/lib/api";
import { Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

type ReportFormValues = {
  natureOfClaim: string;
  otherOption: string;
  claimAmount: string;
  trackingId: string;
  description: string;
  evidence: string;
};

const againstCustomerList = [
  {
    label: "Delivery Issues",
    value: "Delivery Issues",
  },
  {
    label: "Rider/Driver Issues",
    value: "Rider/Driver Issues",
  },
  {
    label: "Payment & Charges Issues",
    value: "Payment & Charges Issues",
  },
  {
    label: "App/Technical Issues",
    value: "App/Technical Issues",
  },
  {
    label: "Order/Store Issues",
    value: "Order/Store Issues",
  },
  {
    label: "Account Issues",
    value: "Account Issues",
  },
  {
    label: "Complaints & Customer Service",
    value: "Complaints & Customer Service",
  },
  {
    label: "Others",
    value: "Others",
  },
];
export default function AddNewReportScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation("complaints");
  const [file, setFile] = useState<PickedFile | null>(null);
  const backroundTopNav = useThemeColor({}, "background");
  const insets = useSafeAreaInsets();
  const {
    mutateAsync: uploadFile,
    loading: isUploading,
    error: uploadError,
  } = useAuthenticatedPost<{ url: string }, FormData>("/storage-upload");
  const { mutateAsync, error, loading } = useAuthenticatedPost<
    any,
    {
      natureOfClaim: string;
      otherOption: string;
      claimAmount: number;
      trackingId: string; //if reportType is booking then trackingId is required(e.g PKG-8RLM6TOOO)
      description: string;
      evidence: string; //url of the file uploaded
    }
  >("/issue/log/cliam");
  const validationSchema = Yup.object().shape({
    natureOfClaim: Yup.string().required(t("validation.nature_required")),
    otherOption: Yup.string().when("natureOfClaim", {
      is: "Others", // when natureOfClaim is "Others"
      then: (schema) =>
        schema
          .required(t("validation.other_required"))
          .min(5, t("validation.other_min"))
          .max(100, t("validation.other_max")),
      otherwise: (schema) => schema.notRequired(),
    }),
    claimAmount: Yup.number()
      .transform((value, originalValue) => {
        if (typeof originalValue === "string") {
          const parsed = parseFloat(originalValue.replace(/,/g, ""));
          return Number.isNaN(parsed) ? undefined : parsed;
        }
        return value;
      })
      .typeError(t("validation.amount_number"))
      .required(t("validation.amount_required"))
      .positive(t("validation.amount_positive")),
    trackingId: Yup.string().required(t("validation.tracking_required")),
    description: Yup.string()
      .required(t("validation.description_required"))
      .min(20, t("validation.description_min"))
      .max(500, t("validation.description_max")),
    attachment: Yup.mixed(),
  });
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            {t("header.new_claim_title")}
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
  }, [navigation, backroundTopNav, t]);
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

  const handleClaimSubmit = async (values: {
    natureOfClaim: string;
    otherOption: string;
    claimAmount: number;
    trackingId: string;
    description: string;
    evidence: string;
  }) => {
    try {
      await mutateAsync({
        ...values,
        evidence: values.evidence || "",
      });

      showNewToast({
        title: t("alerts.claim_submitted"),
        description: t("alerts.claim_submitted_desc"),
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
        t("errors.signup_failed");

      showNewToast({
        title: t("alerts.claim_failed"),
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
                natureOfClaim: "",
                otherOption: "",
                claimAmount: "",
                trackingId: "",
                description: "",
                evidence: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                const numericAmount =
                  typeof values.claimAmount === "string"
                    ? parseFloat(values.claimAmount)
                    : values.claimAmount;

                if (!Number.isFinite(numericAmount)) {
                  showNewToast({
                    title: t("alerts.invalid_amount"),
                    description: t("alerts.invalid_amount_desc"),
                    icon: HelpCircleIcon,
                    action: "error",
                    variant: "solid",
                  });
                  return;
                }

                const payload = {
                  natureOfClaim: values.natureOfClaim,
                  otherOption: values.otherOption,
                  claimAmount: numericAmount,
                  trackingId: values.trackingId,
                  description: values.description,
                  evidence: values.evidence,
                };
                console.log("Form submitted:", payload);
                handleClaimSubmit(payload);
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
                validateForm,
              }) => (
                <ThemedView className="flex gap-4">
                  <ThemedView>
                    <InputLabelText type="b2_body">
                      {t("labels.nature_of_claim")}
                    </InputLabelText>
                    <Select
                      selectedValue={values.natureOfClaim}
                      onValueChange={(value) => {
                        handleChange("natureOfClaim")(value);

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
                          value={values.natureOfClaim}
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
                          {againstCustomerList.map((type) => (
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
                    {errors.natureOfClaim && touched.natureOfClaim && (
                      <ThemedText
                        lightColor="#FF3B30"
                        type="b4_body"
                        className="text-error-500"
                      >
                        {errors.natureOfClaim}
                      </ThemedText>
                    )}
                  </ThemedView>

                  {values.natureOfClaim === "Others" && (
                    <ThemedView>
                      <InputLabelText type="b2_body" className="">
                        {t("labels.other_options")}
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
                          placeholder={t("placeholders.enter_other_options")}
                          value={values.otherOption}
                          onChangeText={handleChange("otherOption")}
                          onBlur={handleBlur("otherOption")}
                          keyboardType="default"
                          autoCapitalize="none"
                        />
                      </Input>
                      {errors.otherOption && touched.otherOption && (
                        <ThemedText
                          lightColor="#FF3B30"
                          type="b4_body"
                          className="text-error-500"
                        >
                          {errors.otherOption}
                        </ThemedText>
                      )}
                    </ThemedView>
                  )}

                  <ThemedView>
                    <InputLabelText type="b2_body" className="">
                      {t("labels.claim_amount")}
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[3.4375rem] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.claimAmount && touched.claimAmount)}
                    >
                      <InputField
                        className=""
                        placeholder={t("placeholders.enter_amount")}
                        value={values.claimAmount}
                        onChangeText={handleChange("claimAmount")}
                        onBlur={handleBlur("claimAmount")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.claimAmount && touched.claimAmount && (
                      <ThemedText
                        lightColor="#FF3B30"
                        type="b4_body"
                        className="text-error-500"
                      >
                        {errors.claimAmount}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body" className="">
                      {t("labels.tracking_id")}
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[3.4375rem] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.trackingId && touched.trackingId)}
                    >
                      <InputField
                        className=""
                        placeholder={t("placeholders.enter_tracking_id")}
                        value={values.trackingId}
                        onChangeText={handleChange("trackingId")}
                        onBlur={handleBlur("trackingId")}
                        keyboardType="default"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.trackingId && touched.trackingId && (
                      <ThemedText
                        lightColor="#FF3B30"
                        type="b4_body"
                        className="text-error-500"
                      >
                        {errors.trackingId}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body" className="pb-1">
                      {t("labels.detailed_description")}
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
                        placeholder={t("placeholders.enter_description")}
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
                      <ThemedText
                        lightColor="#FF3B30"
                        type="b4_body"
                        className="text-error-500"
                      >
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
                          title: t("alerts.file_uploaded"),
                          description: t("alerts.file_uploaded_desc"),
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
                          t("errors.upload_failed_desc");
                        showNewToast({
                          title: t("alerts.upload_failed"),
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
                    helperText={t("labels.upload_helper")}
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
                        {t("buttons.cancel")}
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
                          t("buttons.submit_claim")
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
