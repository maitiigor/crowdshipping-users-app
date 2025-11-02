import { default as PaystackSvg } from "@/assets/svgs/paystack.svg";
import { default as StripeSvg } from "@/assets/svgs/stripe.svg";
import CustomToast from "@/components/Custom/CustomToast";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { CircleIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import {
  useAuthenticatedPatch,
  useAuthenticatedPost,
  useAuthenticatedQuery,
} from "@/lib/api";
import { IWalletRequestResponse } from "@/types/IWalletRequest";
import { formatCurrency } from "@/utils/helper";
import * as ExpoLinking from "expo-linking";
import { Link, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Linking, TouchableOpacity } from "react-native";
import * as Yup from "yup";
// Payment SDK imports
import { useCountry } from "@/hooks/useCountry";
import { useAppSelector } from "@/store";
import { INotificationsResponse } from "@/types/INotification";
import { IUserProfileResponse } from "@/types/IUserProfile";
import { useStripe } from "@stripe/stripe-react-native";
import { usePaystack } from "react-native-paystack-webview";

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(100, "Minimum withdrawal is 100"),
  paymentType: Yup.string().required("Please select a payment method"),
});

const STRIPE_MERCHANT_IDENTIFIER =
  process.env.EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER;

export default function TopUpScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const stripe = useStripe();
  const { popup } = usePaystack();
  const { countryCode } = useCountry();
  // Get the selected country from Redux
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );
  const currencyCode = selectedCountry?.currencies?.[0];
  const selectedCurrency = currencyCode?.code || "NGN";
  const [currency] = useState(selectedCurrency); //NGN | USD
  const { data: userProfile } = useAuthenticatedQuery<IUserProfileResponse>(
    ["me"],
    "/user/profile"
  );
  const { refetch: refetchNotifications } = useAuthenticatedQuery<
    INotificationsResponse | undefined
  >(["notifications"], "/notification");
  const { data, refetch } = useAuthenticatedQuery<
    IWalletRequestResponse | undefined
  >(["wallet"], "/wallet/fetch");

  const { mutateAsync, loading, error } = useAuthenticatedPost<
    any,
    {
      amount: number;
      paymentType: string; //paystack | stripe
    }
  >("/wallet/initiate-funding");

  const stripeReturnUrl = React.useMemo(
    () => ExpoLinking.createURL("/payment-logs/top-up"),
    []
  );

  const { mutateAsync: mutateVerifyTopUp, loading: loadingVerifyTopUp } =
    useAuthenticatedPatch<
      any,
      {
        amountToPay: number;
        paymentType: string; //paystack | stripe
        currency: string;
        trxReference: string;
        paymentIntentId?: string;
      }
    >("/wallet/verify-funding");

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Top Up
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
  }, [navigation, router]);

  const paymentTypes = [
    { id: 1, name: "Paystack", value: "paystack", Icon: PaystackSvg },
    { id: 2, name: "Stripe", value: "stripe", Icon: StripeSvg },
  ];

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

  const handleStripePayment = async (
    clientSecret: string,
    amountToPay: number,
    reference: string,
    paymentIntentId: string
  ) => {
    try {
      // Initialize payment sheet
      const paymentSheetConfig: Parameters<typeof stripe.initPaymentSheet>[0] =
        {
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: "Crowdshipping",
          returnURL: stripeReturnUrl, // Deep link for redirect payment methods
          defaultBillingDetails: {
            name: userProfile?.data.fullName || "Customer Name", // You might want to get this from user data
          },
          style: "automatic",
          googlePay: {
            merchantCountryCode: "NG",
            testEnv: true, // Set to false for production
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

      // Present payment sheet
      const { error: presentError } = await stripe.presentPaymentSheet();

      if (presentError) {
        if (presentError.code === "Canceled") {
          showNewToast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process",
            icon: HelpCircleIcon,
            action: "info",
            variant: "solid",
          });
          return;
        }
        throw new Error(presentError.message);
      }

      // Payment successful, verify with backend
      await verifyPayment(amountToPay, "stripe", reference, paymentIntentId);
    } catch (error: any) {
      console.log("🚀 ~ handleStripePayment ~ error:", error);
      showNewToast({
        title: "Payment Failed",
        description: error.message || "Failed to process Stripe payment",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };

  const launchPaystackCheckout = ({
    accessCode,
    reference,
    amountToPay,
    redirectUrl,
  }: {
    accessCode?: string;
    reference: string;
    amountToPay: number;
    redirectUrl?: string;
  }) => {
    if (!popup?.checkout && !popup?.newTransaction) {
      showNewToast({
        title: "Payment Unavailable",
        description: "Unable to launch Paystack checkout right now.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
      return;
    }

    const customerEmail = userProfile?.data.email;
    if (!customerEmail) {
      showNewToast({
        title: "Missing Email",
        description:
          "We couldn't find your email address. Please update your profile before topping up.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
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
            variable_name: "top_up_reference",
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
        verifyPayment(amountInNaira, "paystack", resolvedReference);
      },
      onCancel: () => {
        showNewToast({
          title: "Payment Cancelled",
          description: "You cancelled the payment process",
          icon: HelpCircleIcon,
          action: "info",
          variant: "solid",
        });
      },
      onError: (err: { message?: string }) => {
        showNewToast({
          title: "Payment Failed",
          description:
            err?.message || "Unable to complete Paystack payment at the moment",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
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
      return;
    }

    if (accessCode) {
      paystackRequest.access_code = accessCode;
    }

    try {
      launchMethod(paystackRequest);
    } catch (err: any) {
      console.error("Paystack checkout failed", err);
      showNewToast({
        title: "Unable to start Paystack",
        description:
          err?.message ||
          "We couldn't start the Paystack checkout. Please try again.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });

      if (redirectUrl) {
        Linking.openURL(redirectUrl);
      }
    }
  };

  const verifyPayment = async (
    amountToPay: number,
    paymentType: string,
    reference: string,
    paymentIntentId?: string
  ) => {
    console.log("🚀 ~ verifyPayment ~ reference:", reference);
    console.log("🚀 ~ verifyPayment ~ paymentType:", paymentType);
    console.log("🚀 ~ verifyPayment ~ amountToPay:", amountToPay);
    try {
      await mutateVerifyTopUp({
        amountToPay: amountToPay,
        paymentType: paymentType,
        currency: currency,
        trxReference: reference,
        paymentIntentId: paymentIntentId,
      });

      showNewToast({
        title: "Success",
        description: "Top-up completed successfully!",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });

      // Refresh wallet data
      refetch();
      refetchNotifications();

      // Navigate back or to success screen
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      console.log("🚀 ~ verifyPayment ~ error:", error);
      showNewToast({
        title: "Verification Failed",
        description: error?.message || "Failed to verify payment",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };

  const handleInitiateTopUp = async (values: {
    amount: number;
    paymentType: string;
  }) => {
    try {
      const response = await mutateAsync({
        amount: values.amount,
        paymentType: values.paymentType,
      });

      console.log("🚀 ~ handleInitiateTopUp ~ response:", response);

      if (response?.code === 200) {
        const { data } = response;

        if (values.paymentType === "paystack") {
          // Handle Paystack payment
          if (data.accessCode) {
            launchPaystackCheckout({
              accessCode: data.accessCode,
              reference: data.reference,
              amountToPay: data.amountToPay,
              redirectUrl: data.redirectUrl,
            });
          } else if (data.redirectUrl) {
            // Fallback to opening hosted page if inline checkout fails
            Linking.openURL(data.redirectUrl);
          }
        } else if (values.paymentType === "stripe") {
          // Handle Stripe payment
          await handleStripePayment(
            data.clientSecret,
            data.amountToPay,
            data.reference,
            data.paymentIntentId
          );
        }
      }
    } catch (e: any) {
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Top-Up Request failed";

      showNewToast({
        title: "Top-Up Request Failed",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
    >
      <ThemedView className="flex-1">
        <ThemedView className="flex-1 gap-3  pb-40 mt-3">
          <ThemedView className="flex justify-center items-center">
            <ThemedView className="p-5  w-full justify-center items-center rounded-xl h-[100px] bg-primary-500">
              <ThemedText type="h3_header" className="text-white">
                {formatCurrency(
                  data?.data.wallet.availableBalance,
                  selectedCurrency,
                  `en-${countryCode}`
                )}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView className="flex w-full">
            <Formik
              initialValues={{
                amount: "",
                paymentType: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                  amount: Number(values.amount),
                };
                console.log("Form submitted:", payload);
                handleInitiateTopUp(payload);
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
                        placeholder="Min. N5000"
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
                        className="text-error-500 mb-4"
                      >
                        {errors.amount}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedText type="s1_subtitle">Select Card</ThemedText>
                  <ThemedView className="mt-5 border p-3 rounded-xl border-typography-100">
                    <RadioGroup
                      value={values.paymentType}
                      onChange={(isSelected) =>
                        setFieldValue("paymentType", isSelected)
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
                                  <ThemedText type="b2_body" className="">
                                    {name}
                                  </ThemedText>
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
                    <ThemedView className="mt-5">
                      <Link href="/(tabs)/payment-logs/add-card" asChild>
                        <ThemedText
                          type="b2_body"
                          className="text-primary-500 text-right"
                        >
                          + Update Bank Account
                        </ThemedText>
                      </Link>
                    </ThemedView>
                  </ThemedView>
                  <Button
                    variant="solid"
                    size="2xl"
                    disabled={loading || loadingVerifyTopUp}
                    className="mt-5 rounded-[12px]"
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText type="s1_subtitle" className="text-white">
                      {loading || loadingVerifyTopUp ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        "Top Up"
                      )}
                    </ThemedText>
                  </Button>
                </ThemedView>
              )}
            </Formik>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
