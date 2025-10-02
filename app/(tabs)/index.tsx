import {
  FlatList,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Link, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { BottomDrawer } from "@/components/Custom/BottomDrawer";
import CustomSidebarMenu from "@/components/Custom/CustomSidebarMenu";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import Feather from "@expo/vector-icons/Feather";
import { ChevronDown, MapPin } from "lucide-react-native";
import MapView from "react-native-maps";
import { useAuthenticatedQuery } from "@/lib/api";
import { IUserProfileResponse } from "@/types/IUserProfile";

type MenuItem = {
  img: string | ImageSourcePropType | undefined;
  titleKey: "home.land" | "home.air" | "home.sea";
  linkTo: string;
};
const deliveryType: MenuItem[] = [
  {
    img: require("@/assets/images/home/road-delivery.png"),
    titleKey: "home.land",
    linkTo: "/(tabs)/road-delivery",
  },
  {
    img: require("@/assets/images/home/flight-delivery.png"),
    titleKey: "home.air",
    linkTo: "/(tabs)/trips",
  },

  {
    img: require("@/assets/images/home/maritime-delivery.png"),
    titleKey: "home.sea",
    linkTo: "/(tabs)/trips",
  },
];
export default function HomeScreen() {
  const navigation = useNavigation();
  const [showDrawer, setShowDrawer] = useState(false);
  const [snap, setSnap] = useState(0.4);
const {
  data,
  isLoading,
  isFetching,
  error,
  refetch,
  loading, // alias
  fetching, // alias
} = useAuthenticatedQuery<IUserProfileResponse>(["me"], "/user/profile");
  const router = useRouter();

  const { t } = useTranslation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: "#FFFFFF",
        elevation: 0, // Android
        shadowOpacity: 0, // iOS
        shadowColor: "transparent", // iOS
        borderBottomWidth: 0,
      },
      headerTitle: () => (
        <ThemedView className="flex justify-center items-center">
          <ThemedText className="text-center" type="s1_subtitle">
            {/* Example: Keep static or make dynamic via user profile */}
            Hello, Gbemisola
          </ThemedText>
          <ThemedView className="flex-row gap-2 items-center">
            <Icon as={MapPin} size="lg" className="text-primary-500" />
            <ThemedText className="text-center" type="c2_caption">
              Ikeja Army cantonment,...
            </ThemedText>
            <Icon as={ChevronDown} size="2xl" className="text-typography-600" />
          </ThemedView>
        </ThemedView>
      ),
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            setShowDrawer(true);
          }}
          className="shadow"
          style={{ paddingHorizontal: 0 }}
        >
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 0 }}
        >
          <ThemedText className="text-center" type="s1_subtitle">
            NG
          </ThemedText>
        </TouchableOpacity>
      ),
    });
  }, [navigation, t, t]);
  const ongoingTrips = [
    {
      id: "1",
      lat: 37.78825,
      lng: -122.4324,
    },
    {
      id: "2",
      lat: 37.78825,
      lng: -122.4324,
    },
  ];
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView>
            <ThemedText className="text-center mt-5" type="h4_header">
              {t("home.send_package")}
            </ThemedText>
            <ThemedText
              className="text-center text-typography-700"
              type="default"
            >
              {t("home.subtitle")}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView
          className={`flex-1 gap-5 pb-20 mt-3 ${
            ongoingTrips.length > 0 ? "mb-96" : ""
          }`}
        >
          {deliveryType.map((item, index) => (
            <Pressable
              key={item.titleKey}
              onPress={() => router.push(item.linkTo as any)}
              className="flex items-center gap-2 h-[165px] w-full"
              style={
                {
                  backgroundColor: "#FFFFFF",
                  padding: 12,
                  borderRadius: 8,
                  // web shadow (as provided)
                  boxShadow:
                    "0px 1px 3px 1px #FDEFEB26, 0px 1px 2px 0px #0000004D",
                  // iOS shadow approximation
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  // Android elevation
                  elevation: 2,
                } as any
              }
            >
              <Image
                source={item.img}
                className="h-[100px] w-[100px] object-contain"
                alt={t(item.titleKey)}
              />
              <ThemedText className="text-typography-700" type="h5_header">
                {t(item.titleKey)}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
        <CustomSidebarMenu
          userProfileData={data as IUserProfileResponse}
          isLoading={isLoading}
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
        />
      </ParallaxScrollView>
      {ongoingTrips.length > 0 && (
        <BottomDrawer
          initialSnap={0.4}
          snapPoints={[0.4, 1]}
          onSnapChange={setSnap}
          snap={snap}
        >
          <View className="py-3 flex-1">
            <ThemedView className={`gap-3 flex-1 ${snap === 1 ? "mt-10" : ""}`}>
              {/* Placeholder list items */}
              <FlatList
                data={ongoingTrips}
                nestedScrollEnabled
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
                renderItem={({ item, index }) => (
                  <ThemedView key={item.id} className="p-2 bg-white">
                    <ThemedView className="flex-row justify-between items-center pb-3">
                      <ThemedText
                        type="s2_subtitle"
                        className="text-typography-800 flex-1"
                      >
                        Ongoing Trip
                      </ThemedText>
                      <Link
                        href={{
                          pathname: "/(tabs)/trip-details/[id]",
                          params: { id: item.id },
                        }}
                        className=" rounded-[12px] bg-primary-50 p-3 px-5"
                      >
                        <ThemedText
                          type="btn_medium"
                          className="text-primary-500"
                        >
                          View
                        </ThemedText>
                      </Link>
                    </ThemedView>
                    <MapView
                      style={{ height: 180, width: "100%", borderRadius: 8 }}
                      initialRegion={{
                        latitude: item.lat,
                        longitude: item.lng,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                      }}
                      showsUserLocation
                    />
                  </ThemedView>
                )}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={{ paddingBottom: 50 }}
                // i need gap between each item
                ItemSeparatorComponent={() => <View className="h-2" />}
              />
            </ThemedView>
          </View>
          {snap === 1 && (
            <ThemedView className="absolute bottom-0 left-0 right-0 px-5">
              <Button
                onPress={() => {
                  setSnap(0.4);
                }}
                variant="solid"
                size="2xl"
                className="mt-5 rounded-[12px]"
              >
                <ThemedText type="s1_subtitle" className="text-white">
                  Close
                </ThemedText>
              </Button>
            </ThemedView>
          )}
        </BottomDrawer>
      )}
    </>
  );
}

// styles removed (unused)
