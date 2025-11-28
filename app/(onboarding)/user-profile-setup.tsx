import AddressPickerComponent, {
  AddressSelection,
} from "@/components/Custom/AddressPicker";
import CountryDropdown from "@/components/Custom/CountryDropdown";
import { CustomModal } from "@/components/Custom/CustomModal";
import CustomToast from "@/components/Custom/CustomToast";
import DateField from "@/components/Custom/DateField";
import ImageUploader from "@/components/Custom/ImageUploader";
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
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  useAuthenticatedPatch,
  useAuthenticatedPost,
  useAuthenticatedQuery,
} from "@/lib/api";
import { formatPhoneForApi, isValidPhone } from "@/lib/phone";
import { IUserProfileResponse } from "@/types/IUserProfile";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

const getValidationSchema = (t: any) =>
  Yup.object().shape({
    firstName: Yup.string()
      .min(2, t("validation.first_name_min"))
      .max(50, t("validation.first_name_max"))
      .required(t("validation.first_name_required")),
    lastName: Yup.string()
      .min(2, t("validation.last_name_min"))
      .max(50, t("validation.last_name_max"))
      .required(t("validation.last_name_required")),
    phoneNumber: Yup.string().required(t("validation.phone_required")),
    country: Yup.string().required(t("validation.country_required")),
    state: Yup.string().required(t("validation.state_required")),
    city: Yup.string().required(t("validation.city_required")),
    location: Yup.object()
      .shape({
        lat: Yup.number().required(t("validation.lat_required")),
        lng: Yup.number().required(t("validation.lng_required")),
        address: Yup.string().required(t("validation.address_required")),
      })
      .required(t("validation.location_required")),
    gender: Yup.string()
      .oneOf(["male", "female", "other"])
      .required(t("validation.gender_required")),
    dob: Yup.date().nullable().max(new Date(), t("validation.dob_future")),
  });

