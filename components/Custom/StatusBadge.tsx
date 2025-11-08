import { ThemedText } from "@/components/ThemedText";
import { Icon } from "@/components/ui/icon";
import {
  CheckCircle2,
  CircleCheck,
  DollarSign,
  MapPin,
  Package,
  Truck,
} from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type StatusType =
  | "GOING_TO_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "ARRIVED_DESTINATION"
  | "DELIVERED"
  | "TOLL_BILL_PENDING"
  | "COMPLETED"
  | "IN_PROGRESS";

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: any;
  iconColor: string;
}

const statusConfigs: Record<StatusType, StatusConfig> = {
  GOING_TO_PICKUP: {
    label: "Going to Pickup",
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    icon: Truck,
    iconColor: "#3B82F6",
  },
  PICKED_UP: {
    label: "Picked Up",
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    icon: Package,
    iconColor: "#8B5CF6",
  },
  IN_TRANSIT: {
    label: "In Transit",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    icon: MapPin,
    iconColor: "#F59E0B",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    icon: MapPin,
    iconColor: "#F59E0B",
  },
  ARRIVED_DESTINATION: {
    label: "Arrived at Destination",
    color: "#06B6D4",
    bgColor: "#ECFEFF",
    icon: MapPin,
    iconColor: "#06B6D4",
  },
  DELIVERED: {
    label: "Delivered",
    color: "#10B981",
    bgColor: "#D1FAE5",
    icon: CheckCircle2,
    iconColor: "#10B981",
  },
  TOLL_BILL_PENDING: {
    label: "Toll Bill Pending",
    color: "#EF4444",
    bgColor: "#FEE2E2",
    icon: DollarSign,
    iconColor: "#EF4444",
  },
  COMPLETED: {
    label: "Completed",
    color: "#059669",
    bgColor: "#D1FAE5",
    icon: CircleCheck,
    iconColor: "#059669",
  },
};

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const config = statusConfigs[status] || statusConfigs.IN_PROGRESS;

  const sizeStyles = {
    sm: {
      padding: 6,
      iconSize: "sm" as const,
      fontSize: "c2_caption" as const,
      gap: 4,
    },
    md: {
      padding: 8,
      iconSize: "md" as const,
      fontSize: "c1_caption" as const,
      gap: 6,
    },
    lg: {
      padding: 10,
      iconSize: "lg" as const,
      fontSize: "default" as const,
      gap: 8,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: config.bgColor,
        paddingHorizontal: currentSize.padding * 1.5,
        paddingVertical: currentSize.padding,
        borderRadius: 20,
        gap: currentSize.gap,
        alignSelf: "flex-start",
      }}
    >
      <Icon
        as={config.icon}
        size={currentSize.iconSize}
        style={{ color: config.iconColor }}
      />
      <ThemedText
        type={currentSize.fontSize}
        style={{
          color: config.color,
          fontWeight: "600",
        }}
      >
        {config.label}
      </ThemedText>
    </View>
  );
};
