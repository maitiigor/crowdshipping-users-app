import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { useNavigation, useRouter } from "expo-router";
import { CircleEllipsis, Download, Send, X } from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";

export default function PaymentReceipts() {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Receipts
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
              onPress={() => router.push("/(tabs)")}
              className="p-2 rounded   flex justify-center items-center"
            >
              <Icon as={X} size="3xl" className="text-typography-900" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      ),
      headerRight: () => (
        <Menu
          placement="bottom"
          className="mr-2 relative right-2 top-3"
          offset={5}
          trigger={({ ...triggerProps }) => {
            return (
              <Button variant="link" {...triggerProps}>
                <ButtonText>
                  <Icon
                    as={CircleEllipsis}
                    size="3xl"
                    className="text-typography-900"
                  />
                </ButtonText>
              </Button>
            );
          }}
        >
          <MenuItem key="Share" textValue="Share">
            <Icon as={Send} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">
              <ThemedText type="default" className="text-black">
                Share E-Receipt
              </ThemedText>
            </MenuItemLabel>
          </MenuItem>
          <MenuItem key="Download" textValue="Download">
            <Icon as={Download} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">
              <ThemedText type="default" className="text-black">
                Download E-Receipt
              </ThemedText>
            </MenuItemLabel>
          </MenuItem>
        </Menu>
      ),
    });
  }, [navigation]);
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 pb-20 gap-5">
            {/* res of the code */}
            <Image
              source={require("@/assets/images/home/payment/barcode.png")}
              alt="Payment Receipt"
              className="w-full h-[142px]"
              resizeMode="stretch"
            />
            <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
              <ThemedView className="flex-row justify-between">
                <ThemedText type="btn_large" className="text-typography-600">
                  Sender Name
                </ThemedText>
                <ThemedText type="btn_large" className="">
                  John Doe
                </ThemedText>
              </ThemedView>
              <ThemedView className="flex-row justify-between">
                <ThemedText type="btn_large" className="text-typography-600">
                  Phone Number
                </ThemedText>
                <ThemedText type="btn_large" className="">
                  +234 974 828 144
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
              <ThemedView className="flex-row justify-between">
                <ThemedText type="btn_large" className="text-typography-600">
                  Receiver’s Name
                </ThemedText>
                <ThemedText type="btn_large" className="">
                  John Doe
                </ThemedText>
              </ThemedView>
              <ThemedView className="flex-row justify-between">
                <ThemedText type="btn_large" className="text-typography-600">
                  Receiver’s Number
                </ThemedText>
                <ThemedText type="btn_large" className="">
                  +234 974 828 144
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
              <ThemedView className="flex-row justify-between">
                <ThemedText type="btn_large" className="text-typography-600">
                  Driver’s Name
                </ThemedText>
                <ThemedText type="btn_large" className="">
                  Jane Doe
                </ThemedText>
              </ThemedView>
              <ThemedView className="flex-row justify-between">
                <ThemedText type="btn_large" className="text-typography-600">
                  Driver’s Number
                </ThemedText>
                <ThemedText type="btn_large" className="">
                  +234 974 828 144
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView className="border border-primary-50 p-5 rounded-2xl flex gap-5">
              <ThemedView className="flex-row justify-between">
                <ThemedText type="btn_large" className="text-typography-600">
                  Shipping Fee
                </ThemedText>
                <ThemedText type="btn_large" className="">
                  ₦2,913,500
                </ThemedText>
              </ThemedView>
              <ThemedView className="flex-row justify-between">
                <ThemedText type="btn_large" className="text-typography-600">
                  Payment method
                </ThemedText>
                <ThemedText type="btn_large" className="">
                  My wallet
                </ThemedText>
              </ThemedView>
              <ThemedView className="flex-row justify-between">
                <ThemedText type="btn_large" className="text-typography-600">
                  Transaction & Track ID
                </ThemedText>
                <ThemedText type="btn_large" className="">
                  ID4927393
                </ThemedText>
              </ThemedView>
              <ThemedView className="flex-row justify-between">
                <ThemedText type="btn_large" className="text-typography-600">
                  Status
                </ThemedText>
                <ThemedText
                  type="b4_body"
                  className="bg-[#CDF5E0] px-4 py-2 rounded-lg text-[#009A49]"
                >
                  Approved
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      <ThemedView className="absolute pt-6 pb-10 bottom-0 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
        <Button
          variant="solid"
          size="2xl"
          onPress={() => {
            router.push("/(tabs)");
          }}
          className="flex-1 rounded-[12px] mx-1"
        >
          <ThemedText type="s2_subtitle" className="text-white text-center">
            Go Home
          </ThemedText>
        </Button>
      </ThemedView>
    </>
  );
}
