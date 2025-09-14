import SupportSvg from "@/assets/svgs/suppor-email.svg";
import NotificationIcon from "@/components/Custom/NotificationIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/ui/icon";
import {
  Link,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, TouchableOpacity } from "react-native";
export default function TravelerDetail() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Support
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
  }, [navigation]);

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 pb-20 gap-5">
            <ThemedView className="justify-center items-center mt-10 px-5">
              <SupportSvg width={150} height={150} />
            </ThemedView>
            <ThemedView className="px-5">
              <ThemedText
                type="default"
                className="text-center text-typography-500"
              >
                Shoot us your complain through email
              </ThemedText>
              <ThemedText
                type="s1_subtitle"
                className="text-center text-typography-800 mt-2"
              >
                Support@crowdshipping.com
              </ThemedText>
            </ThemedView>
            <ThemedView className="mt-10 px-5 gap-4">
              <Link
                href="/(tabs)/support/faq"
                asChild
              >
                <Pressable className="flex-row justify-between items-center">
                  <ThemedText
                    type="s1_subtitle"
                    className="text-typography-800 mt-2"
                  >
                    FAQ
                  </ThemedText>

                  <Icon
                    as={ChevronRight}
                    size="3xl"
                    className="text-typography-900 "
                  />
                </Pressable>
              </Link>
              <ThemedView>
                <Link href="/" asChild>
                  <ThemedText
                    type="s1_subtitle"
                    className="text-typography-800 mt-2"
                  >
                    Support Live chat
                  </ThemedText>
                </Link>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}
