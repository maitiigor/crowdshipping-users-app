import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function CallDriver() {
  const { t } = useTranslation("tripDetails");
  return (
    <View>
      <Text>{t("driver_details.call_driver")}</Text>
    </View>
  );
}
