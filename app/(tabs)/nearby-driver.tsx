import { BottomDrawer } from "@/components/Custom/BottomDrawer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation, useRouter } from "expo-router";
import { Bell, ChevronLeft, SearchIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";

const driverList = [
  {
    id: "1",
    name: "Segun Johnson",
    location: "Ikeja",
    rating: 4.5,
    time: "2 min",
  },
  {
    id: "2",
    name: "Abdulkadir Newton",
    location: "Victoria Island",
    rating: 4.7,
    time: "3 min",
  },
  {
    id: "3",
    name: "Driver 3",
    location: "Lekki",
    rating: 4.6,
    time: "4 min",
  },
];
export default function NearbyDriverScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [snap, setSnap] = useState(0.4);
  const [selectedDriver, setselectedDriver] = useState<any>(null);
  console.log("🚀 ~ NearbyDriverScreen ~ snap:", snap);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Nearby Drivers
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
      headerRight: () => (
        <TouchableOpacity onPress={() => {}} style={{ paddingHorizontal: 0 }}>
          <Icon as={Bell} size="2xl" className="text-typography-900" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);
  return (
    <ThemedView className="flex-1 bg-white relative">
      {/* map */}
      <View className="absolute  top-14 left-0 right-0 z-50 items-center">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="bg-white w-[40px] h-[35px] shadow-lg rounded items-center justify-center absolute left-5"
          style={{ paddingHorizontal: 0 }}
        >
          <Entypo name="chevron-left" size={24} color="#131927" />
        </TouchableOpacity>

        <ThemedView className="flex-row gap-2 top-1 relative bg-primary-100 py-1 rounded px-2 items-center justify-center">
          <ThemedText type="default" className="text-typography-950">
            Amount
          </ThemedText>
          <ThemedText type="btn_large" className="text-typography-950">
            ₦2,913,500
          </ThemedText>
        </ThemedView>
      </View>
      <MapView
        style={{ height: "100%", width: "100%" }}
        initialRegion={{
          latitude: 6.5244,
          longitude: 3.3792,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      />

      <ThemedView className="absolute bottom-10 left-0 right-0 px-5">
        <Button variant="solid" size="2xl" className="mt-5 rounded-[12px]">
          <ThemedText type="btn_large" className="text-white">
            Select Driver
          </ThemedText>
        </Button>
      </ThemedView>
      {/* drawer */}
      <BottomDrawer
        initialSnap={0.4}
        snapPoints={[0.4, 1]}
        onSnapChange={setSnap}
      >
        <View className="py-3 flex-1">
          <ThemedView className="flex-row items-center justify-between mb-3">
            <ThemedText type="b2_body">Select Nearby drivers</ThemedText>
          </ThemedView>
          <ThemedView className="gap-3 flex-1">
            {/* Placeholder list items */}
            {snap === 1 && (
              <Input
                size="lg"
                className="h-[55px] border rounded-t rounded-2xl border-primary-100 bg-primary-inputShade"
                variant="outline"
              >
                <InputSlot className="pl-3">
                  <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField placeholder={"Search Driver"} />
              </Input>
            )}
            <FlatList
              data={driverList}
              nestedScrollEnabled
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1 }}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => setselectedDriver(item)}
                  className={`flex-row items-center justify-between p-3 rounded-xl bg-primary-inputShade border  ${
                    selectedDriver === item
                      ? "bg-primary-0 border-primary-300"
                      : "border-typography-200"
                  }`}
                >
                  <ThemedView className="flex-row gap-3">
                    <Avatar size="lg">
                      <AvatarFallbackText>
                        {item.name.charAt(0)} {index + 1}
                      </AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                        }}
                      />
                    </Avatar>
                    <ThemedView className="flex gap-1">
                      <ThemedText
                        type="s2_subtitle"
                        className="text-typography-800"
                      >
                        {item.name}
                      </ThemedText>
                      <ThemedText type="default">
                        ⭐ {item.rating} (243)
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>

                  <ThemedView className="flex gap-1">
                    <ThemedText type="s2_subtitle">{item.time}</ThemedText>
                    <ThemedText type="default" className="text-typography-500">
                      Away
                    </ThemedText>
                  </ThemedView>
                </Pressable>
              )}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              contentContainerStyle={{ paddingBottom: 100 }}
              // i need gap between each item
              ItemSeparatorComponent={() => <View className="h-2" />}
            />
          </ThemedView>
        </View>
        {selectedDriver && (
          <ThemedView className="absolute bottom-0 left-0 right-0 px-5">
            <Button
              onPress={() => {
                router.push("/(tabs)/package-summary");
              }}
              variant="solid"
              size="2xl"
              className="mt-5 rounded-[12px]"
            >
              <ThemedText type="s1_subtitle" className="text-white">
                Continue
              </ThemedText>
            </Button>
          </ThemedView>
        )}
      </BottomDrawer>
    </ThemedView>
  );
}
