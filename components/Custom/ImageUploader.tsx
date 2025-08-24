import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Feather from "@expo/vector-icons/Feather";
import {
  createMotionAnimatedComponent,
  MotionComponentProps,
} from "@legendapp/motion";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  View,
  ViewStyle,
} from "react-native";
export type ImageUploaderProps = {
  uri?: string | null;
  onChange: (uri: string | null, asset?: ImagePicker.ImagePickerAsset) => void;
  size?: number; // width/height for square/circle
  shape?: "circle" | "rounded" | "square";
  label?: string;
  helperText?: string;
  disabled?: boolean;
  quality?: number; // 0..1
  allowsEditing?: boolean;
  aspect?: [number, number];
  className?: string;
  allowCamera?: boolean;
  showRemove?: boolean;
};

type IAnimatedPressableProps = React.ComponentProps<typeof Pressable> &
  MotionComponentProps<typeof Pressable, ViewStyle, unknown, unknown, unknown>;

const AnimatedPressable = createMotionAnimatedComponent(
  Pressable
) as React.ComponentType<IAnimatedPressableProps>;

const ImageUploader: React.FC<ImageUploaderProps> = ({
  uri,
  onChange,
  size = 120,
  shape = "circle",
  label = "Profile photo",
  helperText,
  disabled = false,
  quality = 0.8,
  allowsEditing = true,
  aspect = [1, 1],
  className,
  allowCamera = true,
  showRemove = true,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const borderRadius = useMemo(() => {
    if (shape === "circle") return size / 2;
    if (shape === "rounded") return 16;
    return 8;
  }, [shape, size]);

  const pickFromLibrary = useCallback(async () => {
    if (disabled) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") return;
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect,
        quality,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        onChange(asset.uri, asset);
      }
    } finally {
      setLoading(false);
      setSheetOpen(false);
    }
  }, [allowsEditing, aspect, disabled, onChange, quality]);

  const takePhoto = useCallback(async () => {
    if (disabled) return;
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") return;
    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing,
        aspect,
        quality,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        onChange(asset.uri, asset);
      }
    } finally {
      setLoading(false);
      setSheetOpen(false);
    }
  }, [allowsEditing, aspect, disabled, onChange, quality]);

  return (
    <ThemedView className={className}>
      {!!label && (
        <ThemedText className="mb-2 text-typography-900">{label}</ThemedText>
      )}
      <AnimatedPressable
        onPress={() => (!disabled ? setSheetOpen(true) : undefined)}
        className="items-center justify-center overflow-hidden border-2 bg-primary-0 shadow-md shadow-black/10"
        style={{ width: size, height: size, borderRadius }}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: "100%", height: "100%", borderRadius }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <ThemedView
            className="w-full h-full items-center justify-center"
            style={{ borderRadius }}
          >
            <Feather name="image" size={22} color="#9CA3AF" />
            <ThemedText className="text-typography-500 mt-1">
              Tap to upload
            </ThemedText>
          </ThemedView>
        )}
        {/* subtle hint overlay when image present */}
        {uri ? (
          <View className="absolute inset-x-0 bottom-0 py-1 bg-black/30 items-center">
            <ThemedText className="text-white text-xs">Change photo</ThemedText>
          </View>
        ) : null}

        {/* Floating edit FAB */}
        <View
          className="absolute right-2 bottom-2 bg-primary-600 z-30 items-center justify-center"
          style={{ width: 36, height: 36, borderRadius: 18 }}
        >
          <Feather name="edit-2" size={18} color="#fff" />
        </View>

        {/* Loading overlay */}
        {loading && (
          <View className="absolute inset-0 bg-black/20 items-center justify-center">
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </AnimatedPressable>
      {!!helperText && (
        <ThemedText className="mt-2 text-typography-600">
          {helperText}
        </ThemedText>
      )}

      {/* Bottom sheet for actions */}
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
            {allowCamera && (
              <Pressable
                className="h-12 rounded-lg bg-primary-600 items-center justify-center mb-3"
                onPress={takePhoto}
              >
                <ThemedText className="text-white">Take a photo</ThemedText>
              </Pressable>
            )}
            <Pressable
              className="h-12 rounded-lg bg-primary-0 border border-background-300 items-center justify-center mb-3"
              onPress={pickFromLibrary}
            >
              <ThemedText className="text-typography-900">
                Choose from library
              </ThemedText>
            </Pressable>
            {uri && showRemove ? (
              <Pressable
                className="h-12 rounded-lg bg-error-50 border border-error-200 items-center justify-center"
                onPress={() => {
                  onChange(null);
                  setSheetOpen(false);
                }}
              >
                <ThemedText className="text-error-600">Remove photo</ThemedText>
              </Pressable>
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </ThemedView>
  );
};

export default ImageUploader;
