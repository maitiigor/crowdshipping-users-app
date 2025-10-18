import {
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { AddressSelection } from "@/components/Custom/AddressPicker";
import CustomToast from "@/components/Custom/CustomToast";
import DateField from "@/components/Custom/DateField";
import ImageUploader from "@/components/Custom/ImageUploader";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import PhoneNumberInput from "@/components/Custom/PhoneNumberInput";
import { ThemedText } from "@/components/ThemedText";
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
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useAuthenticatedPatch, useAuthenticatedPost } from "@/lib/api";
import { formatPhoneForApi, isValidPhone } from "@/lib/phone";
import { FieldArray, Formik } from "formik";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  SquarePlus,
  Trash2,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

// MenuItem type removed (unused)
const productCategoryList = [
  {
    label: "Perishable",
    value: "Perishable",
  },
  {
    label: "Electronics",
    value: "Electronics",
  },
  {
    label: "Clothing",
    value: "Clothing",
  },
  {
    label: "Home & Kitchen",
    value: "Home & Kitchen",
  },
];
const productTypeList = [
  {
    label: "Pizza",
    value: "Pizza",
  },
  {
    label: "Groceries",
    value: "Groceries",
  },
  {
    label: "Other",
    value: "Other",
  },
];

type ProductUnit = "kg" | "lb";

type PackageFormValues = {
  productCategory: string;
  productType: string;
  productWeight: string;
  productUnit: ProductUnit;
  productImage: string;
  productDescription: string;
};

type FormValues = {
  bookingType: "" | "instant" | "schedule";
  scheduleDate: Date | null;
  receiverName: string;
  receiverPhone: string;
  alternativePhone: string;
  packages: PackageFormValues[];
};

const packageSchema = Yup.object({
  productCategory: Yup.string().required("Product category is required"),
  productType: Yup.string().required("Product name is required"),
  productWeight: Yup.string()
    .required("Weight is required")
    .test("is-valid-weight", "Weight must be a valid number", (value) => {
      if (!value) return false;
      const numeric = Number(value);
      return Number.isFinite(numeric) && numeric > 0;
    }),
  productUnit: Yup.mixed<ProductUnit>()
    .oneOf(["kg", "lb"], "Select a weight unit")
    .required("Weight unit is required"),
  productImage: Yup.string().required("Package image is required"),
  productDescription: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .required("Description is required"),
});

