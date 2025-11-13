import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import { COUNTRIES } from "@/constants/countries";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppDispatch, useAppSelector } from "@/store";
import { Country, setSelectedCountry } from "@/store/slices/countrySlice";
import { Search, X } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "../ui/modal";

interface CountrySelectorProps {
  showCountryName?: boolean;
  flagSize?: number;
  textSize?: "default" | "s1_subtitle" | "h4_header";
  flagClassName?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  showCountryName = false,
  flagSize = 32,
  textSize = "s1_subtitle",
  flagClassName,
}) => {
  const dispatch = useAppDispatch();
  const backroundTopNav = useThemeColor({}, "background");
  const colorText = useThemeColor({}, "text");
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCountrySelect = (country: Country) => {
    dispatch(setSelectedCountry(country));
    setModalVisible(false);
    setSearchQuery("");
  };

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.alpha2Code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      onPress={() => handleCountrySelect(item)}
      className="flex-row items-center p-4 border-b gap-3 border-gray-200"
    >
      <Image
        source={{ uri: item.flags.png }}
        alt={item.name}
        style={{ width: 30, height: 20, marginRight: 12 }}
        resizeMode="contain"
      />
      <View className="flex-1">
        <ThemedText type="default">{item.name}</ThemedText>
        <ThemedText type="c2_caption" className="text-typography-500">
          {item.alpha2Code} • +{item.callingCodes[0]}
        </ThemedText>
      </View>
      {selectedCountry?.alpha2Code === item.alpha2Code && (
        <Icon as={Search} size="sm" className="text-primary-500" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center"
        style={{ paddingHorizontal: 0 }}
      >
        {selectedCountry && (
          <>
            <ThemedView
              className={flagClassName}
              style={{ width: flagSize, height: flagSize * 0.75 }}
            >
              <Image
                source={{ uri: selectedCountry.flags.png }}
                alt={selectedCountry.name}
                resizeMode="contain"
              />
            </ThemedView>
            {showCountryName && (
              <ThemedText className="ml-2" type={textSize}>
                {selectedCountry.alpha2Code}
              </ThemedText>
            )}
            {/* {!showCountryName && (
              <ThemedText className="text-center" type={textSize}>
                {selectedCountry.alpha2Code}
              </ThemedText>
            )} */}
          </>
        )}
      </TouchableOpacity>

      <Modal
        isOpen={modalVisible}
        size={"lg"}
        className="flex-1 pt-36"
        onClose={() => {
          setModalVisible(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent
          style={{ backgroundColor: backroundTopNav }}
          className="rounded-2xl items-center w-full"
        >
          <ModalHeader>
            {/* Header */}
            <ThemedView className="flex-row w-full items-center justify-between p-4 border-b border-gray-200">
              <ThemedText type="h5_header">Select Country</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon
                  as={X}
                  size="xl"
                  style={{
                    color: colorText,
                  }}
                  className="text-typography-900"
                />
              </TouchableOpacity>
            </ThemedView>
          </ModalHeader>
          <ModalBody className=" my-4 w-full">
            <ThemedView className="flex-1">
              {/* Search Bar */}
              <View className="p-4">
                <Input variant="outline" size="xl" className="mb-2">
                  <InputField
                    placeholder="Search country..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </Input>
              </View>

              {/* Country List */}
              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.alpha2Code}
                scrollEnabled={false}
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
                renderItem={renderCountryItem}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={10}
              />
            </ThemedView>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
