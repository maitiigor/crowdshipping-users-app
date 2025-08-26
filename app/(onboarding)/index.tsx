import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { changeAppLanguage, LANGUAGE_STORAGE_KEY } from "@/lib/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useNavigation } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const languages = [
  { label: "English", code: "en" },
  { label: "Spanish", code: "es" },
  { label: "French", code: "fr" },
  { label: "German", code: "de" },
  { label: "Chinese", code: "zh" },
  { label: "Japanese", code: "ja" },
  { label: "Korean", code: "ko" },
  { label: "Russian", code: "ru" },
  { label: "Italian", code: "it" },
  { label: "Portuguese", code: "pt" },
  { label: "Arabic", code: "ar" },
] as const;
export default function Index() {
  // hide the header for this screen
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const selectedLabel = useMemo(() => {
    const found = languages.find(
      (l) => l.code === (selectedLanguage || i18n.language)
    );
    return found?.label ?? "English";
  }, [selectedLanguage, i18n.language]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    // preload persisted language to reflect selection
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((saved) => saved && setSelectedLanguage(saved))
      .catch(() => {});
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1  ">
          {/* <Pressable
            onPress={() => navigation.goBack()}
            style={{
              shadowColor: "#FDEFEB",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
            className="p-2 rounded w-[54px] flex justify-center items-center"
          >
            <MaterialIcons name="keyboard-arrow-left" size={34} color="black" />
          </Pressable> */}
          <ThemedText type="h4_header" className="mt-5">
            {t("onboarding.choose_language")}
          </ThemedText>
          <ThemedText type="default" className="pt-2 text-typography-800">
            {t("onboarding.choose_language_hint")}
          </ThemedText>
          <ThemedView>
            <ThemedText type="s1_subtitle" className="pt-5 text-typography-950">
              {t("onboarding.you_selected")}
            </ThemedText>
            <ThemedText
              style={{
                boxShadow: "0px 0px 17px 0px #12110D14",
              }}
              type="default"
              className="py-4 px-5 text-typography-900 rounded-[50px] mt-3"
            >
              {selectedLabel}
            </ThemedText>
          </ThemedView>
          <ThemedView className="mt-2">
            <ThemedText type="s1_subtitle" className="pt-5 text-typography-950">
              {t("onboarding.all_languages")}
            </ThemedText>
            <ThemedView className=" mt-4">
              <Input
                size="lg"
                className="h-[55px] rounded-t rounded-2xl"
                variant="outline"
              >
                <InputSlot className="pl-3">
                  <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField placeholder={t("common.search")} />
              </Input>
              <ThemedView className=" mt-2 pb-64">
                <FlatList
                  scrollEnabled={false}
                  data={languages}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={async () => {
                        setSelectedLanguage(item.code);
                        await changeAppLanguage(item.code);
                      }}
                    >
                      <ThemedText
                        type="b2_body"
                        className={`py-4 px-5 rounded-[50px] ${
                          (selectedLanguage || i18n.language) === item.code
                            ? "bg-primary-100 text-primary-700"
                            : "text-typography-900"
                        }`}
                      >
                        {item.label}
                      </ThemedText>
                    </Pressable>
                  )}
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      <ThemedView className="absolute bottom-10 left-0 right-0 px-5">
        <Link href="/welcome" asChild>
          <Button variant="solid" size="2xl" className="mt-5 rounded-[12px]">
            <ThemedText type="s1_subtitle" className="text-white">
              {t("onboarding.continue")}
            </ThemedText>
          </Button>
        </Link>
      </ThemedView>
    </SafeAreaView>
  );
}
