import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon, SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react-native";

const filterList = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Resolved",
    value: "resolved",
  },
];
export default function ReportScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("pending");
  const [toggleHideShowByID, setToggleHideShowByID] = useState(
    {} as Record<number, boolean>
  );
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Report
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
    <ThemedView className="flex-1 bg-white pt-3">
      <ThemedView className="flex-1 pb-20 px-[18px] overflow-hidden">
        <Input
          size="lg"
          className="h-[55px] rounded-t rounded-2xl"
          variant="outline"
        >
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField placeholder={"Search..."} />
        </Input>
        <ThemedView className="mt-5 flex-row gap-3">
          {filterList.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedFilter(item.value as string);
              }}
              className={`border-2 flex-1 p-3 border-primary-500 rounded-xl ${
                selectedFilter === item.value ? "bg-primary-500" : ""
              }`}
            >
              <ThemedText
                type="s2_subtitle"
                className={` text-center ${
                  selectedFilter === item.value
                    ? "text-white"
                    : "text-primary-500"
                }`}
              >
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
        <ThemedView className="mt-5">
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8]}
            contentContainerClassName="pb-[300px]"
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setToggleHideShowByID((prev) => ({
                    ...prev,
                    [item]: !prev[item],
                  }));
                }}
                className={`border border-primary-50 flex-row justify-between items-center p-4 rounded-xl`}
              >
                {/* Make this container flexible and allow children to shrink */}
                <ThemedView className=" flex gap-5 w-full">
                  <ThemedView className="flex gap-5">
                    <ThemedView className="flex-row gap-2 justify-between">
                      <ThemedText
                        type="default"
                        className="text-typography-500"
                      >
                        Report ID
                      </ThemedText>
                      <ThemedText
                        type="s2_subtitle"
                        className="text-typography-800 flex-1 text-right"
                      >
                        ID4927393
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row gap-2 justify-between">
                      <ThemedText
                        type="default"
                        className="text-typography-500"
                      >
                        Last Updated Date
                      </ThemedText>
                      <ThemedText
                        type="s2_subtitle"
                        className="text-typography-800 flex-1 text-right"
                      >
                        June 14, 2024 | 09:23PM
                      </ThemedText>
                    </ThemedView>
                    <ThemedView className="flex-row gap-2 justify-between items-center">
                      <ThemedText
                        type="default"
                        className="text-typography-500"
                      >
                        Current Status
                      </ThemedText>
                      <ThemedText
                        type="c1_caption"
                        className="text-primary-500 bg-primary-50 p-2 rounded-lg text-right"
                      >
                        Under Review
                      </ThemedText>
                    </ThemedView>

                    {toggleHideShowByID[item] && (
                      <>
                        <ThemedView className="flex gap-2 justify-between">
                          <ThemedText
                            type="default"
                            className="text-typography-500"
                          >
                            Brief Description
                          </ThemedText>
                          <ThemedText
                            type="s2_subtitle"
                            className="text-typography-800 flex-1"
                          >
                            i got to the client late because my tire damaged on
                            my way to deliver
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row gap-2 justify-between">
                          <ThemedText
                            type="default"
                            className="text-typography-500"
                          >
                            Last Updated Date
                          </ThemedText>
                          <ThemedText
                            type="s2_subtitle"
                            className="text-typography-800 flex-1 text-right"
                          >
                            June 14, 2024 | 09:23PM
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="flex-row gap-2 justify-between">
                          <ThemedText
                            type="default"
                            className="text-typography-500"
                          >
                            Support Team
                          </ThemedText>
                          <ThemedText
                            type="s2_subtitle"
                            className="text-typography-800 flex-1 text-right"
                          >
                            Temi Badenoch
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="mt-5 flex-row gap-3">
                          <TouchableOpacity
                            onPress={() => {
                              setToggleHideShowByID((prev) => ({
                                ...prev,
                                [item]: false,
                              }));
                            }}
                            className={`border-2 flex-1 p-3 border-primary-500 rounded-xl 
                              
                                 `}
                          >
                            <ThemedText
                              type="s2_subtitle"
                              className={` text-center text-primary-500`}
                            >
                              Close
                            </ThemedText>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {}}
                            className={`border-2 flex-1 p-3 border-primary-500 rounded-xl 
                               bg-primary-500
                                 `}
                          >
                            <ThemedText
                              type="s2_subtitle"
                              className={` text-center text-white`}
                            >
                              Chat
                            </ThemedText>
                          </TouchableOpacity>
                        </ThemedView>
                      </>
                    )}
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.toString()}
          />
        </ThemedView>
      </ThemedView>
      <ThemedView className="absolute bottom-0 pt-5 pb-10 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
        <Button
          variant="solid"
          size="2xl"
          onPress={() => {
            router.push("/(tabs)/reports/add-new-report");
          }}
          className="flex-1 rounded-[12px] mx-1"
        >
          <ThemedText type="s2_subtitle" className="text-white text-center">
            Add New
          </ThemedText>
        </Button>
      </ThemedView>
    </ThemedView>
  );
}
