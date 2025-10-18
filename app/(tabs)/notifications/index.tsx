import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useAuthenticatedQuery } from "@/lib/api/index";
import { INotificationsResponse } from "@/types/INotification";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BellIcon, ChevronLeft } from "lucide-react-native";
import { EmptyState } from "@/components/Custom/EmptyState";

// dayjs fromNow plugin

dayjs.extend(relativeTime);

export default function NotificationScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { data, isLoading, refetch } = useAuthenticatedQuery<
    INotificationsResponse | undefined
  >(["notifications"], "/notification");
  const notifList = Array.isArray(data?.data) ? data!.data : [];
  const unreadNotifications = notifList.filter((notif) => !notif.isRead);
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

  // i want to refetch the notifications when the user comes back to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      refetch();
    });

    return unsubscribe;
  }, [navigation, refetch]);
  return (
    <ThemedView className="flex-1 bg-white pt-3">
      <ThemedView className="flex-1 pb-20 px-[18px] overflow-hidden">
        <ThemedView className="mt-5">
          {isLoading ? (
            Array.from({ length: 7 }).map((_: any, index: number) => (
              <ThemedView key={index} className="w-full">
                <Box className="w-full gap-4 p-3 rounded-md ">
                  <SkeletonText _lines={3} className="h-2" />
                  <HStack className="gap-1 align-middle">
                    <Skeleton
                      variant="circular"
                      className="h-[24px] w-[28px] mr-2"
                    />
                    <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
                  </HStack>
                </Box>
              </ThemedView>
            ))
            ) : (
            <FlatList
              data={unreadNotifications}
              ListEmptyComponent={
              <EmptyState
                title="No unread notifications"
                description="You have no unread notifications at the moment. Check back later for updates."
                icon={BellIcon}
                className="mt-10"
              />
              }
              contentContainerClassName="pb-[200px]"
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/(tabs)/notifications/[id]",
                      params: {
                        id: item?._id,
                      },
                    });
                  }}
                  className={` flex-row justify-between items-center p-4`}
                >
                  {/* Make this container flexible and allow children to shrink */}
                  <ThemedView className="flex gap-2 flex-1 min-w-0">
                    <ThemedView className="flex-row justify-between items-center min-w-0">
                      <ThemedText
                        type="s1_subtitle"
                        className="flex-wrap w-[80%]"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.title}
                      </ThemedText>
                      <ThemedText
                        type="c1_caption"
                        className="text-typography-700 capitalize"
                      >
                        {dayjs(item?.updatedAt || item.createdAt).fromNow()}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row items-center">
                      <ThemedText
                        type="default"
                        className="text-typography-700 flex-1"
                      >
                       {item.message.length > 80
                          ? item.message.substring(0, 80) + "..."
                          : item.message}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id.toString()}
            />
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
