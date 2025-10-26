import { BottomDrawer } from "@/components/Custom/BottomDrawer";
import CustomToast from "@/components/Custom/CustomToast";
import NotificationIcon from "@/components/Custom/NotificationIcon";
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
import { useToast } from "@/components/ui/toast";
import { useCountry } from "@/hooks/useCountry";
import { useAuthenticatedPatch } from "@/lib/api";
import { useAppSelector } from "@/store";
import { IPickupByDriverResponse } from "@/types/IPickupByDriver";
import { formatCurrency } from "@/utils/helper";
import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  ChevronLeft,
  CircleCheckIcon,
  HelpCircleIcon,
  SearchIcon,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function NearbyDriverScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id, response } = useLocalSearchParams();
  console.log("🚀 ~ NearbyDriverScreen ~ id:", id);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const fallbackTripId = "";
  const tripId = useMemo(() => {
    if (Array.isArray(id) && id.length > 0) return String(id[0]);
    if (typeof id === "string" && id.trim().length > 0) return id;
    return fallbackTripId;
  }, [id]);
  const { mutateAsync, error, loading } = useAuthenticatedPatch<
    any,
    {
      driverId: string;
      amount: number;
    }
    >(`/trip/select/driver/${tripId}`);
    const { country, countryCode } = useCountry();
    // Get the selected country from Redux
    const selectedCountry = useAppSelector(
      (state) => state.country.selectedCountry
    );
    const currency = selectedCountry?.currencies?.[0];
    const selectedCurrency = currency?.code || "NGN";
  const responseObj: IPickupByDriverResponse | null = (() => {
    if (response == null) return null;
    const respStr = String(response).trim();
    if (!respStr || respStr === "undefined" || respStr === "null") return null;
    try {
      const decoded = decodeURIComponent(respStr);
      const parsed = JSON.parse(decoded);
      if (typeof parsed === "string") {
        try {
          return JSON.parse(parsed) as IPickupByDriverResponse;
        } catch (innerErr) {
          console.warn(
            "NearbyDriverScreen: failed to parse nested response param",
            innerErr
          );
          return null;
        }
      }
      return parsed as IPickupByDriverResponse;
    } catch (err) {
      console.warn("NearbyDriverScreen: failed to parse response param", err);
      return null;
    }
  })();
  console.log("🚀 ~ NearbyDriverScreen ~ responseObj:", responseObj);
  const [snap, setSnap] = useState(0.4);
  const [selectedDriver, setselectedDriver] = useState<any>(null);
  console.log("🚀 ~ NearbyDriverScreen ~ snap:", snap);

  // Use actual nearby drivers from API response or empty array as fallback
  const driverList = responseObj?.data?.nearby_drivers || [];
  console.log("🚀 ~ NearbyDriverScreen ~ driverList:", driverList);

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
      headerRight: () => <NotificationIcon />,
    });
  }, [navigation, router]);
  const showNewToast = ({
    title,
    description,
    icon,
    action = "error",
    variant = "solid",
  }: {
    title: string;
    description: string;
    icon: typeof HelpCircleIcon;
    action: "error" | "success" | "info" | "muted" | "warning";
    variant: "solid" | "outline";
  }) => {
    const toastId = Math.random().toString();
    toast.show({
      id: toastId,
      placement: "top",
      duration: 3000,
      render: ({ id: innerId }) => (
        <CustomToast
          uniqueToastId={`toast-${innerId}`}
          icon={icon}
          action={action}
          title={title}
          variant={variant}
          description={description}
        />
      ),
    });
  };
  const initialLatitude = selectedDriver
    ? selectedDriver.geoLocation?.coordinates?.[1] ?? 0
    : responseObj?.data?.nearby_drivers?.[0]?.geoLocation?.coordinates?.[1] ??
      0;
  const initialLongitude = selectedDriver
    ? selectedDriver.geoLocation?.coordinates?.[0] ?? 0
    : responseObj?.data?.nearby_drivers?.[0]?.geoLocation?.coordinates?.[0] ??
      0;
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return driverList;
    return driverList.filter((c) => c.user?.fullName.toLowerCase().includes(q));
  }, [driverList, search]);
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
            {formatCurrency(responseObj?.data?.amount, selectedCurrency, `en-${countryCode}`)}
          </ThemedText>
        </ThemedView>
      </View>
      <MapView
        style={{ height: "100%", width: "100%" }}
        initialRegion={{
          latitude: initialLatitude,
          longitude: initialLongitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {driverList.map((driver: any) => {
          const longitude = driver?.geoLocation?.coordinates?.[0] ?? 0;
          const latitude = driver?.geoLocation?.coordinates?.[1] ?? 0;
          const isSelected = selectedDriver?._id === driver._id;

          return (
            <Marker
              key={driver._id ?? `${latitude}-${longitude}`}
              coordinate={{ latitude, longitude }}
              title={driver.user?.fullName}
              description={`${driver.minutesAway ?? "-"} min away`}
              pinColor={isSelected ? "green" : "red"}
              onPress={() => setselectedDriver(driver)}
            />
          );
        })}
      </MapView>

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
                <InputField
                  value={search}
                  onChangeText={setSearch}
                  placeholder={"Search Driver"}
                />
              </Input>
            )}
            <FlatList
              data={filtered}
              nestedScrollEnabled
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1 }}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => setselectedDriver(item)}
                  className={`flex-row items-center justify-between p-3 rounded-xl bg-primary-inputShade border  ${
                    selectedDriver?._id ?? null === item._id
                      ? "bg-primary-0 border-primary-300"
                      : "border-typography-200"
                  }`}
                >
                  <ThemedView className="flex-row gap-3">
                    <Avatar size="lg">
                      <AvatarFallbackText>
                        {item.user.fullName}
                      </AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: item.profilePicUrl || "",
                        }}
                      />
                    </Avatar>
                    <ThemedView className="flex gap-1">
                      <ThemedText
                        type="s2_subtitle"
                        className="text-typography-800"
                      >
                        {item.user.fullName}
                      </ThemedText>
                      <ThemedText type="default">
                        ⭐ {item.rating.avg} ({item.rating.count})
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>

                  <ThemedView className="flex gap-1">
                    <ThemedText type="s2_subtitle">
                      {item.minutesAway} min
                    </ThemedText>
                    <ThemedText type="default" className="text-typography-500">
                      Away
                    </ThemedText>
                  </ThemedView>
                </Pressable>
              )}
              keyExtractor={(item, index) => `${item._id}-${index}`}
              contentContainerStyle={{ paddingBottom: 100 }}
              // i need gap between each item
              ItemSeparatorComponent={() => <View className="h-2" />}
            />
          </ThemedView>
        </View>
        {selectedDriver && (
          <ThemedView className="absolute bottom-0 left-0 right-0 px-5">
            <Button
              disabled={loading}
              onPress={async () => {
                try {
                  const response = await mutateAsync({
                    driverId: selectedDriver._id,
                    amount: responseObj?.data?.amount || 0,
                  });
                  console.log("🚀 ~ NearbyDriverScreen ~ response:", response);
                  setTimeout(() => {
                    router.push({
                      pathname: "/(tabs)/package-summary",
                      params: {
                        tripId: tripId,
                        amount: responseObj?.data?.amount || 0,
                      },
                    });
                  }, 500);

                  showNewToast({
                    title: "Driver selection saved",
                    description: "Your driver selection was saved successfully",
                    icon: CircleCheckIcon,
                    action: "success",
                    variant: "solid",
                  });
                } catch (error: any) {
                  const message =
                    error?.data?.message ||
                    error?.message ||
                    (typeof error === "string" ? error : undefined) ||
                    "Unable to add packages";
                  console.log("🚀 ~ handleFormSubmit ~ message:", message);

                  showNewToast({
                    title: "Driver selection failed",
                    description: message,
                    icon: HelpCircleIcon,
                    action: "error",
                    variant: "solid",
                  });
                }
              }}
              variant="solid"
              size="2xl"
              className="mt-5 rounded-[12px]"
            >
              <ThemedText type="s1_subtitle" className="text-white">
                {loading ? <ActivityIndicator color="white" /> : "Continue"}
              </ThemedText>
            </Button>
          </ThemedView>
        )}
      </BottomDrawer>
    </ThemedView>
  );
}
