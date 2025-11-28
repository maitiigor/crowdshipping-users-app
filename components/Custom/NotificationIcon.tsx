import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedQuery } from "@/lib/api";
import { INotificationsResponse } from "@/types/INotification";
import { displayLocalNotification } from "@/utils/notificationHelper";
import messaging from "@react-native-firebase/messaging";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Icon } from "../ui/icon";

interface IProps {}
export default function NotificationIcon({}: IProps) {
  const { data, isLoading, refetch } = useAuthenticatedQuery<
    INotificationsResponse | undefined
  >(["notifications"], "/notification");
  const colorNav = useThemeColor({}, "text");
  const router = useRouter();
  const list = Array.isArray(data?.data) ? data!.data : [];
  const unreadCount = list.filter((notif) => !notif.isRead).length || 0;
  const previousIdsRef = useRef<Set<string>>(new Set());

  // Listen for foreground messages and refresh the list
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Notification received in foreground, refreshing list...");
      refetch();
    });
    return unsubscribe;
  }, [refetch]);

  useEffect(() => {
    const currentIds = new Set(list.map((notif) => notif._id));
    const previousIds = previousIdsRef.current;
    const newNotifications = list.filter(
      (notif) => !previousIds.has(notif._id)
    );

    if (previousIds.size > 0 && newNotifications.length > 0) {
      const latest = newNotifications[0];
      const title = latest.title || "New Notification";
      const body = latest.message || "You have a new message";
      void displayLocalNotification(title, body, {
        notificationId: latest._id,
      });
    }

    previousIdsRef.current = currentIds;
  }, [list]);
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
            lightColor="#dc2626"
            darkColor="#b91c1c"
            className={` bg-red-600 rounded-full flex justify-center items-center ${
              Platform.OS === "ios" ? "w-6 h-6" : "w-5 h-5"
            }`}
          >
            <ThemedText
              lightColor="#ffff"
              darkColor="#ffff"
              type="btn_tiny"
              className="text-white text-center"
            >
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
