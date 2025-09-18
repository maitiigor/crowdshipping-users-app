import { EmptyModal } from "@/components/Custom/EmptyModal";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { useNavigation, useRouter } from "expo-router";
import { ChevronLeft, CircleQuestionMark, CircleX, Copy } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
const validationSchema = Yup.object().shape({
  code: Yup.array()
    .of(Yup.string().matches(/^\d$/, "Digit only").required("Required"))
    .length(4, "Enter 4 digits"),
});

const promoText = [
  {
    title: "Description:",
    description: "Enjoy free shipping on all orders throughout this month!",
  },
  {
    title: "Duration :",
    description: "June 23, 2025 - June 30, 2025",
  },
  {
    title: "Discount Amount :",
    description: "100% off shipping (Free shipping).",
  },
  {
    title: "Terms & Conditions :",
    description:
      "No minimum order requirement. Applicable for standard shipping within the country.",
  },
];
export default function PromoScreen() {
  // hide the header for this screen
  const navigation = useNavigation();
  const router = useRouter();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(20); // countdown state
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            My Promo
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

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () =>
      setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(hideEvent, () =>
      setIsKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // countdown effect
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleResend = () => {
    // TODO: call your resend code API here
    setSecondsLeft(20);
  };

  const insets = useSafeAreaInsets();

  // refs to control focus for each input
  const inputsRef = useRef<any[]>([]);

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="mt-5">
            <ThemedText className="pb-2" type="s1_subtitle">
              Shipping Offers
            </ThemedText>
            <FlatList
              data={[1, 2]}
              scrollEnabled={false}
              contentContainerClassName="pb-[300px]"
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(true);
                  }}
                  className={`border border-primary-50 flex-row justify-between items-center p-4 rounded-xl`}
                >
                  {/* Make this container flexible and allow children to shrink */}
                  <ThemedView className=" flex gap-5 w-full">
                    <ThemedView className="flex gap-5">
                      <ThemedView className="flex-row gap-2 items-center">
                        <Image
                          source={require("@/assets/images/home/promo-large.png")}
                          className="w-12 h-12"
                          resizeMode="contain"
                        />
                        <ThemedView className="flex-1 flex-row  gap-2 items-center">
                          <ThemedText
                            type="h5_header"
                            className="text-typography-800 pt-1 "
                          >
                            FREE SHIPPING
                          </ThemedText>
                          <Icon
                            as={CircleQuestionMark}
                            size="2xl"
                            className="text-white bg-typography-200 rounded-full"
                          />
                        </ThemedView>
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.toString()}
            />
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>

      {showModal && (
        <>
          <EmptyModal
            setShowModal={setShowModal}
            showModal={showModal}
            size="lg"
          >
            {/* close icon */}
           <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="absolute -top-0 right-0"
            >
              <Icon as={CircleX} size="2xl" className="text-typography-600" />
            </TouchableOpacity>
            <ThemedView className="items-center justify-center gap-5 pb-5">
              <ThemedText
                type="s1_subtitle"
                className="text-typography-950  text-center"
              >
                Promotion Information
              </ThemedText>
              <Image
                source={require("@/assets/images/home/promo-large.png")}
                className="w-32 h-32"
                resizeMode="contain"
              />
              <ThemedText
                type="h5_header"
                className="text-typography-950 text-center"
              >
                FREE SHIPPING
              </ThemedText>
            </ThemedView>
            <ThemedView className="flex gap-5 justify-start w-full flex-1">
              {promoText.map((item, index) => (
                <ThemedView key={index} className="flex gap-3 flex-1">
                  <ThemedText
                    type="s1_subtitle"
                    className="text-typography-950"
                  >
                    {item.title}
                  </ThemedText>
                  <ThemedText type="default" className="text-typography-800">
                    {item.description}
                  </ThemedText>
                </ThemedView>
              ))}
              <ThemedView className="flex gap-3 flex-1">
                <ThemedText
                  type="s1_subtitle"
                  className="text-typography-950 flex-1"
                >
                  Duration :
                </ThemedText>
                <ThemedView className="flex-1 flex-row justify-between items-center">
                  <ThemedText
                    type="h5_header"
                    className="text-typography-600 flex-1"
                  >
                    FREESHIP
                  </ThemedText>
                  <TouchableOpacity>
                    <Icon as={Copy} size="2xl" className="" />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </EmptyModal>
        </>
      )}
    </>
  );
}
