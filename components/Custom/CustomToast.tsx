import { LucideIcon } from "lucide-react-native";
import React from "react";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Toast, ToastDescription, ToastTitle } from "../ui/toast";
import { VStack } from "../ui/vstack";

// error styles interface
interface ErrorToastStyleProps {
  backgroundColor: "#FFF5F4";
  borderColor: "#F9D0C9";
  borderWidth: 1;
}
interface toastStyleProps {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export default function CustomToast({
  icon,
  title,
  description,
  uniqueToastId,
  action,
  variant="solid",
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  uniqueToastId: string;
  action: "error" | "success" | "info" | "muted" | "warning";
  variant: "solid" | "outline";
}) {
  return (
    <Toast
      action={action}
      variant={variant}
      style={
        action === "error"
          ? ({
              backgroundColor: "#FFF5F4",
              borderColor: "#F9D0C9",
              borderWidth: 1,
            } as ErrorToastStyleProps)
          : action === "success"
          ? ({
              backgroundColor: "#ECFDF3",
              borderColor: "#6EE7B7",
              borderWidth: 1,
            } as toastStyleProps)
          : action === "info"
          ? ({
              backgroundColor: "#EFF6FF",
              borderColor: "#60A5FA",
              borderWidth: 1,
            } as toastStyleProps)
          : action === "muted"
          ? ({
              backgroundColor: "#F3F4F6",
              borderColor: "#D1D5DB",
              borderWidth: 1,
            } as toastStyleProps)
          : action === "warning"
          ? ({
              backgroundColor: "#FFFBEB",
              borderColor: "#FDE68A",
              borderWidth: 1,
            } as toastStyleProps)
          : {}
      }
      nativeID={uniqueToastId}
      className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
    >
      <HStack space="md">
        <Icon
          as={icon}
          className={`mt-1 ${
            action === "error"
              ? "text-error-500"
              : action === "success"
              ? "text-green-600"
              : action === "info"
              ? "text-blue-600"
              : action === "muted"
              ? "text-gray-600"
              : action === "warning"
              ? "text-yellow-600"
              : ""
          }`}
        />
        <VStack space="xs">
          <ToastTitle
            size="xl"
            className={`font-semibold ${
              action === "error"
                ? "text-error-500"
                : action === "success"
                ? "text-green-600"
                : action === "info"
                ? "text-blue-600"
                : action === "muted"
                ? "text-gray-600"
                : action === "warning"
                ? "text-yellow-600"
                : ""
            }`}
          >
            {title}
          </ToastTitle>
          <ToastDescription size="md" className="text-black">
            {description ?? "Something went wrong"}
          </ToastDescription>
        </VStack>
      </HStack>
    </Toast>
  );
}
