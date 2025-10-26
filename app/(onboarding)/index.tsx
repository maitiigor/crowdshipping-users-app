import CustomToast from "@/components/Custom/CustomToast";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { COUNTRIES } from "@/constants/countries";
import { useCountry } from "@/hooks/useCountry";
import { changeAppLanguage, LANGUAGE_STORAGE_KEY } from "@/lib/i18n";
import { Country } from "@/store/slices/countrySlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import * as Location from "expo-location";
import { Link, useNavigation } from "expo-router";
import { MapPin } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

type SupportedLanguageCode = (typeof languages)[number]["code"];
export default function Index() {
  // hide the header for this screen
  const navigation = useNavigation();

  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { country, selectCountry } = useCountry();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [persistedLanguage, setPersistedLanguage] = useState<string | null>(
    null
  );
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const hasAttemptedAutoDetect = useRef(false);
  const hasShownToast = useRef(false);

  const supportedLanguageCodes = useMemo<SupportedLanguageCode[]>(
    () => languages.map((lang) => lang.code),
    []
  );

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
      .then((saved) => {
        if (saved) {
          setSelectedLanguage(saved);
          setPersistedLanguage(saved);
        }
      })
      .catch(() => {})
      .finally(() => setLanguageLoaded(true));
  }, []);

  const resolveCountryFromCode = useCallback(
    (code: string | null | undefined) => {
      if (!code) return null;
      const normalized = code.trim().toUpperCase();
      return COUNTRIES.find((item) => item.alpha2Code === normalized) || null;
    },
    []
  );

  const resolveCountryFromName = useCallback(
    (name: string | null | undefined) => {
      if (!name) return null;
      const normalized = name.trim().toLowerCase();

      return (
        COUNTRIES.find((item) => {
          if (item.name.trim().toLowerCase() === normalized) {
            return true;
          }

          const demonymMatch =
            item.demonym?.trim().toLowerCase() === normalized;

          if (demonymMatch) {
            return true;
          }

          const altSpellingMatch = item.altSpellings?.some(
            (alt) => alt.trim().toLowerCase() === normalized
          );

          return Boolean(altSpellingMatch);
        }) || null
      );
    },
    []
  );

  const resolveLanguageForCountry = useCallback(
    (detectedCountry: Country | null) => {
      if (!detectedCountry) return null;
      const candidates = (detectedCountry.languages ?? [])
        .map((lang) => lang.iso639_1?.toLowerCase())
        .filter((code): code is string => Boolean(code));

      for (const candidate of candidates) {
        if (
          supportedLanguageCodes.includes(candidate as SupportedLanguageCode)
        ) {
          return candidate;
        }
      }

      return null;
    },
    [supportedLanguageCodes]
  );

  const showAutoSelectionToast = useCallback(
    (
      detectedCountry: Country,
      alreadySelected: boolean,
      languageChanged: boolean,
      languageCode: string | null
    ) => {
      if (hasShownToast.current) return;
      hasShownToast.current = true;

      const languageLabel = languageCode
        ? languages.find((lang) => lang.code === languageCode)?.label
        : null;

      const description =
        languageChanged && languageLabel
          ? `We've ${alreadySelected ? "confirmed" : "selected"} ${
              detectedCountry.name
            } and set the app language to ${languageLabel}. You can change them anytime.`
          : `We've ${alreadySelected ? "confirmed" : "selected"} ${
              detectedCountry.name
            } based on your location. You can change it anytime.`;

      toast.show({
        id: `auto-country-${detectedCountry.alpha2Code}`,
        placement: "top",
        duration: 4000,
        render: ({ id }) => (
          <CustomToast
            uniqueToastId={`toast-${id}`}
            icon={MapPin}
            action="info"
            variant="outline"
            title={alreadySelected ? "Location Confirmed" : "Location Detected"}
            description={description}
          />
        ),
      });
    },
    [toast]
  );

  useEffect(() => {
    if (!languageLoaded || hasAttemptedAutoDetect.current) {
      return;
    }

    hasAttemptedAutoDetect.current = true;
    let isActive = true;

    const autoSelectCountryAndLanguage = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        let detectedCountry: Country | null = null;

        if (status === Location.PermissionStatus.GRANTED) {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            mayShowUserSettingsDialog: true,
          });

          if (!isActive) return;

          const [place] = await Location.reverseGeocodeAsync({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          detectedCountry = resolveCountryFromCode(place?.isoCountryCode);

          if (!detectedCountry) {
            detectedCountry = resolveCountryFromName(place?.country);
          }
        }

        if (!detectedCountry) {
          const locales = Localization.getLocales();
          detectedCountry = resolveCountryFromCode(locales[0]?.regionCode);
        }

        if (!detectedCountry || !isActive) {
          return;
        }

        const alreadySelected =
          country?.alpha2Code === detectedCountry.alpha2Code;

        if (!alreadySelected) {
          selectCountry(detectedCountry);
        }

        const shouldAutoChangeLanguage = !persistedLanguage;
        let resolvedLanguage = resolveLanguageForCountry(detectedCountry);

        if (!resolvedLanguage && shouldAutoChangeLanguage) {
          resolvedLanguage = "en";
        }

        let languageCodeForToast: string | null = null;
        let languageChanged = false;

        if (shouldAutoChangeLanguage && resolvedLanguage) {
          if (i18n.language !== resolvedLanguage) {
            await changeAppLanguage(resolvedLanguage);
          }

          if (!isActive) return;

          setSelectedLanguage(resolvedLanguage);
          setPersistedLanguage(resolvedLanguage);
          languageCodeForToast = resolvedLanguage;
          languageChanged = true;
        } else if (resolvedLanguage && i18n.language === resolvedLanguage) {
          setSelectedLanguage(resolvedLanguage);
          languageCodeForToast = resolvedLanguage;
        }

        if (isActive) {
          showAutoSelectionToast(
            detectedCountry,
            alreadySelected,
            languageChanged,
            languageCodeForToast
          );
        }
      } catch (error) {
        if (__DEV__) {
          console.warn("Onboarding auto-detect failed", error);
        }
      }
    };

    autoSelectCountryAndLanguage();

    return () => {
      isActive = false;
    };
  }, [
    country?.alpha2Code,
    i18n.language,
    languageLoaded,
    persistedLanguage,
    selectCountry,
    showAutoSelectionToast,
    resolveCountryFromCode,
    resolveCountryFromName,
    resolveLanguageForCountry,
  ]);

  const handleLanguagePress = async (code: string) => {
    setSelectedLanguage(code);
    setPersistedLanguage(code);
    await changeAppLanguage(code);
  };

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
                    <Pressable onPress={() => handleLanguagePress(item.code)}>
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
        <Link href="/(onboarding)/welcome" asChild>
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
