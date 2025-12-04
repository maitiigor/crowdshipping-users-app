import { useAuthenticatedPatch, useAuthenticatedQuery } from "@/lib/api";
import { INotificationsResponse } from "@/types/INotification";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import {
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import React from "react";
import { ActivityIndicator } from "react-native";
import * as Yup from "yup";
import CustomToast from "../Custom/CustomToast";
import InputLabelText from "../Custom/InputLabelText";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Button } from "../ui/button";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "../ui/modal";
import { Textarea, TextareaInput } from "../ui/textarea";
import { useToast } from "../ui/toast";

import { useTranslation } from "react-i18next";

interface IProps {
  responseId: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
export default function CancelBookingModal({
  responseId,
  showModal,
  setShowModal,
}: IProps) {
  const { t } = useTranslation("trips");
  const validationSchema = Yup.object().shape({
    reason: Yup.string().required(t("cancel_modal.reason_required")),
  });
  const toast = useToast();
  const router = useRouter();
  const { refetch: refetchNotifications } = useAuthenticatedQuery<
    INotificationsResponse | undefined
  >(["notifications"], "/notification");
  const { mutateAsync, loading, error } = useAuthenticatedPatch<
    any,
    {
      reason: string;
    }
  >(`/trip/cancel/package/${responseId}`);

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

  const handleSubmit = async (reason: string) => {
    try {
      await mutateAsync({
        reason,
      });
      showNewToast({
        title: t("cancel_modal.success_title"),
        description: t("cancel_modal.success_desc"),
        icon: CircleCheckIcon,
        action: "success",
        variant: "solid",
      });

      router.push({
        pathname: "/(tabs)",
      });
      refetchNotifications();
      setShowModal(false);
    } catch (e: any) {
      // Prefer server-provided message, then error.message, then hook error string
      const message =
        e?.data?.message ||
        e?.message ||
        (typeof error === "string" ? error : undefined) ||
        t("cancel_modal.failed_default");

      showNewToast({
        title: t("cancel_modal.failed_title"),
        description: message,
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    }
  };
  return (
    <Modal
      isOpen={showModal}
      size={"md"}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <ModalBackdrop />
      <ModalContent className="rounded-2xl items-center">
        <ModalHeader>
          <ThemedText
            type="h5_header"
            className="text-center text-typography-900 mb-4"
          >
            {t("cancel_modal.title")}
          </ThemedText>
        </ModalHeader>
        <ModalBody className="my-4 w-full">
          <Formik
            initialValues={{
              reason: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(formValues) => handleSubmit(formValues.reason)}
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
              <>
                <ThemedView>
                  <InputLabelText type="b2_body" className="pb-1">
                    {t("cancel_modal.reason_label")}
                  </InputLabelText>
                  <Textarea
                    size="lg"
                    isReadOnly={false}
                    isInvalid={!!(errors.reason && touched.reason)}
                    isDisabled={false}
                    className="w-full h-[150px] border-primary-100 bg-primary-inputShade"
                  >
                    <TextareaInput
                      clearButtonMode="while-editing"
                      value={values.reason}
                      onChangeText={handleChange("reason")}
                      onBlur={handleBlur("reason")}
                      placeholder={t("cancel_modal.reason_placeholder")}
                      multiline
                      numberOfLines={10}
                      style={{ textAlignVertical: "top" }}
                    />
                    {/* clear button */}
                  </Textarea>
                  {errors.reason && touched.reason && (
                    <ThemedText
                      lightColor="#FF3B30"
                      type="b4_body"
                      className="text-error-500"
                    >
                      {String(errors.reason)}
                    </ThemedText>
                  )}
                </ThemedView>
                <Button
                  variant="solid"
                  size="2xl"
                  disabled={loading}
                  onPress={() => handleSubmit()}
                  className="mt-5 rounded-[12px]"
                >
                  <ThemedText
                    lightColor="#FFFFFF"
                    darkColor="#FFFFFF"
                    type="s1_subtitle"
                    className="text-white"
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      t("cancel_modal.cancel_button")
                    )}
                  </ThemedText>
                </Button>
              </>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
