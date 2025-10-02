import { CustomModal } from "@/components/Custom/CustomModal";
import CustomToast from "@/components/Custom/CustomToast";
import DateField from "@/components/Custom/DateField";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import PhoneNumberInput from "@/components/Custom/PhoneNumberInput";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { COUNTRIES } from "@/constants/countries";
import { usePost } from "@/lib/api";
import { formatPhoneForApi, isValidPhone } from "@/lib/phone";
import { useNavigation, useRouter } from "expo-router";
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
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country: Yup.string().required("Country is required"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"])
    .required("Gender is required"),
  dateOfBirth: Yup.date()
    .nullable()
    .max(new Date(), "Date cannot be in future"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
export default function UserProfileSetup() {
  const navigation = useNavigation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const phoneInputRef = useRef<any>(null);
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const toast = useToast();
  const { mutateAsync, error, loading } = usePost<
    any,
    {
      fullName: string;
      phoneNumber: string;
      address: string;
      state: string;
      city: string;
      country: string;
      profilePicUrl: string;
    }
  >("/user/update-profile");
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
            Edit Profile
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
      headerRight: () => <NotificationIcon />,
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
    phoneNumber: string;
    address: string;
    state: string;
    city: string;
    gender: string;
    dateOfBirth: Date | null;
    profilePicUrl: string;
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
        fullName: `${values.firstName} ${values.lastName}`,
        phoneNumber: formattedPhone,
        address: values.address,
        state: values.state,
        city: values.city,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        profilePicUrl: values.profilePicUrl,
      });
      showNewToast({
        title: "Success",
        description: "Profile updated successfully!",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      setShowModal(true);
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Sign up failed";

      showNewToast({
        title: "Profile Update Failed",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };
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
        <ThemedView className="flex-1 pb-20">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              phone_number: "",
              country: "",
              state: "",
              city: "",
              gender: "",
              dateOfBirth: null as Date | null,
              imageUpload: "",
            }}
            // validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Form submitted:", values);
              // Handle form submission logic here (e.g., API call)
              setShowModal(true);
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
              <ThemedView className="flex gap-2">
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
                        onChangeText={handleChange("firstName")}
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
                        onChangeText={handleChange("lastName")}
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
                    value={values.phone_number}
                    onChangeFormattedText={handleChange("phone_number")}
                  />
                  {errors.phone_number && touched.phone_number && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.phone_number}
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedView>
                  <InputLabelText className="mt-2">Country</InputLabelText>
                  <Select
                    selectedValue={values.country}
                    onValueChange={handleChange("country")}
                  >
                    <SelectTrigger
                      size="xl"
                      className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                    >
                      <SelectInput
                        placeholder="Select country"
                        className="flex-1"
                      />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {COUNTRIES.map((c) => (
                          <SelectItem
                            key={c.code}
                            label={c.name}
                            value={c.code}
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  {errors.country && touched.country && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.country}
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedView>
                  <InputLabelText>Gender</InputLabelText>
                  <Select
                    selectedValue={values.gender}
                    onValueChange={handleChange("gender")}
                  >
                    <SelectTrigger
                      size="xl"
                      className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                    >
                      <SelectInput
                        placeholder="Select gender"
                        className="flex-1"
                      />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectItem label="Male" value="male" />
                        <SelectItem label="Female" value="female" />
                        <SelectItem label="Other" value="other" />
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  {errors.gender && touched.gender && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.gender}
                    </ThemedText>
                  )}
                </ThemedView>
                <DateField
                  label="Date of Birth"
                  labelClassName="b2_body"
                  value={values.dateOfBirth as unknown as Date | null}
                  onChange={(d) => setFieldValue("dateOfBirth", d)}
                />
                {errors.dateOfBirth && touched.dateOfBirth && (
                  <ThemedText type="b4_body" className="text-error-500 mb-4">
                    {String(errors.dateOfBirth)}
                  </ThemedText>
                )}

                <Button
                  variant="solid"
                  size="2xl"
                  className="mt-5 rounded-[12px]"
                  onPress={() => handleSubmit()}
                >
                  <ThemedText type="s1_subtitle" className="text-white">
                    Update
                  </ThemedText>
                </Button>
              </ThemedView>
            )}
          </Formik>
        </ThemedView>
      </ParallaxScrollView>

      {showModal && (
        <>
          <CustomModal
            description="Your information has been saved successfully."
            title="Profile Updated"
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={"/(tabs)"}
            firstBtnText="Return to Home"
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
}
