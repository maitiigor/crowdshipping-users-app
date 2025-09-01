import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { CircleIcon, Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { VStack } from "@/components/ui/vstack";
import { useNavigation, useRouter } from "expo-router";
import { Bell, ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

const paymentList = [
  {
    id: "1",
    img: require("../../assets/images/home/payment/wallet.png"),
    title: "My Wallet",
  },
  {
    id: "2",
    img: require("../../assets/images/home/payment/paypal.png"),
    title: "Paypal",
  },
  {
    id: "3",
    img: require("../../assets/images/home/payment/apple.png"),
    title: "Apple Pay",
  },
  {
    id: "4",
    img: require("../../assets/images/home/payment/google.png"),
    title: "Google Pay",
  },
  {
    id: "5",
    img: require("../../assets/images/home/payment/mastercard.png"),
    title: "**** **** **** **** 5745",
  },
];
export default function ChoosePaymentType() {
  const navigation = useNavigation();
  const router = useRouter();
  const [values, setValues] = useState("");
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Payment
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
  }, [navigation]);
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 pb-20">
            <ThemedView>
              <ThemedText type="s1_subtitle" className="">
                Select Payment
              </ThemedText>
            </ThemedView>

            <ThemedView className="mt-5">
              <RadioGroup value={values} onChange={setValues}>
                <VStack space="2xl">
                  {paymentList.map((item) => (
                    <Radio
                      size="lg"
                      key={item.id}
                      className="flex-row justify-between items-center border p-4 border-primary-100 rounded-lg"
                      value={item?.id}
                    >
                      <ThemedView className="flex-row items-center gap-5">
                        <Image
                          source={item.img}
                          resizeMode="contain"
                          alt={item.title}
                          className="w-10 h-10"
                        />
                        <RadioLabel>
                          <ThemedText type="b2_body" className="">
                            {item.title}
                          </ThemedText>
                        </RadioLabel>
                      </ThemedView>
                      <RadioIndicator>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                    </Radio>
                  ))}
                </VStack>
              </RadioGroup>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      <ThemedView className="absolute pt-6 pb-10 bottom-0 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
        <Button
          variant="solid"
          size="2xl"
          disabled={values === "" ? true : false}
          onPress={() => {
            router.push("/(tabs)/confirm-payment-pin");
          }}
          className="flex-1 rounded-[12px] mx-1"
        >
          <ThemedText type="s2_subtitle" className="text-white text-center">
            Continue
          </ThemedText>
        </Button>
      </ThemedView>
    </>
  );
}
