import InputLabelText from "@/components/Custom/InputLabelText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Link, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const loginWithSocials = [
  {
    provider: "Facebook",
    icon: <Fontisto name="facebook" size={24} color="#3C5A99" />,
  },
  {
    provider: "Google",
    icon: <AntDesign name="google" size={24} color="#EB4335" />,
  },

  {
    provider: "Apple",
    icon: <FontAwesome name="apple" size={24} color="black" />,
  },
];
export default function Login() {
  // hide the header for this screen
  const navigation = useNavigation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  const handleSocialLogin = (provider: any) => {
    console.log("Social login with:", provider);
    // Handle social login logic here (e.g., API call)
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Login
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
        <ThemedView className="flex-1  ">
          <ThemedText type="h4_header" className="mt-5">
            Welcome Back
          </ThemedText>
          <ThemedText type="default" className="pt-2 text-typography-800 ">
            Please sign in to access your Crowdshipping account and manage your
            deliveries.
          </ThemedText>
        </ThemedView>
        <ThemedView className="flex-1 pb-20">
          <Formik
            initialValues={{ email: "", password: "" }}
            // validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Form submitted:", values);
              // Handle form submission logic here (e.g., API call)
              router.push("/(tabs)");
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
              <ThemedView className="flex gap-4">
                <ThemedView>
                  <InputLabelText className="mb-1">
                    Email address
                  </InputLabelText>
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
                </ThemedView>
                <ThemedView>
                  <InputLabelText className="mb-1">Password</InputLabelText>
                  <Input
                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                    size="xl"
                    isInvalid={!!(errors.password && touched.password)}
                  >
                    <InputField
                      className=""
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry={!showPassword}
                    />
                    <InputSlot className="pr-3" onPress={handleState}>
                      <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                  </Input>
                  {errors.password && touched.password && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.password}
                    </ThemedText>
                  )}
                </ThemedView>

                <Button
                  variant="solid"
                  size="2xl"
                  className="mt-5 rounded-[12px]"
                  onPress={() => handleSubmit()}
                >
                  <ThemedText type="s1_subtitle" className="text-white">
                    Login
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </Formik>

          <Link href="/(onboarding)/forget-password" asChild>
            <ThemedText
              type="s2_subtitle"
              className="text-primary-500 text-center mt-5"
            >
              Forgot Password?
            </ThemedText>
          </Link>

          <ThemedView className="mt-7">
            {/* Divider */}
            <ThemedView className="flex-row items-center gap-5">
              <ThemedView className="flex-1 border  border-typography-100" />
              <ThemedText>Or</ThemedText>
              <ThemedView className="flex-1 border  border-typography-100" />
            </ThemedView>
            <ThemedView className="mt-4 flex-row gap-4 px-4 justify-center items-center">
              {loginWithSocials.map((social) => (
                <Button
                  key={social.provider}
                  variant="outline"
                  size="3xl"
                  className="flex-row border-typography-300 w-1/3 items-center rounded-lg justify-center gap-2 mb-2"
                  onPress={() => handleSocialLogin(social.provider)}
                >
                  {social.icon}
                </Button>
              ))}
            </ThemedView>
          </ThemedView>
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
          <Link href="/(onboarding)/signup" asChild>
            <ThemedText type="s1_subtitle" className="text-primary-500">
              Sign up{" "}
            </ThemedText>
          </Link>
        </ThemedText>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