const validationSchema = Yup.object({
  bookingType: Yup.string()
    .oneOf(["instant", "schedule"], "Select a booking type")
    .required("Booking type is required"),
  scheduleDate: Yup.date()
    .nullable()
    .when("bookingType", {
      is: "schedule",
      then: (schema) => schema.required("Schedule date is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  receiverName: Yup.string()
    .min(2, "Receiver name must be at least 2 characters")
    .required("Receiver name is required"),
  receiverPhone: Yup.string().required("Receiver phone number is required"),
  alternativePhone: Yup.string().required(
    "Alternative phone number is required"
  ),
  packages: Yup.array().of(packageSchema).min(1, "Add at least one package"),
});
type UpdatePackagePayload = {
  bookingType: "instant" | "schedule";
  scheduleDate?: string;
  receiverName: string;
  receiverPhone: string;
  alternativePhone?: string;
  packages: {
    productCategory: string;
    productType: string;
    productWeight: number;
    productUnit: ProductUnit;
    productImage: string;
    productDescription: string;
  }[];
};

export default function AddPackageScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const receiverPhoneInputRef = useRef<any>(null);
  const alternativePhoneInputRef = useRef<any>(null);
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressSelection | null>(null);
  const [selectedDropOffAddress, setSelectedDropOffAddress] =
    useState<AddressSelection | null>(null);
  const [packageImages, setPackageImages] = useState<string[]>([""]);
  const [receiverPhoneValue, setReceiverPhoneValue] = useState("");
  const [alternativePhoneValue, setAlternativePhoneValue] = useState("");
  const insets = useSafeAreaInsets();
  const { id, tripTypeId } = useLocalSearchParams();

  const fallbackTripId = "";
  const tripId = useMemo(() => {
    if (Array.isArray(id) && id.length > 0) return String(id[0]);
    if (typeof id === "string" && id.trim().length > 0) return id;
    return fallbackTripId;
  }, [id]);
  console.log("🚀 ~ AddPackageScreen ~ tripId:", tripId);

  const { mutateAsync, error, loading } = useAuthenticatedPatch<
    any,
    UpdatePackagePayload
  >(`/trip/package/pickup/${tripId}`);

  const { mutateAsync: uploadImage, loading: isUploading } =
    useAuthenticatedPost<{ url: string }, FormData>("/storage-upload");

  const formInitialValues = useMemo<FormValues>(
    () => ({
      bookingType: "",
      scheduleDate: null,
      receiverName: "",
      receiverPhone: "",
      alternativePhone: "",
      packages: [
        {
          productCategory: "",
          productType: "",
          productWeight: "",
          productUnit: "kg",
          productImage: "",
          productDescription: "",
        },
      ],
    }),
    []
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Add Package
          </ThemedText>
        );
      },
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 },
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "#FFFFFF",
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
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

  const showNewToast = ({
    title,
    description,
    icon,
    action = "error",
    variant = "solid",
  }: {
    title: string;
    description: string;
    icon: typeof HelpCircleIcon;
    action: "error" | "success" | "info" | "muted" | "warning";
    variant: "solid" | "outline";
  }) => {
    const toastId = Math.random().toString();
    toast.show({
      id: toastId,
      placement: "top",
      duration: 3000,
      render: ({ id: innerId }) => (
        <CustomToast
          uniqueToastId={`toast-${innerId}`}
          icon={icon}
          action={action}
          title={title}
          variant={variant}
          description={description}
        />
      ),
    });
  };

  const handleFormSubmit = async (values: FormValues) => {
    try {
      const receiverRaw = receiverPhoneValue || values.receiverPhone;
      const receiverCode = receiverPhoneInputRef.current?.state?.code
        ? String(receiverPhoneInputRef.current.state.code)
        : undefined;
      const receiverValid = isValidPhone(receiverRaw);
      if (!receiverValid) {
        showNewToast({
          title: "Invalid receiver phone",
          description: "Enter a valid receiver phone number",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return;
      }
      const formattedReceiverPhone = formatPhoneForApi(
        receiverRaw,
        receiverCode
      );

      let formattedAlternativePhone = "";
      const alternativeRaw = alternativePhoneValue || values.alternativePhone;
      if (alternativeRaw) {
        const altCode = alternativePhoneInputRef.current?.state?.code
          ? String(alternativePhoneInputRef.current.state.code)
          : undefined;
        const altValid = isValidPhone(alternativeRaw);
        if (!altValid) {
          showNewToast({
            title: "Invalid alternative phone",
            description: "Enter a valid alternative phone number",
            icon: HelpCircleIcon,
            action: "error",
            variant: "solid",
          });
          return;
        }
        formattedAlternativePhone = formatPhoneForApi(alternativeRaw, altCode);
      }

      const packagesMissingImage = values.packages.some(
        (pkg) => !pkg.productImage
      );
      if (packagesMissingImage) {
        showNewToast({
          title: "Package image required",
          description: "Upload an image for each package",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return;
      }

      const payload: UpdatePackagePayload = {
        bookingType: values.bookingType as "instant" | "schedule",
        scheduleDate:
          values.bookingType === "schedule" && values.scheduleDate
            ? new Date(values.scheduleDate).toISOString().split("T")[0]
            : "",
        receiverName: values.receiverName.trim(),
        receiverPhone: formattedReceiverPhone,
        alternativePhone: formattedAlternativePhone,

        packages: values.packages.map((pkg) => ({
          productCategory: pkg.productCategory.toLowerCase(),
          productType: pkg.productType.toLowerCase(),
          productWeight: Number(pkg.productWeight),
          productUnit: pkg.productUnit,
          productImage: pkg.productImage,
          productDescription: pkg.productDescription,
        })),
      };
      const response = await mutateAsync(payload);
      showNewToast({
        title: "Package saved",
        description: "Your packages were added successfully",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });

      // sender
      router.push({
        pathname: "/(tabs)/package-details",
        params: {
          id: tripId,
          tripTypeId: tripTypeId,
          response: encodeURIComponent(JSON.stringify(response)),
        },
      });
    } catch (submitError: any) {
      const message =
        submitError?.data?.message ||
        submitError?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Unable to add packages";
      console.log("🚀 ~ handleFormSubmit ~ message:", message);

      showNewToast({
        title: "Add package failed",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Add Package
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
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={"padding"}
      keyboardVerticalOffset={insets.top}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <Formik<FormValues>
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
              submitCount,
            }) => {
              console.log("🚀 ~ AddPackageScreen ~ errors:", errors);
              return (
                <ThemedView className="flex-1 gap-5 pb-20 mt-3">
                  <ThemedView>
                    <InputLabelText className="">Receiver Name</InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={
                        !!(
                          errors.receiverName &&
                          (touched.receiverName || submitCount > 0)
                        )
                      }
                    >
                      <InputField
                        placeholder="Enter receiver's name"
                        value={values.receiverName}
                        onChangeText={handleChange("receiverName")}
                        onBlur={handleBlur("receiverName")}
                        keyboardType="default"
                        autoCapitalize="words"
                      />
                    </Input>
                    {errors.receiverName &&
                      (touched.receiverName || submitCount > 0) && (
                        <ThemedText type="b4_body" className="text-error-500">
                          {errors.receiverName}
                        </ThemedText>
                      )}
                  </ThemedView>

                  <ThemedView>
                    <InputLabelText className="">
                      Receiver Phone Number
                    </InputLabelText>
                    <PhoneNumberInput
                      ref={receiverPhoneInputRef}
                      value={values.receiverPhone}
                      onChangeFormattedText={(text) => {
                        setReceiverPhoneValue(text);
                        setFieldValue("receiverPhone", text);
                      }}
                    />
                    {errors.receiverPhone &&
                      (touched.receiverPhone || submitCount > 0) && (
                        <ThemedText type="b4_body" className="text-error-500">
                          {errors.receiverPhone}
                        </ThemedText>
                      )}
                  </ThemedView>

                  <ThemedView>
                    <InputLabelText className="">
                      Alternative Phone Number
                    </InputLabelText>
                    <PhoneNumberInput
                      ref={alternativePhoneInputRef}
                      value={values.alternativePhone}
                      onChangeFormattedText={(text) => {
                        setAlternativePhoneValue(text);
                        setFieldValue("alternativePhone", text);
                      }}
                    />
                    {errors.alternativePhone &&
                      (touched.alternativePhone || submitCount > 0) && (
                        <ThemedText type="b4_body" className="text-error-500">
                          {errors.alternativePhone}
                        </ThemedText>
                      )}
                  </ThemedView>

                  <ThemedView>
                    <InputLabelText type="b2_body">Booking Type</InputLabelText>
                    <Select
                      selectedValue={values.bookingType}
                      onValueChange={(val) => {
                        setFieldValue("bookingType", val);
                        if (val === "instant") {
                          setFieldValue("scheduleDate", null);
                        }
                      }}
                    >
                      <SelectTrigger
                        size="xl"
                        className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      >
                        <SelectInput
                          placeholder="Select a booking type"
                          value={values.bookingType}
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
                          <SelectItem label="Instant" value="instant" />
                          <SelectItem label="Schedule" value="schedule" />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                    {errors.bookingType &&
                      (touched.bookingType || submitCount > 0) && (
                        <ThemedText type="b4_body" className="text-error-500">
                          {errors.bookingType}
                        </ThemedText>
                      )}
                  </ThemedView>

                  {values.bookingType === "schedule" && (
                    <ThemedView>
                      <DateField
                        label="Schedule Date"
                        labelClassName="b2_body"
                        value={values.scheduleDate as unknown as Date | null}
                        onChange={(date) => setFieldValue("scheduleDate", date)}
                      />
                      {errors.scheduleDate &&
                        (touched.scheduleDate || submitCount > 0) && (
                          <ThemedText type="b4_body" className="text-error-500">
                            {String(errors.scheduleDate)}
                          </ThemedText>
                        )}
                    </ThemedView>
                  )}

                  <FieldArray name="packages">
                    {({ push, remove }) => (
                      <ThemedView className="flex gap-6">
                        {values.packages.map((pkg, index) => {
                          const pkgErrors = Array.isArray(errors.packages)
                            ? (errors.packages[index] as any) || {}
                            : {};
                          const pkgTouched = Array.isArray(touched.packages)
                            ? (touched.packages[index] as any) || {}
                            : {};

                          return (
                            <ThemedView
                              key={index}
                              className="rounded-3xl  bg-white  py-5 "
                            >
                              <ThemedView className="flex-row items-center justify-between mb-4">
                                <ThemedText type="s1_subtitle" className="">
                                  Package {index + 1}
                                </ThemedText>
                                {index > 0 && (
                                  <TouchableOpacity
                                    onPress={() => {
                                      remove(index);
                                      setPackageImages((prev) => {
                                        const next = [...prev];
                                        next.splice(index, 1);
                                        return next.length ? next : [""];
                                      });
                                    }}
                                  >
                                    <Icon
                                      as={Trash2}
                                      size="xl"
                                      className="text-error-500"
                                    />
                                  </TouchableOpacity>
                                )}
                              </ThemedView>

                              <ThemedView className="mb-4">
                                <InputLabelText type="b2_body">
                                  Product Category
                                </InputLabelText>
                                <Select
                                  selectedValue={pkg.productCategory}
                                  onValueChange={(val) =>
                                    setFieldValue(
                                      `packages[${index}].productCategory`,
                                      val
                                    )
                                  }
                                >
                                  <SelectTrigger
                                    size="xl"
                                    className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                                  >
                                    <SelectInput
                                      placeholder="Select a category"
                                      value={pkg.productCategory}
                                      className="flex-1"
                                    />
                                    <SelectIcon
                                      className="mr-3"
                                      as={ChevronDownIcon}
                                    />
                                  </SelectTrigger>
                                  <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                      <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                      </SelectDragIndicatorWrapper>
                                      {productCategoryList.map((category) => (
                                        <SelectItem
                                          key={category.value}
                                          value={category.value}
                                          label={category.label}
                                        />
                                      ))}
                                    </SelectContent>
                                  </SelectPortal>
                                </Select>
                                {pkgErrors.productCategory &&
                                  (pkgTouched.productCategory ||
                                    submitCount > 0) && (
                                    <ThemedText
                                      type="b4_body"
                                      className="text-error-500"
                                    >
                                      {pkgErrors.productCategory}
                                    </ThemedText>
                                  )}
                              </ThemedView>
                              <ThemedView className="mb-4">
                                <InputLabelText type="b2_body">
                                  Product Name
                                </InputLabelText>
                                <ThemedView className="flex-row gap-3">
                                  <ThemedView className="flex-1">
                                    <Input
                                      size="xl"
                                      className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                                      variant="outline"
                                      isInvalid={
                                        !!(
                                          pkgErrors.productType &&
                                          (pkgTouched.productType ||
                                            submitCount > 0)
                                        )
                                      }
                                    >
                                      <InputField
                                        placeholder="Product name"
                                        value={pkg.productType}
                                        onChangeText={(text) =>
                                          setFieldValue(
                                            `packages[${index}].productType`,
                                            text
                                          )
                                        }
                                        onBlur={handleBlur(
                                          `packages[${index}].productType`
                                        )}
                                        keyboardType="decimal-pad"
                                        autoCapitalize="none"
                                      />
                                    </Input>
                                  </ThemedView>
                                </ThemedView>
                                {pkgErrors.productType &&
                                  (pkgTouched.productType ||
                                    submitCount > 0) && (
                                    <ThemedText
                                      type="b4_body"
                                      className="text-error-500"
                                    >
                                      {pkgErrors.productType}
                                    </ThemedText>
                                  )}
                                {pkgErrors.productUnit &&
                                  (pkgTouched.productUnit ||
                                    submitCount > 0) && (
                                    <ThemedText
                                      type="b4_body"
                                      className="text-error-500"
                                    >
                                      {pkgErrors.productUnit}
                                    </ThemedText>
                                  )}
                              </ThemedView>

                              <ThemedView className="mb-4">
                                <InputLabelText type="b2_body">
                                  Product Weight
                                </InputLabelText>
                                <ThemedView className="flex-row gap-3">
                                  <ThemedView className="flex-1">
                                    <Input
                                      size="xl"
                                      className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                                      variant="outline"
                                      isInvalid={
                                        !!(
                                          pkgErrors.productWeight &&
                                          (pkgTouched.productWeight ||
                                            submitCount > 0)
                                        )
                                      }
                                    >
                                      <InputField
                                        placeholder="e.g. 12"
                                        value={pkg.productWeight}
                                        onChangeText={(text) =>
                                          setFieldValue(
                                            `packages[${index}].productWeight`,
                                            text
                                          )
                                        }
                                        onBlur={handleBlur(
                                          `packages[${index}].productWeight`
                                        )}
                                        keyboardType="decimal-pad"
                                        autoCapitalize="none"
                                      />
                                    </Input>
                                  </ThemedView>
                                  <ThemedView className="w-28">
                                    <Select
                                      selectedValue={pkg.productUnit}
                                      onValueChange={(val) =>
                                        setFieldValue(
                                          `packages[${index}].productUnit`,
                                          val as ProductUnit
                                        )
                                      }
                                    >
                                      <SelectTrigger
                                        size="xl"
                                        className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                                      >
                                        <SelectInput
                                          placeholder="Unit"
                                          value={pkg.productUnit}
                                          className="flex-1"
                                        />
                                        <SelectIcon
                                          className="mr-3"
                                          as={ChevronDownIcon}
                                        />
                                      </SelectTrigger>
                                      <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                          <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                          </SelectDragIndicatorWrapper>
                                          <SelectItem label="kg" value="kg" />
                                          <SelectItem label="lb" value="lb" />
                                        </SelectContent>
                                      </SelectPortal>
                                    </Select>
                                  </ThemedView>
                                </ThemedView>
                                {pkgErrors.productWeight &&
                                  (pkgTouched.productWeight ||
                                    submitCount > 0) && (
                                    <ThemedText
                                      type="b4_body"
                                      className="text-error-500"
                                    >
                                      {pkgErrors.productWeight}
                                    </ThemedText>
                                  )}
                                {pkgErrors.productUnit &&
                                  (pkgTouched.productUnit ||
                                    submitCount > 0) && (
                                    <ThemedText
                                      type="b4_body"
                                      className="text-error-500"
                                    >
                                      {pkgErrors.productUnit}
                                    </ThemedText>
                                  )}
                              </ThemedView>

                              <ThemedView className="mb-4 items-center">
                                <ImageUploader
                                  uri={packageImages[index] || null}
                                  editIconClassName="bottom-0 right-0"
                                  allowsEditing
                                  size={100}
                                  label="Package Image"
                                  aspect={[4, 3]}
                                  className="border-2 border-typography-300 bg-primary-inputShade flex justify-center items-center py-4 w-full rounded-lg"
                                  shape="circle"
                                  onChange={async (uri, asset) => {
                                    setPackageImages((prev) => {
                                      const next = [...prev];
                                      next[index] = uri || "";
                                      return next;
                                    });

                                    if (!uri || !asset) {
                                      setFieldValue(
                                        `packages[${index}].productImage`,
                                        ""
                                      );
                                      return;
                                    }

                                    try {
                                      const form = new FormData();
                                      const fileName =
                                        asset.fileName ||
                                        `package-${Date.now()}.jpg`;
                                      const mimeType =
                                        asset.mimeType || "image/jpeg";

                                      form.append("file", {
                                        uri,
                                        name: fileName,
                                        type: mimeType,
                                      } as any);

                                      const response = await uploadImage(form);
                                      const uploadedUrl =
                                        (response as any)?.data?.data ||
                                        (response as any)?.data?.url ||
                                        (response as any)?.url ||
                                        "";

                                      if (!uploadedUrl) {
                                        throw new Error(
                                          "Upload did not return a URL"
                                        );
                                      }

                                      setFieldValue(
                                        `packages[${index}].productImage`,
                                        uploadedUrl
                                      );
                                      showNewToast({
                                        title: "Image uploaded",
                                        description:
                                          "Package image saved successfully",
                                        icon: CircleCheckIcon,
                                        action: "success",
                                        variant: "solid",
                                      });
                                    } catch (uploadError: any) {
                                      setFieldValue(
                                        `packages[${index}].productImage`,
                                        ""
                                      );
                                      showNewToast({
                                        title: "Upload failed",
                                        description:
                                          uploadError?.message ||
                                          "Could not upload image",
                                        icon: HelpCircleIcon,
                                        action: "error",
                                        variant: "solid",
                                      });
                                    }
                                  }}
                                  helperText="Upload a photo of the package"
                                />
                                {pkgErrors.productImage &&
                                  (pkgTouched.productImage ||
                                    submitCount > 0) && (
                                    <ThemedText
                                      type="b4_body"
                                      className="text-error-500 mt-2"
                                    >
                                      {pkgErrors.productImage}
                                    </ThemedText>
                                  )}
                              </ThemedView>

                              <ThemedView>
                                <InputLabelText type="b2_body" className="pb-1">
                                  Product Description
                                </InputLabelText>
                                <Textarea
                                  size="lg"
                                  isInvalid={
                                    !!(
                                      pkgErrors.productDescription &&
                                      (pkgTouched.productDescription ||
                                        submitCount > 0)
                                    )
                                  }
                                  className="w-full h-[150px] border-primary-100 bg-primary-inputShade"
                                >
                                  <TextareaInput
                                    clearButtonMode="while-editing"
                                    value={pkg.productDescription}
                                    onChangeText={(text) =>
                                      setFieldValue(
                                        `packages[${index}].productDescription`,
                                        text
                                      )
                                    }
                                    onBlur={handleBlur(
                                      `packages[${index}].productDescription`
                                    )}
                                    placeholder="Enter product description"
                                    multiline
                                    maxLength={500}
                                    numberOfLines={10}
                                    style={{ textAlignVertical: "top" }}
                                  />
                                </Textarea>
                                <ThemedText
                                  type="c1_caption"
                                  className="text-right pt-1"
                                >
                                  {String(pkg.productDescription?.length ?? 0)}/
                                  500
                                </ThemedText>
                                {pkgErrors.productDescription &&
                                  (pkgTouched.productDescription ||
                                    submitCount > 0) && (
                                    <ThemedText
                                      type="b4_body"
                                      className="text-error-500"
                                    >
                                      {pkgErrors.productDescription}
                                    </ThemedText>
                                  )}
                              </ThemedView>
                            </ThemedView>
                          );
                        })}

                        <Button
                          variant="outline"
                          size="2xl"
                          className="mt-2 rounded-[12px] border-dashed"
                          onPress={() => {
                            push({
                              productCategory: "",
                              productType: "",
                              productWeight: "",
                              productUnit: "kg",
                              productImage: "",
                              productDescription: "",
                            });
                            setPackageImages((prev) => [...prev, ""]);
                          }}
                        >
                          <ThemedView className="flex-row items-center justify-center gap-2">
                            <Icon
                              as={SquarePlus}
                              size="xl"
                              className="text-primary-500"
                            />
                            <ThemedText
                              type="s2_subtitle"
                              className="text-primary-500"
                            >
                              Add Another Package
                            </ThemedText>
                          </ThemedView>
                        </Button>
                      </ThemedView>
                    )}
                  </FieldArray>

                  <Button
                    variant="solid"
                    size="2xl"
                    className="mt-5 rounded-[12px]"
                    isDisabled={loading || isUploading}
                    onPress={() => handleSubmit()}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <ThemedText type="s1_subtitle" className="text-white">
                        Continue
                      </ThemedText>
                    )}
                  </Button>
                </ThemedView>
              );
            }}
          </Formik>
        </ThemedView>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

// styles removed as they were unused
