/**
 * Example: How to use the Country Selector globally with Redux
 *
 * The CountrySelector component has been set up in the app with Redux for global state management.
 * Here's how you can access and use the selected country anywhere in your app:
 */

import { CountrySelector } from "@/components/Custom/CountrySelector";
import { COUNTRIES } from "@/constants/countries";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setSelectedCountry,
  setSelectedCountryByCode,
} from "@/store/slices/countrySlice";
import React from "react";
import { Image, Text, View } from "react-native";

export const CountryUsageExample = () => {
  const dispatch = useAppDispatch();

  // Get the selected country from Redux
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );

  // Example 1: Access country properties
  const countryName = selectedCountry?.name;
  const countryCode = selectedCountry?.alpha2Code;
  const countryFlag = selectedCountry?.flags.png;
  const callingCode = selectedCountry?.callingCodes[0];
  const currency = selectedCountry?.currencies?.[0];
  const languages = selectedCountry?.languages;

  // Example 2: Programmatically change country by code
  const changeToUSA = () => {
    dispatch(setSelectedCountryByCode("US"));
  };

  // Example 3: Programmatically change country by object
  const changeToNigeria = () => {
    const nigeria = COUNTRIES.find((c) => c.alpha2Code === "NG");
    if (nigeria) {
      dispatch(setSelectedCountry(nigeria));
    }
  };

  // Suppress unused variable warnings for example code
  void changeToUSA;
  void changeToNigeria;

  return (
    <View>
      {/* Use the CountrySelector component anywhere */}
      <CountrySelector
        showCountryName={true}
        flagSize={40}
        textSize="h4_header"
      />

      {/* Access country data */}
      <Text>Selected Country: {countryName}</Text>
      <Text>Country Code: {countryCode}</Text>
      <Text>Calling Code: +{callingCode}</Text>
      <Text>
        Currency: {currency?.name} ({currency?.symbol})
      </Text>
      <Text>Primary Language: {languages?.[0]?.name}</Text>

      {/* Display flag */}
      {countryFlag && (
        <Image
          source={{ uri: countryFlag }}
          style={{ width: 100, height: 75 }}
        />
      )}
    </View>
  );
};

/**
 * Available Country Object Properties:
 *
 * - name: string (e.g., "Nigeria")
 * - alpha2Code: string (e.g., "NG")
 * - alpha3Code: string (e.g., "NGA")
 * - callingCodes: string[] (e.g., ["234"])
 * - capital: string (e.g., "Abuja")
 * - region: string (e.g., "Africa")
 * - subregion: string (e.g., "Western Africa")
 * - population: number
 * - latlng: number[] (e.g., [10, 8])
 * - demonym: string (e.g., "Nigerian")
 * - area: number
 * - timezones: string[] (e.g., ["UTC+01:00"])
 * - borders: string[] (e.g., ["BEN", "CMR", "TCD", "NER"])
 * - nativeName: string
 * - numericCode: string
 * - flags: { svg: string, png: string }
 * - currencies: Array<{ code?: string, name: string, symbol?: string }>
 * - languages: Array<{ iso639_1: string, iso639_2: string, name: string, nativeName: string }>
 * - topLevelDomain: string[] (e.g., [".ng"])
 * - altSpellings: string[]
 * - gini?: number
 * - cioc?: string
 */

/**
 * Redux Actions Available:
 *
 * 1. setSelectedCountry(country: Country)
 *    - Set country using full country object
 *
 * 2. setSelectedCountryByCode(code: string)
 *    - Set country using alpha2Code or alpha3Code
 *
 * 3. resetCountry()
 *    - Reset to default country (Nigeria or first in list)
 */
