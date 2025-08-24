import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CalendarDaysIcon } from "@/components/ui/icon";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import { Modal, Platform, Pressable, View } from "react-native";

export type DateFieldProps = {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: "date" | "time" | "datetime";
  label?: string;
  placeholder?: string;
  // Cross-platform; narrowed internally to valid options per OS
  display?: "default" | "spinner" | "calendar" | "clock" | "inline" | "compact";
  className?: string;
  format?: (d: Date) => string;
};

const defaultFormat = (d: Date) => d.toLocaleDateString();

const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
  mode = "date",
  label = "Date of birth",
  placeholder = "Select date",
  display = Platform.select({
    ios: "spinner",
    android: "default",
    default: "default",
  })!,
  className,
  format = defaultFormat,
}) => {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<Date>(value ?? new Date());

  const labelText = useMemo(
    () => (value ? format(value) : placeholder),
    [value, placeholder, format]
  );

  const confirm = () => {
    setOpen(false);
    onChange(temp);
  };

  const onNativeChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      setOpen(false);
      if (selected) onChange(selected);
    } else if (selected) {
      setTemp(selected);
    }
  };

  return (
    <ThemedView className={className}>
      {!!label && (
        <ThemedText className="mb-2 text-typography-900">{label}</ThemedText>
      )}
      <Pressable
        onPress={() => (Platform.OS === "web" ? undefined : setOpen(true))}
        className="h-[55px] rounded-lg bg-primary-0 px-3  flex-row items-center justify-between border border-background-300"
      >
        <ThemedText
          className={value ? "text-typography-900" : "text-typography-500"}
        >
          {labelText}
        </ThemedText>
        <AntDesign name="calendar" size={24} color="black" />
      </Pressable>

      {open && Platform.OS !== "ios" && (
        <DateTimePicker
          value={value ?? new Date()}
          // Android doesn't support 'datetime' mode directly
          mode={(mode === "datetime" ? "date" : mode) as any}
          display={(display ?? "default") as any}
          onChange={onNativeChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal
          transparent
          visible={open}
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable
            className="flex-1 bg-black/40"
            onPress={() => setOpen(false)}
          >
            <View className="mt-auto bg-white rounded-t-3xl p-4">
              <View className="items-center">
                <View className="w-12 h-1.5 bg-background-300 rounded-full mb-3" />
              </View>
              <DateTimePicker
                value={temp}
                // iOS picker displayed in modal; 'datetime' visually handled via confirmation
                mode={(mode === "datetime" ? "date" : mode) as any}
                display={(display ?? "spinner") as any}
                onChange={(_, d) => d && setTemp(d)}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                themeVariant="light"
              />
              <View className="flex-row justify-end gap-4 mt-3">
                <Pressable onPress={() => setOpen(false)}>
                  <ThemedText className="text-typography-700">
                    Cancel
                  </ThemedText>
                </Pressable>
                <Pressable onPress={confirm}>
                  <ThemedText className="text-primary-600 font-bold">
                    Confirm
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </ThemedView>
  );
};

export default DateField;
