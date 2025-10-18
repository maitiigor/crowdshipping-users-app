import CustomToast from "@/components/Custom/CustomToast";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useAuthenticatedPatch, useAuthenticatedQuery } from "@/lib/api";
import { INotificationsResponse } from "@/types/INotification";
import { formatCurrency } from "@/utils/helper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import { ChevronLeft, HelpCircleIcon, SearchIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  discount: Yup.string().optional(),
  amount: Yup.number().required("Amount is required"),
});

export default function ConfirmPrice() {
  const navigation = useNavigation();
  const { tripId, amount } = useLocalSearchParams();
  const toast = useToast();
  const { refetch: notifyRefetch } = useAuthenticatedQuery<
    INotificationsResponse | undefined
  >(["notifications"], "/notification");
  const { mutateAsync, error, loading } = useAuthenticatedPatch<
    any,
    {
      discountCode: string;
      amount: number;
    }
  >(`/trip/confirm/package/${tripId}`);
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Pricing
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
              className="p-2 rounded flex justify-center items-center"
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

  const handleFormSubmit = async (values: {
    discount: string;
    amount: number;
  }) => {
    try {
      const payload = {
        discountCode: values.discount,
        amount: values.amount,
      };
      const response = await mutateAsync(payload);
      console.log("🚀 ~ handleFormSubmit ~ response:", response);
      notifyRefetch();
      showNewToast({
        title: "Success",
        description: "Payment Initiated successfully",
        icon: HelpCircleIcon,
        action: "success",
        variant: "solid",
      });
      router.push({
        pathname: "/(tabs)/choose-payment-type",
        params: {
          tripId: tripId,
          amount: response?.data?.amount,
          responseId: response?.data?.id,
          discountCode: values.discount,
        },
      });
    } catch (submitError: any) {
      const message =
        submitError?.data?.message ||
        submitError?.message ||
        (typeof error === "string" ? error : undefined) ||
        "An error occurred while confirming the price.";
      showNewToast({
        title: "Error",
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };

  return (
    <Formik
      initialValues={{
        discount: "",
        amount: parseInt(amount as string, 10),
      }}
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
      }) => (
        <>
          <ParallaxScrollView
            headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
          >
            <ThemedView className="flex-1">
              <ThemedView className="flex-1 pb-20">
                <ThemedView>
                  <ThemedText type="b2_body" className="text-center">
                    Total Waybill cost
                  </ThemedText>
                  <ThemedText
                    type="h4_header"
                    className="text-center text-primary-600 pt-1"
                  >
                    {formatCurrency(
                      parseInt(amount as string, 10),
                      "NGN",
                      "en-NG"
                    )}
                  </ThemedText>
                </ThemedView>
                <ThemedView>
                  <ThemedView className="flex gap-4">
                    <ThemedView className="mt-5">
                      <Input
                        size="lg"
                        className="h-[55px] border rounded-t rounded-2xl border-primary-100 bg-primary-inputShade"
                        variant="outline"
                      >
                        <InputSlot className="pl-3">
                          <InputIcon as={SearchIcon} />
                        </InputSlot>
                        <InputField
                          className=""
                          placeholder="Enter Discount code"
                          value={values.discount}
                          onChangeText={handleChange("discount")}
                          onBlur={handleBlur("discount")}
                          keyboardType="default"
                          autoCapitalize="none"
                        />
                        {/* <Button
                          variant="solid"
                          size="2xl"
                          className="rounded-[12px] mr-1"
                          onPress={() => handleSubmit()}
                        >
                          <ThemedText type="s2_subtitle" className="text-white">
                            Apply
                          </ThemedText>
                        </Button> */}
                      </Input>
                      {errors.discount && touched.discount && (
                        <ThemedText type="b4_body" className="text-error-500">
                          {errors.discount}
                        </ThemedText>
                      )}
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                <ThemedView className="">
                  <ThemedText type="btn_giant" className="mt-5">
                    Delivery Details (ID2350847391)
                  </ThemedText>
                  <ThemedView className="border mt-6 border-primary-50 p-5 rounded-2xl flex gap-5">
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_large"
                        className="text-typography-600"
                      >
                        xyz Charges
                      </ThemedText>
                      <ThemedText type="btn_large" className="">
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_large"
                        className="text-typography-600"
                      >
                        xyz Charges
                      </ThemedText>
                      <ThemedText type="btn_large" className="">
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_large"
                        className="text-typography-600"
                      >
                        xyz Charges
                      </ThemedText>
                      <ThemedText type="btn_large" className="">
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_large"
                        className="text-typography-600"
                      >
                        xyz Charges
                      </ThemedText>
                      <ThemedText type="btn_large" className="">
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText
                        type="btn_large"
                        className="text-typography-600"
                      >
                        xyz Charges
                      </ThemedText>
                      <ThemedText type="btn_large" className="">
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row justify-between">
                      <ThemedText type="s1_subtitle" className="">
                        xyz Charges
                      </ThemedText>
                      <ThemedText
                        type="s1_subtitle"
                        className="text-primary-500"
                      >
                        ₦2,913,500
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ParallaxScrollView>
          <ThemedView className="absolute pt-6 pb-10 bottom-0 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
            <Button
              variant="solid"
              size="2xl"
              disabled={loading}
              onPress={() => handleSubmit()}
              className="flex-1 rounded-[12px] mx-1"
            >
              <ThemedText type="s2_subtitle" className="text-white text-center">
                Confirm Order
              </ThemedText>
            </Button>
          </ThemedView>
        </>
      )}
    </Formik>
  );
}
