import { default as PaystackSvg } from "@/assets/svgs/paystack.svg";
import { default as StripeSvg } from "@/assets/svgs/stripe.svg";
import { default as WalletSvg } from "@/assets/svgs/wallet.svg";
import CustomToast from "@/components/Custom/CustomToast";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { CircleIcon, Icon } from "@/components/ui/icon";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useCountry } from "@/hooks/useCountry";
import { useAuthenticatedPatch, useAuthenticatedQuery } from "@/lib/api";
import { useAppSelector } from "@/store";
import { INotificationsResponse } from "@/types/INotification";
import { IUserProfileResponse } from "@/types/IUserProfile";
import { formatCurrency } from "@/utils/helper";
import { useStripe } from "@stripe/stripe-react-native";
import * as ExpoLinking from "expo-linking";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Linking, TouchableOpacity } from "react-native";
import { usePaystack } from "react-native-paystack-webview";
import * as Yup from "yup";

const resolveParamValue = (
  value: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const parseParamToNumber = (value: string | string[] | undefined): number => {
  const resolvedValue = resolveParamValue(value);
  if (
    resolvedValue === undefined ||
    resolvedValue === null ||
    resolvedValue === ""
  ) {
    return 0;
  }

  const parsed = Number.parseFloat(resolvedValue);
  return Number.isFinite(parsed) ? parsed : 0;
};

const validationSchema = Yup.object().shape({
  paymentType: Yup.string().required("Please select a payment method"),
});

const paymentTypes = [
  { id: 1, name: "Wallet", value: "wallet", Icon: WalletSvg },
  { id: 2, name: "Paystack", value: "paystack", Icon: PaystackSvg },
  { id: 3, name: "Stripe", value: "stripe", Icon: StripeSvg },
];

const STRIPE_MERCHANT_IDENTIFIER =
  process.env.EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER;

type PaymentType = "wallet" | "paystack" | "stripe";

export default function ChoosePaymentType() {
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const stripe = useStripe();
  const { popup } = usePaystack();
  const {
    amount,
    discountCode,
    responseId,
    originalAmount,
    discountAmount,
    discountPercentage,
  } = useLocalSearchParams();
  const { data: userProfile } = useAuthenticatedQuery<IUserProfileResponse>(
    ["me"],
    "/user/profile"
  );
  const { refetch: refetchNotifications } = useAuthenticatedQuery<
    INotificationsResponse | undefined
  >(["notifications"], "/notification");
  const { country, countryCode } = useCountry();
  // Get the selected country from Redux
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );
  const currency = selectedCountry?.currencies?.[0];
  const selectedCurrency = currency?.code || "NGN";
  const { mutateAsync, error } = useAuthenticatedPatch<
    any,
    {
      paymentType: PaymentType;
      discountCode: string | null;
      amount: number;
      tax: number;
      charge: number;
      total: number;
    }
  >(`/trip/initiate/bid/payment/${responseId}`);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const {
    amountNumber,
    originalAmountNumber,
    discountAmountNumber,
    discountPercentageNumber,
    hasDiscount,
  } = useMemo(() => {
    const originalValue = parseParamToNumber(originalAmount);
    const amountValue = parseParamToNumber(amount);
    const discountAmountValue = parseParamToNumber(discountAmount);
    const discountPercentageValue = parseParamToNumber(discountPercentage);

    // Determine the original amount (before discount)
    const normalizedOriginal =
      originalValue > 0 ? originalValue : amountValue > 0 ? amountValue : 0;

    // Calculate discount amount
    let computedDiscountAmount =
      discountAmountValue > 0 ? discountAmountValue : 0;

    // If discount wasn't passed but we have percentage and original, calculate it
    if (
      computedDiscountAmount <= 0 &&
      discountPercentageValue > 0 &&
      normalizedOriginal > 0
    ) {
      computedDiscountAmount =
        (normalizedOriginal * discountPercentageValue) / 100;
    }

    // Ensure discount doesn't exceed original amount
    computedDiscountAmount = Math.min(
      computedDiscountAmount,
      normalizedOriginal
    );

    // Calculate discount percentage if not provided
    const computedDiscountPercentage =
      discountPercentageValue > 0
        ? discountPercentageValue
        : normalizedOriginal > 0 && computedDiscountAmount > 0
        ? (computedDiscountAmount / normalizedOriginal) * 100
        : 0;

    // Determine if we have a valid discount
    const hasAppliedDiscount =
      normalizedOriginal > 0 &&
      computedDiscountAmount > 0 &&
      computedDiscountPercentage > 0;

    // Calculate final amount to pay (original - discount)
    const finalAmount = hasAppliedDiscount
      ? Math.max(normalizedOriginal - computedDiscountAmount, 0)
      : amountValue > 0
      ? amountValue
      : normalizedOriginal;

    return {
      amountNumber: Math.max(finalAmount, 0),
      originalAmountNumber: normalizedOriginal,
      discountAmountNumber: hasAppliedDiscount
        ? Math.min(computedDiscountAmount, normalizedOriginal)
        : 0,
      discountPercentageNumber: hasAppliedDiscount
        ? computedDiscountPercentage
        : 0,
      hasDiscount: hasAppliedDiscount,
    };
  }, [amount, originalAmount, discountAmount, discountPercentage]);

  const discountCodeValue = (() => {
    const resolved = resolveParamValue(discountCode);
    return typeof resolved === "string" ? resolved.trim() : "";
  })();
  const responseIdValue = (() => {
    const resolved = resolveParamValue(responseId);
    return resolved ? resolved.toString() : "";
  })();

  const formatPercentageValue = (value: number) =>
    Number.isFinite(value) ? parseFloat(value.toFixed(2)).toString() : "0";
  const stripeReturnUrl = useMemo(
    () => ExpoLinking.createURL("/(tabs)/choose-payment-type"),
    []
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <ThemedText type="s1_subtitle" className="text-center">
          Payment
        </ThemedText>
      ),
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 },
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "#FFFFFF",
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
    const toastId = Math.random().toString();
    toast.show({
      id: toastId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => (
        <CustomToast
          uniqueToastId={`toast-${id}`}
          icon={icon}
          action={action}
          title={title}
          variant={variant}
          description={description}
        />
      ),
    });
  };

  const navigateToConfirmPayment = ({
    reference,
    amountToPay,
    paymentType,
    paymentIntentId,
  }: {
    reference?: string;
    amountToPay: number;
    paymentType: PaymentType;
    paymentIntentId?: string;
  }) => {
    if (!reference) {
      showNewToast({
        title: "Missing Reference",
        description: "Unable to continue without a transaction reference.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
      return;
    }

    router.push({
      pathname: "/(tabs)/confirm-payment-pin",
      params: {
        responseId: responseIdValue,
        amount: String(
          Number.isFinite(amountToPay) ? amountToPay : amountNumber
        ),
        amountToPay: String(
          Number.isFinite(amountToPay) ? amountToPay : amountNumber
        ),
        discountCode: discountCodeValue,
        reference,
        paymentType,
        paymentIntentId: paymentIntentId ?? "",
        originalAmount:
          hasDiscount && originalAmountNumber > 0
            ? originalAmountNumber.toString()
            : originalAmountNumber > 0
            ? originalAmountNumber.toString()
            : "",
        discountAmount:
          hasDiscount && discountAmountNumber > 0
            ? discountAmountNumber.toString()
            : "",
        discountPercentage:
          hasDiscount && discountPercentageNumber > 0
            ? discountPercentageNumber.toString()
            : "",
      },
    });
  };

  const handleStripePayment = async ({
    clientSecret,
    amountToPay,
    reference,
    paymentIntentId,
    onComplete,
  }: {
    clientSecret?: string;
    amountToPay: number;
    reference?: string;
    paymentIntentId?: string;
    onComplete?: () => void;
  }) => {
    try {
      if (!clientSecret || !reference) {
        throw new Error("Invalid Stripe payment details received");
      }

      const paymentSheetConfig: Parameters<typeof stripe.initPaymentSheet>[0] =
        {
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: "Crowdshipping",
          returnURL: stripeReturnUrl,
          defaultBillingDetails: {
            name: userProfile?.data.fullName || "Crowdshipping Customer",
          },
          style: "automatic",
          googlePay: {
            merchantCountryCode: "NG",
            testEnv: true,
          },
          applePay: STRIPE_MERCHANT_IDENTIFIER
            ? {
                merchantCountryCode: "NG",
              }
            : undefined,
        };

      const { error: initError } = await stripe.initPaymentSheet(
        paymentSheetConfig
      );

      if (initError) {
        throw new Error(initError.message);
      }

      const { error: presentError } = await stripe.presentPaymentSheet();

      if (presentError) {
        if (presentError.code === "Canceled") {
          showNewToast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
            icon: HelpCircleIcon,
            action: "info",
            variant: "solid",
          });
          return;
        }

        throw new Error(presentError.message);
      }

      showNewToast({
        title: "Payment Successful",
        description: "Enter your PIN to complete this payment.",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });

      navigateToConfirmPayment({
        reference,
        amountToPay,
        paymentType: "stripe",
        paymentIntentId,
      });
    } catch (err: any) {
      showNewToast({
        title: "Payment Failed",
        description:
          err?.message || "Failed to process Stripe payment. Please try again.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    } finally {
      onComplete?.();
    }
  };

  const launchPaystackCheckout = ({
    accessCode,
    reference,
    amountToPay,
    redirectUrl,
    onFlowComplete,
  }: {
    accessCode?: string;
    reference?: string;
    amountToPay: number;
    redirectUrl?: string;
    onFlowComplete?: () => void;
  }) => {
    if (!reference) {
      showNewToast({
        title: "Payment Unavailable",
        description: "Missing transaction reference for Paystack checkout.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
      onFlowComplete?.();
      return;
    }

    if (!popup?.checkout && !popup?.newTransaction) {
      showNewToast({
        title: "Payment Unavailable",
        description: "Unable to launch Paystack checkout right now.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
      onFlowComplete?.();
      return;
    }

    const customerEmail = userProfile?.data.email;
    if (!customerEmail) {
      showNewToast({
        title: "Missing Email",
        description:
          "We need your email address before you can pay with Paystack.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
      onFlowComplete?.();
      return;
    }

    const amountInNaira = Math.round(amountToPay);

    const paystackRequest: any = {
      email: customerEmail,
      amount: amountInNaira,
      reference,
      metadata: {
        custom_fields: [
          {
            display_name: userProfile?.data.fullName || "Crowdshipping User",
            variable_name: "booking_payment_reference",
            value: reference,
          },
        ],
        accessCode,
        redirectUrl,
      },
      onSuccess: (response: {
        reference?: string;
        transaction?: string;
        status?: string;
      }) => {
        const resolvedReference =
          response?.reference || response?.transaction || reference;

        showNewToast({
          title: "Payment Successful",
          description: "Enter your PIN to complete this payment.",
          icon: CircleCheckIcon,
          action: "success",
          variant: "solid",
        });

        navigateToConfirmPayment({
          reference: resolvedReference,
          amountToPay,
          paymentType: "paystack",
        });
        onFlowComplete?.();
      },
      onCancel: () => {
        showNewToast({
          title: "Payment Cancelled",
          description: "You cancelled the payment process.",
          icon: HelpCircleIcon,
          action: "info",
          variant: "solid",
        });
        onFlowComplete?.();
      },
      onError: (err: { message?: string }) => {
        showNewToast({
          title: "Payment Failed",
          description:
            err?.message ||
            "Unable to complete Paystack payment at the moment.",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        onFlowComplete?.();
      },
    };

    const launchMethod =
      accessCode && popup?.newTransaction
        ? popup.newTransaction
        : popup.checkout;

    if (!launchMethod) {
      showNewToast({
        title: "Payment Unavailable",
        description: "Unable to start Paystack checkout right now.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
      onFlowComplete?.();
      return;
    }

    if (accessCode) {
      paystackRequest.access_code = accessCode;
    }

    try {
      launchMethod(paystackRequest);
    } catch (err: any) {
      showNewToast({
        title: "Unable to start Paystack",
        description:
          err?.message ||
          "We couldn't start the Paystack checkout. Please try again.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
      onFlowComplete?.();

      if (redirectUrl) {
        Linking.openURL(redirectUrl);
      }
    }
  };

  const handleInitiatePayment = async (selectedPaymentType: PaymentType) => {
    if (!selectedPaymentType) {
      showNewToast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        icon: HelpCircleIcon,
        action: "warning",
        variant: "solid",
      });
      return;
    }

    if (!amountNumber || Number.isNaN(amountNumber)) {
      showNewToast({
        title: "Invalid Amount",
        description: "Unable to determine the payment amount for this trip.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
      return;
    }

    try {
      setIsProcessingPayment(true);

      const response = await mutateAsync({
        paymentType: selectedPaymentType,
        discountCode: discountCodeValue ? discountCodeValue : null,
        amount: amountNumber,
        tax: 0,
        charge: 0,
        total: amountNumber,
      });

      const responseData = response?.data ?? {};

      if (selectedPaymentType === "wallet") {
        showNewToast({
          title: "Payment Initiated",
          description: "Enter your PIN to confirm this wallet payment.",
          icon: CircleCheckIcon,
          action: "success",
          variant: "solid",
        });

        navigateToConfirmPayment({
          reference: responseData.reference || responseData.trxReference,
          amountToPay: responseData.amountToPay ?? amountNumber,
          paymentType: "wallet",
        });
        setIsProcessingPayment(false);
        return;
      }

      if (selectedPaymentType === "paystack") {
        launchPaystackCheckout({
          accessCode: responseData.accessCode,
          reference: responseData.reference,
          amountToPay: responseData.amountToPay ?? amountNumber,
          redirectUrl: responseData.redirectUrl,
          onFlowComplete: () => setIsProcessingPayment(false),
        });
        return;
      }

      if (selectedPaymentType === "stripe") {
        await handleStripePayment({
          clientSecret: responseData.clientSecret,
          amountToPay: responseData.amountToPay ?? amountNumber,
          reference: responseData.reference,
          paymentIntentId: responseData.paymentIntentId,
          onComplete: () => setIsProcessingPayment(false),
        });
        return;
      }
      refetchNotifications();
    } catch (err: any) {
      setIsProcessingPayment(false);

      const message =
        err?.data?.message ||
        err?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Failed to initiate payment. Please try again.";

      showNewToast({
        title: "Payment Initiation Failed",
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
        paymentType: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(formValues) =>
        handleInitiatePayment(formValues.paymentType as PaymentType)
      }
    >
      {({ values, setFieldValue, handleSubmit }) => (
        <>
          <ParallaxScrollView
            headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
          >
            <ThemedView className="flex-1">
              <ThemedView className="flex gap-6 pb-24">
                <ThemedView className="flex items-center mt-6">
                  <ThemedView className="p-5 w-full justify-center items-center rounded-xl bg-primary-500 gap-1">
                    {hasDiscount && originalAmountNumber > 0 && (
                      <ThemedText
                        type="b3_body"
                        className="text-white/70 line-through"
                      >
                        {formatCurrency(originalAmountNumber, selectedCurrency, `en-${countryCode}`)}
                      </ThemedText>
                    )}
                    <ThemedText type="h3_header" className="text-white">
                      {formatCurrency(
                        Number.isFinite(amountNumber) ? amountNumber : 0,
                        selectedCurrency,
                        `en-${countryCode}`
                      )}
                    </ThemedText>
                    <ThemedText type="b3_body" className="text-white/80 mt-1">
                      Total amount payable
                    </ThemedText>
                    {hasDiscount && (
                      <ThemedText type="b4_body" className="text-white/90 mt-1">
                        You save{" "}
                        {formatCurrency(discountAmountNumber, selectedCurrency, `en-${countryCode}`)}{" "}
                        (-
                        {formatPercentageValue(discountPercentageNumber)}%)
                      </ThemedText>
                    )}
                  </ThemedView>
                </ThemedView>

                {hasDiscount && (
                  <ThemedView className="mx-5 border border-success-100 bg-success-50 p-4 rounded-2xl">
                    <ThemedView className="flex-row justify-between">
                      <ThemedText type="b2_body" className="text-success-600">
                        Discount
                        {discountCodeValue ? ` (${discountCodeValue})` : ""}
                      </ThemedText>
                      <ThemedText type="b2_body" className="text-success-600">
                        -{formatCurrency(discountAmountNumber, selectedCurrency, `en-${countryCode}`)}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between mt-2">
                      <ThemedText
                        type="b2_body"
                        className="text-typography-800"
                      >
                        Discount rate
                      </ThemedText>
                      <ThemedText
                        type="b2_body"
                        className="text-typography-800"
                      >
                        -{formatPercentageValue(discountPercentageNumber)}%
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between mt-2 pt-2 border-t border-success-100">
                      <ThemedText
                        type="b2_body"
                        className="text-typography-800"
                      >
                        Amount payable
                      </ThemedText>
                      <ThemedText
                        type="b2_body"
                        className="text-typography-950"
                      >
                        {formatCurrency(
                          amountNumber,
                          selectedCurrency,
                          `en-${countryCode}`
                        )}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                )}

                <ThemedView>
                  <ThemedText type="s1_subtitle">Select Payment</ThemedText>
                  <ThemedView className="mt-5 border p-3 rounded-xl border-typography-100">
                    <RadioGroup
                      value={values.paymentType}
                      onChange={(selected) =>
                        setFieldValue("paymentType", selected)
                      }
                    >
                      <VStack space="md">
                        {paymentTypes.map(
                          ({ id, name, value, Icon: SvgIcon }) => (
                            <Radio
                              size="lg"
                              key={id}
                              className="flex-row justify-between items-center p-2"
                              value={value}
                            >
                              <ThemedView className="flex-row items-center gap-5">
                                <SvgIcon
                                  width={36}
                                  height={36}
                                  color={"#0288d1"}
                                />
                                <RadioLabel>
                                  <ThemedText type="b2_body">{name}</ThemedText>
                                </RadioLabel>
                              </ThemedView>
                              <RadioIndicator>
                                <RadioIcon as={CircleIcon} />
                              </RadioIndicator>
                            </Radio>
                          )
                        )}
                      </VStack>
                    </RadioGroup>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ParallaxScrollView>
          <ThemedView className="absolute pt-6 pb-10 bottom-0 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
            <Button
              variant="solid"
              size="2xl"
              disabled={
                !values.paymentType || isProcessingPayment || amountNumber <= 0
              }
              onPress={() => handleSubmit()}
              className="flex-1 rounded-[12px] mx-1"
            >
              <ThemedText type="s2_subtitle" className="text-white text-center">
                {isProcessingPayment ? (
                  <ActivityIndicator color="white" />
                ) : (
                  "Continue"
                )}
              </ThemedText>
            </Button>
          </ThemedView>
        </>
      )}
    </Formik>
  );
}
