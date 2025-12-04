import { useAuthenticatedDelete, useAuthenticatedQuery } from "@/lib/api";
import { INotificationsResponse } from "@/types/INotification";
import { useRouter } from "expo-router";
import {
  CircleCheckIcon,
  HelpCircleIcon,
  LucideIcon,
} from "lucide-react-native";
import React from "react";
import { ActivityIndicator } from "react-native";
import CustomToast from "../Custom/CustomToast";
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
import { useToast } from "../ui/toast";

import { useTranslation } from "react-i18next";
interface IProps {
  responseId: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
export default function CancelAirSeaBookingModal({
  responseId,
  showModal,
  setShowModal,
}: IProps) {
  const { t } = useTranslation("trips");
  const toast = useToast();
  const router = useRouter();
  const { refetch: refetchNotifications } = useAuthenticatedQuery<
    INotificationsResponse | undefined
  >(["notifications"], "/notification");
  const { mutateAsync, loading, error } = useAuthenticatedDelete<any, any>(
    `/trip/cancel/bid/${responseId}`
  );

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

  const handleSubmit = async () => {
    try {
      await mutateAsync({});
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
          <ThemedText
            type="b2_body"
            className="text-typography-700 text-center mb-6 px-2"
          >
            {t("cancel_modal.confirm_text")}
          </ThemedText>
          <ThemedText
            type="b2_body"
            className="text-typography-700 text-center mb-6 px-2 "
          >
            {t("cancel_modal.policy_text")}
          </ThemedText>
          <ThemedView className="flex-row gap-4 w-full justify-center">
            <Button
              className="flex-1 bg-background-100 rounded-xl items-center"
              onTouchEnd={() => {
                setShowModal(false);
                router.back();
              }}
            >
              <ThemedText type="btn_large" className="text-typography-700">
                {t("cancel_modal.go_back")}
              </ThemedText>
            </Button>
            <Button
              className="flex-1 bg-red-100 rounded-xl items-center"
              onTouchEnd={() => handleSubmit()}
            >
              <ThemedText type="btn_large" className="text-red-600">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  t("cancel_modal.confirm_button")
                )}
              </ThemedText>
            </Button>
          </ThemedView>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
