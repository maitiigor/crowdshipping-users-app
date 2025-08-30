import { BottomDrawer } from "@/components/Custom/BottomDrawer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation, useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";

export default function NearbyDriverScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [snap, setSnap] = useState(0.4);
  console.log("🚀 ~ NearbyDriverScreen ~ snap:", snap);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitle: "Nearby Drivers",
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20, fontWeight: "bold" }, // Increased font size
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{ paddingHorizontal: 0 }}
        >
          <Entypo name="chevron-left" size={34} color="#131927" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => {}} style={{ paddingHorizontal: 0 }}>
          <Icon as={Bell} size="2xl" className="text-typography-900" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
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
        <View className="py-3">
          <View className="flex-row items-center justify-between mb-3">
            <ThemedText type="b2_body">Nearby drivers</ThemedText>
            <ThemedText type="default" className="text-typography-500">
              {Math.round(snap * 100)}%
            </ThemedText>
          </View>
          <View className="gap-3">
            {/* Placeholder list items */}
            <View className="flex-row justify-between items-center p-3 bg-background-50 rounded-xl">
              <ThemedText type="default">Alex • 4.9⭐ • 2 min</ThemedText>
              <ThemedText type="default" className="text-primary-600">
                ₦1,200
              </ThemedText>
            </View>
            <View className="flex-row justify-between items-center p-3 bg-background-50 rounded-xl">
              <ThemedText type="default">Maya • 4.7⭐ • 3 min</ThemedText>
              <ThemedText type="default" className="text-primary-600">
                ₦1,150
              </ThemedText>
            </View>
            <View className="flex-row justify-between items-center p-3 bg-background-50 rounded-xl">
              <ThemedText type="default">John • 4.8⭐ • 4 min</ThemedText>
              <ThemedText type="default" className="text-primary-600">
                ₦1,180
              </ThemedText>
            </View>
          </View>
        </View>
      </BottomDrawer>
    </ThemedView>
  );
}
