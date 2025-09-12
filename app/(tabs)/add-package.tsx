import { KeyboardAvoidingView, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { AddressSelection } from "@/components/Custom/AddressPicker";
import CustomSidebarMenu from "@/components/Custom/CustomSidebarMenu";
import DateField from "@/components/Custom/DateField";
import ImageUploader from "@/components/Custom/ImageUploader";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
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
import Feather from "@expo/vector-icons/Feather";
import { Formik } from "formik";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
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
export default function AddPackageScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressSelection | null>(null);
  const [selectedDropOffAddress, setSelectedDropOffAddress] =
    useState<AddressSelection | null>(null);
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
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
          <ThemedView className="flex-1 gap-3 pb-20 mt-3">
            <Formik
              initialValues={{
                productCategory: "",
                productType: "",
                bookingType: "",
                description: "",
                date: null as Date | null,
                weight: "",
                vehicle: "",
              }}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                  // force date to null if booking type is instant
                  date: values.bookingType === "instant" ? null : values.date,
                  selectedPickupAddress,
                  selectedDropOffAddress,
                };
                console.log("Form submitted:", payload);
                router.push({
                  pathname: "/(tabs)/package-details",
                  params: { id: id },
                });
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
                <ThemedView className="flex gap-4">
                  <ThemedView>
                    <InputLabelText type="b2_body">
                      Product Category
                    </InputLabelText>
                    <Select
                      selectedValue={values.productCategory}
                      onValueChange={handleChange("productCategory")}
                    >
                      <SelectTrigger
                        size="xl"
                        className="h-[55px] rounded-lg border-primary-100  bg-primary-inputShade px-2"
                      >
                        <SelectInput
                          placeholder="Select a category"
                          value={values.productCategory}
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
                          {productCategoryList.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                              label={category.label}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                    {errors.productCategory && touched.productCategory && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {errors.productCategory}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body">Product Type</InputLabelText>
                    <Select
                      selectedValue={values.productType}
                      onValueChange={handleChange("productType")}
                    >
                      <SelectTrigger
                        size="xl"
                        className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      >
                        <SelectInput
                          placeholder="Select a type"
                          value={values.productType}
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
                          {productTypeList.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              label={type.label}
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                    {errors.productType && touched.productType && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {errors.productType}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body" className="">
                      Weight
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.weight && touched.weight)}
                    >
                      <InputField
                        className=""
                        placeholder="e.g 100kg"
                        value={values.weight}
                        onChangeText={handleChange("weight")}
                        onBlur={handleBlur("weight")}
                        keyboardType="default"
                        autoCapitalize="none"
                      />
                    </Input>
                    {errors.weight && touched.weight && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {errors.weight}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body">Booking Type</InputLabelText>
                    <Select
                      selectedValue={values.bookingType}
                      onValueChange={(val) => {
                        setFieldValue("bookingType", val);
                        // reset date when switching to instant
                        if (val === "instant") setFieldValue("date", null);
                      }}
                    >
                      <SelectTrigger
                        size="xl"
                        className="h-[55px] rounded-lg border-primary-100 bg-primary-inputShade px-2"
                      >
                        <SelectInput
                          placeholder="Select a type"
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
                          {[
                            { label: "Instant", value: "instant" },
                            { label: "Schedule", value: "schedule" },
                          ].map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              label={type.label}
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                    {errors.bookingType && touched.bookingType && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {errors.bookingType}
                      </ThemedText>
                    )}
                  </ThemedView>
                  {/* only show Date when booking type is not instant */}
                  {values.bookingType !== "instant" && (
                    <ThemedView>
                      <DateField
                        label="Date"
                        labelClassName="b2_body"
                        value={values.date as unknown as Date | null}
                        onChange={(d) => setFieldValue("date", d)}
                      />
                      {errors.date && touched.date && (
                        <ThemedText type="b4_body" className="text-error-500">
                          {String(errors.date)}
                        </ThemedText>
                      )}
                    </ThemedView>
                  )}
                  <ImageUploader
                    uri={pickedImage}
                    editIconClassName="bottom-0 right-0"
                    allowsEditing
                    size={80}
                    label=""
                    aspect={[4, 3]}
                    className=" border-2 flex justify-center bg-primary-inputShade border-typography-300 items-center py-4 rounded border-dotted"
                    shape="circle"
                    onChange={(uri) => {
                      setPickedImage(uri);
                      setFieldValue("imageUpload", uri ?? "");
                    }}
                    helperText="A picture of the package"
                  />
                  <ThemedView>
                    <InputLabelText type="b2_body" className="pb-1">
                      Product Description
                    </InputLabelText>
                    <Textarea
                      size="lg"
                      isReadOnly={false}
                      isInvalid={!!(errors.description && touched.description)}
                      isDisabled={false}
                      className="w-full h-[150px] border-primary-100 bg-primary-inputShade"
                    >
                      <TextareaInput
                        clearButtonMode="while-editing"
                        value={values.description}
                        onChangeText={handleChange("description")}
                        onBlur={handleBlur("description")}
                        placeholder="Enter Product Description"
                        multiline
                        maxLength={500}
                        numberOfLines={10}
                        style={{ textAlignVertical: "top" }}
                      />
                      {/* clear button */}
                    </Textarea>
                    <ThemedText type="c1_caption" className="text-right pt-1">
                      {String(values.description?.length ?? 0)}/500
                    </ThemedText>
                    {errors.description && touched.description && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {String(errors.description)}
                      </ThemedText>
                    )}
                  </ThemedView>
                  {/* <ThemedView className="flex-row gap-2 justify-center items-center">
                    <Icon
                      as={SquarePlus}
                      size="3xl"
                      className="text-primary-600"
                    />
                    <ThemedText type="default" className="text-primary-600">
                      Add Another Package
                    </ThemedText>
                  </ThemedView> */}
                  <Button
                    variant="solid"
                    size="2xl"
                    className="mt-5 rounded-[12px]"
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText type="s1_subtitle" className="text-white">
                      Continue
                    </ThemedText>
                  </Button>
                </ThemedView>
              )}
            </Formik>
          </ThemedView>
        </ThemedView>
        <CustomSidebarMenu
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
        />
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

// styles removed as they were unused