export default function UserProfileSetup() {
  const navigation = useNavigation();
  const { t } = useTranslation("userProfileSetup");
  const validationSchema = getValidationSchema(t);
  // const router = useRouter();
  const phoneInputRef = useRef<any>(null);
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const backroundTopNav = useThemeColor({}, "background");
  console.log("🚀 ~ UserProfileSetup ~ pickedImage:", pickedImage);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const toast = useToast();
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressSelection | null>(null);
  const { isHome } = useLocalSearchParams();
  const { data } = useAuthenticatedQuery<IUserProfileResponse>(
    ["me"],
    "/user/profile"
  );
  const { mutateAsync, error, loading } = useAuthenticatedPatch<
    any,
    {
      fullName: string;
      phoneNumber: string;
      location: {
        lat: number;
        lng: number;
        address: string;
      };
      state: string;
      city: string;
      country: string;
      gender: string; //male | female | other
      dob: string;
      profilePicUrl: string;
    }
  >("/user/update-profile");
  console.log("🚀 ~ UserProfileSetup ~ data:", data);

  // Helper: split full name into first/last
  const splitName = (
    fullName?: string
  ): { firstName: string; lastName: string } => {
    if (!fullName) return { firstName: "", lastName: "" };
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    const lastName = parts.pop() || "";
    const firstName = parts.join(" ");
    return { firstName, lastName };
  };

  // Build initial values from API response (falls back to blanks)
  const formInitialValues = React.useMemo(() => {
    const profile = data?.data?.profile;
    const names = splitName(data?.data?.fullName);
    return {
      firstName: isHome === "true" ? names.firstName || "" : "",
      lastName: isHome === "true" ? names.lastName || "" : "",
      phoneNumber: isHome === "true" ? data?.data?.phoneNumber || "" : "",
      country: isHome === "true" ? profile?.country || "" : "",
      location: {
        lat: isHome === "true" ? profile?.lat : undefined,
        lng: isHome === "true" ? profile?.lng : undefined,
        address: isHome === "true" ? profile?.address || "" : "",
      },
      state: isHome === "true" ? profile?.state || "" : "",
      city: isHome === "true" ? profile?.city || "" : "",
      gender: isHome === "true" ? profile?.gender || "" : "",
      dob: null as Date | null, // API sample has no DOB
      profilePicUrl: isHome === "true" ? profile?.profilePicUrl || "" : "",
    };
  }, [data]);

  // Sync auxiliary UI state (image preview, phone state, address picker) when data loads
  useEffect(() => {
    if (!data?.data || isHome !== "true") return;
    const profile = data.data.profile;
    setPickedImage(profile?.profilePicUrl || null);
    setPhone(data.data.phoneNumber || "");
    if (profile?.address) {
      setSelectedPickupAddress({
        address: profile.address,
        coordinates: { lat: profile.lat, lng: profile.lng },
      });
    }
  }, [data, isHome]);

  const { mutateAsync: uploadImage, loading: isUploading } =
    useAuthenticatedPost<{ url: string }, FormData>("/storage-upload");
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
  }, [navigation, backroundTopNav]);
  // Keyboard visibility tracking was unused; removed to avoid warnings
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

  const handleSubmit = async (values: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    location: {
      lat: number | undefined;
      lng: number | undefined;
      address: string;
    };
    state: string;
    city: string;
    country: string;
    gender: string; //male | female | other
    dob: Date | null;
    profilePicUrl: string;
  }) => {
    try {
      // Ensure location coordinates are present
      const lat = values.location.lat;
      const lng = values.location.lng;
      if (lat == null || lng == null) {
        showNewToast({
          title: t("toast.missing_location_title"),
          description: t("toast.missing_location_description"),
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return;
      }

      // Validate and format phone before submitting
      const phoneApi = phoneInputRef.current as any;
      const preferCallingCode = phoneApi?.state?.code
        ? String(phoneApi.state.code)
        : undefined;
      const valid = isValidPhone(phone || "");
      if (!valid) {
        showNewToast({
          title: t("toast.invalid_phone_title"),
          description: t("toast.invalid_phone_description"),
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return;
      }
      // API expects: (+<country_code>)<nationalNumber> e.g. (+234)8022908484
      const formattedPhone = formatPhoneForApi(phone, preferCallingCode);
      console.log("🚀 ~ handleSignUp ~ formattedPhone:", formattedPhone);
      // Format DOB as YYYY-MM-DD if provided
      const dobStr = values.dob
        ? new Date(values.dob).toISOString().split("T")[0]
        : "";

      await mutateAsync({
        fullName: `${values.firstName} ${values.lastName}`,
        phoneNumber: formattedPhone,
        location: {
          lat: lat,
          lng: lng,
          address: values.location.address,
        },
        state: values.state,
        city: values.city,
        country: values.country,
        gender: values.gender,
        dob: dobStr,
        profilePicUrl: values.profilePicUrl,
      });

      setShowModal(true);
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        (typeof error === "string" ? error : undefined) ||
        t("toast.default_error");

      showNewToast({
        title: t("toast.update_failed_title"),
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
      style={{ backgroundColor: backroundTopNav }}
      className="flex-1"
      behavior={"padding"}
      keyboardVerticalOffset={insets.top}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1 pb-20">
          <Formik
            initialValues={formInitialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values) => {
              // console.log("Form submitted:", values);
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
              setFieldValue,
            }) => (
              <ThemedView className="flex gap-5">
                <ThemedView className="flex-row gap-4">
                  <ThemedView className="w-1/2">
                    <InputLabelText className="">
                      {t("first_name_label")}
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.firstName && touched.firstName)}
                    >
                      <InputField
                        className=""
                        placeholder={t("first_name_placeholder")}
                        value={values.firstName}
                        onChangeText={handleChange("firstName")}
                        onBlur={handleBlur("firstName")}
                        keyboardType="default"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.firstName && touched.firstName && (
                      <ThemedText
                        lightColor="#FF3B30"
                        type="b4_body"
                        className="text-error-500"
                      >
                        {errors.firstName}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView className="flex-1 w-1/2">
                    <InputLabelText className="">
                      {t("last_name_label")}
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.lastName && touched.lastName)}
                    >
                      <InputField
                        className=""
                        placeholder={t("last_name_placeholder")}
                        value={values.lastName}
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        keyboardType="default"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.lastName && touched.lastName && (
                      <ThemedText
                        lightColor="#FF3B30"
                        type="b4_body"
                        className="text-error-500"
                      >
                        {errors.lastName}
                      </ThemedText>
                    )}
                  </ThemedView>
                </ThemedView>

                <ThemedView>
                  <InputLabelText className="">
                    {t("pickup_address_label")}
                  </InputLabelText>
                  <AddressPickerComponent
                    value={selectedPickupAddress}
                    onSelect={(sel) => {
                      setSelectedPickupAddress(sel);
                      // Reflect selection in Formik values.location
                      setFieldValue("location", {
                        lat: sel.coordinates.lat,
                        lng: sel.coordinates.lng,
                        address: sel.address,
                      });
                    }}
                  />
                </ThemedView>
                <ThemedView>
                  <InputLabelText className="">
                    {t("phone_number_label")}
                  </InputLabelText>
                  <PhoneNumberInput
                    ref={phoneInputRef}
                    value={values.phoneNumber}
                    onChangeFormattedText={(t) => {
                      setPhone(t);
                      setFieldValue("phoneNumber", t);
                    }}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <ThemedText
                      lightColor="#FF3B30"
                      type="b4_body"
                      className="text-error-500"
                    >
                      {errors.phoneNumber}
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedView>
                  <CountryDropdown
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange("country")}
                  />
                </ThemedView>
                <ThemedView className="w-full">
                  <InputLabelText className="">
                    {t("state_label")}
                  </InputLabelText>
                  <Input
                    size="xl"
                    className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                    variant="outline"
                    isInvalid={!!(errors.state && touched.state)}
                  >
                    <InputField
                      className=""
                      placeholder={t("state_placeholder")}
                      value={values.state}
                      onChangeText={handleChange("state")}
                      onBlur={handleBlur("state")}
                      keyboardType="default"
                      autoCapitalize="none"
                    />
                  </Input>
                  {errors.state && touched.state && (
                    <ThemedText
                      lightColor="#FF3B30"
                      type="b4_body"
                      className="text-error-500 mb-4"
                    >
                      {errors.state}
                    </ThemedText>
                  )}
                </ThemedView>
                <ThemedView className="w-full">
                  <InputLabelText className="">
                    {t("city_label")}
                  </InputLabelText>
                  <Input
                    size="xl"
                    className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                    variant="outline"
                    isInvalid={!!(errors.city && touched.city)}
                  >
                    <InputField
                      className=""
                      placeholder={t("city_placeholder")}
                      value={values.city}
                      onChangeText={handleChange("city")}
                      onBlur={handleBlur("city")}
                      keyboardType="default"
                      autoCapitalize="none"
                    />
                  </Input>
                  {errors.city && touched.city && (
                    <ThemedText
                      lightColor="#FF3B30"
                      type="b4_body"
                      className="text-error-500"
                    >
                      {errors.city}
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedView>
                  <InputLabelText>{t("gender_label")}</InputLabelText>
                  <Select
                    selectedValue={values.gender}
                    onValueChange={handleChange("gender")}
                  >
                    <SelectTrigger
                      size="xl"
                      className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
                    >
                      <SelectInput
                        placeholder={t("gender_placeholder")}
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
                        <SelectItem
                          label={t("gender_options.male")}
                          value="male"
                        />
                        <SelectItem
                          label={t("gender_options.female")}
                          value="female"
                        />
                        <SelectItem
                          label={t("gender_options.other")}
                          value="other"
                        />
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  {errors.gender && touched.gender && (
                    <ThemedText
                      lightColor="#FF3B30"
                      type="b4_body"
                      className="text-error-500 mb-4"
                    >
                      {errors.gender}
                    </ThemedText>
                  )}
                </ThemedView>
                <ThemedView>
                  <DateField
                    label={t("dob_label")}
                    labelClassName="b2_body"
                    value={values.dob as unknown as Date | null}
                    onChange={(d) => setFieldValue("dob", d)}
                  />
                  {errors.dob && touched.dob && (
                    <ThemedText
                      lightColor="#FF3B30"
                      type="b4_body"
                      className="text-error-500"
                    >
                      {String(errors.dob)}
                    </ThemedText>
                  )}
                </ThemedView>
                <ThemedView className="w-full">
                  <ImageUploader
                    uri={pickedImage}
                    editIconClassName="bottom-0 right-0"
                    allowsEditing
                    size={80}
                    label=""
                    aspect={[4, 3]}
                    className=" border-2 flex justify-center bg-primary-inputShade border-typography-300 items-center py-4 rounded border-dotted"
                    shape="circle"
                    onChange={async (uri, asset) => {
                      setPickedImage(uri);
                      try {
                        if (!uri || !asset) {
                          setFieldValue("profilePicUrl", "");
                          return;
                        }
                        // Build FormData for upload
                        const form = new FormData();
                        const fileName =
                          asset.fileName || `upload-${Date.now()}.jpg`;
                        const mimeType = asset.type || "image/jpeg";
                        // React Native FormData requires { uri, name, type }
                        form.append("file", {
                          // @ts-ignore - React Native specific
                          uri,
                          name: fileName,
                          type: mimeType,
                        } as any);

                        const res = await uploadImage(form);
                        console.log("🚀 ~ res:", res);
                        const url = (res as any)?.data?.data || "";
                        if (!url)
                          throw new Error("Upload did not return a URL");

                        setFieldValue("profilePicUrl", url);
                        showNewToast({
                          title: t("toast.image_uploaded_title"),
                          description: t("toast.image_uploaded_description"),
                          icon: CircleCheckIcon,
                          action: "success",
                          variant: "solid",
                        });
                      } catch (e: any) {
                        showNewToast({
                          title: t("toast.upload_failed_title"),
                          description:
                            e?.message || t("toast.upload_failed_default"),
                          icon: HelpCircleIcon,
                          action: "error",
                          variant: "solid",
                        });
                      }
                    }}
                    helperText={t("upload_helper_text")}
                  />
                </ThemedView>

                <Button
                  variant="solid"
                  size="2xl"
                  isDisabled={loading || isUploading}
                  className="mt-5 rounded-[12px]"
                  onPress={() => handleSubmit()}
                >
                  <ThemedText type="s1_subtitle" className="text-white">
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      t("update_button")
                    )}
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
            description={t("modal.description")}
            title={t("modal.title")}
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={"/(tabs)"}
            firstBtnText={t("modal.button")}
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
}
