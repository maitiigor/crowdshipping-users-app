import CustomToast from "@/components/Custom/CustomToast";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useCountry } from "@/hooks/useCountry";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  useAuthenticatedPatch,
  useAuthenticatedPost,
  useAuthenticatedQuery,
} from "@/lib/api";
import { useAppSelector } from "@/store";
import { INotificationsResponse } from "@/types/INotification";
import { IPickupTripDetailsResponse } from "@/types/IPickupByDriver";
import { IWalletRequestResponse } from "@/types/IWalletRequest";
import { formatCurrency } from "@/utils/helper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
  SearchIcon,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  discount: Yup.string().optional(),
  amount: Yup.number().required("Amount is required"),
});

export default function ConfirmPrice() {
  const navigation = useNavigation();
  const { tripId, amount } = useLocalSearchParams();
  const toast = useToast();
  const { refetch: notifyRefetch } = useAuthenticatedQuery<
    INotificationsResponse | undefined
    >(["notifications"], "/notification");
  const backroundTopNav = useThemeColor({}, "background");
  const { data, isLoading } = useAuthenticatedQuery<
    IWalletRequestResponse | undefined
  >(["wallet"], "/wallet/fetch");
  const { mutateAsync, error, loading } = useAuthenticatedPatch<
    any,
    {
      discountCode: string;
      amount: number;
    }
  >(`/trip/confirm/package/${tripId}`);
  const {
    data: pickupData,
    refetch: refetchPickupData,
    isLoading: isLoadingPickupData,
  } = useAuthenticatedQuery<IPickupTripDetailsResponse | undefined>(
    ["pickup-details", tripId],
    `/trip/packages/${tripId}`
  );
  const {
    mutateAsync: applyDiscount,
    error: discountError,
    loading: discountLoading,
  } = useAuthenticatedPost<
    any,
    {
      discountCode: string;
    }
  >(`/trip/apply/discount`);
  const { country, countryCode } = useCountry();
  // Get the selected country from Redux
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );
  const currency = selectedCountry?.currencies?.[0];
  const selectedCurrency = currency?.code || "NGN";
  const router = useRouter();
  const baseAmount = useMemo(() => {
    const amountValue = Array.isArray(amount) ? amount[0] : amount;
    const parsed =
      typeof amountValue === "string"
        ? parseFloat(amountValue)
        : Number(amountValue);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amount]);
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(
    null
  );
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | null>(
    null
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Pricing
          </ThemedText>
        );
      },
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 },
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: backroundTopNav,
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
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
              className="p-2 rounded flex justify-center items-center"
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
    const toastId = Math.random().toString();
    toast.show({
      id: toastId,
      placement: "top",
      duration: 3000,
      render: ({ id: innerId }) => (
        <CustomToast
          uniqueToastId={`toast-${innerId}`}
          icon={icon}
          action={action}
          title={title}
          variant={variant}
          description={description}
        />
      ),
    });
  };

  const formatPercentage = (value: number) =>
    parseFloat(value.toFixed(2)).toString();

  const handleApplyDiscount = async (
    discountCodeValue: string,
    setFieldValue: (
      field: string,
      value: unknown,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    const trimmedCode = discountCodeValue?.trim();

    if (!trimmedCode) {
      showNewToast({
        title: "Discount Required",
        description: "Enter a discount code before applying.",
        icon: HelpCircleIcon,
        action: "warning",
        variant: "solid",
      });
      return;
    }

    if (baseAmount <= 0) {
      showNewToast({
        title: "Invalid Amount",
        description: "Unable to apply a discount to this amount.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
      return;
    }

    try {
      const response = await applyDiscount({
        discountCode: trimmedCode,
      });

      const percentageFromResponse = Number(response?.data?.discount);

      if (
        !Number.isFinite(percentageFromResponse) ||
        percentageFromResponse <= 0
      ) {
        setDiscountPercentage(null);
        setDiscountValue(0);
        setAppliedDiscountCode(null);
        setFieldValue("amount", baseAmount);
        showNewToast({
          title: "Discount Unavailable",
          description: "We couldn't calculate a valid discount for this code.",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return;
      }

      const computedDiscountValue = (baseAmount * percentageFromResponse) / 100;
      const newAmount = Math.max(baseAmount - computedDiscountValue, 0);

      setDiscountPercentage(percentageFromResponse);
      setDiscountValue(computedDiscountValue);
      setAppliedDiscountCode(trimmedCode);
      setFieldValue("amount", Number(newAmount.toFixed(2)));
      showNewToast({
        title: "Discount Applied",
        description: `You saved ${formatCurrency(
          computedDiscountValue,
          selectedCurrency,
          `en-${countryCode}`
        )}.`,
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
    } catch (discountErr: any) {
      showNewToast({
        title: "Discount Failed",
        description:
          discountErr?.data?.message ||
          discountErr?.message ||
          (typeof discountError === "string" ? discountError : undefined) ||
          "Unable to apply discount at the moment.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };

  const handleFormSubmit = async (values: {
    discount: string;
    amount: number;
  }) => {
    try {
      const payload = {
        discountCode: values.discount?.trim() || "",
        amount: values.amount,
      };
      const response = await mutateAsync(payload);
      console.log("🚀 ~ handleFormSubmit ~ response:", response);
      notifyRefetch();
      showNewToast({
        title: "Success",
        description: "Payment Initiated successfully",
        icon: HelpCircleIcon,
        action: "success",
        variant: "solid",
      });
      const trimmedDiscountCode = values.discount?.trim() || "";
      const discountAmountParam =
        discountPercentage !== null && discountValue > 0
          ? discountValue.toString()
          : "";
      const discountPercentageParam =
        discountPercentage !== null && discountPercentage > 0
          ? discountPercentage.toString()
          : "";
      router.push({
        pathname: "/(tabs)/choose-payment-type",
        params: {
          amount: (response?.data?.amount ?? values.amount).toString(),
          responseId: response?.data?.id ? String(response?.data?.id) : "",
          discountCode: trimmedDiscountCode,
          originalAmount: baseAmount.toString(),
          discountAmount: discountAmountParam,
          discountPercentage: discountPercentageParam,
        },
      });
    } catch (submitError: any) {
      const message =
        submitError?.data?.message ||
        submitError?.message ||
        (typeof error === "string" ? error : undefined) ||
        "An error occurred while confirming the price.";
      showNewToast({
        title: "Error",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };

  return (
    <Formik
      initialValues={{
        discount: "",
        amount: baseAmount,
      }}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
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
        <>
          <ParallaxScrollView
            headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
          >
            <ThemedView className="flex-1">
              <ThemedView className="flex-1 pb-20">
                <ThemedView>
                  <ThemedText type="b2_body" className="text-center">
                    Total Waybill cost
                  </ThemedText>
                  {discountPercentage !== null && (
                    <ThemedText
                      type="default"
                      className="text-center text-typography-400 line-through"
                    >
                      {formatCurrency(
                        baseAmount,
                        selectedCurrency,
                        `en-${countryCode}`
                      )}
                    </ThemedText>
                  )}
                  <ThemedText
                    type="h4_header"
                    className="text-center text-primary-600 pt-1"
                  >
                    {formatCurrency(
                      values.amount || 0,
                      selectedCurrency,
                      `en-${countryCode}`
                    )}
                  </ThemedText>
                  {discountPercentage !== null && (
                    <ThemedText
                      type="b3_body"
                      className="text-center text-success-600 mt-1"
                    >
                      Discount applied: -{formatPercentage(discountPercentage)}%
                      (
                      {formatCurrency(
                        discountValue,
                        selectedCurrency,
                        `en-${countryCode}`
                      )}{" "}
                      saved)
                    </ThemedText>
                  )}
                </ThemedView>
                <ThemedView>
                  <ThemedView className="flex gap-4">
                    <ThemedView className="mt-5">
                      <Input
                        size="lg"
                        className="h-[55px] border rounded-t rounded-2xl border-primary-100 bg-primary-inputShade"
                        variant="outline"
                      >
                        <InputSlot className="pl-3">
                          <InputIcon as={SearchIcon} />
                        </InputSlot>
                        <InputField
                          className=""
                          placeholder="Enter Discount code"
                          value={values.discount}
                          onChangeText={(text) => {
                            handleChange("discount")(text);
                            if (
                              appliedDiscountCode &&
                              appliedDiscountCode !== text.trim()
                            ) {
                              setDiscountPercentage(null);
                              setDiscountValue(0);
                              setAppliedDiscountCode(null);
                              setFieldValue("amount", baseAmount);
                            }
                          }}
                          onBlur={handleBlur("discount")}
                          keyboardType="default"
                          autoCapitalize="none"
                        />
                        <Button
                          variant="solid"
                          size="2xl"
                          className="rounded-[12px] mr-1"
                          onPress={() =>
                            handleApplyDiscount(values.discount, setFieldValue)
                          }
                          disabled={discountLoading}
                        >
                          {discountLoading ? (
                            <ActivityIndicator color="white" />
                          ) : (
                            <ThemedText
                              type="s2_subtitle"
                              className="text-white"
                            >
                              Apply
                            </ThemedText>
                          )}
                        </Button>
                      </Input>
                      {errors.discount && touched.discount && (
                        <ThemedText
                          lightColor="#FF3B30"
                          type="b4_body"
                          className="text-error-500"
                        >
                          {errors.discount}
                        </ThemedText>
                      )}
                    </ThemedView>
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
                  {discountPercentage !== null && (
                    <ThemedView className="mt-4 border border-success-100 bg-success-50 p-4 rounded-2xl">
                      <ThemedView className="flex-row justify-between">
                        <ThemedText type="b2_body" className="text-success-600">
                          Discount ({formatPercentage(discountPercentage)}%)
                        </ThemedText>
                        <ThemedText type="b2_body" className="text-success-600">
                          -
                          {formatCurrency(
                            discountValue,
                            selectedCurrency,
                            `en-${countryCode}`
                          )}
                        </ThemedText>
                      </ThemedView>
                      <ThemedView className="flex-row justify-between mt-2">
                        <ThemedText
                          type="b2_body"
                          className="text-typography-800"
                        >
                          New total payable
                        </ThemedText>
                        <ThemedText
                          type="b2_body"
                          className="text-typography-950"
                        >
                          {formatCurrency(
                            values.amount || 0,
                            selectedCurrency,
                            `en-${countryCode}`
                          )}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                  )}
                </ThemedView>
                {/* PLEASE FILL IN DELIVERY DETAILS 😴 */}
                {/* <ThemedView className="">
                  <ThemedText type="btn_giant" className="mt-5">
                    Delivery Details (ID2350847391)
                  </ThemedText>
                  <ThemedView className="border mt-6 border-primary-50 p-5 rounded-2xl flex gap-5">
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_large"
                        className="text-typography-600"
                      >
                        xyz Charges
                      </ThemedText>
                      <ThemedText type="btn_large" className="">
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_large"
                        className="text-typography-600"
                      >
                        xyz Charges
                      </ThemedText>
                      <ThemedText type="btn_large" className="">
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_large"
                        className="text-typography-600"
                      >
                        xyz Charges
                      </ThemedText>
                      <ThemedText type="btn_large" className="">
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_large"
                        className="text-typography-600"
                      >
                        xyz Charges
                      </ThemedText>
                      <ThemedText type="btn_large" className="">
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_large"
                        className="text-typography-600"
                      >
                        xyz Charges
                      </ThemedText>
                      <ThemedText type="btn_large" className="">
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText type="s1_subtitle" className="">
                        xyz Charges
                      </ThemedText>
                      <ThemedText
                        type="s1_subtitle"
                        className="text-primary-500"
                      >
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView> */}
              </ThemedView>
            </ThemedView>
          </ParallaxScrollView>
          <ThemedView className="absolute pt-6 pb-10 bottom-0 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
            <Button
              variant="solid"
              size="2xl"
              disabled={loading}
              onPress={() => handleSubmit()}
              className="flex-1 rounded-[12px] mx-1"
            >
              <ThemedText type="s2_subtitle" className="text-white text-center">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  "Confirm Order"
                )}
              </ThemedText>
            </Button>
          </ThemedView>
        </>
      )}
    </Formik>
  );
}
