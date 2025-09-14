import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, type TextProps } from "react-native";
import { twMerge } from "tailwind-merge";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
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
    | "btn_tiny";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  className,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      className={twMerge(className)}
      style={[
        type === "default" ? styles.default : undefined,
        type === "link" ? styles.link : undefined,
        type === "h1_header" ? styles.h1_header : undefined,
        type === "h2_header" ? styles.h2_header : undefined,
        type === "h3_header" ? styles.h3_header : undefined,
        type === "h4_header" ? styles.h4_header : undefined,
        type === "h5_header" ? styles.h5_header : undefined,
        type === "s1_subtitle" ? styles.s1_subtitle : undefined,
        type === "s2_subtitle" ? styles.s2_subtitle : undefined,
        type === "b2_body" ? styles.b2_body : undefined,
        type === "b3_body" ? styles.b3_body : undefined,
        type === "b4_body" ? styles.b4_body : undefined,
        type === "c1_caption" ? styles.c1_caption : undefined,
        type === "c2_caption" ? styles.c2_caption : undefined,
        type === "c3_caption" ? styles.c3_caption : undefined,
        type === "label_text" ? styles.label_text : undefined,
        type === "btn_giant" ? styles.btn_giant : undefined,
        type === "btn_large" ? styles.btn_large : undefined,
        type === "btn_medium" ? styles.btn_medium : undefined,
        type === "btn_small" ? styles.btn_small : undefined,
        type === "btn_tiny" ? styles.btn_tiny : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // Headlines
  h1_header: {
    fontSize: 48,
    lineHeight: 58,
    fontWeight: "600", // Semi Bold
    fontFamily: "Poppins-SemiBold",
  },
  h2_header: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  h3_header: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  h4_header: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  h5_header: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  // link
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "Poppins-Regular",
  },
  // Subtitles
  s1_subtitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  s2_subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },

  // Body
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400", // Regular
    fontFamily: "Poppins-Regular",
  },
  b2_body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500", // Medium
    fontFamily: "Poppins-Medium",
  },
  b3_body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    fontFamily: "Poppins-Regular",
  },
  b4_body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
  },

  // Captions
  c1_caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    fontFamily: "Poppins-Regular",
  },
  c2_caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
  },
  c3_caption: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
  },

  // Label
  label_text: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
  },

  // Buttons
  btn_giant: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  btn_large: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  btn_medium: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  btn_small: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  btn_tiny: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
});

export default styles;
