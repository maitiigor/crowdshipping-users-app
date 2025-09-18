import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/ui/icon";
import { useNavigation, useRouter } from "expo-router";
import { ChevronLeft, CircleCheckBig } from "lucide-react-native";
import React, { useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

export default function TransactionHistoryScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Transaction History
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
    <ThemedView className="flex-1 bg-white p-5">
      <ThemedView className="flex-1 gap-3 mt-3">
        <ThemedView className="flex">
          <ThemedView className="">
            <FlatList
              data={[1, 2, 3, 4, 5, 6, 7, 8]}
              contentContainerClassName="pb-20"
              ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {}}
                  className={` flex-row justify-between items-center py-4 rounded-xl`}
                >
                  {/* Make this container flexible and allow children to shrink */}
                  <ThemedView className="flex-row items-center gap-3 flex-1 min-w-0">
                    <ThemedView className="p-3 bg-primary-50 rounded-full">
                      <Icon
                        as={CircleCheckBig}
                        size="2xl"
                        className="text-primary-500"
                      />
                    </ThemedView>
                    {/* Ensure the text area can wrap/shrink */}
                    <ThemedView className="flex-1 min-w-0">
                      <ThemedText
                        type="b2_body"
                        className="flex-wrap"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        New Order Made
                      </ThemedText>
                      <ThemedView className="flex-row items-center">
                        <ThemedText
                          type="c1_caption"
                          className="text-typography-700 capitalize w-[80%]"
                        >
                          You have created a new Shipping order
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>

                  <ThemedText
                    type="c1_caption"
                    className="flex-wrap text-primary-500"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    1 hour ago
                  </ThemedText>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.toString()}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
