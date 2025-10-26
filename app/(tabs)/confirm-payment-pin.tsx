import { CustomModal } from "@/components/Custom/CustomModal";
import CustomToast from "@/components/Custom/CustomToast";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useCountry } from "@/hooks/useCountry";
import { useAuthenticatedPatch } from "@/lib/api";
import { useAppSelector } from "@/store";
import { paramToString } from "@/utils/helper";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
type PaymentType = "wallet" | "paystack" | "stripe";

const validationSchema = Yup.object().shape({
  code: Yup.array()
    .of(Yup.string().matches(/^\d$/, "Digit only").required("Required"))
    .length(5, "Enter 5 digits"),
});

export default function ConfirmPaymentPin() {
  // hide the header for this screen
  const navigation = useNavigation();
  const {
    amount,
    discountCode,
    responseId,
    reference,
    paymentType,
    amountToPay,
  } = useLocalSearchParams();
  const toast = useToast();

  const responseIdParam = paramToString(responseId);
  const amountParam = paramToString(amount);
  const amountToPayParam = paramToString(amountToPay);
  const discountCodeParam = paramToString(discountCode) ?? "";
  const referenceParam = paramToString(reference);
  const paymentTypeParam = paramToString(paymentType);
  const amountValue = Number(amountToPayParam ?? amountParam ?? 0);
  const [, setIsKeyboardVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(20); // countdown state
  const [showModal, setShowModal] = useState(false);
  const { country, countryCode } = useCountry();
  // Get the selected country from Redux
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );
  const currencyCode = selectedCountry?.currencies?.[0];
  const selectedCurrency = currencyCode?.code || "NGN";
  const [currency] = useState(selectedCurrency || "NGN"); //NGN | USD
  const { mutateAsync, loading, error } = useAuthenticatedPatch<
    any,
    {
      otp: string;
      trxReference: string;
      paymentType: "wallet" | "paystack" | "stripe";
      currency: string;
      amountToPay: number;
      entityType: "booking";
      discountCode: string;
    }
  >(`/trip/verify/bid/payment/${responseIdParam}`);

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

  const isValidPaymentType = (
    value: string | undefined
  ): value is PaymentType =>
    value === "wallet" || value === "paystack" || value === "stripe";

  const handleVerifyPayment = async (otp: string) => {
    const referenceValue = referenceParam;
    const paymentTypeValue = isValidPaymentType(paymentTypeParam)
      ? paymentTypeParam
      : undefined;

    if (!otp || otp.length !== 5) {
      showNewToast({
        title: "Invalid PIN",
        description: "Please enter the 5-digit payment PIN.",
        icon: HelpCircleIcon,
        action: "warning",
        variant: "solid",
      });
      return;
    }

    if (!referenceValue || !paymentTypeValue) {
      showNewToast({
        title: "Missing Details",
        description:
          "Unable to verify this payment. Please restart the payment process.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
      return;
    }

    try {
      await mutateAsync({
        otp,
        trxReference: referenceValue,
        paymentType: paymentTypeValue,
        currency,
        amountToPay: Number.isFinite(amountValue) ? amountValue : 0,
        entityType: "booking",
        discountCode: discountCodeParam,
      });

      Keyboard.dismiss();

      showNewToast({
        title: "Payment Verified",
        description: "Your payment has been confirmed successfully.",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });

      setShowModal(true);
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Failed to verify payment. Please try again.";

      showNewToast({
        title: "Verification Failed",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Confirm Pin
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
              className="p-2 rounded  flex justify-center items-center"
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
    });
  }, [navigation]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () =>
      setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(hideEvent, () =>
      setIsKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // countdown effect
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleResend = () => {
    // TODO: call your resend code API here
    setSecondsLeft(20);
  };

  const insets = useSafeAreaInsets();

  // refs to control focus for each input
  const inputsRef = useRef<any[]>([]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={insets.top}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className=" justify-center items-center mt-20">
            <ThemedText type="default" className="text-typography-500">
              Enter your Pin to confirm payment
            </ThemedText>
          </ThemedView>

          <Formik
            initialValues={{ code: Array(5).fill("") }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const code = values.code.join("");
              handleVerifyPayment(code);
            }}
          >
            {({ handleSubmit, values, errors, touched, setFieldValue }) => {
              const isCodeComplete = values.code.every(
                (digit) => typeof digit === "string" && digit.length === 1
              );
              const lastIndex = values.code.length - 1;

              return (
                <ThemedView className="mt-5 flex-1 w-full">
                  <HStack space="md" className="h-24" reversed={false}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <ThemedView key={idx} className="flex-1">
                        <Input
                          size="xl"
                          className="h-20 w-full border-2  rounded-lg mb-2 "
                          variant="outline"
                          isInvalid={!!(touched.code && errors.code)}
                        >
                          <InputField
                            ref={(el) => {
                              inputsRef.current[idx] = el;
                            }}
                            value={values.code[idx]}
                            onChangeText={(text) => {
                              const next = (text || "")
                                .replace(/\D/g, "")
                                .slice(0, 1);
                              setFieldValue(`code[${idx}]`, next);
                              if (next && idx < lastIndex) {
                                inputsRef.current[idx + 1]?.focus?.();
                              }
                            }}
                            onKeyPress={({ nativeEvent }) => {
                              if (
                                nativeEvent.key === "Backspace" &&
                                !values.code[idx] &&
                                idx > 0
                              ) {
                                inputsRef.current[idx - 1]?.focus?.();
                              }
                            }}
                            placeholder=""
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            autoCapitalize="none"
                            returnKeyType={idx === lastIndex ? "done" : "next"}
                            autoFocus={idx === 0}
                            maxLength={1}
                            className="text-center "
                          />
                        </Input>
                      </ThemedView>
                    ))}
                  </HStack>

                  {touched.code && errors.code && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {Array.isArray(errors.code)
                        ? "Enter 5 digits"
                        : (errors.code as string)}
                    </ThemedText>
                  )}

                  <Button
                    variant="solid"
                    size="2xl"
                    className="mt-5 rounded-[12px]"
                    disabled={!isCodeComplete || loading}
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText type="s1_subtitle" className="text-white">
                      {loading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        "Continue"
                      )}
                    </ThemedText>
                  </Button>
                </ThemedView>
              );
            }}
          </Formik>

          {/* replace the static countdown block */}
          <ThemedView className="pt-5">
            {secondsLeft > 0 ? (
              <ThemedText
                type="s1_subtitle"
                className="text-typography-950  text-center"
              >
                Send code again{" "}
                <ThemedText type="default" className="text-typography-600">
                  00:{String(secondsLeft).padStart(2, "0")}
                </ThemedText>
              </ThemedText>
            ) : (
              <ThemedView className="flex-row items-center justify-center gap-3">
                <ThemedText
                  type="default"
                  className="text-typography-950  text-center"
                >
                  I didn’t receive a code{" "}
                </ThemedText>
                <Button onPress={handleResend} variant="link">
                  <ThemedText
                    type="s1_subtitle"
                    className="text-typography-950"
                  >
                    Resend
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>

      {showModal && (
        <>
          <CustomModal
            description="Your package will be picked up by the courier, please wait a moment"
            title="Booking Successful!"
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={"/(tabs)/payment-receipt"}
            firstBtnText="View Receipt"
            secondBtnLink={"/(tabs)"}
            secondBtnText="Home"
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
}
