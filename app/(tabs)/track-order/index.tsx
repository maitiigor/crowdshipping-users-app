import CustomToast from "@/components/Custom/CustomToast";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedPost } from "@/lib/api";
import { useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";

import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  CircleCheckIcon,
  Clock,
  HelpCircleIcon,
  LucideIcon,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import * as Yup from "yup";

interface TrackOrderData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  trackingId: string;
  pickUpLocation: {
    address: string;
  };
  dropOffLocation: {
    address: string;
  };
}

export default function TrackOrderScreen() {
  const navigation = useNavigation();
  const backroundTopNav = useThemeColor({}, "background");
  const router = useRouter();
  const toast = useToast();
  const [trackOrderData, setTrackOrderData] = useState<TrackOrderData | null>(
    null
  );
  const validationSchema = () => {
    return Yup.object().shape({
      trackingRef: Yup.string().required("Tracking reference is required"),
    });
  };
  const { mutateAsync, error, loading } = useAuthenticatedPost<
    any,
    {
      trackingRef: string;
    }
  >(`/orders/track`);
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Track Order
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
              onLongPress={() => router.push("/(tabs)")}
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
  }, [navigation, router, backroundTopNav]);
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
  const handleSubmit = async (values: { trackingRef: string }) => {
    try {
      const response = await mutateAsync({
        trackingRef: values.trackingRef,
      });

      console.log("🚀 ~ handleSubmit ~ response:", response);
      showNewToast({
        title: "Success",
        description: "Order tracked successfully!",
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });
      setTrackOrderData(response.data);
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        "Sign up failed";
      showNewToast({
        title: "Tracking Order Process Failed",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
    >
      <ThemedView className="flex-1">
        <ThemedView className="flex-1 gap-3 pb-20 mt-3">
          <Formik
            initialValues={{
              trackingRef: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handleSubmit({
                ...values,
                trackingRef: values?.trackingRef ?? "",
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
              <ThemedView className="flex gap-4 mt-5">
                <ThemedView>
                  <InputLabelText className="pb-2">
                    Tracking Reference
                  </InputLabelText>
                  <Input
                    size="xl"
                    className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                    variant="outline"
                    isInvalid={!!(errors.trackingRef && touched.trackingRef)}
                  >
                    <InputField
                      className=""
                      placeholder="e.g PKG-123456789"
                      value={values.trackingRef}
                      onChangeText={handleChange("trackingRef")}
                      onBlur={handleBlur("trackingRef")}
                      keyboardType="default"
                      autoCapitalize="none"
                    />
                  </Input>
                  {errors.trackingRef && touched.trackingRef && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.trackingRef}
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedView className="flex-row justify-between flex-1 gap-3">
                  <Button
                    variant="solid"
                    size="2xl"
                    disabled={!values.trackingRef || loading}
                    className="mt-5 rounded-[12px] flex-1"
                    onPress={() => handleSubmit()}
                  >
                    <ThemedText
                      type="s1_subtitle"
                      lightColor="#FFFFFF"
                      darkColor="#FFFFFF"
                      className="text-white"
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        "Track Order"
                      )}
                    </ThemedText>
                  </Button>
                </ThemedView>
              </ThemedView>
            )}
          </Formik>

          {/* Tracking Data Display */}
          {trackOrderData && (
            <ThemedView className="mt-6 gap-4 pb-10">
              {/* Status Card */}
              <ThemedView className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-l">
                <ThemedView className="flex-row items-center justify-between mb-4">
                  <ThemedView className="flex-row items-center gap-3">
                    <ThemedView
                      className={`p-3 rounded-full ${
                        trackOrderData.status === "cancelled"
                          ? "bg-red-100"
                          : trackOrderData.status === "delivered"
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      <Icon
                        as={
                          trackOrderData.status === "cancelled"
                            ? XCircle
                            : trackOrderData.status === "delivered"
                            ? CheckCircle2
                            : Truck
                        }
                        size="xl"
                        className={
                          trackOrderData.status === "cancelled"
                            ? "text-red-600"
                            : trackOrderData.status === "delivered"
                            ? "text-green-600"
                            : "text-blue-600"
                        }
                      />
                    </ThemedView>
                    <ThemedView>
                      <ThemedText type="b4_body" className="text-gray-500">
                        Package Status
                      </ThemedText>
                      <ThemedText
                        type="s1_subtitle"
                        className={`text-lg font-semibold capitalize ${
                          trackOrderData.status === "cancelled"
                            ? "text-red-600"
                            : trackOrderData.status === "delivered"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {trackOrderData.status}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView
                    className={`px-4 py-2 rounded-full ${
                      trackOrderData.status === "cancelled"
                        ? "bg-red-100"
                        : trackOrderData.status === "delivered"
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <ThemedText
                      type="b4_body"
                      className={`font-semibold ${
                        trackOrderData.status === "cancelled"
                          ? "text-red-600"
                          : trackOrderData.status === "delivered"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {trackOrderData.status.toUpperCase()}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                {/* Tracking ID */}
                <ThemedView className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                  <ThemedView className="flex-row items-center gap-2 mb-2">
                    <Icon as={Package} size="md" className="text-gray-600" />
                    <ThemedText type="b4_body" className="text-gray-500">
                      Tracking ID
                    </ThemedText>
                  </ThemedView>
                  <ThemedText
                    type="s1_subtitle"
                    className="text-lg font-bold text-primary-500"
                  >
                    {trackOrderData.trackingId}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              {/* Location Details Card */}
              <ThemedView className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-l">
                <ThemedText type="h3_header" className="text-xl font-bold mb-4">
                  Location Details
                </ThemedText>

                {/* Pick-up Location */}
                <ThemedView className="mb-6">
                  <ThemedView className="flex-row items-start gap-3">
                    <ThemedView className="bg-green-100 p-2 rounded-full mt-1">
                      <Icon as={MapPin} size="md" className="text-green-600" />
                    </ThemedView>
                    <ThemedView className="flex-1">
                      <ThemedText type="b4_body" className="text-gray-500 mb-1">
                        Pick-up Location
                      </ThemedText>
                      <ThemedText
                        type="b3_body"
                        className="text-gray-900 dark:text-gray-100 leading-5"
                      >
                        {trackOrderData.pickUpLocation.address}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>

                {/* Connecting Line */}
                <ThemedView className="ml-5 h-12 w-0.5 bg-gray-300 dark:bg-gray-600" />

                {/* Drop-off Location */}
                <ThemedView className="mt-0">
                  <ThemedView className="flex-row items-start gap-3">
                    <ThemedView className="bg-red-100 p-2 rounded-full mt-1">
                      <Icon as={MapPin} size="md" className="text-red-600" />
                    </ThemedView>
                    <ThemedView className="flex-1">
                      <ThemedText type="b4_body" className="text-gray-500 mb-1">
                        Drop-off Location
                      </ThemedText>
                      <ThemedText
                        type="b3_body"
                        className="text-gray-900 dark:text-gray-100 leading-5"
                      >
                        {trackOrderData.dropOffLocation.address}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </ThemedView>

              {/* Timeline Card */}
              <ThemedView className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-l">
                <ThemedText type="h3_header" className="text-xl font-bold mb-4">
                  Timeline
                </ThemedText>

                <ThemedView className="gap-4">
                  {/* Created At */}
                  <ThemedView className="flex-row items-center gap-3">
                    <ThemedView className="bg-blue-100 p-2 rounded-full">
                      <Icon as={Calendar} size="md" className="text-blue-600" />
                    </ThemedView>
                    <ThemedView className="flex-1">
                      <ThemedText type="b4_body" className="text-gray-500 mb-1">
                        Created
                      </ThemedText>
                      <ThemedText
                        type="b3_body"
                        className="text-gray-900 dark:text-gray-100"
                      >
                        {new Date(trackOrderData.createdAt).toLocaleString(
                          "en-US",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>

                  {/* Updated At */}
                  <ThemedView className="flex-row items-center gap-3">
                    <ThemedView className="bg-purple-100 p-2 rounded-full">
                      <Icon as={Clock} size="md" className="text-purple-600" />
                    </ThemedView>
                    <ThemedView className="flex-1">
                      <ThemedText type="b4_body" className="text-gray-500 mb-1">
                        Last Updated
                      </ThemedText>
                      <ThemedText
                        type="b3_body"
                        className="text-gray-900 dark:text-gray-100"
                      >
                        {new Date(trackOrderData.updatedAt).toLocaleString(
                          "en-US",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </ThemedView>

              {/* Package ID Card
              <ThemedView className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-l">
                <ThemedText type="b4_body" className="text-white/80 mb-1">
                  Package ID
                </ThemedText>
                <ThemedText
                  type="s1_subtitle"
                  className="text-white text-sm font-mono"
                >
                  {trackOrderData._id}
                </ThemedText>
              </ThemedView> */}
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
