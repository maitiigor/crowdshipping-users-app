import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { useNavigation, useRouter } from "expo-router";
import { ChevronLeft, CircleCheckBig } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentLogScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("");
  const filterList = [
    {
      label: "Withdrawal",
      value: "withdrawal",
      onPress: () => {
        router.push({
          pathname: "/(tabs)/payment-logs/withdrawal",
        });
      },
    },
    {
      label: "Top Up",
      value: "top Up",
      onPress: () => {
        router.push({
          pathname: "/(tabs)/payment-logs/top-up",
        });
      },
    },
  ];
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Payment Logs
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
  // useEffect(() => {
  //   // Ensure "withdrawal" is active when the screen mounts and every time it gains focus
  //   setSelectedFilter("withdrawal");
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     setSelectedFilter("withdrawal");
  //   });
  //   return unsubscribe;
  // }, [navigation]);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
    >
      <ThemedView className="flex-1">
        <ThemedView className="flex-1 gap-3  pb-40 mt-3">
          <ImageBackground
            source={require("@/assets/images/home/bg-card.png")}
            resizeMode="cover"
            className="flex justify-center p-5 items-center rounded-xl h-[220px]"
            // ensure the actual image and container are clipped to rounded corners
            style={{ borderRadius: 16, overflow: "hidden" }}
            imageStyle={{ borderRadius: 16 }}
          >
            <ThemedView className=" flex h-full w-full justify-center items-center">
              <ThemedText type="h5_header" className="text-white">
                Total Balance
              </ThemedText>
              <ThemedText type="h3_header" className="text-white mt-4">
                ****
              </ThemedText>
            </ThemedView>
          </ImageBackground>
          <ThemedView className="mt-5 flex-row gap-3">
            {filterList.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedFilter(item.value as string);
                  item.onPress();
                }}
                className={`border-2 flex-1 p-3 border-primary-500 rounded-xl ${
                  selectedFilter === item.value ? "bg-primary-500" : ""
                }`}
              >
                <ThemedText
                  type="s2_subtitle"
                  className={` text-center ${
                    selectedFilter === item.value
                      ? "text-white"
                      : "text-primary-500"
                  }`}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
          <ThemedView className="flex-row justify-between gap-3 mt-5 items-center">
            <ThemedText type="s1_subtitle">Transaction History</ThemedText>
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/payment-logs/transaction-history",
                });
              }}
            >
              <ThemedText type="default" className="text-primary-500">
                See all
              </ThemedText>
            </Pressable>
          </ThemedView>
          <ThemedView className="flex">
            <ThemedView className="mt-5">
              <FlatList
                scrollEnabled={false}
                data={[1, 2, 3, 4, 5, 6, 7, 8].slice(0, 5)}
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
    </ParallaxScrollView>
  );
}
