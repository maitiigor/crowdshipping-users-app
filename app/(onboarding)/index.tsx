import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const label_text = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Russian",
  "Italian",
  "Portuguese",
  "Arabic",
];
export default function Index() {
  // hide the header for this screen
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
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
            Choose the language
          </ThemedText>
          <ThemedText type="default" className="pt-2 text-typography-800">
            Select your preferred language below This helps us serve you better.
            `
          </ThemedText>
          <ThemedView>
            <ThemedText type="s1_subtitle" className="pt-5 text-typography-950">
              You Selected
            </ThemedText>
            <ThemedText
              style={{
                boxShadow: "0px 0px 17px 0px #12110D14",
              }}
              type="default"
              className="py-4 px-5 text-typography-900 rounded-[50px] mt-3"
            >
              {selectedLanguage ? selectedLanguage : "English"}
            </ThemedText>
          </ThemedView>
          <ThemedView className="mt-2">
            <ThemedText type="s1_subtitle" className="pt-5 text-typography-950">
              All Languages
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
                <InputField placeholder="Search..." />
              </Input>
              <ThemedView className=" mt-2 pb-64">
                <FlatList
                  scrollEnabled={false}
                  data={label_text}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => setSelectedLanguage(item)}>
                      <ThemedText
                        type="b2_body"
                        className={`py-4 px-5 rounded-[50px] ${
                          selectedLanguage === item
                            ? "bg-primary-100 text-primary-700"
                            : "text-typography-900"
                        }`}
                      >
                        {item}
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
              Continue
            </ThemedText>
          </Button>
        </Link>
      </ThemedView>
    </SafeAreaView>
  );
}
