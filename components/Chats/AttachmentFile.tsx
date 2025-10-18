import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";

export default function AttachmentFile({
  uri,
  handleAttachmentPress,
}: {
  uri: string;
  handleAttachmentPress: (uri: string) => void;
}) {
  const [imageUri, setImageUri] = useState(
    uri || "https://dummyimage.com/600x400/e3d7e3/000000.png&text=not+found"
  );
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className=""
      onPress={() => handleAttachmentPress(imageUri)}
    >
      <Image
        source={{ uri: imageUri }}
        resizeMode="cover"
        onError={() => {
          console.warn("Failed to load image:", uri);
          // Set fallback image
          setImageUri(
            "https://dummyimage.com/600x400/e3d7e3/000000.png&text=not+found"
          );
        }}
        style={{
          width: 220,
          height: 220,
          borderRadius: 16,
        }}
      />
    </TouchableOpacity>
  );
}
