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
import { clearAuthData } from "@/lib/auth/tokenStorage";
import { logout } from "@/store/slices/authSlice";
import { IUserProfileResponse } from "@/types/IUserProfile";
import type { LinkProps } from "expo-router";
import { Link, usePathname, useRouter } from "expo-router";
import {
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
  TruckElectric,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
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
  // Use string to allow linking to routes that may be added later without TS errors
  linkTo: string;
};

const menuList: MenuItem[] = [
  {
    icon: Home,
    name: "Home",
    linkTo: "/",
  },
  {
    icon: RotateCw,
    name: "Booking History",
    linkTo: "/(tabs)/booking-history",
  },
  {
    icon: TruckElectric,
    name: "Trips",
    linkTo: "/(tabs)/trips",
  },
  {
    icon: MailPlus,
    name: "Inbox",
    linkTo: "/(tabs)/inbox/chats",
  },
  {
    icon: Wallet,
    name: "Payment logs",
    linkTo: "/(tabs)/payment-logs/main",
  },
  {
    icon: CircleDollarSign,
    name: "Report Issues",
    linkTo: "/(tabs)/reports/list",
  },
  {
    icon: MessageCircleMore,
    name: "Complaints",
    linkTo: "/(tabs)/complaints",
  },
  {
    icon: Headset,
    name: "Support",
    linkTo: "/(tabs)/support",
  },
  {
    icon: Bell,
    name: "Notifications",
    linkTo: "/(tabs)/notifications",
  },
  {
    icon: Gift,
    name: "My Promo",
    linkTo: "/(tabs)/promo",
  },
  {
    icon: NotepadText,
    name: "Terms & Conditions",
    linkTo: "/(onboarding)/terms-of-service",
  },
  {
    icon: ScrollText,
    name: "Privacy Policy",
    linkTo: "/(onboarding)/privacy-policy",
  },
];
// export const logoutAsync = createAsyncThunk(
//   "auth/logoutAsync",
//   async (_, { dispatch }) => {
//     try {
//       await api.post("/auth/logout"); // optional server logout
//     } finally {
//       // always clear client auth state
//       dispatch(logout());
//       localStorage.removeItem("token");
//     }
//   }
// );
export default function CustomSidebarMenu({
  showDrawer,
  setShowDrawer,
  userProfileData,
  isLoading,
}: IProps) {
  const router = useRouter();
  const [showLogoutDrawer, setShowLogoutDrawer] = useState(false);
  // import { usePathname, useSegments } from "expo-router";
  const pathname = usePathname();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      dispatch(logout());
      await clearAuthData();
      router.push("/(onboarding)/login");
    } catch {
      // show error UI
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
          <DrawerContent className="w-[300px] md:w-[350px]">
            <DrawerHeader className="justify-start flex-row gap-2 pt-16">
              <Avatar size="lg">
                <AvatarFallbackText>
                  {userProfileData?.data?.fullName}
                </AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri:
                      userProfileData?.data?.profile.profilePicUrl ||
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                  }}
                />
              </Avatar>
              <VStack className="justify-normal">
                <ThemedText type="default">Welcome, back</ThemedText>
                <ThemedText type="s1_subtitle" className="text-typography-950">
                  {isLoading ? "Loading..." : userProfileData?.data?.fullName}
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
                Edit Profile
              </ThemedText>
            </Pressable>

            <DrawerBody contentContainerClassName="gap-3">
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
            </DrawerBody>
            <DrawerFooter>
              <Button
                className="w-full gap-2 flex-row items-center justify-start px-5"
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
                  Logout
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
          <DrawerContent className="rounded-2xl">
            <DrawerHeader className="flex justify-center">
              <ThemedText
                type="h3_header"
                className="text-primary-500 text-center"
              >
                Log out
              </ThemedText>
            </DrawerHeader>
            <DrawerBody>
              <ThemedText type="b2_body" className="text-center">
                Are you sure you want to log out?
              </ThemedText>
            </DrawerBody>
            <DrawerFooter>
              <ThemedView className=" pt-5 pb-10 bg-white left-0 right-0 px-5 flex-row justify-center items-center gap-3">
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
                    className="text-primary-500 text-center "
                  >
                    Cancel
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
                    Yes, Logout
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
