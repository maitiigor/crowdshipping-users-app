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
import { usePost } from "@/lib/api";
import {
  Link,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
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
const validationSchema = Yup.object().shape({
  code: Yup.array()
    .of(Yup.string().matches(/^\d$/, "Digit only").required("Required"))
    .length(5, "Enter 5 digits"),
});

export default function SignUpConfirmationCode() {
  // hide the header for this screen
  const navigation = useNavigation();
  const router = useRouter();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60); // countdown state
  const [showModal, setShowModal] = useState(false);
  const { type, email } = useLocalSearchParams(); // password-reset | sign-up
  const toast = useToast();

  const { mutateAsync, error, loading } = usePost<
    any,
    {
      type: string; //sign-up | password-reset
      otp: string;
      email: string;
    }
  >("/auth/verify-otp");
  const {
    mutateAsync: resendMutateAsync,
    error: resendError,
    loading: resendLoading,
  } = usePost<
    any,
    {
      type: string; //sign-up | password-reset
      email: string;
    }
  >("/auth/resend-otp");

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Sign Up
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
        type: type as string,
        otp: values.code.join(""),
        email: email as string,
      });
      console.log("🚀 ~ handleSubmit ~ response:", response)
      showNewToast({
        title: "Success",
        description: "OTP verified successfully!",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      if (type === "password-reset") {
        router.push({
          pathname: "/(onboarding)/reset-password",
          params: { token: response?.data?.token, email: response?.data?.email },
        });
        return;
      }
      setShowModal(true);
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
  const handleResend = async () => {
    try {
      await resendMutateAsync({
        type: type as string,
        email: email as string,
      });
      showNewToast({
        title: "Success",
        description: "OTP resent successfully!",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });

      setSecondsLeft(60);
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Sign up failed";

      showNewToast({
        title: "OTP Resend Failed",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
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
          <ThemedView className=" justify-center items-center">
            <ThemedText type="s1_subtitle" className="mt-5">
              Enter the 5-digit code sent to you at {email}
            </ThemedText>
          </ThemedView>

          <Formik
            initialValues={{ code: ["", "", "", "", ""] }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const code = values.code.join("");
              console.log("Submitting code:", code);
              // Handle form submission logic here (e.g., API call)
              handleSubmit(values);
            }}
          >
            {({ handleSubmit, values, errors, touched, setFieldValue }) => (
              <ThemedView className="mt-5 w-full">
                <HStack space="md" className="h-20" reversed={false}>
                  {Array.from({ length: 5 }).map((_, idx) => (
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
                          returnKeyType={idx === 4 ? "done" : "next"}
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
                  disabled={loading}
                  className="mt-5 rounded-[12px]"
                  onPress={() => handleSubmit()}
                >
                  <ThemedText type="s1_subtitle" className="text-white">
                    {loading ? <ActivityIndicator color="white" /> : "Verify"}
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
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
                <Button
                  disabled={resendLoading}
                  onPress={handleResend}
                  variant="link"
                >
                  <ThemedText
                    type="s1_subtitle"
                    className="text-typography-950"
                  >
                    {resendLoading ? "Resending..." : "Resend"}
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      <ThemedView
        className="absolute left-0 right-0 px-5"
        style={{
          bottom: isKeyboardVisible === true ? 0 : 30,
        }}
      >
        <ThemedText
          type="s1_subtitle"
          className="text-typography-950 text-center"
        >
          You don’t have an account?{" "}
          <Link href="../signup" asChild>
            <ThemedText type="s1_subtitle" className="text-primary-500">
              Sign up{" "}
            </ThemedText>
          </Link>
        </ThemedText>
      </ThemedView>
      {showModal && (
        <>
          <CustomModal
            description="Welcome to Crowdshipping! You're ready to start sending or receiving packages."
            title="Registration Successful!"
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={"/(onboarding)/user-profile-setup"}
            firstBtnText="Update profile"
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
}
