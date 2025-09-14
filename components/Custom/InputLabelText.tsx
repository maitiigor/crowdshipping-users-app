import React from "react";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";

interface IProps {
  children: React.ReactNode;
  type?:
    | "default"
    | "link"
    | "h1_header"
    | "h2_header"
    | "h3_header"
    | "h4_header"
    | "h5_header"
    | "s1_subtitle"
    | "s2_subtitle"
    | "b2_body"
    | "b3_body"
    | "b4_body"
    | "c1_caption"
    | "c2_caption"
    | "c3_caption"
    | "label_text"
    | "btn_giant"
    | "btn_large"
    | "btn_medium"
    | "btn_small"
    | "btn_tiny"
    | undefined;
  className?: string;
}

export default function InputLabelText({
  children,
  type = "b2_body",
  className,
}: IProps) {
  return (
    <View>
      <ThemedText type={type} className={className}>
        {children}
      </ThemedText>
    </View>
  );
}
