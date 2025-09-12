import { Bell } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "../ui/icon";

interface IProps {}
export default function NotificationIcon({}: IProps) {
  return (
    <TouchableOpacity onPress={() => {}} style={{ paddingHorizontal: 0 }}>
      <Icon as={Bell} size="2xl" className="text-typography-900" />
    </TouchableOpacity>
  );
}
