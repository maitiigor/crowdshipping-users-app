import { Link, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, TouchableOpacity, View } from "react-native";

import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { ChevronLeft, ChevronRight, Dot, PlusCircle } from "lucide-react-native";

const filterList = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "In Progress",
    value: "in-progress",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
];
export default function ChooseBeneficiary() {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("all");
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Select Bank
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
      <ThemedView className="flex-1 pb-20 px-2 overflow-hidden">
        <ThemedView className="mt-5">
          <FlatList
            data={[1, 2, 3]}
            contentContainerClassName="pb-10"
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                className={` flex-row justify-between items-center p-4 rounded-xl`}
              >
                {/* Make this container flexible and allow children to shrink */}
                <ThemedView className="flex-row items-center gap-2 flex-1 min-w-0">
                  <Image
                    source={require("@/assets/images/home/payment/bank-icon.png")}
                    alt="bank icon"
                    size="sm"
                    resizeMode="contain"
                    className=""
                  />
                  {/* Ensure the text area can wrap/shrink */}
                  <ThemedView className="flex-1 min-w-0">
                    <ThemedText
                      type="b2_body"
                      className="flex-wrap uppercase"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      Gbemisola Anu Adeleke
                    </ThemedText>
                    <ThemedView className="flex-row items-center gap-3">
                      <ThemedText
                        type="b4_body"
                        className="text-typography-500 uppercase"
                      >
                        OPAY
                      </ThemedText>

                      <ThemedText
                        type="b4_body"
                        className="text-typography-700 "
                      >
                        ********9083
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>

                <Icon
                  as={ChevronRight}
                  size="3xl"
                  className="text-typography-800"
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.toString()}
          />
          <ThemedView className="flex-row items-center gap-2  min-w-0">
            <Link href={`/payment-logs/add-bank`} asChild>
              <Pressable className="flex-row justify-end items-center gap-2 px-4 w-full">
                <Icon as={PlusCircle} size="3xl" className="text-primary-500" />
                <ThemedText
                  type="b2_body"
                  className="text-primary-500 text-right"
                >
                  Add Bank Account
                </ThemedText>
              </Pressable>
            </Link>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
