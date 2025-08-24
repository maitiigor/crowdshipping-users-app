import { CustomModal } from "@/components/Custom/CustomModal";
import DateField from "@/components/Custom/DateField";
import ImageUploader from "@/components/Custom/ImageUploader";
import PhoneNumberInput from "@/components/Custom/PhoneNumberInput";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/ui/icon";
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
import { COUNTRIES } from "@/constants/countries";
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
      headerTitleStyle: { fontSize: 20, fontWeight: "bold" }, // Increased font size
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 0 }}
        >
          <Entypo name="chevron-left" size={34} color="#E75B3B" />
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
              phone_number: "",
              country: "",
              gender: "",
              dateOfBirth: null as Date | null,
              imageUpload: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Form submitted:", values);
              // Handle form submission logic here (e.g., API call)
              router.push("/home");
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
                <ThemedText className="mt-3">Your Full Name</ThemedText>
                <Input
                  size="xl"
                  className="h-[55px] rounded-lg mb-2 bg-primary-0 px-2"
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
                <ThemedText className="">Email address</ThemedText>
                <Input
                  size="xl"
                  className="h-[55px] rounded-lg mb-2 bg-primary-0 px-2"
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
                <ThemedText className="">Phone Number</ThemedText>
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

                <ThemedText className="mt-2">Country</ThemedText>
                <Select
                  selectedValue={values.country}
                  onValueChange={handleChange("country")}
                >
                  <SelectTrigger
                    size="xl"
                    className="h-[55px] rounded-lg mb-2 bg-primary-0 px-2"
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

                <ThemedText>Gender</ThemedText>
                <Select
                  selectedValue={values.gender}
                  onValueChange={handleChange("gender")}
                >
                  <SelectTrigger
                    size="xl"
                    className="h-[55px] rounded-lg mb-2 bg-primary-0 px-2"
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

                <DateField
                  label="Date of Birth"
                  value={values.dateOfBirth as unknown as Date | null}
                  onChange={(d) => setFieldValue("dateOfBirth", d)}
                />
                {errors.dateOfBirth && touched.dateOfBirth && (
                  <ThemedText type="b4_body" className="text-error-500 mb-4">
                    {String(errors.dateOfBirth)}
                  </ThemedText>
                )}
                <ImageUploader
                  uri={pickedImage}
                  allowsEditing
                  label="Profile Photo"
                  className=""
                  shape="circle"
                  onChange={(uri) => {
                    setPickedImage(uri);
                    setFieldValue("imageUpload", uri ?? "");
                  }}
                  helperText="PNG or JPG up to 5MB"
                />
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
      {showModal && (
        <>
          <CustomModal
            description="Your information has been saved successfully."
            title="Profile Updated"
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={"/home"}
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
