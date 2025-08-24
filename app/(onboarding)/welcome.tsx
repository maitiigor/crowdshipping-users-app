import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { Link, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const onboardingSteps = [
  {
    id: 1,
    img: require("@/assets/images/onboarding/onboarding-1.png"),
    title: "Your Delivery, Your Way",
    description:
      "Post a request, choose a nearby carrier, and track your item from pickup to drop-off  all in one app",
  },
  {
    id: 2,
    img: require("@/assets/images/onboarding/onboarding-2.png"),
    title: "Send & Receive Packages ",
    description:
      "Post a request, choose a nearby carrier, and track your item from pickup to drop-off  all in one app",
  },
  {
    id: 3,
    img: require("@/assets/images/onboarding/onboarding-3.png"),
    title: "Deliver by Air, Land, or Water",
    description:
      "Choose the best way to move your package — by road, flight, or sea. Fast, flexible, and reliable.",
  },
];
export default function Welcome() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width } = Dimensions.get("window");
  const [value, setValue] = useState("true");

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const renderOnboardingItem = ({
    item,
  }: {
    item: (typeof onboardingSteps)[0];
  }) => (
    <View style={{ width }} className="items-center justify-center bottom-8 px-8 pb-28">
      <Image
        source={item.img}
        className="w-80 h-80 mb-8"
        resizeMode="contain"
      />
      <ThemedText type="h4_header" className="text-center mb-4 font-bold">
        {item.title}
      </ThemedText>
      <ThemedText
        type="default"
        className="text-center text-typography-600 leading-6"
      >
        {item.description}
      </ThemedText>
      {renderDots()}
    </View>
  );

  const renderDots = () => (
    <View className="flex-row justify-center items-center mt-5">
      {onboardingSteps.map((_, index) => (
        <View
          key={index}
          className={`w-3 h-3 rounded-full mx-1 ${
            index === currentStep ? "bg-primary-500" : "bg-gray-300"
          }`}
        />
      ))}
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentStep(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ThemedView className="flex-1 justify-center items-center">
        <FlatList
          ref={flatListRef}
          data={onboardingSteps}
          renderItem={renderOnboardingItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          keyExtractor={(item) => item.id.toString()}
        />
      </ThemedView>

      <ThemedView className="absolute bottom-10 left-0 right-0 px-5">
        <Link href="/login" asChild>
          <Button variant="solid" size="2xl" className="mt-5 rounded-[12px]">
            <ThemedText type="s1_subtitle" className="text-white">
              Login
            </ThemedText>
          </Button>
        </Link>
        <Link href="../signup" asChild>
          <Button variant="outline" size="2xl" className="mt-5 rounded-[12px]">
            <ThemedText type="s1_subtitle" className="text-primary-500">
              Get Started
            </ThemedText>
          </Button>
        </Link>
        <ThemedView className="mt-5 mx-2 pb-2">
          <Checkbox
            value={value}
            size="md"
            onChange={(newValue) => setValue(newValue ? "true" : "false")}
            isInvalid={false}
            isDisabled={false}
          >
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>
              <ThemedText
                type="c1_caption"
                className="text-typography-600 leading-8"
              >
                By signing up, you consent to our{" "}
                <Link href="../terms-of-service" asChild>
                  <ThemedText type="btn_medium" className="text-primary-500 ">
                    Terms of Service
                  </ThemedText>
                </Link>{" "}
                and how we use your data in our{" "}
                <Link href="../privacy-policy" asChild>
                  <ThemedText type="btn_medium" className="text-primary-500 ">
                    Privacy Policy
                  </ThemedText>
                </Link>{" "}
              </ThemedText>
            </CheckboxLabel>
          </Checkbox>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}
