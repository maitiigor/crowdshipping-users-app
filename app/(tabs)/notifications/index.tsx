import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/ui/icon";
import { ChevronLeft, Dot } from "lucide-react-native";

export default function NotificationScreen() {
  const navigation = useNavigation();
  const router = useRouter();

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
  return (
    <ThemedView className="flex-1 bg-white pt-3">
      <ThemedView className="flex-1 pb-20 px-[18px] overflow-hidden">
        <ThemedView className="mt-5">
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8]}
            contentContainerClassName="pb-[200px]"
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/booking-history/[id]",
                    params: {
                      id: item,
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
                      className="flex-wrap"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      Booking Confirmed
                    </ThemedText>
                    <ThemedText
                      type="c1_caption"
                      className="text-typography-700 capitalize"
                    >
                      2 days ago
                    </ThemedText>
                  </ThemedView>
                    <ThemedView className="flex-row items-center">
                      <ThemedText
                        type="default"
                        className="text-typography-700 flex-1"
                      >
                        Your delivery #ID342424 from California to Nigeria is
                        confirmed.
                      </ThemedText>
                    </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.toString()}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
