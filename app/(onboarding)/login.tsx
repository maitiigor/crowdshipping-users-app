import CustomToast from "@/components/Custom/CustomToast";
import InputLabelText from "@/components/Custom/InputLabelText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { useToast } from "@/components/ui/toast";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@/lib/api/index";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
const getValidationSchema = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("validation.invalid_email"))
      .required(t("validation.email_required")),
    password: Yup.string()
      .min(6, t("validation.password_min"))
      .required(t("validation.password_required")),
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
  const { t } = useTranslation("login");
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  // Note: Each toast uses its own generated id; no need to persist in state.
  // Optionally prefill the email field when navigating like: /login?email=user@site.com
  const { email } = useLocalSearchParams<{ email?: string | string[] }>();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const backroundTopNav = useThemeColor({}, "background");
  const validationSchema = getValidationSchema(t);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  const { login, error, isLoading } = useAuth();
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

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      await login({
        email,
        password,
      });
      showNewToast({
        title: t("toast.success_title"),
        description: t("toast.success_description"),
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      router.push("/(tabs)");
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        t("toast.default_error");

      showNewToast({
        title: t("toast.failed_title"),
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
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
            {t("header_title")}
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
              onPress={() => router.push("/(onboarding)/welcome")}
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
            {t("welcome_back")}
          </ThemedText>
          <ThemedText type="default" className="pt-2 text-typography-800 ">
            {t("subtitle")}
          </ThemedText>
        </ThemedView>
        <ThemedView className="flex-1 pb-20">
          <Formik
            // Pick the first email if array; fallback to empty string
            initialValues={{
              email: Array.isArray(email) ? email[0] ?? "" : email ?? "",
              password: "",
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Form submitted:", values);
              handleLogin(values);
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
                <ThemedView>
                  <InputLabelText className="mb-1">
                    {t("email_label")}
                  </InputLabelText>
                  <Input
                    size="xl"
                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                    variant="outline"
                    isInvalid={!!(errors.email && touched.email)}
                  >
                    <InputField
                      className=""
                      placeholder={t("email_placeholder")}
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
                </ThemedView>
                <ThemedView>
                  <InputLabelText className="mb-1">
                    {t("password_label")}
                  </InputLabelText>
                  <Input
                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                    size="xl"
                    isInvalid={!!(errors.password && touched.password)}
                  >
                    <InputField
                      className=""
                      type={showPassword ? "text" : "password"}
                      placeholder={t("password_placeholder")}
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
                    <ThemedText
                      lightColor="#FF3B30"
                      type="b4_body"
                      className="text-error-500 mb-4"
                    >
                      {errors.password}
                    </ThemedText>
                  )}
                </ThemedView>

                <Button
                  variant="solid"
                  size="2xl"
                  isDisabled={isLoading}
                  className="mt-5 rounded-[12px]"
                  onPress={() => handleSubmit()}
                >
                  <ThemedText type="s1_subtitle" className="text-white">
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      t("login_button")
                    )}
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
              {t("forgot_password")}
            </ThemedText>
          </Link>

          <ThemedView className="mt-7">
            {/* Divider */}
            <ThemedView className="flex-row items-center gap-5">
              <ThemedView className="flex-1 border  border-typography-100" />
              <ThemedText>{t("or_divider")}</ThemedText>
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
      <Link href="/(onboarding)/signup" asChild>
        <Pressable
          className="absolute left-0 mb-2 bg-white right-0 px-5"
          style={{
            bottom: isKeyboardVisible === true ? 0 : 0,
            backgroundColor: backroundTopNav,
          }}
        >
          <ThemedText
            type="s1_subtitle"
            className="text-typography-950 py-6 text-center"
          >
            {t("no_account")}{" "}
            <ThemedText type="s1_subtitle" className="text-primary-500">
              {t("sign_up_link")}{" "}
            </ThemedText>
          </ThemedText>
        </Pressable>
      </Link>
    </KeyboardAvoidingView>
  );
}
