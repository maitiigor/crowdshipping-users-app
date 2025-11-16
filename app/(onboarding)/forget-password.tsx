import CustomToast from "@/components/Custom/CustomToast";
import InputLabelText from "@/components/Custom/InputLabelText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useThemeColor } from "@/hooks/useThemeColor";
import { usePost } from "@/lib/api";
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
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgetPassword() {
  // hide the header for this screen
  const navigation = useNavigation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const backroundTopNav = useThemeColor({}, "background");
  const { mutateAsync, error, loading } = usePost<
    any,
    {
      email: string;
    }
  >("/auth/forgot-password");
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Forget Password
          </ThemedText>
        );
      },
      headerTitleAlign: "center",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: backroundTopNav,
        elevation: 0, // Android
        shadowOpacity: 0, // iOS
        shadowColor: "transparent", // iOS
        borderBottomWidth: 0,
      },
      headerTitleStyle: { fontSize: 20 }, // Increased font size
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

  const insets = useSafeAreaInsets();
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

  const handleSubmit = async (values: { email: string }) => {
    try {
      await mutateAsync({
        email: values.email as string,
      });
      showNewToast({
        title: "Success",
        description: "Email sent successfully!",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });

      router.push({
        pathname: "/(onboarding)/signup-confirm-code",
        params: { email: values.email, type: "password-reset" },
      });
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Sign up failed";

      showNewToast({
        title: "Forgot Password Failed",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };
  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: backroundTopNav }}
      behavior={"padding"}
      keyboardVerticalOffset={insets.top}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1  justify-center items-center">
          <Image
            alt="Lock"
            source={require("@/assets/images/onboarding/lock.png")}
            className="w-auto h-[100px]"
            resizeMode="contain"
          />
          <ThemedText type="h4_header" className="mt-5 text-center">
            Forgot your password?
          </ThemedText>
          <ThemedText
            type="default"
            className="pt-2 text-typography-800 text-center"
          >
            Enter your registered email below to receive password reset
            instruction
          </ThemedText>
        </ThemedView>
        <ThemedView className="flex-1 pb-20">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Form submitted:", values);
              // Handle form submission logic here (e.g., API call)
              handleSubmit(values);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <ThemedView className="mt-5">
                <InputLabelText className="mb-2">Email address</InputLabelText>
                <Input
                  size="xl"
                  className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                  variant="outline"
                  isInvalid={!!(errors.email && touched.email)}
                >
                  <InputField
                    className=""
                    placeholder="user@gmail.com"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Input>
                {errors.email && touched.email && (
                  <ThemedText
                    lightColor="#FF3B30"
                    type="b4_body"
                    className="text-error-500 mb-4"
                  >
                    {errors.email}
                  </ThemedText>
                )}

                <Button
                  variant="solid"
                  size="2xl"
                  className="mt-5 rounded-[12px]"
                  disabled={loading}
                  onPress={() => handleSubmit()}
                >
                  <ThemedText type="s1_subtitle" className="text-white">
                    {loading ? <ActivityIndicator color="white" /> : "Send"}
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </Formik>
        </ThemedView>
      </ParallaxScrollView>
      <Link
        href="../signup"
        className="absolute left-0 bg-white right-0 px-5 mb-5"
        style={{
          bottom: isKeyboardVisible === true ? 0 : 0,
          backgroundColor: backroundTopNav,
        }}
        asChild
      >
        <ThemedText
          type="s1_subtitle"
          className="text-typography-950 py-6 text-center"
        >
          You don’t have an account?{" "}
          <ThemedText type="s1_subtitle" className="text-primary-500 pt-6">
            Sign up{" "}
          </ThemedText>
        </ThemedText>
      </Link>
    </KeyboardAvoidingView>
  );
}
