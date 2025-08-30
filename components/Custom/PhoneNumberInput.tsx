import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";
import PhoneInput from "react-native-phone-number-input";

// Under our ambient module declaration, the library is untyped; expose `any` to avoid TS issues.
export type PhoneNumberInputRef = any;

export interface PhoneNumberInputProps {
  value: string;
  onChangeFormattedText?: (text: string) => void;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  layout?: "first" | "second";
  disabled?: boolean;
  defaultCode?: string; // country code like 'US', 'GB'
  countryPickerProps?: any;
  containerStyle?: StyleProp<ViewStyle>;
  flagButtonStyle?: StyleProp<ViewStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  codeTextStyle?: StyleProp<TextStyle>;
  textInputProps?: TextInputProps;
}

/**
 * A thin, reusable wrapper around react-native-phone-number-input with sensible defaults.
 * - Forwards ref to access validation helpers from the underlying library.
 * - Accepts style overrides and common props to keep usage consistent across screens.
 */
const PhoneNumberInput = forwardRef<PhoneNumberInputRef, PhoneNumberInputProps>(
  (
    {
      value,
      onChangeFormattedText,
      onChangeText,
      placeholder = "Your phone number",
      layout = "first",
      disabled = false,
      defaultCode,
      countryPickerProps,
      containerStyle,
      flagButtonStyle,
      textContainerStyle,
      textInputStyle,
      codeTextStyle,
      textInputProps,
    },
    ref
  ) => {
    const innerRef = useRef<any>(null);
    useImperativeHandle(ref, () => innerRef.current);

    return (
      <PhoneInput
        ref={innerRef}
        value={value}
        layout={layout}
        defaultCode={defaultCode as any}
        disabled={disabled}
        countryPickerProps={{
          withFilter: true,
          withEmoji: true,
          ...(countryPickerProps || {}),
        }}
        onChangeFormattedText={onChangeFormattedText}
        onChangeText={onChangeText}
        containerStyle={[
          {
            height: 52,
            width: "100%",
            borderRadius: 5,
            backgroundColor: "#f9fafb33",
            borderWidth: 1,
            borderColor: "#F8CCC2",
          },
          containerStyle as any,
        ]}
        flagButtonStyle={[
          {
            width: 60,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          },
          flagButtonStyle as any,
        ]}
        textContainerStyle={[
          {
            height: 52,
            backgroundColor: "transparent",
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            paddingVertical: 0,
          },
          textContainerStyle as any,
        ]}
        textInputStyle={[
          {
            color: "#111",
            fontSize: 16,
            paddingVertical: 0,
          },
          textInputStyle as any,
        ]}
        codeTextStyle={[{ fontSize: 16, color: "#111" }, codeTextStyle as any]}
        textInputProps={{
          placeholder,
          placeholderTextColor: "#9CA3AF",
          ...textInputProps,
        }}
      />
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
