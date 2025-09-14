import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  createMotionAnimatedComponent,
  MotionComponentProps,
} from "@legendapp/motion";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import {
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileText,
  Upload,
  Video as VideoIcon,
  X,
} from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  View,
  ViewStyle,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { Icon } from "../ui/icon";

// Basic mapping of fallback icons per file category
const fileCategoryIcon: Record<string, any> = {
  image: Upload,
  video: VideoIcon,
  audio: FileAudio,
  code: FileCode,
  archive: FileArchive,
  text: FileText,
  other: File,
};

export interface PickedFile {
  uri: string;
  name?: string | null;
  size?: number | null;
  mimeType?: string | null;
  type: "image" | "video" | "audio" | "text" | "archive" | "code" | "other";
  // for videos we can attach a generated thumbnail
  thumbnailUri?: string | null;
  // original asset if chosen via ImagePicker (for images/videos)
  asset?: ImagePicker.ImagePickerAsset;
}

export interface FileUploaderProps {
  value?: PickedFile | null;
  onChange: (file: PickedFile | null) => void;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  allowImages?: boolean;
  allowVideos?: boolean;
  allowDocuments?: boolean; // general docs (pdf, docx, etc)
  allowMultiple?: boolean; // (not implemented yet - future) for now single
  quality?: number; // image/video quality 0..1
  generateVideoThumbnail?: boolean;
  size?: number; // square preview size
  className?: string;
  previewShape?: "square" | "rounded" | "circle" | "none";
  showRemove?: boolean;
  editIconClassName?: string;
}

type IAnimatedPressableProps = React.ComponentProps<typeof Pressable> &
  MotionComponentProps<typeof Pressable, ViewStyle, unknown, unknown, unknown>;

const AnimatedPressable = createMotionAnimatedComponent(
  Pressable
) as React.ComponentType<IAnimatedPressableProps>;

// Utility categorize file by mime
function categorize(
  mimeType?: string | null,
  name?: string | null
): PickedFile["type"] {
  if (!mimeType && name) {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext) {
      if (["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"].includes(ext))
        return "image";
      if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return "video";
      if (["mp3", "wav", "aac", "m4a", "ogg", "flac"].includes(ext))
        return "audio";
      if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
      if (
        [
          "js",
          "ts",
          "tsx",
          "json",
          "py",
          "java",
          "kt",
          "rb",
          "go",
          "rs",
          "c",
          "cpp",
          "cs",
          "html",
          "css",
        ].includes(ext)
      )
        return "code";
      if (["txt", "md", "rtf", "pdf", "doc", "docx"].includes(ext))
        return "text";
    }
    return "other";
  }
  if (!mimeType) return "other";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/zip" || mimeType.includes("compressed"))
    return "archive";
  if (
    mimeType.startsWith("text/") ||
    [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(mimeType)
  )
    return "text";
  if (mimeType.includes("json") || mimeType.includes("javascript"))
    return "code";
  return "other";
}

