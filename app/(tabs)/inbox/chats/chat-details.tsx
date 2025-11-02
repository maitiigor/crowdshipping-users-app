import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Image as RNImage,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import AttachmentFile from "@/components/Chats/AttachmentFile";
import CustomToast from "@/components/Custom/CustomToast";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { useToast } from "@/components/ui/toast";
import {
  useAuthenticatedPatch,
  useAuthenticatedPost,
  useAuthenticatedQuery,
} from "@/lib/api";
import { ISingleChatResponse } from "@/types/IConversation";
import { Formik } from "formik";
import {
  CheckCheck,
  ChevronLeft,
  CircleCheckIcon,
  File,
  FileAudio,
  HelpCircleIcon,
  Image,
  LucideIcon,
  Mic,
  Paperclip,
  Pause,
  Phone,
  Play,
  Plus,
  Send,
  StopCircle,
  X,
} from "lucide-react-native";

const formatSeconds = (value?: number) => {
  if (!value || Number.isNaN(value)) {
    return "00:00";
  }
  const totalSeconds = Math.max(0, Math.floor(value));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const formatMillis = (value?: number) => {
  if (value === undefined || value === null) {
    return "00:00";
  }
  return formatSeconds(value / 1000);
};

type VoiceMessagePlayerProps = {
  uri: string;
  isSender: boolean;
};

const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({
  uri,
  isSender,
}) => {
  const player = useAudioPlayer(uri, 250);
  const status = useAudioPlayerStatus(player);
  const isLoaded = status?.isLoaded ?? false;
  const isPlaying = status?.playing ?? false;

  const handleToggle = useCallback(() => {
    if (!status || !isLoaded) return;
    if (status.playing) {
      player.pause();
      return;
    }
    if (status.duration && status.currentTime >= status.duration) {
      void player.seekTo(0);
    }
    player.play();
  }, [isLoaded, player, status]);

  const currentLabel = formatSeconds(status?.currentTime ?? 0);
  const totalLabel = formatSeconds(status?.duration ?? 0);

  return (
    <ThemedView
      className={`flex-row items-center gap-3 w-[300px] rounded-xl px-3 py-2 ${
        isSender ? "bg-white/20" : "bg-white"
      }`}
    >
      <TouchableOpacity
        accessibilityRole="button"
        onPress={handleToggle}
        disabled={!isLoaded}
        className={`h-10 w-10 items-center justify-center rounded-full ${
          isSender ? "bg-white" : "bg-primary-500"
        }`}
      >
        {!isLoaded ? (
          <ActivityIndicator color={isSender ? "#1F2933" : "#FFFFFF"} />
        ) : (
          <Icon
            as={isPlaying ? Pause : Play}
            size="lg"
            className={isSender ? "text-primary-500" : "text-white"}
          />
        )}
      </TouchableOpacity>
      <ThemedView className="flex-1">
        <ThemedText
          type="b4_body"
          className={isSender ? "text-white" : "text-typography-900"}
        >
          {currentLabel} / {totalLabel}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default function ChatDetailsScreen() {
  const navigation = useNavigation();
  const { id, participantName } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  const conversationId = (Array.isArray(id) ? id[0] : id) ?? "";
  const routeParticipantName = Array.isArray(participantName)
    ? participantName[0]
    : participantName;
  const { data, isLoading, isFetching, refetch } = useAuthenticatedQuery<
    ISingleChatResponse | undefined
  >(
    ["conversations", conversationId],
    conversationId ? `/conversation/${conversationId}` : "",
    undefined,
    { enabled: Boolean(conversationId) }
  );
  const { mutateAsync, loading } = useAuthenticatedPatch<
    any,
    {
      type: string; //text, image, file, voice
      content?: string; //required if type is text
      attachments?: string[]; //required if type is  not text
    }
  >(`/conversation/${conversationId}`);
  const {
    mutateAsync: uploadFile,
    loading: isUploading,
    error: uploadError,
  } = useAuthenticatedPost<{ url: string }, FormData>("/storage-upload");
  const participant = data?.data?.participant;
  const participantAvatar = participant?.profile?.profilePicUrl;
  const displayName =
    routeParticipantName || participant?.fullName || "Chat Details";
  type MessageRole = "sender" | "receiver";
  type MessageType =
    | "text"
    | "image"
    | "file"
    | "audio"
    | "voice"
    | "video"
    | "unknown";
  type Message = {
    id: string;
    text: string;
    timestamp: number;
    role: MessageRole;
    type: MessageType;
    attachments: string[];
    senderImage?: string;
  };
  const [queuedMessages, setQueuedMessages] = useState<Message[]>([]);
  type DraftAttachmentKind = "image" | "file" | "voice";
  type DraftAttachment = {
    id: string;
    localUri: string;
    remoteUri?: string;
    name?: string;
    mimeType?: string;
    kind: DraftAttachmentKind;
    uploading: boolean;
  };
  const [draftAttachments, setDraftAttachments] = useState<DraftAttachment[]>(
    []
  );
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [isPreparingRecording, setIsPreparingRecording] = useState(false);
  const isRecording = recorderState?.isRecording ?? false;
  const recordingDurationMillis = recorderState?.durationMillis ?? 0;

  const showNewToast = useCallback(
    ({
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
    },
    [toast]
  );

  const normalizeType = useCallback((value?: string): MessageType => {
    if (!value) return "unknown";
    const supported: MessageType[] = [
      "text",
      "image",
      "file",
      "audio",
      "voice",
      "video",
    ];
    return supported.includes(value as MessageType)
      ? (value as MessageType)
      : value === "voice"
      ? "voice"
      : value === "audio"
      ? "audio"
      : "unknown";
  }, []);

  const serverMessages = useMemo<Message[]>(() => {
    if (!data?.data?.messages?.length) return [];

    return data.data.messages.map((message) => ({
      id: message.messageId,
      text: message.message,
      timestamp: new Date(message.sentAt).getTime(),
      role: message.isSender ? "sender" : "receiver",
      type: normalizeType(message.type),
      attachments: message.attachments ?? [],
      senderImage: message.sender?.profileImage,
    }));
  }, [data, normalizeType]);

  const messages = useMemo(() => {
    return [...serverMessages, ...queuedMessages].sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }, [queuedMessages, serverMessages]);

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

  const getInitials = useCallback((value?: string) => {
    if (!value) return "CC";
    return value
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }, []);

  const isImageAttachment = useCallback(
    (uri: string, messageType: MessageType) => {
      if (messageType === "image") return true;
      const cleanUri = uri.split("?")[0] ?? uri;
      const extension = cleanUri.split(".").pop()?.toLowerCase();
      if (!extension) return false;
      return ["png", "jpg", "jpeg", "gif", "webp", "heic", "bmp"].includes(
        extension
      );
    },
    []
  );

  const getFileName = useCallback((uri: string) => {
    const cleanUri = uri.split("?")[0] ?? uri;
    return cleanUri.split("/").pop() ?? "Attachment";
  }, []);

  const handleAttachmentPress = useCallback(async (uri: string) => {
    try {
      await Linking.openURL(uri);
    } catch {
      // noop
    }
  }, []);

  const updateDraftAttachment = useCallback(
    (id: string, patch: Partial<DraftAttachment>) => {
      setDraftAttachments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      );
    },
    []
  );

  const removeDraftAttachment = useCallback((id: string) => {
    setDraftAttachments((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const ensureSingleKind = useCallback(
    (kind: DraftAttachmentKind) => {
      if (!draftAttachments.length) return true;
      return draftAttachments.every((item) => item.kind === kind);
    },
    [draftAttachments]
  );

  const ensureRecordingPermission = useCallback(async () => {
    try {
      if (typeof AudioModule.getRecordingPermissionsAsync === "function") {
        const existing = await AudioModule.getRecordingPermissionsAsync();
        if (existing?.granted) {
          return true;
        }
      }

      const result = await AudioModule.requestRecordingPermissionsAsync();
      if (!result.granted) {
        showNewToast({
          title: "Microphone blocked",
          description: "We need microphone access to record audio messages.",
          icon: HelpCircleIcon,
          action: "warning",
          variant: "solid",
        });
        return false;
      }
      return true;
    } catch (err: any) {
      showNewToast({
        title: "Permission error",
        description: err?.message || "Could not verify microphone access.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
      return false;
    }
  }, [showNewToast]);

  const compressImageAsync = useCallback(async (uri: string) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1280 } }],
        {
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      return result.uri;
    } catch {
      return uri;
    }
  }, []);

  const uploadAttachment = useCallback(
    async (
      id: string,
      payload: {
        uri: string;
        name?: string;
        mimeType?: string;
        kind: DraftAttachmentKind;
      }
    ) => {
      const { uri, name, mimeType, kind } = payload;
      console.log("🚀 ~ ChatDetailsScreen ~ payload:", payload)
      try {
        let workingUri = uri;
        let workingMime = mimeType;
        let workingName = name;

        if (kind === "image") {
          workingUri = await compressImageAsync(uri);
          workingMime = workingMime ?? "image/jpeg";
          if (!workingName) {
            workingName = `image-${Date.now()}.jpg`;
          }
        } else if (kind === "voice") {
          const extension = workingName?.split(".").pop() || "m4a";
          if (
            Platform.OS === "android" &&
            workingUri.startsWith("content://")
          ) {
            const dest = `${
              FileSystem.cacheDirectory ?? ""
            }voice-${Date.now()}.${extension}`;
            try {
              await FileSystem.copyAsync({ from: workingUri, to: dest });
              workingUri = dest;
            } catch (copyErr) {
              console.warn(
                "Failed to copy recording from content URI",
                copyErr
              );
            }
          } else {
            try {
              const info = await FileSystem.getInfoAsync(workingUri);
              if (!info.exists) {
                throw new Error("Recording file missing");
              }
            } catch (fileErr) {
              console.warn("Recording file check failed", fileErr);
            }
          }
          workingMime = workingMime ?? "audio/mp4";
          if (!workingName) {
            workingName = `voice-${Date.now()}.m4a`;
          }
        }

        const form = new FormData();
        form.append("file", {
          uri: workingUri,
          name: workingName || `upload-${Date.now()}`,
          type: workingMime || "application/octet-stream",
        } as any);

        const res = await uploadFile(form);
        const uploadedUrl = (res as any)?.data?.data;
        if (!uploadedUrl) {
          throw new Error("Upload failed");
        }

        updateDraftAttachment(id, {
          remoteUri: uploadedUrl,
          uploading: false,
        });
        showNewToast({
          title: "Attachment Ready",
          description: "Your file was uploaded successfully.",
          icon: CircleCheckIcon,
          action: "success",
          variant: "solid",
        });
      } catch (err: any) {
        removeDraftAttachment(id);
        const message =
          err?.data?.message ||
          err?.message ||
          (typeof uploadError === "string" ? uploadError : undefined) ||
          "Unable to upload attachment.";
        showNewToast({
          title: "Upload Failed",
          description: message,
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
      }
    },
    [
      compressImageAsync,
      removeDraftAttachment,
      showNewToast,
      updateDraftAttachment,
      uploadFile,
      uploadError,
    ]
  );

  const handleNewAttachment = useCallback(
    async (
      source: {
        uri: string;
        name?: string;
        mimeType?: string;
      },
      kind: DraftAttachmentKind
    ) => {
      if (!ensureSingleKind(kind)) {
        showNewToast({
          title: "Mixed Types Blocked",
          description: "Send one attachment category per message.",
          icon: HelpCircleIcon,
          action: "warning",
          variant: "solid",
        });
        return;
      }

      const id = `draft-${Date.now()}`;
      setDraftAttachments((prev) => [
        ...prev,
        {
          id,
          localUri: source.uri,
          name: source.name,
          mimeType: source.mimeType,
          kind,
          uploading: true,
        },
      ]);

      await uploadAttachment(id, {
        uri: source.uri,
        name: source.name,
        mimeType: source.mimeType,
        kind,
      });
    },
    [ensureSingleKind, showNewToast, uploadAttachment]
  );

  const pickPhoto = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      showNewToast({
        title: "Permission Needed",
        description: "We need access to your library to pick images.",
        icon: HelpCircleIcon,
        action: "warning",
        variant: "solid",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    await handleNewAttachment(
      {
        uri: asset.uri,
        name: asset.fileName ?? undefined,
        mimeType: asset.mimeType ?? undefined,
      },
      "image"
    );
  }, [handleNewAttachment, showNewToast]);

  const pickFile = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    await handleNewAttachment(
      {
        uri: asset.uri,
        name: asset.name ?? undefined,
        mimeType: asset.mimeType ?? undefined,
      },
      "file"
    );
  }, [handleNewAttachment]);

  const pickAudio = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
      type: "audio/*",
    });
    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    await handleNewAttachment(
      {
        uri: asset.uri,
        name: asset.name ?? undefined,
        mimeType: asset.mimeType ?? "audio/mpeg",
      },
      "voice"
    );
  }, [handleNewAttachment]);

  const handleMicPress = useCallback(async () => {
    if (isPreparingRecording) {
      return;
    }

    if (isRecording) {
      try {
        await audioRecorder.stop();
        const status = audioRecorder.getStatus();
        const uri = status?.url ?? audioRecorder.uri;
        if (!uri) {
          throw new Error("Recording unavailable");
        }
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });
        await handleNewAttachment(
          {
            uri,
            name: `voice-${Date.now()}.m4a`,
            mimeType: "audio/m4a",
          },
          "voice"
        );
      } catch (err: any) {
        showNewToast({
          title: "Recording failed",
          description: err?.message || "We couldn't finish that recording.",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
      }
      return;
    }

    if (!ensureSingleKind("voice")) {
      showNewToast({
        title: "Attachments conflict",
        description: "Remove other attachments before recording audio.",
        icon: HelpCircleIcon,
        action: "warning",
        variant: "solid",
      });
      return;
    }

    const permissionGranted = await ensureRecordingPermission();
    if (!permissionGranted) {
      return;
    }

    try {
      setIsPreparingRecording(true);
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      showNewToast({
        title: "Recording",
        description: "Tap the mic again to stop and attach your audio.",
        icon: CircleCheckIcon,
        action: "info",
        variant: "solid",
      });
    } catch (err: any) {
      showNewToast({
        title: "Recording error",
        description: err?.message || "Unable to start recording.",
        icon: HelpCircleIcon,
        action: "error",
        variant: "solid",
      });
    } finally {
      setIsPreparingRecording(false);
    }
  }, [
    audioRecorder,
    ensureRecordingPermission,
    ensureSingleKind,
    handleNewAttachment,
    isPreparingRecording,
    isRecording,
    showNewToast,
  ]);

  useEffect(() => {
    return () => {
      try {
        void audioRecorder.stop();
      } catch {
        // noop
      }
      void setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });
    };
  }, [audioRecorder]);

  const hasUploadingAttachment = draftAttachments.some(
    (item) => item.uploading
  );

  const deriveDraftType = useCallback(
    (attachments: DraftAttachment[]): MessageType => {
      if (!attachments.length) return "text";
      const kind = attachments[0]?.kind;
      if (kind === "image") return "image";
      if (kind === "voice") return "voice";
      return "file";
    },
    []
  );

  const handleMessageSubmit = useCallback(
    async (values: {
      type: string; //text, image, file, voice
      content?: string; //required if type is text
      attachments?: string[]; //required if type is not text
    }) => {
      try {
        await mutateAsync({
          ...values,
        });
        return true;
      } catch (e: any) {
        showNewToast({
          title: "Message Failed",
          description: e?.data?.message || e?.message || "Unknown error",
          icon: HelpCircleIcon,
          action: "error",
          variant: "solid",
        });
        return false;
      }
    },
    [mutateAsync, showNewToast]
  );

  useEffect(() => {
    if (!chatItems.length) return;
    const timeout = setTimeout(scrollToEnd, 100);
    return () => clearTimeout(timeout);
  }, [chatItems.length]);
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => {
        return (
          <ThemedText type="s1_subtitle" className="text-center">
            {displayName}
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
  }, [displayName, navigation, router]);

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
              {isLoading ? (
                <ThemedView className="w-full items-center justify-center py-12">
                  <ActivityIndicator size="large" color="#2F80ED" />
                </ThemedView>
              ) : chatItems.length === 0 ? (
                <ThemedView className="w-full items-center justify-center py-12">
                  <ThemedText
                    type="b3_body"
                    className="text-typography-500 text-center"
                  >
                    No messages yet. Start the conversation!
                  </ThemedText>
                </ThemedView>
              ) : (
                chatItems.map((item) => {
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
                  const avatarUri = isSender
                    ? m.senderImage
                    : m.senderImage ?? participantAvatar;
                  const avatarInitials = isSender
                    ? getInitials("You")
                    : getInitials(participant?.fullName);
                  return (
                    <ThemedView
                      key={item.key}
                      className={`w-full flex-row items-end ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isSender && (
                        <Avatar size="sm" className="mr-2 bg-typography-400">
                          <AvatarFallbackText>
                            {avatarInitials}
                          </AvatarFallbackText>
                          {avatarUri ? (
                            <AvatarImage source={{ uri: avatarUri }} />
                          ) : null}
                        </Avatar>
                      )}
                      <ThemedView
                        className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                          isSender ? "bg-primary-500" : "bg-typography-200"
                        } ${isSender ? "rounded-br-sm" : "rounded-bl-sm"}`}
                      >
                        {m.attachments.length > 0 && (
                          <ThemedView className="gap-2 mb-2">
                            {m.type === "voice" || m.type === "audio"
                              ? m.attachments.map((uri, index) => (
                                  <VoiceMessagePlayer
                                    key={`${m.id}-voice-${index}`}
                                    uri={uri}
                                    isSender={isSender}
                                  />
                                ))
                              : m.attachments.map((uri, index) => {
                                  const attachmentKey = `${m.id}-att-${index}`;
                                  const attachmentIsImage = isImageAttachment(
                                    uri,
                                    m.type
                                  );

                                  if (attachmentIsImage) {
                                    return (
                                      <AttachmentFile
                                        key={attachmentKey}
                                        uri={uri}
                                        handleAttachmentPress={() =>
                                          handleAttachmentPress(uri)
                                        }
                                      />
                                    );
                                  }

                                  return (
                                    <TouchableOpacity
                                      key={attachmentKey}
                                      activeOpacity={0.8}
                                      onPress={() => handleAttachmentPress(uri)}
                                    >
                                      <ThemedView
                                        className={`flex-row items-center gap-2 px-3 py-2 rounded-xl ${
                                          isSender ? "bg-white/20" : "bg-white"
                                        }`}
                                      >
                                        <Icon
                                          as={Paperclip}
                                          size="lg"
                                          className={
                                            isSender
                                              ? "text-white"
                                              : "text-typography-800"
                                          }
                                        />
                                        <ThemedText
                                          type="b4_body"
                                          className={`flex-1 ${
                                            isSender
                                              ? "text-white"
                                              : "text-typography-900"
                                          }`}
                                          numberOfLines={1}
                                        >
                                          {getFileName(uri)}
                                        </ThemedText>
                                      </ThemedView>
                                    </TouchableOpacity>
                                  );
                                })}
                          </ThemedView>
                        )}
                        {!!m.text && (
                          <ThemedText
                            type="b4_body"
                            className={`${
                              isSender ? "text-white" : "text-typography-900"
                            }`}
                          >
                            {m.text}
                          </ThemedText>
                        )}

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
                      {isSender && (
                        <Avatar size="sm" className="ml-2">
                          <AvatarFallbackText>
                            {getInitials("You")}
                          </AvatarFallbackText>
                          {avatarUri ? (
                            <AvatarImage source={{ uri: avatarUri }} />
                          ) : null}
                        </Avatar>
                      )}
                      {isSender && <ThemedView className="ml-2" />}
                    </ThemedView>
                  );
                })
              )}
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
            onSubmit={async (values, { resetForm }) => {
              const draftsSnapshot = [...draftAttachments];
              const text = values.message.trim();
              const hasText = text.length > 0;
              const uploadedAttachments = draftsSnapshot
                .filter((item) => Boolean(item.remoteUri))
                .map((item) => item.remoteUri as string);
              const hasAttachments = uploadedAttachments.length > 0;

              if (!hasText && !hasAttachments) {
                showNewToast({
                  title: "Nothing to send",
                  description: "Add a message or attachment first.",
                  icon: HelpCircleIcon,
                  action: "info",
                  variant: "solid",
                });
                return;
              }

              if (hasUploadingAttachment) {
                showNewToast({
                  title: "Still uploading",
                  description:
                    "Please wait for attachments to finish uploading.",
                  icon: HelpCircleIcon,
                  action: "warning",
                  variant: "solid",
                });
                return;
              }

              if (
                draftsSnapshot.length > 0 &&
                uploadedAttachments.length !== draftsSnapshot.length
              ) {
                showNewToast({
                  title: "Upload incomplete",
                  description: "One or more files did not upload successfully.",
                  icon: HelpCircleIcon,
                  action: "warning",
                  variant: "solid",
                });
                return;
              }

              const messageType = hasAttachments
                ? deriveDraftType(draftsSnapshot)
                : "text";

              if (messageType === "text" && !hasText) {
                showNewToast({
                  title: "Empty message",
                  description: "Type a message before sending.",
                  icon: HelpCircleIcon,
                  action: "info",
                  variant: "solid",
                });
                return;
              }

              const payload: {
                type: string;
                content?: string;
                attachments?: string[];
              } = {
                type: messageType,
              };
              if (hasText) {
                payload.content = text;
              }
              if (hasAttachments) {
                payload.attachments = uploadedAttachments;
              }

              const localId = `local-${Date.now()}`;
              const queuedMessage: Message = {
                id: localId,
                text,
                timestamp: Date.now(),
                role: "sender",
                type: messageType as MessageType,
                attachments: uploadedAttachments,
              };
              setQueuedMessages((prev) => [...prev, queuedMessage]);
              resetForm();
              setDraftAttachments([]);
              setTimeout(scrollToEnd, 50);

              const success = await handleMessageSubmit(payload);
              if (success) {
                await refetch();
              }
              setQueuedMessages((prev) =>
                prev.filter((message) => message.id !== localId)
              );
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => {
              const trimmedMessage = values.message.trim();
              const disableSend =
                (!trimmedMessage && draftAttachments.length === 0) ||
                hasUploadingAttachment ||
                loading ||
                isUploading;

              return (
                <ThemedView className="flex-row items-end gap-4">
                  <ThemedView className="flex-1">
                    {draftAttachments.length > 0 && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-2 pt-2"
                        contentContainerStyle={{ paddingRight: 12 }}
                      >
                        {draftAttachments.map((attachment) => (
                          <ThemedView
                            key={attachment.id}
                            className="relative mr-3"
                          >
                            {attachment.kind === "image" ? (
                              <RNImage
                                source={{ uri: attachment.localUri }}
                                style={{
                                  width: 96,
                                  height: 96,
                                  borderRadius: 16,
                                }}
                              />
                            ) : (
                              <ThemedView className="w-40 rounded-2xl bg-typography-200 px-3 py-2">
                                <ThemedView className="flex-row items-center gap-2">
                                  <Icon
                                    as={
                                      attachment.kind === "voice"
                                        ? FileAudio
                                        : File
                                    }
                                    size="lg"
                                    className="text-typography-900"
                                  />
                                  <ThemedText
                                    type="b4_body"
                                    className="flex-1 text-typography-900"
                                    numberOfLines={1}
                                  >
                                    {attachment.name ?? "Attachment"}
                                  </ThemedText>
                                </ThemedView>
                              </ThemedView>
                            )}
                            <TouchableOpacity
                              onPress={() =>
                                removeDraftAttachment(attachment.id)
                              }
                              className="absolute -top-2 -right-2 h-7 w-7 items-center justify-center rounded-full bg-black/70"
                            >
                              <Icon as={X} size="sm" className="text-white" />
                            </TouchableOpacity>
                            {attachment.uploading && (
                              <ThemedView className="absolute inset-0 items-center justify-center rounded-2xl bg-black/40">
                                <ActivityIndicator color="#FFFFFF" />
                              </ThemedView>
                            )}
                          </ThemedView>
                        ))}
                      </ScrollView>
                    )}
                    <Input
                      className="min-h-[50px] flex-1 h-full rounded-lg border-0 border-primary-100 bg-[#F3F3F6] px-2"
                      size="xl"
                      isInvalid={!!(errors.message && touched.message)}
                    >
                      <Menu
                        placement="bottom"
                        className="mr-2 relative left-2 -top-4"
                        offset={5}
                        trigger={({ ...triggerProps }) => {
                          return (
                            <Button variant="link" {...triggerProps}>
                              <ButtonText className="flex-row items-center gap-2 p-2 rounded-lg">
                                <Icon as={Plus} size="2xl" />
                              </ButtonText>
                            </Button>
                          );
                        }}
                      >
                        <MenuItem
                          key="photo"
                          textValue="photo"
                          onPress={pickPhoto}
                        >
                          <MenuItemLabel size="sm">
                            <ThemedView className="flex-row items-center gap-2">
                              <ThemedText type="default">
                                <Icon as={Image} size="2xl" />
                              </ThemedText>
                              <ThemedText
                                type="s2_subtitle"
                                className="text-black"
                              >
                                Photos
                              </ThemedText>
                            </ThemedView>
                          </MenuItemLabel>
                        </MenuItem>
                        <MenuItem
                          key="audio"
                          textValue="audio"
                          onPress={pickAudio}
                        >
                          <MenuItemLabel size="sm">
                            <ThemedView className="flex-row items-center gap-2">
                              <ThemedText type="default">
                                <Icon as={FileAudio} size="2xl" />
                              </ThemedText>
                              <ThemedText
                                type="s2_subtitle"
                                className="text-black"
                              >
                                Audios
                              </ThemedText>
                            </ThemedView>
                          </MenuItemLabel>
                        </MenuItem>
                        <MenuItem
                          key="file"
                          textValue="file"
                          onPress={pickFile}
                        >
                          <MenuItemLabel size="sm">
                            <ThemedView className="flex-row items-center gap-2">
                              <ThemedText type="default">
                                <Icon as={File} size="2xl" />
                              </ThemedText>
                              <ThemedText
                                type="s2_subtitle"
                                className="text-black"
                              >
                                Files
                              </ThemedText>
                            </ThemedView>
                          </MenuItemLabel>
                        </MenuItem>
                      </Menu>

                      {isRecording && (
                        <ThemedView className="flex-row items-center gap-2 px-3 pb-2">
                          <Icon
                            as={StopCircle}
                            size="lg"
                            className="text-error-500"
                          />
                          <ThemedText type="b4_body" className="text-error-500">
                            Recording… {formatMillis(recordingDurationMillis)}
                          </ThemedText>
                        </ThemedView>
                      )}
                      <InputField
                        placeholder={`${isRecording ? "" : "send message..."}`}
                        value={values.message}
                        className="bg-transparent px-0 pb-5 m-0 top-4 text-typography-900"
                        onChangeText={handleChange("message")}
                        style={{
                          textAlignVertical: "top",
                          minHeight: 24,
                          maxHeight: 128,
                        }}
                        onBlur={handleBlur("message")}
                        multiline
                        numberOfLines={undefined}
                      />
                      <InputSlot className="pr-3">
                        <TouchableOpacity
                          onPress={handleMicPress}
                          disabled={isPreparingRecording}
                          className="p-2"
                        >
                          {isPreparingRecording ? (
                            <ActivityIndicator />
                          ) : (
                            <Icon
                              as={isRecording ? StopCircle : Mic}
                              size="2xl"
                              className={
                                isRecording
                                  ? "text-error-500"
                                  : "text-typography-900"
                              }
                            />
                          )}
                        </TouchableOpacity>
                      </InputSlot>
                    </Input>
                    {errors.message && touched.message && (
                      <ThemedText
                        type="b4_body"
                        className="text-error-500 mb-4"
                      >
                        {errors.message}
                      </ThemedText>
                    )}
                  </ThemedView>
                  <Button
                    variant="solid"
                    size="2xl"
                    className="rounded-full h-16 w-14"
                    onPress={() => handleSubmit()}
                    isDisabled={disableSend}
                  >
                    {loading || isUploading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Icon as={Send} size="2xl" className="text-white" />
                    )}
                  </Button>
                </ThemedView>
              );
            }}
          </Formik>
        </ThemedView>
      </KeyboardAvoidingView>
    </>
  );
}
