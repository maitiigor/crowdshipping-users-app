import { BottomDrawer } from "@/components/Custom/BottomDrawer";
import InputLabelText from "@/components/Custom/InputLabelText";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon, InfoIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";

import { ChevronLeft, Clock3, DollarSign, MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";

export default function TripDetailsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [snap, setSnap] = useState(0.5);
  const [rating, setRating] = useState<number>(0);
  const { tripTypeId } = useLocalSearchParams();

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
        <ThemedView className=" w-[90%]  p-3 rounded-lg  bg-white">
          <ThemedView
            className={`flex-row items-center
             justify-between
          `}
          >
            <ThemedView className="flex-row gap-3">
              <Avatar size="lg">
                <AvatarFallbackText>John Donald</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                  }}
                />
              </Avatar>
              <ThemedView className="flex gap-1">
                <ThemedText type="s2_subtitle" className="text-typography-800">
                  John Donald
                </ThemedText>

                <ThemedView className="flex-row flex-1 items-center gap-1">
                  <Icon as={Clock3} />
                  <ThemedText type="btn_small">Ikeja, Lagos→Canada</ThemedText>
                </ThemedView>
                <ThemedView className="flex-row flex-1 items-center gap-1">
                  <Icon as={MapPin} />
                  <ThemedText type="btn_small">Ikeja, Lagos→Canada</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            <ThemedView className="flex gap-1">
              <ThemedText type="s2_subtitle">2km</ThemedText>
              <ThemedText type="default" className="text-typography-500">
                Away
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView className="flex-row mt-5 justify-between items-center  gap-3">
            <ThemedText type="b2_body" className="text-typography-900">
              $5000
            </ThemedText>
            <ThemedView className="flex-row w-[60%] justify-between gap-3">
              <Button
                variant="outline"
                size="lg"
                className=" rounded-[12px] "
                onPress={() => {
                  router.back();
                }}
              >
                <ThemedText type="btn_medium" className="text-primary-500">
                  Decline
                </ThemedText>
              </Button>
              <Button
                variant="solid"
                size="lg"
                className=" rounded-[12px] flex-1"
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/trips/confirm-pay",
                    params: { id: tripTypeId as string },
                  });
                }}
              >
                <ThemedText type="btn_medium" className="text-white">
                  Accept
                </ThemedText>
              </Button>
            </ThemedView>
          </ThemedView>
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
        initialSnap={0.5}
        snapPoints={[0.5, 1]}
        onSnapChange={setSnap}
      >
        <ThemedView className="py-3 flex-1">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <Formik
              initialValues={{
                bidAmount: "",
              }}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload = {
                  ...values,
                  // force date to null if booking type is instant
                };
                console.log("Form submitted:", payload);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <ThemedView className="flex gap-4 mt-5">
                  <ThemedView>
                    <InputLabelText className="">
                      Your Bid Amount (in USD)
                    </InputLabelText>
                    <Input
                      size="xl"
                      className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                      variant="outline"
                      isInvalid={!!(errors.bidAmount && touched.bidAmount)}
                    >
                      <InputField
                        className=""
                        placeholder="Input your bid amount"
                        value={values.bidAmount}
                        onChangeText={handleChange("bidAmount")}
                        onBlur={handleBlur("bidAmount")}
                        keyboardType="numeric"
                        autoCapitalize="none"
                      />
                      <InputSlot className="pl-3">
                        <InputIcon as={DollarSign} />
                      </InputSlot>
                    </Input>
                    {errors.bidAmount && touched.bidAmount && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.bidAmount}
                      </ThemedText>
                    )}
                  </ThemedView>

                  <ThemedView>
                    <Alert action="error" variant="solid" className=" p-2">
                      <AlertIcon
                        size="xl"
                        as={InfoIcon}
                        className="text-error-600"
                      />
                      <AlertText>
                        <ThemedText type="b3_body" className="text-error-600">
                          Please note: Once the booking is accepted and payment
                          is completed, no modifications are allowed for
                          Maritime and Air deliveries.
                        </ThemedText>
                      </AlertText>
                    </Alert>
                  </ThemedView>

                  <ThemedView className="flex-row justify-between flex-1 gap-3">
                    <Button
                      variant="outline"
                      size="2xl"
                      className="mt-5 rounded-[12px] "
                      onPress={() => {
                        router.back();
                      }}
                    >
                      <ThemedText
                        type="s1_subtitle"
                        className="text-primary-500"
                      >
                        Cancel Bid
                      </ThemedText>
                    </Button>
                    <Button
                      variant="solid"
                      size="2xl"
                      disabled={!values.bidAmount}
                      className="mt-5 rounded-[12px] flex-1"
                      onPress={() => handleSubmit()}
                    >
                      <ThemedText type="s1_subtitle" className="text-white">
                        Send Bid
                      </ThemedText>
                    </Button>
                  </ThemedView>
                </ThemedView>
              )}
            </Formik>

            <ThemedView className="border border-primary-50 p-5 rounded-2xl mt-10 flex gap-5">
              <ThemedView className="flex gap-5">
                <ThemedView className="flex justify-between flex-1 gap-1 pb-4">
                  <ThemedText
                    type="s1_subtitle"
                    className="text-typography-800 flex-1"
                  >
                    Urgent Documents to VI
                  </ThemedText>
                  <ThemedView className="flex-row flex-1 items-center gap-1">
                    <Icon as={MapPin} />
                    <ThemedText type="default">Ikeja, Lagos→Canada</ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedView className="flex-row gap-2 justify-between">
                  <ThemedText
                    type="s2_subtitle"
                    className="text-typography-800"
                  >
                    Weight
                  </ThemedText>
                  <ThemedText
                    type="default"
                    className="text-typography-500 flex-1 text-right"
                  >
                    2kg
                  </ThemedText>
                </ThemedView>
                <ThemedView className="flex-row gap-2 justify-between">
                  <ThemedText
                    type="s2_subtitle"
                    className="text-typography-800"
                  >
                    Amount
                  </ThemedText>
                  <ThemedText
                    type="default"
                    className="text-typography-500 flex-1 text-right"
                  >
                    $200
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </BottomDrawer>
    </ThemedView>
  );
}
