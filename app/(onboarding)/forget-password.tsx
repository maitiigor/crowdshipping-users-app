import InputLabelText from "@/components/Custom/InputLabelText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Link, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
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
        backgroundColor: "#FFFFFF",
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

  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
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
              router.push("/confirmation-code");
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
                  <ThemedText type="b4_body" className="text-error-500 mb-4">
                    {errors.email}
                  </ThemedText>
                )}

                <Button
                  variant="solid"
                  size="2xl"
                  className="mt-5 rounded-[12px]"
                  onPress={() => handleSubmit()}
                >
                  <ThemedText type="s1_subtitle" className="text-white">
                    Send
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </Formik>
        </ThemedView>
      </ParallaxScrollView>
      <ThemedView
        className="absolute left-0 bg-white right-0 px-5"
        style={{
          bottom: isKeyboardVisible === true ? 0 : 0,
        }}
      >
        <ThemedText
          type="s1_subtitle"
          className="text-typography-950 py-6 text-center"
        >
          You don’t have an account?{" "}
          <Link href="../signup" asChild>
            <ThemedText type="s1_subtitle" className="text-primary-500">
              Sign up{" "}
            </ThemedText>
          </Link>
        </ThemedText>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
