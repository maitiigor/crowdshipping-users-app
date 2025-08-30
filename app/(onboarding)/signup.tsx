import InputLabelText from "@/components/Custom/InputLabelText";
import PhoneNumberInput from "@/components/Custom/PhoneNumberInput";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import Entypo from "@expo/vector-icons/Entypo";
import { Link, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
import { loginWithSocials } from "./login";
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
export default function Signup() {
  const navigation = useNavigation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const phoneInputRef = useRef<any>(null);
  const [phone, setPhone] = useState("");
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
      headerTitle: "Signup",
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 0 }}
        >
          <Entypo name="chevron-left" size={34} color="#131927" />
        </TouchableOpacity>
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
          <ThemedText type="h4_header" className="my-2">
            Create An Account
          </ThemedText>
        </ThemedView>
        <ThemedView className="flex-1 pb-20">
          <Formik
            initialValues={{
              fullName: "",
              email: "",
              phone: "",
              password: "",
              confirmPassword: "",
            }}
            // validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Form submitted:", values);
              // Handle form submission logic here (e.g., API call)
              router.push("/signup-confirm-code");
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
                  <InputLabelText className="">Your Full Name</InputLabelText>
                  <Input
                    size="xl"
                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                    variant="outline"
                    isInvalid={!!(errors.email && touched.email)}
                  >
                    <InputField
                      className=""
                      placeholder="Input your name"
                      value={values.fullName}
                      onChangeText={handleChange("fullName")}
                      onBlur={handleBlur("fullName")}
                      keyboardType="default"
                      autoCapitalize="none"
                    />
                  </Input>
                  {errors.fullName && touched.fullName && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.fullName}
                    </ThemedText>
                  )}
                </ThemedView>
                <ThemedView>
                  <InputLabelText className="">Email address</InputLabelText>
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
                  <InputLabelText className="">Phone Number</InputLabelText>
                  <PhoneNumberInput
                    ref={phoneInputRef}
                    value={phone}
                    onChangeFormattedText={(text: string) => setPhone(text)}
                  />
                  {errors.phone && touched.phone && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.phone}
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedView>
                  <InputLabelText className="mt-2">Password</InputLabelText>
                  <Input
                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                    size="xl"
                    isInvalid={!!(errors.password && touched.password)}
                  >
                    <InputField
                      className=""
                      type={showPassword ? "text" : "password"}
                      placeholder="Input your password"
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
                <ThemedView>
                  <InputLabelText className="">Confirm Password</InputLabelText>
                  <Input
                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                    size="xl"
                    isInvalid={
                      !!(errors.confirmPassword && touched.confirmPassword)
                    }
                  >
                    <InputField
                      className=""
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={values.confirmPassword}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      secureTextEntry={!showPassword}
                    />
                    <InputSlot className="pr-3" onPress={handleState}>
                      <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                  </Input>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.confirmPassword}
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
                    Sign up
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </Formik>

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
          Already have an account?{" "}
          <Link href="../login" asChild>
            <ThemedText type="s1_subtitle" className="text-primary-500">
              Sign in{" "}
            </ThemedText>
          </Link>
        </ThemedText>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
