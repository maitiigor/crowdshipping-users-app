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
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedPatch } from "@/lib/api";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
const validationSchema = Yup.object().shape({
  code: Yup.array()
    .of(Yup.string().matches(/^\d$/, "Digit only").required("Required"))
    .length(6, "Enter 6 digits"),
});

export default function ConfirmPaymentPin() {
  // hide the header for this screen
  const navigation = useNavigation();
  const backroundTopNav = useThemeColor({}, "background");
  const router = useRouter();
  const toast = useToast();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(20); // countdown state
  const [showModal, setShowModal] = useState(false);
  const { fromPage, amount, currency, transferCode, trxReference } =
    useLocalSearchParams();
  const { mutateAsync, loading, error } = useAuthenticatedPatch<
    any,
    {
      otp: string;
      amount: number;
      currency: string;
      trxReference: string;
      transferCode: string;
    }
  >("/wallet/verify-withdrawal");
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
  }, [navigation, backroundTopNav]);

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

  const handleSubmit = async (values: { code: string[] }) => {
    try {
      const response = await mutateAsync({
        otp: values.code.join(""),
        amount: Number(amount),
        currency: String(currency),
        trxReference: String(trxReference),
        transferCode: String(transferCode),
      });
      console.log("🚀 ~ handleSubmit ~ response:", response);
      showNewToast({
        title: "Success",
        description: "OTP verified successfully!",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      router.push({
        pathname: "/(tabs)/payment-logs/main",
      });
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Sign up failed";

      showNewToast({
        title: "OTP Failed",
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
            initialValues={{ code: ["", "", "", "", "", ""] }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const code = values.code.join("");
              console.log("Submitting code:", code);
              handleSubmit(values);
            }}
          >
            {({ handleSubmit, values, errors, touched, setFieldValue }) => (
              <ThemedView className="mt-5 flex-1 w-full">
                <HStack space="md" className="h-24" reversed={false}>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <ThemedView key={idx} className="flex-1">
                      <Input
                        size="xl"
                        className="h-[65px] w-full border-2  rounded-lg mb-2 "
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
                            if (next && idx < 4) {
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
                          returnKeyType={idx === 5 ? "done" : "next"}
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
                  onPress={() => handleSubmit()}
                >
                  <ThemedText type="s1_subtitle" className="text-white">
                    Continue
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </Formik>

          {/* replace the static countdown block */}
          {/* <ThemedView className="pt-5 hidden">
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
          </ThemedView> */}
        </ThemedView>
      </ParallaxScrollView>

      {showModal && (
        <>
          <CustomModal
            description="Your balance will be added your wallet"
            title="Top Up Successful!"
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
