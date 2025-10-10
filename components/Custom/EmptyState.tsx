import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/ui/icon";
import { LucideIcon } from "lucide-react-native";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: IconComponent,
  className = "",
}) => {
  return (
    <ThemedView
      className={`flex-1 justify-center items-center p-6 ${className}`}
    >
      {IconComponent && (
        <Icon
          as={IconComponent}
          size="6xl"
          className="text-typography-400 mb-4"
        />
      )}
      <ThemedText type="h3_header" className="text-typography-900 text-center mb-2">
        {title}
      </ThemedText>
      {description && (
        <ThemedText type="default" className="text-typography-600 text-center">
          {description}
        </ThemedText>
      )}
    </ThemedView>
  );
};
