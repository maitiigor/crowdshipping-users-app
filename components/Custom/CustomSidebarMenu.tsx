import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button, ButtonIcon } from "@/components/ui/button";

import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";

import { VStack } from "@/components/ui/vstack";
import { useThemeColor } from "@/hooks/useThemeColor";
import { clearAuthData } from "@/lib/auth/tokenStorage";
import { logout } from "@/store/slices/authSlice";
import { IUserProfileResponse } from "@/types/IUserProfile";
import type { LinkProps } from "expo-router";
import { Link, usePathname, useRouter } from "expo-router";
import {
  ArrowRightLeft,
  Bell,
  CircleDollarSign,
  Gift,
  Headset,
  Home,
  LogOut,
  MailPlus,
  MessageCircleMore,
  NotepadText,
  RotateCw,
  ScrollText,
  SettingsIcon,
  TrainTrack,
  TruckElectric,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Icon } from "../ui/icon";
import { Pressable } from "../ui/pressable";

interface IProps {
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  userProfileData: IUserProfileResponse;
  isLoading: boolean;
}

type MenuItem = {
  icon: React.ElementType;
  name: string;
  linkTo: string;
};

export default function CustomSidebarMenu({
  showDrawer,
  setShowDrawer,
  userProfileData,
  isLoading,
}: IProps) {
  const router = useRouter();
  const [showLogoutDrawer, setShowLogoutDrawer] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const backgroundColor = useThemeColor({}, "background");
  const color = useThemeColor({}, "text");
  const { t } = useTranslation("sidebar");

  const menuList: MenuItem[] = [
    {
      icon: Home,
      name: t("menu.home"),
      linkTo: "/",
    },
    {
      icon: RotateCw,
      name: t("menu.booking_history"),
      linkTo: "/(tabs)/booking-history",
    },
    {
      icon: TruckElectric,
      name: t("menu.trips"),
      linkTo: "/(tabs)/trips",
    },
    {
      icon: ArrowRightLeft,
      name: t("menu.bidding_history"),
      linkTo: "/(tabs)/bids",
    },
    {
      icon: TrainTrack,
      name: t("menu.track_order"),
      linkTo: "/(tabs)/track-order",
    },
    {
      icon: MailPlus,
      name: t("menu.inbox"),
      linkTo: "/(tabs)/inbox/chats",
    },
    {
      icon: Wallet,
      name: t("menu.wallet"),
      linkTo: "/(tabs)/payment-logs/main",
    },
    {
      icon: CircleDollarSign,
      name: t("menu.report_issues"),
      linkTo: "/(tabs)/reports/list",
    },
    {
      icon: MessageCircleMore,
      name: t("menu.claims"),
      linkTo: "/(tabs)/complaints/list",
    },
    {
      icon: Headset,
      name: t("menu.support"),
      linkTo: "/(tabs)/support",
    },
    {
      icon: Bell,
      name: t("menu.notifications"),
      linkTo: "/(tabs)/notifications",
    },
    {
      icon: SettingsIcon,
      name: t("menu.settings"),
      linkTo: "/(tabs)/settings",
    },
    {
      icon: Gift,
      name: t("menu.my_promo"),
      linkTo: "/(tabs)/promo",
    },
    {
      icon: NotepadText,
      name: t("menu.terms_conditions"),
      linkTo: "/(onboarding)/terms-of-service",
    },
    {
      icon: ScrollText,
      name: t("menu.privacy_policy"),
      linkTo: "/(onboarding)/privacy-policy",
    },
  ];

  const handleLogout = async () => {
    try {
      dispatch(logout());
      await clearAuthData();
      router.push("/(onboarding)/login");
    } catch {
      console.error("Failed to logout");
    }
  };

  return (
    <>
      {showDrawer ? (
        <Drawer
          isOpen
          onClose={() => {
            setShowDrawer(false);
          }}
          size="lg"
        >
          <DrawerBackdrop />
          <DrawerContent
            style={{ backgroundColor }}
            className="w-[300px] md:w-[350px] "
          >
            <DrawerHeader className="justify-start flex-row gap-2 pt-16">
              <Avatar size="lg">
                <AvatarFallbackText>
                  {userProfileData?.data?.fullName}
                </AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: userProfileData?.data?.profile.profilePicUrl,
                  }}
                />
              </Avatar>
              <VStack className="justify-normal">
                <ThemedText type="default">{t("welcome_back")}</ThemedText>
                <ThemedText type="s1_subtitle" className="text-typography-950">
                  {isLoading ? t("loading") : userProfileData?.data?.fullName}
                </ThemedText>
              </VStack>
            </DrawerHeader>
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/user-profile-setup",
                  params: { isHome: "true" },
                });
                setShowDrawer(false);
              }}
            >
              <ThemedText
                type="s2_subtitle"
                className="text-primary-600 pt-2 pl-2"
              >
                {t("edit_profile")}
              </ThemedText>
            </Pressable>

            <DrawerBody
              contentContainerClassName="gap-3"
              showsVerticalScrollIndicator={false}
              className="mb-40"
            >
              {menuList.map((item) => (
                <Link
                  key={item.name}
                  href={item.linkTo as LinkProps["href"]}
                  asChild
                >
                  <Pressable
                    onPress={() => {
                      setShowDrawer(false);
                    }}
                    className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
                  >
                    <Icon
                      as={item.icon}
                      color={color}
                      size="xl"
                      className="text-typography-900"
                    />
                    <ThemedText
                      type={pathname === item.linkTo ? "btn_giant" : "b2_body"}
                      className="text-typography-900"
                    >
                      {item.name}
                    </ThemedText>
                  </Pressable>
                </Link>
              ))}
              {/* Spacer to prevent footer overlap */}
              <ThemedView className="h-36" />
            </DrawerBody>
            <DrawerFooter
              style={{ backgroundColor }}
              className="absolute bottom-0 left-0 right-0 bg-white py-6"
            >
              <Button
                className="w-full gap-2 flex-row items-center justify-start px-10"
                variant="link"
                action="secondary"
                onPress={() => {
                  setShowLogoutDrawer(true);
                }}
              >
                <ButtonIcon as={LogOut} className="text-primary-500" />
                <ThemedText
                  className="text-left text-primary-500"
                  type="btn_giant"
                >
                  {t("logout")}
                </ThemedText>
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : null}
      {/* logout drawer  */}
      {showLogoutDrawer ? (
        <Drawer
          isOpen
          size="sm"
          anchor="bottom"
          onClose={() => {
            setShowLogoutDrawer(false);
          }}
        >
          <DrawerBackdrop />
          <DrawerContent style={{ backgroundColor }} className="rounded-2xl">
            <DrawerHeader className="flex justify-center">
              <ThemedText
                type="h3_header"
                className="text-primary-500 text-center"
              >
                {t("logout_drawer.title")}
              </ThemedText>
            </DrawerHeader>
            <DrawerBody>
              <ThemedText type="b2_body" className="text-center">
                {t("logout_drawer.description")}
              </ThemedText>
            </DrawerBody>
            <DrawerFooter>
              <ThemedView className="pt-5 pb-10 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
                <Button
                  variant="outline"
                  size="2xl"
                  className="rounded-[12px] w-1/2"
                  onPress={() => {
                    setShowLogoutDrawer(false);
                  }}
                >
                  <ThemedText
                    type="s2_subtitle"
                    className="text-primary-500 text-center"
                  >
                    {t("logout_drawer.cancel")}
                  </ThemedText>
                </Button>
                <Button
                  variant="solid"
                  size="2xl"
                  onPress={() => {
                    setShowLogoutDrawer(false);
                    setShowDrawer(false);
                    handleLogout();
                  }}
                  className="flex-1 w-1/2 rounded-[12px]"
                >
                  <ThemedText
                    type="s2_subtitle"
                    className="text-white text-center"
                  >
                    {t("logout_drawer.confirm")}
                  </ThemedText>
                </Button>
              </ThemedView>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : null}
    </>
  );
}
