# Country Selector with Redux - Implementation Summary

## What Was Implemented

A global country selection system using Redux that allows you to:

1. Select a country from a searchable modal
2. Display the country's flag
3. Access the complete country object globally throughout your app

## Files Created/Modified

### 1. Redux Slice: `store/slices/countrySlice.ts`

- Created Redux slice for managing selected country state
- Default country: Nigeria (NG)
- Actions:
  - `setSelectedCountry(country)` - Set by full country object
  - `setSelectedCountryByCode(code)` - Set by alpha2Code or alpha3Code
  - `resetCountry()` - Reset to default

### 2. Store Configuration: `store/index.ts`

- Added `countryReducer` to the Redux store
- Country state is now available at `state.country.selectedCountry`

### 3. CountrySelector Component: `components/Custom/CountrySelector.tsx`

- Reusable component that displays the selected country flag
- Opens a searchable modal with all countries when clicked
- Props:
  - `showCountryName?: boolean` - Show country code next to flag
  - `flagSize?: number` - Size of flag image (default: 32)
  - `textSize?: "default" | "s1_subtitle" | "h4_header"` - Text size

### 4. Updated Home Screen: `app/(tabs)/index.tsx`

- Replaced hardcoded "NG" text with `<CountrySelector />` component
- Now displays the selected country's flag in the header

### 5. Usage Example: `examples/countryUsageExample.tsx`

- Complete documentation and examples of how to use the country selector

### 6. Custom Hook: `hooks/useCountry.ts`

- Convenient hook that wraps Redux operations
- Provides easy access to country data and actions

## How to Use

### Method 1: Using the Custom Hook (Recommended)

```tsx
import { useCountry } from "@/hooks/useCountry";

const MyComponent = () => {
  const {
    country, // Full country object
    countryCode, // e.g., "NG"
    countryName, // e.g., "Nigeria"
    countryFlag, // Flag PNG URL
    callingCode, // e.g., "234"
    currency, // Currency object
    selectCountry, // Function to select country
    selectByCode, // Function to select by code
    reset, // Function to reset to default
  } = useCountry();

  return (
    <View>
      <Text>{countryName}</Text>
      <Image source={{ uri: countryFlag }} />
      <Button onPress={() => selectByCode("US")} title="Select USA" />
    </View>
  );
};
```

### Method 2: Using Redux Directly

### Display the Country Selector

```tsx
import { CountrySelector } from "@/components/Custom/CountrySelector";

<CountrySelector showCountryName={true} flagSize={40} textSize="h4_header" />;
```

### Access Selected Country Anywhere

```tsx
import { useAppSelector } from "@/store";

const MyComponent = () => {
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );

  // Access any property
  const name = selectedCountry?.name;
  const code = selectedCountry?.alpha2Code;
  const flag = selectedCountry?.flags.png;
  const callingCode = selectedCountry?.callingCodes[0];
  const currency = selectedCountry?.currencies?.[0];

  return <Text>{name}</Text>;
};
```

### Change Country Programmatically

```tsx
import { useAppDispatch } from "@/store";
import {
  setSelectedCountryByCode,
  setSelectedCountry,
} from "@/store/slices/countrySlice";
import { COUNTRIES } from "@/constants/countries";

const MyComponent = () => {
  const dispatch = useAppDispatch();

  // Method 1: By country code
  const selectUSA = () => {
    dispatch(setSelectedCountryByCode("US"));
  };

  // Method 2: By country object
  const selectNigeria = () => {
    const nigeria = COUNTRIES.find((c) => c.alpha2Code === "NG");
    if (nigeria) {
      dispatch(setSelectedCountry(nigeria));
    }
  };
};
```

## Available Country Properties

The full country object contains:

- `name` - Full country name
- `alpha2Code` - 2-letter code (e.g., "NG")
- `alpha3Code` - 3-letter code (e.g., "NGA")
- `callingCodes` - Phone calling codes
- `capital` - Capital city
- `region` - Continental region
- `subregion` - Sub-region
- `population` - Population count
- `flags.png` - Flag image URL (PNG)
- `flags.svg` - Flag image URL (SVG)
- `currencies` - Array of currency objects
- `languages` - Array of language objects
- `timezones` - Array of timezones
- `borders` - Array of bordering country codes
- And more...

## Testing

To test the implementation:

1. Open the app and navigate to the home screen
2. Click on the country flag/code in the top-right header
3. Search for and select a different country
4. The flag should update globally
5. Access the country data in any component using Redux

## Next Steps

You can now:

- Use the selected country to filter API calls
- Display country-specific content
- Use calling codes for phone number inputs
- Show currency based on selected country
- Localize content based on country selection
