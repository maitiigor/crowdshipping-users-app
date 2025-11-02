import BankDropdown from "@/components/Custom/BankDropdown";
import { CustomModal } from "@/components/Custom/CustomModal";
import CustomToast from "@/components/Custom/CustomToast";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  useAuthenticatedPatch,
  useAuthenticatedPost,
  useAuthenticatedQuery,
} from "@/lib/api";
import { IWalletRequestResponse } from "@/types/IWalletRequest";
import { useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
export default function UpdateWalletAccountScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const [bankValues, setBankValues] = useState({ bankCode: "", bankName: "" });
  console.log("🚀 ~ WithdrawalScreen ~ bankValues:", bankValues);
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading, refetch } = useAuthenticatedQuery<
    IWalletRequestResponse | undefined
  >(["wallet"], "/wallet/fetch");
  console.log("🚀 ~ UpdateWalletAccountScreen ~ data:", data);
  const validationSchema = Yup.object().shape({
    bankName: Yup.string().required("Bank is required"),
    accountNumber: Yup.string()
      .required("Account Number is required")
      .matches(/^\d+$/, "Account Number must be digits only")
      .min(10, "Account Number must be at least 10 digits"),
    accountName: Yup.string().required("Account Name is required"),
  });
  const {
    mutateAsync: mutateResolveAccount,
    loading: loadingResolveAccount,
    isSuccess: isSuccessResolveAccount,
  } = useAuthenticatedPost<
    any,
    {
      bankCode: string;
      accountNumber: string;
    }
  >("/wallet/resolve-account");
  const { mutateAsync, loading, error } = useAuthenticatedPatch<
    any,
    {
      bankName: string;
      accountNumber: string;
      accountName: string;
    }
  >("/wallet/update-account");

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Update Bank Account
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
  }, [navigation]);
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
  // use the data to prefill the form if available
  useEffect(() => {
    if (data && data.data && data.data.wallet) {
      const { bankName } = data.data.wallet;
      setBankValues({ bankCode: "", bankName: bankName || "" });
    }
  }, [data?.data?.wallet]);
  const handleAccountUpdate = async (values: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  }) => {
    try {
      const response = await mutateAsync({
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        accountName: values.accountName,
      });
      showNewToast({
        title: "Success",
        description: "Account Updated successfully!",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      setShowModal(true);
      // router.push({
      //   pathname: "/(tabs)/confirm-payment-pin",
      //   params: {
      //     fromPage: "withdrawal",
      //     amount: values.amount,
      //     currency: currency,
      //     trxReference: response.data.trxReference,
      //     transferCode: response.data.transferCode,
      //   },
      // });
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Account Update failed";

      showNewToast({
        title: "Account Update Failed",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };
  // i want to refetch the notifications when the user comes back to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      refetch();
    });

    return unsubscribe;
  }, []);
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
                bankName: data?.data?.wallet?.bankName || "",
                accountNumber:
                  String(data?.data?.wallet?.accountNumber ?? "") || "",
                accountName: data?.data?.wallet?.accountName || "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                  bankName: bankValues.bankName,
                };
                console.log("Form submitted:", payload);
                handleAccountUpdate(payload);
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
                    <BankDropdown
                      errors={
                        errors.bankName && touched.bankName
                          ? { bankName: errors.bankName }
                          : {}
                      }
                      touched={
                        errors.bankName && touched.bankName
                          ? { bankName: true }
                          : {}
                      }
                      values={bankValues}
                      handleChange={async (code: string, name: string) => {
                        setFieldValue("bankCode", code);
                        setFieldValue("bankName", name);
                        setBankValues({ bankCode: code, bankName: name });
                        // If user already entered a 10-digit account number, resolve immediately
                        if (
                          values.accountNumber &&
                          values.accountNumber.length === 10
                        ) {
                          try {
                            const response = await mutateResolveAccount({
                              bankCode: code,
                              accountNumber: values.accountNumber,
                            });
                            const resolvedName =
                              response?.data?.account_name || "";
                            if (resolvedName) {
                              setFieldValue("accountName", resolvedName);
                            }
                          } catch (err) {
                            console.error("Error resolving account:", err);
                          }
                        }
                      }}
                    />
                  </ThemedView>
                  <ThemedView className="flex flex-1 gap-3 w-full">
                    <ThemedView className="flex-1 w-full">
                      <InputLabelText className="">
                        Account Number
                      </InputLabelText>
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
                          onChangeText={async (text: string) => {
                            // Keep only digits
                            const digits = text.replace(/\D/g, "");
                            console.log("🚀 ~ digits:", digits);
                            setFieldValue("accountNumber", digits);

                            // Clear account name while typing until we have a full number
                            if (digits.length !== 10) {
                              setFieldValue("accountName", "");
                              return;
                            }

                            // Resolve when bank is selected and account number is 10 digits
                            if (bankValues.bankCode && digits.length === 10) {
                              try {
                                const response = await mutateResolveAccount({
                                  bankCode: bankValues.bankCode,
                                  accountNumber: digits,
                                });
                                const resolvedName =
                                  response?.data?.account_name || "";
                                if (resolvedName) {
                                  setFieldValue("accountName", resolvedName);
                                }
                              } catch (err: any) {
                                console.error("Error resolving account:", err);
                                // Add toast for user feedback
                                showNewToast({
                                  title: "Account Resolution Failed",
                                  description:
                                    err?.data?.message ||
                                    err?.message ||
                                    "Unable to verify account. Please check details and try again.",
                                  icon: HelpCircleIcon, // Ensure this icon is imported
                                  action: "error",
                                  variant: "solid",
                                });
                              }
                            }
                          }}
                          onBlur={handleBlur("accountNumber")}
                          keyboardType="numeric"
                          autoCapitalize="none"
                        />
                        {loadingResolveAccount && <ActivityIndicator />}
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
                  </ThemedView>
                  <ThemedView className="flex flex-1 gap-3 w-full">
                    <ThemedView className="flex-1 w-full">
                      <InputLabelText className="">Account Name</InputLabelText>
                      <Input
                        size="xl"
                        isDisabled={isSuccessResolveAccount}
                        className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                        variant="outline"
                        isInvalid={
                          !!(errors.accountName && touched.accountName)
                        }
                      >
                        <InputField
                          className=""
                          placeholder="Account name will auto-fill"
                          value={values.accountName}
                          onChangeText={handleChange("accountName")}
                          onBlur={handleBlur("accountName")}
                          // Let users edit if needed; leave default keyboard
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

                  <Button
                    variant="solid"
                    size="2xl"
                    disabled={loading}
                    className="mt-5 rounded-[12px]"
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText type="s1_subtitle" className="text-white">
                      {loading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        "Update Account"
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
            description="Your bank account has been updated successfully."
            title="Account Updated"
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={""}
            firstBtnText="Go Back"
            onFirstClick={() => {
              setShowModal(false);
              router.back();
            }}
            // secondBtnLink={""}
            // secondBtnText=""
            setShowModal={() => {
              setShowModal(false);
              router.back();
            }}
            showModal={showModal}
            size="lg"
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
}
