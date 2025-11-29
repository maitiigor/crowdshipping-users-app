import CustomToast from "@/components/Custom/CustomToast";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";
import { saveThemePreference } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthenticatedPatch, useAuthenticatedQuery } from "@/lib/api";
import { IUserPreferenceResponse } from "@/types/IUserPreference";
import { useNavigation, useRouter } from "expo-router";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  LucideIcon,
  Mail,
  MessageSquare,
  Moon,
  Smartphone,
  Sun,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Switch, TouchableOpacity } from "react-native";

/**
 * User Preferences Screen
 *
 * This screen allows users to customize their app experience:
 * - Email Notifications: Toggle email alerts on/off
 * - SMS Notifications: Toggle SMS alerts on/off
 * - Theme: Choose between Light, Dark, or System Default
 *
 * Theme changes are saved to both AsyncStorage (for immediate app-wide effect)
 * and the backend API (for persistence across devices).
 *
 * The theme system uses:
 * - saveThemePreference() to update AsyncStorage and notify all listeners
 * - useColorScheme() hook to read the current theme throughout the app
 * - Event-based updates to ensure all components reflect theme changes instantly
 */
export default function UserPreference() {
  const navigation = useNavigation();
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation("settings");

  const { data, isLoading, refetch } = useAuthenticatedQuery<
    IUserPreferenceResponse | undefined
  >(["user_preference"], "/user/preference");
  const backgroundColor = useThemeColor({}, "background");

  const { mutateAsync, loading } = useAuthenticatedPatch<
    any,
    {
      enableEmail?: boolean;
      enableSms?: boolean;
      theme?: string;
    }
  >(`user/preference`);

  // Local state for immediate UI updates
  const [enableEmail, setEnableEmail] = useState(false);
  const [enableSms, setEnableSms] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("system");

  // Update local state when data loads
  useEffect(() => {
    if (data?.data) {
      setEnableEmail(data.data.enableEmail);
      setEnableSms(data.data.enableSms);
      setSelectedTheme(data.data.theme);

      // Also save to AsyncStorage to sync with local storage
      saveThemePreference(data.data.theme);
    }
  }, [data]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            {t("header.title")}
          </ThemedText>
        );
      },
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 20 },
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: backgroundColor,
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
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
              className="p-2 rounded flex justify-center items-center"
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
  }, [navigation, router, backgroundColor, t]);

  const showNewToast = ({
    title,
    description,
    icon,
    action = "error",
    variant = "solid",
  }: {
    title: string;
    description: string;
    icon: LucideIcon;
    action: "error" | "success" | "info" | "muted" | "warning";
    variant: "solid" | "outline";
  }) => {
    const newId = Math.random();
    toast.show({
      id: newId.toString(),
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <CustomToast
            uniqueToastId={uniqueToastId}
            icon={icon}
            action={action}
            title={title}
            variant={variant}
            description={description}
          />
        );
      },
    });
  };

  const handleToggleEmail = async (value: boolean) => {
    setEnableEmail(value);
    try {
      await mutateAsync({ enableEmail: value });
      showNewToast({
        title: t("toast.success"),
        description: value
          ? t("toast.email_enabled")
          : t("toast.email_disabled"),
        icon: CheckCircle2,
        action: "success",
        variant: "solid",
      });
      refetch();
    } catch {
      setEnableEmail(!value); // Revert on error
      showNewToast({
        title: t("toast.error"),
        description: t("toast.update_email_failed"),
        icon: Mail,
        action: "error",
        variant: "solid",
      });
    }
  };

  const handleToggleSms = async (value: boolean) => {
    setEnableSms(value);
    try {
      await mutateAsync({ enableSms: value });
      showNewToast({
        title: t("toast.success"),
        description: value ? t("toast.sms_enabled") : t("toast.sms_disabled"),
        icon: CheckCircle2,
        action: "success",
        variant: "solid",
      });
      refetch();
    } catch {
      setEnableSms(!value); // Revert on error
      showNewToast({
        title: t("toast.error"),
        description: t("toast.update_sms_failed"),
        icon: MessageSquare,
        action: "error",
        variant: "solid",
      });
    }
  };

  const handleThemeChange = async (theme: string) => {
    setSelectedTheme(theme);
    try {
      // Save to AsyncStorage first for immediate effect
      await saveThemePreference(theme);

      // Then save to backend
      await mutateAsync({ theme });

      showNewToast({
        title: t("toast.success"),
        description: t("toast.theme_changed", { theme: theme }),
        icon: CheckCircle2,
        action: "success",
        variant: "solid",
      });
      refetch();
    } catch {
      showNewToast({
        title: t("toast.error"),
        description: t("toast.update_theme_failed"),
        icon: Sun,
        action: "error",
        variant: "solid",
      });
    }
  };

  if (isLoading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1 pb-20">
          {/* Header Section */}
          <ThemedView className="mt-6 mb-8">
            <ThemedText type="h3_header" className="text-typography-900 mb-2">
              {t("main.customize_your_experience")}
            </ThemedText>
            <ThemedText type="default" className="text-typography-500">
              {t("main.manage_notifications_desc")}
            </ThemedText>
          </ThemedView>

          {/* Notifications Section */}
          <ThemedView className="mb-8">
            <ThemedView className="flex-row items-center mb-4">
              <ThemedView className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
                <Icon
                  as={MessageSquare}
                  size="xl"
                  className="text-primary-600"
                />
              </ThemedView>
              <ThemedText type="s1_subtitle" className="text-typography-900">
                {t("main.notifications_title")}
              </ThemedText>
            </ThemedView>

            {/* Email Toggle */}
            <ThemedView className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
              <ThemedView className="flex-row justify-between items-center">
                <ThemedView className="flex-row items-center flex-1">
                  <ThemedView className="w-12 h-12 rounded-xl bg-blue-50 items-center justify-center mr-4">
                    <Icon as={Mail} size="xl" className="text-blue-600" />
                  </ThemedView>
                  <ThemedView className="flex-1">
                    <ThemedText
                      type="s1_subtitle"
                      className="text-typography-900 mb-1"
                    >
                      {t("main.email_notif_title")}
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 text-sm"
                    >
                      {t("main.email_notif_desc")}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <Switch
                  value={enableEmail}
                  onValueChange={handleToggleEmail}
                  trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
                  thumbColor={enableEmail ? "#3B82F6" : "#F3F4F6"}
                  ios_backgroundColor="#E5E7EB"
                  disabled={loading}
                />
              </ThemedView>
            </ThemedView>

            {/* SMS Toggle */}
            <ThemedView className="bg-white rounded-2xl p-4 shadow-sm">
              <ThemedView className="flex-row justify-between items-center">
                <ThemedView className="flex-row items-center flex-1">
                  <ThemedView className="w-12 h-12 rounded-xl bg-green-50 items-center justify-center mr-4">
                    <Icon
                      as={Smartphone}
                      size="xl"
                      className="text-green-600"
                    />
                  </ThemedView>
                  <ThemedView className="flex-1">
                    <ThemedText
                      type="s1_subtitle"
                      className="text-typography-900 mb-1"
                    >
                      {t("main.sms_notif_title")}
                    </ThemedText>
                    <ThemedText
                      type="default"
                      className="text-typography-500 text-sm"
                    >
                      {t("main.sms_notif_desc")}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <Switch
                  value={enableSms}
                  onValueChange={handleToggleSms}
                  trackColor={{ false: "#E5E7EB", true: "#86EFAC" }}
                  thumbColor={enableSms ? "#10B981" : "#F3F4F6"}
                  ios_backgroundColor="#E5E7EB"
                  disabled={loading}
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {/* Theme Section */}
          <ThemedView className="mb-8">
            <ThemedView className="flex-row items-center mb-4">
              <ThemedView className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                <Icon as={Sun} size="xl" className="text-purple-600" />
              </ThemedView>
              <ThemedText type="s1_subtitle" className="text-typography-900">
                {t("main.appearance_title")}
              </ThemedText>
            </ThemedView>

            {/* Theme Options */}
            <ThemedView className="bg-white rounded-2xl p-4 shadow-sm">
              {/* Light Theme */}
              <TouchableOpacity
                onPress={() => handleThemeChange("light")}
                disabled={loading}
                className="mb-3"
              >
                <ThemedView
                  className={`flex-row justify-between items-center p-4 rounded-xl ${
                    selectedTheme === "light"
                      ? "bg-yellow-50 border-2 border-yellow-400"
                      : "bg-gray-50"
                  }`}
                >
                  <ThemedView className="flex-row items-center flex-1">
                    <ThemedView
                      className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                        selectedTheme === "light" ? "bg-yellow-100" : "bg-white"
                      }`}
                    >
                      <Icon
                        as={Sun}
                        size="lg"
                        className={
                          selectedTheme === "light"
                            ? "text-yellow-600"
                            : "text-gray-500"
                        }
                      />
                    </ThemedView>
                    <ThemedView>
                      <ThemedText
                        type="s1_subtitle"
                        className={
                          selectedTheme === "light"
                            ? "text-yellow-900"
                            : "text-typography-700"
                        }
                      >
                        {t("main.light_mode")}
                      </ThemedText>
                      <ThemedText
                        type="default"
                        className="text-typography-500 text-xs mt-1"
                      >
                        {t("main.light_mode_desc")}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  {selectedTheme === "light" && (
                    <Icon as={Check} size="xl" className="text-yellow-600" />
                  )}
                </ThemedView>
              </TouchableOpacity>

              {/* Dark Theme */}
              <TouchableOpacity
                onPress={() => handleThemeChange("dark")}
                disabled={loading}
                className="mb-3"
              >
                <ThemedView
                  className={`flex-row justify-between items-center p-4 rounded-xl ${
                    selectedTheme === "dark"
                      ? "bg-indigo-50 border-2 border-indigo-400"
                      : "bg-gray-50"
                  }`}
                >
                  <ThemedView className="flex-row items-center flex-1">
                    <ThemedView
                      className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                        selectedTheme === "dark" ? "bg-indigo-100" : "bg-white"
                      }`}
                    >
                      <Icon
                        as={Moon}
                        size="lg"
                        className={
                          selectedTheme === "dark"
                            ? "text-indigo-600"
                            : "text-gray-500"
                        }
                      />
                    </ThemedView>
                    <ThemedView>
                      <ThemedText
                        type="s1_subtitle"
                        className={
                          selectedTheme === "dark"
                            ? "text-indigo-900"
                            : "text-typography-700"
                        }
                      >
                        {t("main.dark_mode")}
                      </ThemedText>
                      <ThemedText
                        type="default"
                        className="text-typography-500 text-xs mt-1"
                      >
                        {t("main.dark_mode_desc")}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  {selectedTheme === "dark" && (
                    <Icon as={Check} size="xl" className="text-indigo-600" />
                  )}
                </ThemedView>
              </TouchableOpacity>

              {/* System Theme */}
              <TouchableOpacity
                onPress={() => handleThemeChange("system")}
                disabled={loading}
              >
                <ThemedView
                  className={`flex-row justify-between items-center p-4 rounded-xl ${
                    selectedTheme === "system"
                      ? "bg-blue-50 border-2 border-blue-400"
                      : "bg-gray-50"
                  }`}
                >
                  <ThemedView className="flex-row items-center flex-1">
                    <ThemedView
                      className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                        selectedTheme === "system" ? "bg-blue-100" : "bg-white"
                      }`}
                    >
                      <Icon
                        as={Smartphone}
                        size="lg"
                        className={
                          selectedTheme === "system"
                            ? "text-blue-600"
                            : "text-gray-500"
                        }
                      />
                    </ThemedView>
                    <ThemedView>
                      <ThemedText
                        type="s1_subtitle"
                        className={
                          selectedTheme === "system"
                            ? "text-blue-900"
                            : "text-typography-700"
                        }
                      >
                        {t("main.system_default")}
                      </ThemedText>
                      <ThemedText
                        type="default"
                        className="text-typography-500 text-xs mt-1"
                      >
                        {t("main.system_default_desc")}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  {selectedTheme === "system" && (
                    <Icon as={Check} size="xl" className="text-blue-600" />
                  )}
                </ThemedView>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {/* Info Section */}
          <ThemedView className="bg-blue-50 rounded-2xl p-4 mb-6">
            <ThemedText type="default" className="text-blue-900 text-center">
              {t("main.auto_save")}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}
