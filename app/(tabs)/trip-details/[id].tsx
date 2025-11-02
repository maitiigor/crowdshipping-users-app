import { BottomDrawer } from "@/components/Custom/BottomDrawer";
import { CustomModal } from "@/components/Custom/CustomModal";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import {
  Link,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";

import {
  ChevronLeft,
  Clock3,
  Dot,
  Handbag,
  MapPin,
  MessageCircleMore,
  NotepadText,
  Phone,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";

export default function TrackBidOrder() {
  const navigation = useNavigation();
  const router = useRouter();
  const [snap, setSnap] = useState(0.4);
  const [selectedDriver, setselectedDriver] = useState<any>(null);
  const [showModal, setShowModal] = useState(true);
  const [rating, setRating] = useState<number>(0);
  const { id } = useLocalSearchParams();

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Trip Details
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
              onLongPress={() => router.push("/(tabs)")}
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
        <ThemedView className="py-3 flex-1">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <ThemedView className="flex justify-center items-center gap-2 mb-4">
              <ThemedText type="s1_subtitle">
                Your Package is on the way
              </ThemedText>
              <ThemedView className="flex-row items-center">
                <ThemedText type="c1_caption" className="text-typography-700 ">
                  On the way{" "}
                </ThemedText>
                <Icon as={Dot} size="lg" className="text-typography-500" />
                <ThemedText type="c1_caption" className="text-typography-700 ">
                  June 24
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView className="gap-3">
              <ThemedView
                className={`flex-row items-center justify-between p-3 rounded-xl bg-primary-inputShade border border-typography-200 `}
              >
                <ThemedView className="flex-row gap-3">
                  <Link
                    href={{
                      pathname: "/(tabs)/trip-details/driver-details/[id]",
                      params: { id: Array.isArray(id) ? id[0] : id ?? "" },
                    }}
                  >
                    <Avatar size="lg">
                      <AvatarFallbackText>Segun Johnson</AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                        }}
                      />
                    </Avatar>
                  </Link>
                  <ThemedView className="flex gap-1">
                    <ThemedText
                      type="s2_subtitle"
                      className="text-typography-800"
                    >
                      Segun Johnson
                    </ThemedText>
                    <ThemedText type="default">⭐ 4.8 (243)</ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => {
                      // Handle press
                      router.push({
                        pathname:
                          "/(tabs)/inbox/chats/chat-details",
                        params: { id: Array.isArray(id) ? id[0] : id ?? "" },
                      });
                    }}
                  >
                    <Icon
                      as={MessageCircleMore}
                      size="2xl"
                      className="text-primary-500"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: "/(tabs)/inbox/calls/call-details",
                        params: { id: Array.isArray(id) ? id[0] : id ?? "" },
                      });
                    }}
                  >
                    <Icon as={Phone} size="2xl" className="text-primary-500" />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
              <HStack
                space="md"
                reversed={false}
                className="items-stretch mt-5"
              >
                <ThemedView className="flex-1 min-w-0  rounded-lg overflow-hidden">
                  <View className=" items-center">
                    <ThemedView className="bg-primary-50  w-[44px] h-[44px] rounded-full flex justify-center items-center mb-3">
                      <Icon
                        as={Clock3}
                        size="2xl"
                        className="text-primary-500"
                      />
                    </ThemedView>
                    <ThemedView className="flex justify-center items-center">
                      <ThemedText type="b4_body" className="">
                        2-3 days
                      </ThemedText>
                      <ThemedText
                        type="c1_caption"
                        className="text-typography-600 text-center"
                      >
                        Estimate Time
                      </ThemedText>
                    </ThemedView>
                  </View>
                </ThemedView>
                <ThemedView className="flex-1 min-w-0  rounded-lg overflow-hidden">
                  <View className=" items-center">
                    <ThemedView className="bg-primary-50  w-[44px] h-[44px] rounded-full flex justify-center items-center mb-3">
                      <Icon
                        as={Handbag}
                        size="2xl"
                        className="text-primary-500"
                      />
                    </ThemedView>
                    <ThemedView className="flex justify-center items-center">
                      <ThemedText type="b4_body" className="">
                        2.4Kg
                      </ThemedText>
                      <ThemedText
                        type="c1_caption"
                        className="text-typography-600 text-center"
                      >
                        Package Weight
                      </ThemedText>
                    </ThemedView>
                  </View>
                </ThemedView>
                <ThemedView className="flex-1 min-w-0 rounded-lg overflow-hidden">
                  <View className=" flex justify-center items-center">
                    <ThemedView className="bg-primary-50 w-[44px] h-[44px] rounded-full flex justify-center items-center mb-3">
                      <Icon
                        as={NotepadText}
                        size="2xl"
                        className="text-primary-500"
                      />
                    </ThemedView>
                    <ThemedView className="flex justify-center items-center">
                      <ThemedText type="b4_body" className="text-center">
                        #HWDSF7765DS
                      </ThemedText>
                      <ThemedText
                        type="c1_caption"
                        className="text-typography-600 text-center"
                      >
                        Track ID
                      </ThemedText>
                    </ThemedView>
                  </View>
                </ThemedView>
              </HStack>
            </ThemedView>
            {/* delivery timeline (vertical) */}
            <ThemedView className="mt-6 border p-5 rounded-xl border-typography-200">
              {/* Stop 1 */}
              {Array.from({ length: 6 }).map((_, i) => {
                // last item no line
                const totalStops = 6;
                const isLastItem = i === totalStops - 1;
                const isFirstItem = i === 0;
                return (
                  <ThemedView key={`stop-1-${i}`} className="flex-row">
                    <ThemedView className="items-center mr-3">
                      {isFirstItem ? (
                        <Icon
                          as={MapPin}
                          size="2xl"
                          className="text-primary-600"
                        />
                      ) : (
                        <ThemedView className="w-7 h-7 border-2 border-primary-500 rounded-full flex justify-center items-center">
                          <ThemedView className="bg-primary-600 w-3 h-3 rounded-full" />
                        </ThemedView>
                      )}
                      {/* connector */}
                      {!isLastItem && (
                        <ThemedView className="mt-2">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <ThemedView
                              key={`v-sep-1-${i}`}
                              className="w-1 h-2 rounded-full bg-typography-300 my-1"
                            />
                          ))}
                        </ThemedView>
                      )}
                    </ThemedView>
                    <ThemedView className="flex-1 pb-4">
                      <ThemedText
                        type="s2_subtitle"
                        className="text-typography-900"
                      >
                        54rd, Indiana town, Alabama
                      </ThemedText>
                      <ThemedText
                        type="c1_caption"
                        className="text-typography-600"
                      >
                        July 20, 2025 | 11:45 AM
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                );
              })}
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </BottomDrawer>
      {showModal && (
        <>
          <CustomModal
            description={
              rating > 0
                ? `Thank you, You rated our Driver ${
                    rating === 1
                      ? "one"
                      : rating === 2
                      ? "two"
                      : rating === 3
                      ? "three"
                      : rating === 4
                      ? "four"
                      : "five"
                  } star`
                : "Please leave a star review for your courier"
            }
            title="Shipping Completed"
            img={require("@/assets/images/onboarding/modal-success.png")}
            firstBtnLink={""}
            firstBtnText=""
            secondBtnLink={""}
            secondBtnText=""
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          >
            {/* create a star review component */}
            <ThemedView className="flex flex-col items-center mt-5">
              <ThemedView className="flex flex-row">
                {Array.from({ length: 5 }).map((_, i) => {
                  const idx = i + 1;
                  const filled = idx <= rating;
                  return (
                    <TouchableOpacity
                      onPress={() => handleStarClick(idx)}
                      key={`star-${i}`}
                      className="mx-1"
                    >
                      <AntDesign
                        name={filled ? "star" : "staro"}
                        size={40}
                        color={filled ? "#E75B3B" : "#C8C8C8"}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ThemedView>
              <VStack space="lg" className="w-full relative mt-5">
                <Link
                  href={{
                    pathname:
                      "/(tabs)/trip-details/driver-customer-feedback/[id]",
                    params: {
                      id: Array.isArray(id) ? id[0] : id ?? "",
                      rating: rating,
                    },
                  }}
                  asChild
                  className="flex-grow rounded-xl py-4 w-full bg-primary-500"
                >
                  <Pressable
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    <ThemedText
                      type="btn_large"
                      className="text-white w-full text-center"
                    >
                      Write a review
                    </ThemedText>
                  </Pressable>
                </Link>

                <Link
                  href={"/(tabs)"}
                  className="flex-grow border-2 border-primary-500 py-4 rounded-xl w-full text-primary-500"
                  asChild
                >
                  <Pressable onPress={() => setShowModal(false)}>
                    <ThemedText
                      type="btn_large"
                      className="text-primary-500 w-full text-center"
                    >
                      Cancel
                    </ThemedText>
                  </Pressable>
                </Link>
              </VStack>
            </ThemedView>
          </CustomModal>
        </>
      )}
    </ThemedView>
  );
}
