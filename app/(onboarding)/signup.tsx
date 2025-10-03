import CustomToast from "@/components/Custom/CustomToast";
import InputLabelText from "@/components/Custom/InputLabelText";
import PhoneNumberInput from "@/components/Custom/PhoneNumberInput";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import {
  EyeIcon,
  EyeOffIcon,
  HelpCircleIcon,
  Icon,
} from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { usePost } from "@/lib/api/index";
import { formatPhoneForApi, isValidPhone } from "@/lib/phone";
import { Link, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import { ChevronLeft, CircleCheckIcon, LucideIcon } from "lucide-react-native";
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
import { loginWithSocials } from "./login";
const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name can't be longer than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name can't be longer than 50 characters")
    .required("Last name is required"),
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
  console.log("🚀 ~ Signup ~ phone:", phone);
  const toast = useToast();
  const { mutateAsync, error, loading } = usePost<
    any,
    {
      accountType: string;
      fullName: string;
      email: string;
      phoneNumber: string;
      password: string;
      confirmPassword: string;
    }
  >("/auth/sign-up");
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
            Signup
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

  const handleSignUp = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      // Validate and format phone before submitting
      const phoneApi = phoneInputRef.current as any;
      const preferCallingCode = phoneApi?.state?.code
        ? String(phoneApi.state.code)
        : undefined;
      const valid = isValidPhone(phone || "");
      if (!valid) {
        showNewToast({
          title: "Invalid phone",
          description: "Please enter a valid phone number",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return;
      }
      // API expects: (+<country_code>)<nationalNumber> e.g. (+234)8022908484
      const formattedPhone = formatPhoneForApi(phone, preferCallingCode);
      console.log("🚀 ~ handleSignUp ~ formattedPhone:", formattedPhone);
      await mutateAsync({
        accountType: "user",
        fullName: `${values.firstName.trim()} ${values.lastName.trim()}`,
        email: values.email,
        phoneNumber: formattedPhone,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      showNewToast({
        title: "Success",
        description: "Registered successfully!",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      router.push({
        pathname: "/(onboarding)/signup-confirm-code",
        params: { email: values.email, type: "sign-up" },
      });
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Sign up failed";

      showNewToast({
        title: "Sign Up Failed",
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
      behavior={"padding"}
      keyboardVerticalOffset={insets.top}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1 ">
          <ThemedText type="h4_header" className="my-2">
            Create An Account
          </ThemedText>
        </ThemedView>
        <ThemedView className="flex-1 pb-20">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              phoneNumber: phone,
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Form submitted:", values);
              // Handle form submission logic here (e.g., API call)
              handleSignUp(values);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <ThemedView className="flex gap-4">
                <ThemedView className="flex-row gap-4">
                  <ThemedView className="w-1/2">
                    <InputLabelText className="">First Name</InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.firstName && touched.firstName)}
                    >
                      <InputField
                        className=""
                        placeholder="first name"
                        value={values.firstName}
                        onChangeText={(text) =>
                          setFieldValue("firstName", text.replace(/\s/g, ""))
                        }
                        onBlur={handleBlur("firstName")}
                        keyboardType="default"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.firstName && touched.firstName && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.firstName}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView className="flex-1 w-1/2">
                    <InputLabelText className="">Last Name</InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.lastName && touched.lastName)}
                    >
                      <InputField
                        className=""
                        placeholder="last name"
                        value={values.lastName}
                        onChangeText={(text) =>
                          setFieldValue("lastName", text.replace(/\s/g, ""))
                        }
                        onBlur={handleBlur("lastName")}
                        keyboardType="default"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.lastName && touched.lastName && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.lastName}
                      </ThemedText>
                    )}
                  </ThemedView>
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
                  {errors.phoneNumber && touched.phoneNumber && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.phoneNumber}
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
                    {loading ? <ActivityIndicator color="white" /> : "Sign up"}
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
      <Link
        href="/(onboarding)/login"
        className="absolute left-0 bg-white right-0 px-5 mb-5"
        style={{
          bottom: isKeyboardVisible === true ? 0 : 0,
        }}
        asChild
      >
        <ThemedText
          type="s1_subtitle"
          className="text-typography-950 py-6 text-center"
        >
          You don’t have an account?{" "}
          <ThemedText type="s1_subtitle" className="text-primary-500 pt-6">
            Sign in{" "}
          </ThemedText>
        </ThemedText>
      </Link>
    </KeyboardAvoidingView>
  );
}
