import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { useCountry } from "@/hooks/useCountry";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedQuery } from "@/lib/api";
import { useAppSelector } from "@/store";
import { ISingleClaimResponse } from "@/types/IReport";
import { formatCurrency, paramToString } from "@/utils/helper";
import dayjs from "dayjs";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  ArrowLeft,
  CalendarClock,
  Download,
  RefreshCw,
  ShieldAlert,
} from "lucide-react-native";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, TouchableOpacity } from "react-native";

const statusStyles: Record<string, string> = {
  pending: "bg-warning-50 border-warning-100 text-warning-700",
  resolved: "bg-success-50 border-success-100 text-success-700",
  rejected: "bg-error-50 border-error-100 text-error-700",
  escalated: "bg-secondary-50 border-secondary-100 text-secondary-700",
};

const ClaimDetails = () => {
  const navigation = useNavigation();
  const { t } = useTranslation("complaints");
  const { id } = useLocalSearchParams<{ id: string }>();
  const idStr = paramToString(id);
  const router = useRouter();
  const backroundTopNav = useThemeColor({}, "background");
  const { data, isLoading, refetch, isRefetching } = useAuthenticatedQuery<
    ISingleClaimResponse | undefined
  >(["claim", idStr], `/issue/cliam/${idStr}`);
  const report = data?.data;
  const { countryCode } = useCountry();
  // Get the selected country from Redux
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );
  const currency = selectedCountry?.currencies?.[0];
  const selectedCurrency = currency?.code || "NGN";

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <ThemedText type="s1_subtitle" className="text-center">
          {t("header.details_title")}
        </ThemedText>
      ),
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 },
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: backroundTopNav,
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
        borderBottomWidth: 0,
      },
      headerLeft: () => (
        <TouchableOpacity
          onLongPress={() => router.push("/(tabs)")}
          onPress={() => navigation.goBack()}
          className="p-2 rounded flex justify-center items-center"
        >
          <Icon as={ArrowLeft} size="3xl" className="text-typography-900" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => refetch()}
          disabled={isRefetching}
          className="p-2 rounded flex justify-center items-center"
        >
          <Icon
            as={RefreshCw}
            size="lg"
            className={`text-typography-900 ${
              isRefetching ? "opacity-40" : "opacity-100"
            }`}
          />
        </TouchableOpacity>
      ),
    });
  }, [isRefetching, navigation, refetch, backroundTopNav, t]);

  const handleOpenEvidence = useCallback(async () => {
    if (!report?.evidence) return;
    try {
      const supported = await Linking.canOpenURL(report.evidence);
      if (!supported) {
        throw new Error("Unsupported URL");
      }
      await Linking.openURL(report.evidence);
    } catch {
      Alert.alert(
        "Unable to open evidence",
        "We couldn't open the attachment link. Please try again later."
      );
    }
  }, [report?.evidence]);

  const statusKey = (report?.status || "").toLowerCase();
  const statusClass =
    statusStyles[statusKey] ||
    "bg-background-100 border-background-200 text-typography-700";

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
    >
      <ThemedView className="flex-1 bg-white">
        <ThemedView className="flex-1 gap-4 pb-40 mt-3">
          {isLoading ? (
            <>
              <Box className="w-full gap-4 p-4 rounded-2xl border border-background-100">
                <HStack className="items-center gap-3">
                  <Skeleton
                    variant="circular"
                    className="h-12 w-12 rounded-full"
                  />
                  <SkeletonText
                    _lines={2}
                    gap={4}
                    className="h-3 flex-1 w-[85.5%]"
                  />
                </HStack>
                <SkeletonText _lines={3} gap={4} className="h-3" />
              </Box>
              {Array.from({ length: 7 }).map((_: any, index: number) => (
                <Box
                  key={index}
                  className="w-full gap-2 p-4 rounded-2xl  border-background-100"
                >
                  <VStack className="items-center gap-3">
                    <SkeletonText _lines={1} gap={4} className="h-3" />
                    <SkeletonText _lines={1} gap={4} className="h-3 w-[40%]" />
                  </VStack>
                </Box>
              ))}
            </>
          ) : report ? (
            <>
              <ThemedView className="w-full p-4 rounded-2xl border border-primary-50 bg-background-0">
                <HStack className="items-start gap-3 mb-3">
                  <ThemedView className="h-12 w-12 rounded-full bg-primary-50 border border-primary-100 items-center justify-center">
                    <Icon
                      as={ShieldAlert}
                      size="xl"
                      className="text-primary-600"
                    />
                  </ThemedView>
                  <ThemedView className="flex-1 min-w-0 gap-1">
                    <ThemedText
                      type="h5_header"
                      className="text-typography-900"
                    >
                      {report.natureOfClaim || t("labels.claim")}
                    </ThemedText>
                    <ThemedText
                      type="c2_caption"
                      className="text-typography-600"
                    >
                      {t("labels.reference")}: {report.claimRef}
                    </ThemedText>
                  </ThemedView>
                </HStack>

                <HStack className="flex-wrap gap-2">
                  <ThemedView
                    className={`px-3 py-1 rounded-full border ${statusClass}`}
                  >
                    <ThemedText type="c2_caption" className="capitalize">
                      {t("labels.status")}:{" "}
                      {report.status
                        ? t(`status.${report.status.toLowerCase()}`, {
                            defaultValue: report.status,
                          })
                        : "unknown"}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="px-3 py-1 rounded-full bg-neutral-50 border border-neutral-100">
                    <ThemedText type="c2_caption" className="text-neutral-700">
                      {t("labels.raised_by")}:{" "}
                      {report.raisedBy?.fullName || "Unknown"}
                    </ThemedText>
                  </ThemedView>
                </HStack>
              </ThemedView>

              <ThemedView className="border border-background-100 rounded-2xl p-4 bg-background-0 gap-4">
                <ThemedText type="btn_giant" className="text-typography-800">
                  {t("labels.summary")}
                </ThemedText>
                <ThemedView className="gap-3">
                  <SummaryRow
                    label={t("labels.report_id")}
                    value={report._id || id}
                  />
                  <SummaryRow
                    label={t("labels.claim_reference")}
                    value={report.claimRef}
                  />
                  <SummaryRow
                    label={t("labels.nature_of_claim")}
                    value={report.natureOfClaim}
                  />
                  <SummaryRow
                    label={t("labels.description")}
                    value={report.description}
                    multiline
                  />
                  <SummaryRow
                    label={t("labels.claim_amount")}
                    value={formatCurrency(
                      report.claimAmount,
                      selectedCurrency,
                      `en-${countryCode}`
                    )}
                  />
                  <SummaryRow
                    label={t("labels.raised_by")}
                    value={report.raisedBy?.fullName}
                  />
                  <SummaryRow
                    label={t("labels.raised_by_id")}
                    value={report.raisedById}
                  />
                  <SummaryRow
                    label={t("labels.support_team")}
                    value={report.supportTeam || t("labels.not_assigned")}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView className="border border-background-100 rounded-2xl p-4 bg-background-0 gap-4">
                <ThemedText type="btn_giant" className="text-typography-800">
                  {t("labels.timeline")}
                </ThemedText>
                <ThemedView className="gap-3">
                  <TimelineRow
                    icon={CalendarClock}
                    label={t("labels.created")}
                    value={
                      report.createdAt
                        ? dayjs(report.createdAt).format("MMM D, YYYY h:mm A")
                        : "-"
                    }
                  />
                  <TimelineRow
                    icon={CalendarClock}
                    label={t("labels.updated")}
                    value={
                      report.updatedAt
                        ? dayjs(report.updatedAt).format("MMM D, YYYY h:mm A")
                        : "-"
                    }
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView className="border border-background-100 rounded-2xl p-4 bg-background-0 gap-4">
                <ThemedText type="btn_giant" className="text-typography-800">
                  {t("labels.evidence")}
                </ThemedText>
                {report.evidence ? (
                  <Button
                    variant="outline"
                    size="xl"
                    className="rounded-xl border-primary-200"
                    onPress={handleOpenEvidence}
                  >
                    <ButtonIcon as={Download} />
                    <ButtonText numberOfLines={1} ellipsizeMode="tail">
                      {t("buttons.open_attachment")}
                    </ButtonText>
                  </Button>
                ) : (
                  <ThemedText type="b4_body" className="text-typography-600">
                    {t("labels.no_evidence")}
                  </ThemedText>
                )}
              </ThemedView>
            </>
          ) : (
            <ThemedView className="p-4 rounded-xl bg-error-50 border border-error-100">
              <ThemedText type="b3_body" className="text-error-700">
                {t("errors.load_failed")}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
};

const SummaryRow = ({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value?: string | number | null;
  multiline?: boolean;
}) => {
  const displayValue = value == null || value === "" ? "-" : String(value);

  return (
    <ThemedView className="gap-1">
      <ThemedText type="btn_medium" className="text-typography-600">
        {label}
      </ThemedText>
      <ThemedText
        type={multiline ? "b3_body" : "btn_medium"}
        className="text-typography-900"
      >
        {displayValue}
      </ThemedText>
    </ThemedView>
  );
};

const TimelineRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
}) => {
  return (
    <HStack className="justify-between items-center">
      <HStack className="items-center gap-2">
        <Icon as={icon} size="md" className="text-typography-600" />
        <ThemedText type="btn_medium" className="text-typography-600">
          {label}
        </ThemedText>
      </HStack>
      <ThemedText type="btn_medium" className="text-typography-900">
        {value}
      </ThemedText>
    </HStack>
  );
};

export default ClaimDetails;
