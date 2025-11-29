import { EmptyState } from "@/components/Custom/EmptyState";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedQuery } from "@/lib/api";
import { IWalletRequestResponse } from "@/types/IWalletRequest";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigation, useRouter } from "expo-router";
import {
  ChevronLeft,
  CircleCheckBig,
  History,
  ListFilterPlus,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, TouchableOpacity, View } from "react-native";

// dayjs fromNow plugin
dayjs.extend(relativeTime);
export default function TransactionHistoryScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const backroundTopNav = useThemeColor({}, "background");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const { t } = useTranslation("paymentLogs");

  // Build fetchOptions conditionally
  const fetchOptions = selectedFilter
    ? { query: { trans_type: selectedFilter.toLowerCase() } }
    : undefined;

  // Include the filter in the query key for proper caching
  const queryKey = selectedFilter
    ? ["wallet", selectedFilter.toLowerCase()]
    : ["wallet"];

  const { data, isLoading, refetch, isFetching } = useAuthenticatedQuery<
    IWalletRequestResponse | undefined
  >(queryKey, "/wallet/fetch", fetchOptions);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            {t("header.transaction_history")}
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
  }, [navigation, router, backroundTopNav, t]);

  return (
    <ThemedView className="flex-1 bg-white p-5">
      <ThemedView className="flex-1 gap-3 mt-3">
        <ThemedView className="flex">
          <ThemedView className="flex-row justify-between items-center">
            <ThemedText type="h5_header" className="text-black mt-4">
              {t("transaction.filter")}
            </ThemedText>
            <Menu
              placement="bottom"
              className="mr-2 relative right-2 top-3"
              offset={5}
              onSelectionChange={(key) => {
                setSelectedFilter(key as string);
                refetch();
              }} // Add this to set the filter
              trigger={({ ...triggerProps }) => {
                return (
                  <Button variant="link" {...triggerProps}>
                    <ButtonText className="flex-row items-center gap-2 p-2 rounded-lg border border-typography-300">
                      <Icon
                        as={ListFilterPlus}
                        size="2xl"
                        className="text-black"
                      />
                    </ButtonText>
                  </Button>
                );
              }}
            >
              <MenuItem key="debit" textValue="debit">
                <MenuItemLabel size="sm">
                  <ThemedText type="default" className="text-black">
                    {t("transaction.debit")}
                  </ThemedText>
                </MenuItemLabel>
              </MenuItem>
              <MenuItem key="credit" textValue="credit">
                <MenuItemLabel size="sm">
                  <ThemedText type="default" className="text-black">
                    {t("transaction.credit")}
                  </ThemedText>
                </MenuItemLabel>
              </MenuItem>
            </Menu>
          </ThemedView>
          <ThemedView className="mt-5">
            {isLoading ? (
              Array.from({ length: 7 }).map((_: any, index: number) => (
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
                scrollEnabled={false}
                data={data?.data.transactions ?? []}
                ListEmptyComponent={
                  <EmptyState
                    title={t("transaction.empty_title")}
                    description={t("transaction.empty_description")}
                    icon={History}
                    className="mt-10"
                  />
                }
                refreshing={isFetching}
                onRefresh={() => {
                  refetch();
                }}
                contentContainerClassName="pb-20"
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {}}
                    className={` flex-row justify-between items-center py-4 rounded-xl`}
                  >
                    {/* Make this container flexible and allow children to shrink */}
                    <ThemedView className="flex-row items-center gap-3 flex-1 min-w-0">
                      <ThemedView
                        className={`p-3  rounded-full ${
                          item.type === "credit"
                            ? "bg-success-0"
                            : "bg-primary-50"
                        }`}
                      >
                        <Icon
                          as={CircleCheckBig}
                          size="2xl"
                          className={`${
                            item.type === "credit"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        />
                      </ThemedView>
                      {/* Ensure the text area can wrap/shrink */}
                      <ThemedView className="flex-1 min-w-0">
                        <ThemedText
                          type="b2_body"
                          className="flex-wrap"
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {item?.title ?? t(`wallet.wallet_${item.type}ed`)}
                        </ThemedText>
                        <ThemedView className="flex-row items-center">
                          <ThemedText
                            type="c1_caption"
                            className="text-typography-700 capitalize w-[80%]"
                          >
                            {item?.description}
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>
                    </ThemedView>

                    <ThemedText
                      type="c1_caption"
                      className="flex-wrap text-primary-500"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {dayjs(item.updatedAt || item.createdAt)
                        .fromNow()
                        .replace(/\bminutes\b/g, "mins")
                        .replace(/\bminute\b/g, "min")
                        .replace(/\bseconds\b/g, "secs")
                        .replace(/\bsecond\b/g, "sec")}
                    </ThemedText>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item?.referenceId?.toString()}
              />
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
