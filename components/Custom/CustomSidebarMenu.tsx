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
import type { LinkProps } from "expo-router";
import { Link } from "expo-router";
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
  Wallet,
} from "lucide-react-native";
import React from "react";
import { ThemedText } from "../ThemedText";
import { Icon } from "../ui/icon";
import { Pressable } from "../ui/pressable";
import { useRouter } from "expo-router";

interface IProps {
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

type MenuItem = {
  icon: React.ElementType;
  name: string;
  linkTo: LinkProps["href"];
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
    linkTo: "/booking-history",
  },
  {
    icon: MailPlus,
    name: "Inbox",
    linkTo: "/inbox",
  },
  {
    icon: Wallet,
    name: "Payment logs",
    linkTo: "/payment-logs",
  },
  {
    icon: CircleDollarSign,
    name: "Report Issues",
    linkTo: "/report-issues",
  },
  {
    icon: MessageCircleMore,
    name: "Complaints",
    linkTo: "/complaints",
  },
  {
    icon: Headset,
    name: "Support",
    linkTo: "/support",
  },
  {
    icon: Bell,
    name: "Notifications",
    linkTo: "/notifications",
  },
  {
    icon: Gift,
    name: "My Promo",
    linkTo: "/my-promo",
  },
  {
    icon: NotepadText,
    name: "Terms & Conditions",
    linkTo: "/terms-of-service",
  },
  {
    icon: ScrollText,
    name: "Privacy Policy",
    linkTo: "/privacy-policy",
  },
];
export default function CustomSidebarMenu({
  showDrawer,
  setShowDrawer,
}: IProps) {
  const router = useRouter();
  return (
    <>
      <Drawer
        isOpen={showDrawer}
        onClose={() => {
          setShowDrawer(false);
        }}
        size="lg"
      >
        <DrawerBackdrop />
        <DrawerContent className="w-[300px] md:w-[350px]">
          <DrawerHeader className="justify-start flex-row gap-2 pt-16">
            <Avatar size="lg">
              <AvatarFallbackText>User Image</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                }}
              />
            </Avatar>
            <VStack className="justify-normal">
              <ThemedText type="default">Welcome, back</ThemedText>
              <ThemedText type="s1_subtitle" className="text-typography-950">
                Gbemisola
              </ThemedText>
            </VStack>
          </DrawerHeader>
          <Pressable onPress={() => {
            router.push("/user-profile-setup");
            setShowDrawer(false);
          }}>
            <ThemedText type="s2_subtitle" className="text-primary-600 pt-2 pl-2">
              Edit Profile
            </ThemedText>
          </Pressable>

          <DrawerBody contentContainerClassName="gap-2">
            {menuList.map((item) => (
              <Link key={item.name} href={item.linkTo} asChild>
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
                  <ThemedText type="default" className="text-typography-900">
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
    </>
  );
}
