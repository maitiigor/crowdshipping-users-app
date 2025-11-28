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
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getOnboardingSteps = (t: any) => [
  {
    id: 1,
    img: require("@/assets/images/onboarding/onboarding-1.png"),
    titleKey: "onboarding_step_1.title",
    descriptionKey: "onboarding_step_1.description",
  },
  {
    id: 2,
    img: require("@/assets/images/onboarding/onboarding-2.png"),
    titleKey: "onboarding_step_2.title",
    descriptionKey: "onboarding_step_2.description",
  },
  {
    id: 3,
    img: require("@/assets/images/onboarding/onboarding-3.png"),
    titleKey: "onboarding_step_3.title",
    descriptionKey: "onboarding_step_3.description",
  },
];
export default function Welcome() {
  const navigation = useNavigation();
  const { t } = useTranslation("welcome");
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width } = Dimensions.get("window");
  const backroundTopNav = useThemeColor({}, "background");
  const [value, setValue] = useState("true");
  const onboardingSteps = getOnboardingSteps(t);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const renderOnboardingItem = ({
    item,
  }: {
    item: (typeof onboardingSteps)[0];
  }) => (
    <View
      style={{ width }}
      className="items-center justify-center bottom-8 px-8 pb-28"
    >
      <Image
        source={item.img}
        className="w-80 h-80 mb-8"
        resizeMode="contain"
      />
      <ThemedText type="h4_header" className="text-center mb-4 font-bold">
        {t(item.titleKey)}
      </ThemedText>
      <ThemedText
        type="default"
        className="text-center text-typography-600 leading-6"
      >
        {t(item.descriptionKey)}
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
    <SafeAreaView
      style={{ backgroundColor: backroundTopNav }}
      className="flex-1"
    >
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
              {t("login_button")}
            </ThemedText>
          </Button>
        </Link>
        <Link href="../signup" asChild>
          <Button variant="outline" size="2xl" className="mt-5 rounded-[12px]">
            <ThemedText type="s1_subtitle" className="text-primary-500">
              {t("get_started_button")}
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
                {t("terms_consent")}{" "}
                <Link href="/terms-of-service" asChild>
                  <ThemedText type="btn_medium" className="text-primary-500 ">
                    {t("terms_of_service")}
                  </ThemedText>
                </Link>{" "}
                {t("and")}{" "}
                <Link href="/(onboarding)/privacy-policy" asChild>
                  <ThemedText type="btn_medium" className="text-primary-500 ">
                    {t("privacy_policy")}
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