const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onChange,
  label = "Attachment",
  helperText,
  disabled = false,
  allowImages = true,
  allowVideos = true,
  allowDocuments = true,
  quality = 0.8,
  generateVideoThumbnail = true,
  size = 120,
  className,
  previewShape = "rounded",
  showRemove = true,
  editIconClassName,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const borderRadius = useMemo(() => {
    if (previewShape === "circle") return size / 2;
    if (previewShape === "rounded") return 16;
    if (previewShape === "none") return 0;
    return 4;
  }, [previewShape, size]);

  const pickDocument = useCallback(async () => {
    if (disabled) return;
    setLoading(true);
    try {
      const res = await DocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (!res.canceled && Array.isArray(res.assets) && res.assets.length > 0) {
        const asset = res.assets[0] as DocumentPicker.DocumentPickerAsset;
        const { uri, name, size: fsize, mimeType } = asset;
        const type = categorize(mimeType, name);
        const picked: PickedFile = {
          uri,
          name,
          size: typeof fsize === "number" ? fsize : null,
          mimeType: mimeType ?? null,
          type,
        };
        onChange(picked);
      }
    } finally {
      setLoading(false);
      setSheetOpen(false);
    }
  }, [disabled, onChange]);

  const pickFromLibrary = useCallback(async () => {
    if (disabled) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") return;
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          allowImages && allowVideos
            ? ImagePicker.MediaTypeOptions.All
            : allowVideos
            ? ImagePicker.MediaTypeOptions.Videos
            : ImagePicker.MediaTypeOptions.Images,
        quality,
        allowsEditing: allowImages, // editing only for images
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        const type = categorize(asset.mimeType, asset.fileName || asset.uri);
        let thumbnailUri: string | undefined;
        if (type === "video" && generateVideoThumbnail) {
          try {
            const thumb = await VideoThumbnails.getThumbnailAsync(asset.uri, {
              time: 1000,
              quality: 0.7,
            });
            thumbnailUri = thumb.uri;
          } catch {}
        }
        const picked: PickedFile = {
          uri: asset.uri,
          name: asset.fileName || null,
          size: asset.fileSize || null,
          mimeType: asset.mimeType || null,
          type,
          thumbnailUri: thumbnailUri || null,
          asset,
        };
        // If choosing an image but documents are disabled it's still fine; just emit
        if (
          (type === "image" && allowImages) ||
          (type === "video" && allowVideos)
        ) {
          onChange(picked);
        }
      }
    } finally {
      setLoading(false);
      setSheetOpen(false);
    }
  }, [
    allowImages,
    allowVideos,
    disabled,
    generateVideoThumbnail,
    onChange,
    quality,
  ]);

  const takePhotoOrVideo = useCallback(async () => {
    if (disabled) return;
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") return;
    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: allowVideos
          ? ImagePicker.MediaTypeOptions.All
          : ImagePicker.MediaTypeOptions.Images,
        quality,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        const type = categorize(asset.mimeType, asset.fileName || asset.uri);
        let thumbnailUri: string | undefined;
        if (type === "video" && generateVideoThumbnail) {
          try {
            const thumb = await VideoThumbnails.getThumbnailAsync(asset.uri, {
              time: 1000,
              quality: 0.7,
            });
            thumbnailUri = thumb.uri;
          } catch {}
        }
        const picked: PickedFile = {
          uri: asset.uri,
          name: asset.fileName || null,
          size: asset.fileSize || null,
          mimeType: asset.mimeType || null,
          type,
          thumbnailUri: thumbnailUri || null,
          asset,
        };
        if (
          (type === "image" && allowImages) ||
          (type === "video" && allowVideos)
        ) {
          onChange(picked);
        }
      }
    } finally {
      setLoading(false);
      setSheetOpen(false);
    }
  }, [
    allowImages,
    allowVideos,
    disabled,
    generateVideoThumbnail,
    onChange,
    quality,
  ]);

  // Determine which icon to use for non-image preview
  const iconFor = (file?: PickedFile | null) => {
    if (!file) return Upload;
    return fileCategoryIcon[file.type] || File;
  };

  const renderPreview = () => {
    if (!value) {
      return (
        <ThemedView
          className="w-full h-full items-center justify-center"
          style={{ borderRadius }}
        >
          <Icon as={Upload} className="text-primary-500" size="3xl" />
          {/* <ThemedText className="text-typography-500 mt-1 text-xs">
            Tap to upload
          </ThemedText> */}
        </ThemedView>
      );
    }

    if (value.type === "image") {
      return (
        <Image
          source={{ uri: value.uri }}
          style={{ width: "100%", height: "100%", borderRadius }}
          contentFit="cover"
        />
      );
    }

    if (value.type === "video") {
      return (
        <View
          className="w-full h-full"
          style={{ borderRadius, overflow: "hidden" }}
        >
          {value.thumbnailUri ? (
            <Image
              source={{ uri: value.thumbnailUri }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <ThemedView className="flex-1 items-center justify-center">
              <Icon as={VideoIcon} className="text-primary-500" size="2xl" />
            </ThemedView>
          )}
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <ThemedText className="text-white text-xs">Video</ThemedText>
          </View>
        </View>
      );
    }

    // other types - show icon and name
    const IconComp = iconFor(value);
    return (
      <ThemedView
        className="w-full h-full items-center justify-center px-2"
        style={{ borderRadius }}
      >
        <Icon as={IconComp} className="text-primary-500" size="2xl" />
        {value.name ? (
          <ThemedText
            numberOfLines={2}
            className="text-xxs text-center mt-1 text-typography-600"
          >
            {value.name}
          </ThemedText>
        ) : null}
      </ThemedView>
    );
  };

  return (
    <AnimatedPressable
      onPress={() => (!disabled ? setSheetOpen(true) : undefined)}
      className={className}
    >
      {!!label && (
        <ThemedText className="mb-2 text-typography-900">{label}</ThemedText>
      )}
      <View
        className={twMerge(
          "items-center justify-center overflow-hidden border-none border-primary-500 bg-primary-inputShade shadow-md shadow-black/10 relative",
          disabled && "opacity-60"
        )}
        style={{ width: size, height: size, borderRadius }}
      >
        {renderPreview()}
        {value && showRemove && !loading ? (
          <Pressable
            onPress={() => onChange(null)}
            className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
          >
            <Icon as={X} className="text-white" size="sm" />
          </Pressable>
        ) : null}
        {loading && (
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </View>
      {!!helperText && (
        <ThemedText type="s2_subtitle" className="mt-2 text-typography-800 text-center">
          {helperText}
        </ThemedText>
      )}

      <Modal
        transparent
        visible={sheetOpen}
        animationType="fade"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setSheetOpen(false)}
        >
          <View className="mt-auto bg-white rounded-t-3xl p-4">
            <View className="items-center">
              <View className="w-12 h-1.5 bg-background-300 rounded-full mb-3" />
            </View>
            {(allowImages || allowVideos) && (
              <Pressable
                className="h-12 rounded-lg bg-primary-600 items-center justify-center mb-3"
                onPress={takePhotoOrVideo}
              >
                <ThemedText className="text-white">
                  {allowVideos ? "Camera (Photo/Video)" : "Take a Photo"}
                </ThemedText>
              </Pressable>
            )}
            {(allowImages || allowVideos) && (
              <Pressable
                className="h-12 rounded-lg bg-primary-inputShade border border-background-300 items-center justify-center mb-3"
                onPress={pickFromLibrary}
              >
                <ThemedText className="text-typography-900">
                  Choose from library
                </ThemedText>
              </Pressable>
            )}
            {allowDocuments && (
              <Pressable
                className="h-12 rounded-lg bg-primary-inputShade border border-background-300 items-center justify-center mb-3"
                onPress={pickDocument}
              >
                <ThemedText className="text-typography-900">
                  Pick a document
                </ThemedText>
              </Pressable>
            )}
            {value && showRemove ? (
              <Pressable
                className="h-12 rounded-lg bg-error-50 border border-error-200 items-center justify-center"
                onPress={() => {
                  onChange(null);
                  setSheetOpen(false);
                }}
              >
                <ThemedText className="text-error-600">Remove file</ThemedText>
              </Pressable>
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </AnimatedPressable>
  );
};

export default FileUploader;
