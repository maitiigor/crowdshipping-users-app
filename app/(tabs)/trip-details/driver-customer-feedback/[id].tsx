import { CustomModal } from "@/components/Custom/CustomModal";
import CustomToast from "@/components/Custom/CustomToast";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { HelpCircleIcon, Icon } from "@/components/ui/icon";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedPost } from "@/lib/api";
import { paramToString } from "@/utils/helper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import { ChevronLeft, CircleCheckIcon, LucideIcon } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

export default function DriverCustomerFeedback() {
  const { t } = useTranslation("tripDetails");

  const validationSchema = Yup.object().shape({
    review: Yup.string()
      .min(10, t("feedback.validation.review_min"))
      .max(500, t("feedback.validation.review_max"))
      .required(t("feedback.validation.review_required")),
    rating: Yup.number()
      .min(1, t("feedback.validation.rating_min"))
      .max(5, t("feedback.validation.rating_max"))
      .required(t("feedback.validation.rating_required")),
  });
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const backroundTopNav = useThemeColor({}, "background");
  const { id, rating: selectedRating, travellerName } = useLocalSearchParams();
  const idStr = paramToString(id);
  const travellerNameStr = paramToString(travellerName);
  const [showModal, setShowModal] = useState(false);
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState<number>(
    selectedRating?.toString() ? parseInt(selectedRating?.toString()) : 0
  );
  const { mutateAsync, error, loading } = useAuthenticatedPost<
    any,
    {
      bookingId: string;
      rating: number;
      review: string;
    }
  >(`/rating/rate/delivery`);
  const handleStarClick = (value: number) => {
    setRating(value);
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            {t("feedback.title")}
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
  }, [navigation, router, backroundTopNav]);
  const showNewToast = useCallback(
    ({
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
    },
    [toast]
  );
  const handleReview = async (values: { rating: number; review: string }) => {
    try {
      await mutateAsync({
        bookingId: idStr!,
        rating: values.rating,
        review: values.review,
      });
      showNewToast({
        title: t("toast.success"),
        description: t("toast.review_success", { name: travellerNameStr }),
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
        t("toast.failed_default");

      showNewToast({
        title: t("toast.review_failed", { name: travellerNameStr }),
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
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 gap-3 pb-20 mt-3">
            <Formik
              initialValues={{
                rating: selectedRating?.toString()
                  ? parseInt(selectedRating?.toString())
                  : 0,
                review: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                };
                console.log("Form submitted:", payload);
                handleReview(payload);
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
                  <ThemedView className="flex flex-row justify-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const idx = i + 1;
                      const filled = idx <= rating;
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            handleStarClick(idx);
                            setFieldValue("rating", idx);
                          }}
                          key={`star-${i}`}
                          className="mx-1"
                        >
                          <AntDesign
                            name={filled ? "star" : "staro"}
                            size={40}
                            color={filled ? "#E75B3B" : "#C8C8C8"}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </ThemedView>
                  <ThemedView>
                    <InputLabelText type="b2_body" className="pb-1">
                      {t("feedback.comment_label")}
                    </InputLabelText>
                    <Textarea
                      size="lg"
                      isReadOnly={false}
                      isInvalid={!!(errors.review && touched.review)}
                      isDisabled={false}
                      className="w-full h-[150px] border-primary-100 bg-primary-inputShade"
                    >
                      <TextareaInput
                        clearButtonMode="while-editing"
                        value={values.review}
                        onChangeText={handleChange("review")}
                        onBlur={handleBlur("review")}
                        placeholder={t("feedback.review_placeholder")}
                        multiline
                        numberOfLines={10}
                        style={{ textAlignVertical: "top" }}
                      />
                      {/* clear button */}
                    </Textarea>
                    {errors.review && touched.review && (
                      <ThemedText type="b4_body" className="text-error-500">
                        {String(errors.review)}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <Button
                    variant="solid"
                    size="2xl"
                    className="mt-5 rounded-[12px]"
                    onPress={() => handleSubmit()}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <ThemedText type="s1_subtitle" className="text-white">
                        {t("feedback.submit_button")}
                      </ThemedText>
                    )}
                  </Button>
                </ThemedView>
              )}
            </Formik>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      {showModal && (
        <>
          <CustomModal
            description={t("feedback.modal.description")}
            title={t("feedback.modal.title")}
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={"/(tabs)"}
            firstBtnText={t("feedback.modal.done")}
            secondBtnLink={""}
            secondBtnText=""
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
}
