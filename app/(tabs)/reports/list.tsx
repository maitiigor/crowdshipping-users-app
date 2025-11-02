import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { EmptyState } from "@/components/Custom/EmptyState";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon, SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useAuthenticatedQuery } from "@/lib/api";
import { IReportDatum, IReportResponse } from "@/types/IReport";
import dayjs from "dayjs";
import { ChevronLeft, CircleQuestionMark } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { HStack } from "@/components/ui/hstack";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("pending");
  const [toggleHideShowByID, setToggleHideShowByID] = useState(
    {} as Record<number, boolean>
  );
  const {
    data: pendingReports,
    isLoading,
    refetch,
    isFetching,
  } = useAuthenticatedQuery<IReportResponse | undefined>(
    ["pending-reports"],
    "/issue/pending/reports"
  );
  const {
    data: resolvedReports,
    isLoading: isLoadingResolved,
    refetch: refetchResolved,
    isFetching: isFetchingResolved,
  } = useAuthenticatedQuery<IReportResponse | undefined>(
    ["resolved-reports"],
    "/issue/resolved/reports"
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
  }, [navigation, router]);
  const currentData =
    selectedFilter === "pending"
      ? pendingReports?.data || []
      : resolvedReports?.data || [];
  const filteredData = currentData.filter(
    (item) =>
      item.reportRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
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
          <InputField
            placeholder={"Search..."}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
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
          {isLoading || isLoadingResolved ? (
            Array.from({ length: 5 }).map((_: any, index: number) => (
              <ThemedView key={index} className="w-full">
                <Box className="w-full gap-4 p-3 rounded-md ">
                  <SkeletonText _lines={3} className="h-2" />
                  <HStack className="gap-1 align-middle">
                    <Skeleton
                      variant="circular"
                      className="h-[24px] w-[28px] mr-2"
                    />
                    <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
                  </HStack>
                </Box>
              </ThemedView>
            ))
          ) : (
            <FlatList
              data={filteredData}
              refreshing={isFetching || isFetchingResolved}
              onRefresh={() => {
                if (selectedFilter === "pending") {
                  refetch();
                } else {
                  refetchResolved();
                }
              }}
              ListEmptyComponent={
                <EmptyState
                  title={`No ${selectedFilter} reports`}
                  description={`You have no ${selectedFilter} reports at the moment. Check back later for updates.`}
                  icon={CircleQuestionMark}
                  className="mt-10"
                />
              }
              contentContainerClassName="pb-[300px]"
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              renderItem={({ item }: { item: IReportDatum }) => (
                <TouchableOpacity
                  onPress={() => {
                    setToggleHideShowByID((prev) => ({
                      ...prev,
                      [item._id]: !prev[item._id as any],
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
                          {item.reportRef}
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
                          {dayjs(item.updatedAt).format(
                            "MMMM D, YYYY | hh:mmA"
                          )}
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
                          className={`  p-2 rounded-lg text-right ${
                            item.status === "pending"
                              ? "text-primary-500 bg-primary-50"
                              : "text-green-500 bg-green-50"
                          }`}
                        >
                          {item.status === "pending"
                            ? "Under Review"
                            : "Resolved"}
                        </ThemedText>
                      </ThemedView>

                      {toggleHideShowByID[item?._id as any] && (
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
                              {item.description || "No description provided"}
                            </ThemedText>
                          </ThemedView>
                          {/* <ThemedView className="flex-row gap-2 justify-between">
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
                            {dayjs(item.updatedAt).format(
                              "MMMM D, YYYY | hh:mmA"
                            )}
                          </ThemedText>
                        </ThemedView> */}
                          {/* <ThemedView className="flex-row hidden gap-2 justify-between">
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
                        </ThemedView> */}
                          <ThemedView className="mt-5 flex-row gap-3">
                            <TouchableOpacity
                              onPress={() => {
                                setToggleHideShowByID((prev) => ({
                                  ...prev,
                                  [item?._id]: false,
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
                              onPress={() => {
                                router.push({
                                  pathname: "/(tabs)/reports/[id]",
                                  params: {
                                    id: item?._id,
                                  },
                                });
                              }}
                              className={`border-2 flex-1 p-3 border-primary-500 rounded-xl 
                               bg-primary-500
                                 `}
                            >
                              <ThemedText
                                type="s2_subtitle"
                                className={` text-center text-white`}
                              >
                                Details
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
          )}
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
