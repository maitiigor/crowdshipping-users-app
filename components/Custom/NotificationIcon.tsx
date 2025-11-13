import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedQuery } from "@/lib/api";
import { INotificationsResponse } from "@/types/INotification";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Icon } from "../ui/icon";

interface IProps {}
export default function NotificationIcon({}: IProps) {
  const { data, isLoading } = useAuthenticatedQuery<
    INotificationsResponse | undefined
  >(["notifications"], "/notification");
  const colorNav = useThemeColor({}, "text");
  const router = useRouter();
  const list = Array.isArray(data?.data) ? data!.data : [];
  const unreadCount = list.filter((notif) => !notif.isRead).length || 0;
  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/(tabs)/notifications");
      }}
      style={{ paddingHorizontal: 0 }}
      className="relative"
    >
      <ThemedView
        className={`absolute  z-10 ${
          Platform.OS === "ios" ? "-top-2 -right-2" : "-top-0 -right-0"
        }`}
      >
        {unreadCount > 0 && (
          <ThemedView
            className={` bg-red-600 rounded-full flex justify-center items-center ${
              Platform.OS === "ios" ? "w-6 h-6" : "w-5 h-5"
            }`}
          >
            <ThemedText type="btn_tiny" className="text-white text-center">
              {isLoading ? ".." : unreadCount}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
      <Icon
        as={Bell}
        style={{
          color: colorNav,
        }}
        size="2xl"
        className="text-typography-900"
      />
    </TouchableOpacity>
  );
}
