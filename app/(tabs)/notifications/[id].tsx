import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useAuthenticatedPatch, useAuthenticatedQuery } from "@/lib/api";
import { INotificationsResponse, ISingleNotificationResponse } from "@/types/INotification";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  AlarmClock,
  Bell,
  CalendarClock,
  ChevronLeft,
  Info,
} from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";

dayjs.extend(relativeTime);

const NotificationDetail = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refetch: refetchNotifications } = useAuthenticatedQuery<
      INotificationsResponse | undefined
    >(["notifications"], "/notification");
  const { data, isLoading, refetch } = useAuthenticatedQuery<
    ISingleNotificationResponse | undefined
  >(["notification", id], `/notification/${id}`);
  const notif = data?.data;
  const { mutateAsync, error, loading } = useAuthenticatedPatch<any, {}>(
    `/notification/${id}`
  );
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Notifications
          </ThemedText>
        );
      },
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "#FFFFFF",
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
  }, [navigation, router]);
  useEffect(() => {
    const markAsRead = async () => {
      if (data?.data && !data.data.isRead) {
        // Mark notification as read
        await mutateAsync({});
        refetch();
        refetchNotifications();
      }
    };
    markAsRead();
  }, [data?.data?.isRead]);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
    >
      <ThemedView className="flex-1 bg-white">
        <ThemedView className="flex-1 gap-4 pb-40 mt-3">
          {/* Hero section */}
          {isLoading ? (
            <Box className="w-full gap-4 p-4 rounded-2xl border border-background-100">
              <HStack className="items-center gap-3">
                <Skeleton
                  variant="circular"
                  className="h-12 w-12 rounded-full"
                />
                <SkeletonText _lines={2} gap={4} className="h-3 w-[85.5%] flex-1" />
              </HStack>
              <SkeletonText _lines={3} gap={4} className="h-3" />
            </Box>
          ) : (
            <ThemedView className="w-full p-4 rounded-2xl border border-primary-50 bg-background-0">
              <HStack className="items-center gap-3 mb-2">
                <ThemedView className="h-12 w-12 rounded-full bg-primary-50 border border-primary-100 items-center justify-center">
                  <Icon as={Bell} size="xl" className="text-primary-600" />
                </ThemedView>
                <ThemedView className="flex-1 min-w-0">
                  <ThemedText
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    type="h5_header"
                    className="text-typography-900"
                  >
                    {notif?.title || "Notification"}
                  </ThemedText>
                  <ThemedText type="c2_caption" className="text-typography-600">
                    {notif
                      ? dayjs(notif.updatedAt || notif.createdAt).fromNow()
                      : ""}
                  </ThemedText>
                </ThemedView>
              </HStack>

              {notif?.message ? (
                <ThemedText type="b3_body" className="text-typography-700 mt-2">
                  {notif.message}
                </ThemedText>
              ) : null}

              {/* Status chips */}
              <HStack className="flex-wrap gap-2 mt-3">
                {notif?.type ? (
                  <ThemedView className="px-3 py-1 rounded-full bg-secondary-50 border border-secondary-100">
                    <ThemedText
                      type="c2_caption"
                      className="text-secondary-700"
                    >
                      Type: {notif.type}
                    </ThemedText>
                  </ThemedView>
                ) : null}
                {notif?.channel ? (
                  <ThemedView className="px-3 py-1 rounded-full bg-primary-50 border border-primary-100">
                    <ThemedText type="c2_caption" className="text-primary-700">
                      Channel: {notif.channel}
                    </ThemedText>
                  </ThemedView>
                ) : null}
                <ThemedView className="px-3 py-1 rounded-full bg-success-50 border border-success-100">
                  <ThemedText type="c2_caption" className="text-success-700">
                    {notif?.isRead ? "Read" : "Unread"}
                  </ThemedText>
                </ThemedView>
                <ThemedView className="px-3 py-1 rounded-full bg-warning-50 border border-warning-100">
                  <ThemedText type="c2_caption" className="text-warning-700">
                    {notif?.delivered ? "Delivered" : "Not delivered"}
                  </ThemedText>
                </ThemedView>
              </HStack>
            </ThemedView>
          )}

          {/* Meta information */}
          {isLoading ? (
            <Box className="w-full gap-4 p-4 rounded-2xl border border-background-100">
              <SkeletonText _lines={1} className="h-3 w-1/3" />
              <SkeletonText _lines={3} gap={4} className="h-3" />
            </Box>
          ) : (
            <ThemedView className="border border-background-100 rounded-2xl p-4 bg-background-0 gap-4">
              <ThemedText type="btn_giant" className="text-typography-800">
                Details
              </ThemedText>
              <ThemedView className="gap-3">
                <HStack className="justify-between items-center">
                  <ThemedText type="btn_medium" className="text-typography-600">
                    Notification ID
                  </ThemedText>
                  <ThemedText type="btn_medium" className="text-typography-900">
                    {notif?._id ?? id}
                  </ThemedText>
                </HStack>
                {notif?.data?.bookingId || notif?.data?.booking ? (
                  <HStack className="justify-between items-center">
                    <ThemedText
                      type="btn_medium"
                      className="text-typography-600"
                    >
                      Related Booking
                    </ThemedText>
                    <ThemedText
                      type="btn_medium"
                      className="text-typography-900"
                    >
                      {notif?.data?.bookingId || notif?.data?.booking}
                    </ThemedText>
                  </HStack>
                ) : null}
                {notif?.triggeredById ? (
                  <HStack className="justify-between items-center">
                    <ThemedText
                      type="btn_medium"
                      className="text-typography-600"
                    >
                      Triggered By
                    </ThemedText>
                    <ThemedText
                      type="btn_medium"
                      className="text-typography-900"
                    >
                      {notif?.triggeredById}
                    </ThemedText>
                  </HStack>
                ) : null}
                <HStack className="justify-between items-center">
                  <HStack className="items-center gap-2">
                    <Icon
                      as={CalendarClock}
                      size="md"
                      className="text-typography-600"
                    />
                    <ThemedText
                      type="btn_medium"
                      className="text-typography-600"
                    >
                      Created
                    </ThemedText>
                  </HStack>
                  <ThemedText type="btn_medium" className="text-typography-900">
                    {notif
                      ? dayjs(notif.createdAt).format("MMM D, YYYY h:mm A")
                      : ""}
                  </ThemedText>
                </HStack>
                <HStack className="justify-between items-center">
                  <HStack className="items-center gap-2">
                    <Icon
                      as={AlarmClock}
                      size="md"
                      className="text-typography-600"
                    />
                    <ThemedText
                      type="btn_medium"
                      className="text-typography-600"
                    >
                      Updated
                    </ThemedText>
                  </HStack>
                  <ThemedText type="btn_medium" className="text-typography-900">
                    {notif
                      ? dayjs(notif.updatedAt).format("MMM D, YYYY h:mm A")
                      : ""}
                  </ThemedText>
                </HStack>
              </ThemedView>
            </ThemedView>
          )}

          {/* CTA to Booking (if available) */}
          {!isLoading && (notif?.data?.bookingId || notif?.data?.booking) ? (
            <Button
              action="primary"
              size="3xl"
              className="mt-2 rounded-xl"
              onPress={() => {
                const bookingId =
                  notif?.data?.bookingId || notif?.data?.booking;
                if (bookingId) {
                  router.push({
                    pathname: "/(tabs)/booking-history/[id]",
                    params: { id: bookingId as string },
                  });
                }
              }}
            >
              <ButtonIcon as={Info} />
              <ButtonText size="lg">View booking</ButtonText>
            </Button>
          ) : null}

          {/* Helper note */}
          {!isLoading && !notif && (
            <ThemedView className="p-4 rounded-xl bg-error-50 border border-error-100">
              <ThemedText type="b3_body" className="text-error-700">
                Could not load this notification. Please go back and try again.
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
};

export default NotificationDetail;
