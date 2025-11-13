import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AddIcon, Icon, RemoveIcon } from "@/components/ui/icon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

const filterList = [
  {
    label: "General",
    value: "general",
  },
  {
    label: "Account",
    value: "account",
  },
  {
    label: "Subscription",
    value: "subscription",
  },
];
export default function TravelerDetail() {
  const navigation = useNavigation();
  const router = useRouter();
  const backroundTopNav = useThemeColor({}, "background");
  const { id } = useLocalSearchParams();
  const [selectedFilter, setSelectedFilter] = useState("general");

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            FAQ
          </ThemedText>
        );
      },
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 }, // Increased font size
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: backroundTopNav,
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
  }, [navigation, backroundTopNav]);

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 pb-20 gap-5">
            <ThemedView>
              <FlatList
                data={filterList}
                horizontal
                contentContainerClassName="pb-3 px-3"
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedFilter(item.value as string);
                    }}
                    className={`border-2 w-[200px] p-3 border-primary-500 rounded-full ${
                      selectedFilter === item.value ? "bg-primary-500" : ""
                    }`}
                  >
                    <ThemedText
                      type="s1_subtitle"
                      className={` text-center ${
                        selectedFilter === item.value
                          ? "text-white"
                          : "text-primary-500"
                      }`}
                    >
                      {item.label}
                    </ThemedText>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.value}
              />
            </ThemedView>

            <Accordion
              variant="unfilled"
              type="single"
              defaultValue={["item-1"]}
              className="mt-5"
            >
              <AccordionItem value="item-1" className="rounded-lg">
                <AccordionHeader>
                  <AccordionTrigger>
                    {({ isExpanded }: { isExpanded: boolean }) => {
                      return (
                        <>
                          <ThemedText
                            type="btn_giant"
                            className="flex-1 text-primary-500"
                          >
                            What is Crowdshipping?
                          </ThemedText>
                          {isExpanded ? (
                            <AccordionIcon
                              as={RemoveIcon}
                              className="text-primary-500"
                            />
                          ) : (
                            <AccordionIcon
                              as={AddIcon}
                              className="text-primary-500"
                            />
                          )}
                        </>
                      );
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <ThemedText type="default" className="text-typography-600">
                    The defaultValue prop of the Accordion component is used to
                    define the open item by default. It is used when the
                    Accordion component is uncontrolled.
                  </ThemedText>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="rounded-lg">
                <AccordionHeader>
                  <AccordionTrigger>
                    {({ isExpanded }: { isExpanded: boolean }) => {
                      return (
                        <>
                          <ThemedText
                            type="btn_giant"
                            className="flex-1 text-primary-500"
                          >
                            How do i create an account?
                          </ThemedText>
                          {isExpanded ? (
                            <AccordionIcon
                              as={RemoveIcon}
                              className="text-primary-500"
                            />
                          ) : (
                            <AccordionIcon
                              as={AddIcon}
                              className="text-primary-500"
                            />
                          )}
                        </>
                      );
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <ThemedText type="default" className="text-typography-600">
                    The defaultValue prop of the Accordion component is used to
                    define the open item by default. It is used when the
                    Accordion component is uncontrolled.
                  </ThemedText>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="rounded-lg">
                <AccordionHeader>
                  <AccordionTrigger>
                    {({ isExpanded }: { isExpanded: boolean }) => {
                      return (
                        <>
                          <ThemedText
                            type="btn_giant"
                            className="flex-1 text-primary-500"
                          >
                            Update my profile information ?
                          </ThemedText>
                          {isExpanded ? (
                            <AccordionIcon
                              as={RemoveIcon}
                              className="text-primary-500"
                            />
                          ) : (
                            <AccordionIcon
                              as={AddIcon}
                              className="text-primary-500"
                            />
                          )}
                        </>
                      );
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <ThemedText type="default" className="text-typography-600">
                    The defaultValue prop of the Accordion component is used to
                    define the open item by default. It is used when the
                    Accordion component is uncontrolled.
                  </ThemedText>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}
