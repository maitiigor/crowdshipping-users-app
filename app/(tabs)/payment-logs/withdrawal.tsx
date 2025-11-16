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
import { useCountry } from "@/hooks/useCountry";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedPost, useAuthenticatedQuery } from "@/lib/api";
import { useAppSelector } from "@/store";
import { IWalletRequestResponse } from "@/types/IWalletRequest";
import { formatCurrency } from "@/utils/helper";
import { Link, useNavigation, useRouter } from "expo-router";
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
export default function WithdrawalScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const backroundTopNav = useThemeColor({}, "background");
  const [bankValues, setBankValues] = useState({ bankCode: "", bankName: "" });
  console.log("🚀 ~ WithdrawalScreen ~ bankValues:", bankValues);
  const { data, isLoading } = useAuthenticatedQuery<
    IWalletRequestResponse | undefined
  >(["wallet"], "/wallet/fetch");
  const [showModal, setShowModal] = useState(false);
  const { countryCode } = useCountry();
  // Get the selected country from Redux
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );
  const currency = selectedCountry?.currencies?.[0];
  const selectedCurrency = currency?.code || "NGN";
  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .min(100, "Minimum withdrawal is 100")
      .max(
        data?.data.wallet.availableBalance || 0,
        "Amount exceeds available balance"
      ),
    bankCode: Yup.string().required("Bank is required"),
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
  const { mutateAsync, loading, error } = useAuthenticatedPost<
    any,
    {
      amount: number;
      bankName: string;
      bankCode: string;
      accountNumber: string;
      accountName: string;
    }
  >("/wallet/initiate-withdrawal");
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Withdraw to bank
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

  const handleInitiateWithdrawal = async (values: {
    amount: number;
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  }) => {
    try {
      const response = await mutateAsync({
        amount: values.amount,
        bankName: values.bankName,
        bankCode: values.bankCode,
        accountNumber: values.accountNumber,
        accountName: values.accountName,
      });
      console.log("🚀 ~ handleInitiateWithdrawal ~ response:", response);
      showNewToast({
        title: "Success",
        description: "Withdrawal Request successfully!",
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
        "Withdrawal Request failed";

      showNewToast({
        title: "Withdrawal Request Failed",
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
                amount: "",
                bankName: "",
                bankCode: "",
                accountNumber: "",
                accountName: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                  amount: parseInt(values.amount, 10),
                  bankCode: bankValues.bankCode,
                  bankName: bankValues.bankName,
                };
                console.log("Form submitted:", payload);
                handleInitiateWithdrawal(payload);
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
                    <InputLabelText className="">Amount</InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.amount && touched.amount)}
                    >
                      <InputField
                        className=""
                        placeholder="Enter Amount"
                        value={values.amount}
                        onChangeText={handleChange("amount")}
                        onBlur={handleBlur("amount")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.amount && touched.amount && (
                      <ThemedText
                        type="b4_body"
                        lightColor="#FF3B30"
                        className="text-error-500 mb-4"
                      >
                        {errors.amount}
                      </ThemedText>
                    )}

                    <ThemedView className=" flex-row items-center justify-between">
                      <ThemedText className="text-typography-800">
                        Wallet Balance
                      </ThemedText>
                      <ThemedText type="default" className="text-primary-500">
                        {isLoading
                          ? "Loading..."
                          : formatCurrency(
                              data?.data.wallet.availableBalance,
                              selectedCurrency,
                              `en-${countryCode}`
                            ) ||
                            formatCurrency(
                              0.0,
                              selectedCurrency,
                              `en-${countryCode}`
                            )}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView>
                    <BankDropdown
                      errors={
                        errors.bankCode && touched.bankCode
                          ? { bankCode: errors.bankCode }
                          : {}
                      }
                      touched={
                        errors.bankCode && touched.bankCode
                          ? { bankCode: true }
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
                          lightColor="#FF3B30"
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
                          lightColor="#FF3B30"
                          className="text-error-500 mb-4"
                        >
                          {errors.accountName}
                        </ThemedText>
                      )}
                      <Link
                        className="hidden"
                        href={`/payment-logs/choose-beneficiary`}
                        asChild
                      >
                        <ThemedText
                          type="b2_body"
                          className="text-primary-500 text-right"
                        >
                          Choose Beneficiary
                        </ThemedText>
                      </Link>
                    </ThemedView>
                  </ThemedView>

                  <Button
                    variant="solid"
                    size="2xl"
                    disabled={loading}
                    className="mt-5 rounded-[12px]"
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText
                      lightColor="#FFFFFF"
                      darkColor="#FFFFFF"
                      type="s1_subtitle" className="text-white">
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
      {showModal && (
        <>
          <CustomModal
            description="Your withdrawal request has been submitted and is pending admin verification."
            title="Withdrawal Request Submitted"
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
