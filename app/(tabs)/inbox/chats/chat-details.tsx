import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Formik } from "formik";
import {
  CheckCheck,
  ChevronLeft,
  Mic,
  Phone,
  Plus,
  Send,
} from "lucide-react-native";

export default function ChatDetailsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  useLocalSearchParams();
  type MessageRole = "sender" | "receiver";
  type Message = {
    id: string;
    text: string;
    timestamp: number;
    role: MessageRole;
  };

  const [messages, setMessages] = useState<Message[]>(() => {
    const now = Date.now();
    return [
      {
        id: "m1",
        text: "Hi, I’m at the pickup point.",
        timestamp: now - 1000 * 60 * 25,
        role: "sender",
      },
      {
        id: "m2",
        text: "Great! I’m 5 minutes away.",
        timestamp: now - 1000 * 60 * 24,
        role: "receiver",
      },
      {
        id: "m3",
        text: "Please ring when you arrive.",
        timestamp: now - 1000 * 60 * 23,
        role: "sender",
      },
      {
        id: "m4",
        text: "Will do. Do you need help loading?",
        timestamp: now - 1000 * 60 * 22,
        role: "receiver",
      },
      {
        id: "m5",
        text: "Yes, just a small box.",
        timestamp: now - 1000 * 60 * 21,
        role: "sender",
      },
      {
        id: "m6",
        text: "Perfect. See you shortly!",
        timestamp: now - 1000 * 60 * 20,
        role: "receiver",
      },
    ];
  });

  const scrollRef = useRef<ScrollView | null>(null);
  const scrollToEnd = () => scrollRef.current?.scrollToEnd({ animated: true });
  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

  type ChatItem =
    | { type: "divider"; key: string; label: string }
    | { type: "message"; key: string; message: Message };

  const chatItems = useMemo<ChatItem[]>(() => {
    const startOfDay = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const getDayKey = (ts: number) => startOfDay(new Date(ts)).getTime();
    const labelForDay = (dayTs: number) => {
      const todayKey = getDayKey(Date.now());
      const yesterdayKey = todayKey - 24 * 60 * 60 * 1000;
      if (dayTs === todayKey) return "Today";
      if (dayTs === yesterdayKey) return "Yesterday";
      return new Date(dayTs).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };
    const sorted = [...messages].sort((a, b) => a.timestamp - b.timestamp);
    const items: ChatItem[] = [];
    let lastDay: number | null = null;
    for (const m of sorted) {
      const dayKey = getDayKey(m.timestamp);
      if (dayKey !== lastDay) {
        items.push({
          type: "divider",
          key: `d-${dayKey}`,
          label: labelForDay(dayKey),
        });
        lastDay = dayKey;
      }
      items.push({ type: "message", key: m.id, message: m });
    }
    return items;
  }, [messages]);
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            Segun Johnson
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
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/(tabs)/inbox/calls/call-details",
              params: {},
            });
          }}
          style={{ paddingHorizontal: 0 }}
        >
          <Icon as={Phone} size="2xl" className="text-typography-900" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}
      >
        <ThemedView className="flex-1">
          <ThemedView className="flex-1 pb-40 mt-3">
            <ScrollView
              ref={scrollRef}
              onContentSizeChange={scrollToEnd}
              contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            >
              {chatItems.map((item) => {
                if (item.type === "divider") {
                  return (
                    <ThemedView
                      key={item.key}
                      className="w-full items-center my-2"
                    >
                      <ThemedView className="flex-row gap-2 items-center">
                        <ThemedView className="h-[2px] w-full rounded-full bg-typography-200" />
                        <ThemedView className="px-3 py-1">
                          <ThemedText
                            type="default"
                            className="text-typography-700"
                          >
                            {item.label}
                          </ThemedText>
                        </ThemedView>
                        <ThemedView className="h-[2px] w-full rounded-full bg-typography-200" />
                      </ThemedView>
                    </ThemedView>
                  );
                }
                const m = item.message;
                const isSender = m.role === "sender";
                return (
                  <ThemedView
                    key={item.key}
                    className={`w-full flex-row items-end ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isSender && (
                      <ThemedView className="h-8 w-8 rounded-full bg-primary-100 mr-2 items-center justify-center">
                        <ThemedText
                          type="c2_caption"
                          className="text-primary-700"
                        >
                          SJ
                        </ThemedText>
                      </ThemedView>
                    )}
                    <ThemedView
                      className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                        isSender ? "bg-primary-500" : "bg-typography-200"
                      } ${isSender ? "rounded-br-sm" : "rounded-bl-sm"}`}
                    >
                      <ThemedText
                        type="b4_body"
                        className={`${
                          isSender ? "text-white" : "text-typography-900"
                        }`}
                      >
                        {m.text}
                      </ThemedText>
                      <ThemedView className="flex-row items-center gap-1">
                        <ThemedText
                          type="c2_caption"
                          className={`${
                            isSender ? "text-white/70" : "text-typography-700"
                          } mt-1`}
                        >
                          {formatTime(m.timestamp)}
                        </ThemedText>
                        <Icon
                          as={CheckCheck}
                          className={`${
                            isSender ? "text-white/70" : "text-green-700"
                          } mt-1`}
                        />
                      </ThemedView>
                    </ThemedView>
                    {isSender && <ThemedView className="ml-2" />}
                  </ThemedView>
                );
              })}
            </ScrollView>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        className="absolute bottom-10 left-0 right-0 px-5"
      >
        <ThemedView className="flex-1">
          <Formik
            initialValues={{
              message: "",
            }}
            // validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              const text = values.message.trim();
              if (!text) return;
              const newMessage: Message = {
                id: `m-${Date.now()}`,
                text,
                timestamp: Date.now(),
                role: "sender",
              };
              setMessages((prev) => [...prev, newMessage]);
              resetForm();
              setTimeout(scrollToEnd, 50);

              // Simulate a quick receiver reply for demo purposes
              setTimeout(() => {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `r-${Date.now()}`,
                    text: "Noted ✅",
                    timestamp: Date.now(),
                    role: "receiver",
                  },
                ]);
                setTimeout(scrollToEnd, 50);
              }, 600);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <ThemedView className="flex-row items-center gap-4">
                <ThemedView className="flex-1">
                  <Input
                    className="h-[55px] rounded-lg border-0 border-primary-100 bg-[#F3F3F6] px-2"
                    size="xl"
                    isInvalid={!!(errors.message && touched.message)}
                  >
                    <InputSlot className="pr-3" onPress={() => {}}>
                      <Icon as={Plus} size="2xl" />
                    </InputSlot>
                    <InputField
                      className=""
                      placeholder="Send message"
                      value={values.message}
                      onChangeText={handleChange("message")}
                      onBlur={handleBlur("message")}
                    />
                    <InputSlot className="pr-3" onPress={() => {}}>
                      <Icon as={Mic} size="2xl" />
                    </InputSlot>
                  </Input>
                  {errors.message && touched.message && (
                    <ThemedText type="b4_body" className="text-error-500 mb-4">
                      {errors.message}
                    </ThemedText>
                  )}
                </ThemedView>
                <Button
                  variant="solid"
                  size="2xl"
                  className="rounded-full h-16 w-14"
                  onPress={() => handleSubmit()}
                  isDisabled={!values.message.trim()}
                >
                  <Icon as={Send} size="2xl" className="text-white" />
                </Button>
              </ThemedView>
            )}
          </Formik>
        </ThemedView>
      </KeyboardAvoidingView>
    </>
  );
}
