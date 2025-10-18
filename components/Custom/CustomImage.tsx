import React, { useState } from "react";
import { Image } from "../ui/image";
type size =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "2xs"
  | "xs"
  | "full"
  | "none"
  | undefined;
export default function CustomImage({
  uri,
  size,
  alt,
  className,
}: {
  uri: string;
  size: size;
  alt?: string;
  className?: string;
}) {
  const [imageUri, setImageUri] = useState(
    uri || "https://dummyimage.com/600x400/e3d7e3/000000.png&text=not+found"
  );
  return (
    <Image
      source={{ uri: imageUri }}
      className={className}
      onError={() => {
        console.warn("Failed to load image:", uri);
        // Set fallback image
        setImageUri(
          "https://dummyimage.com/600x400/e3d7e3/000000.png&text=not+found"
        );
      }}
      size={size}
      alt={alt}
    />
  );
}
