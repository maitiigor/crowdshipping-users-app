import { COUNTRIES } from "@/constants/countries";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Use the actual type from COUNTRIES array
export type Country = (typeof COUNTRIES)[number];

export interface CountryState {
  selectedCountry: Country | null;
}

// Default to Nigeria or first country
const defaultCountry =
  COUNTRIES.find((c) => c.alpha2Code === "NG") || COUNTRIES[0];

const initialState: CountryState = {
  selectedCountry: defaultCountry,
};

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setSelectedCountry(state, action: PayloadAction<Country>) {
      state.selectedCountry = action.payload;
    },
    setSelectedCountryByCode(state, action: PayloadAction<string>) {
      const country = COUNTRIES.find(
        (c) =>
          c.alpha2Code === action.payload || c.alpha3Code === action.payload
      );
      if (country) {
        state.selectedCountry = country;
      }
    },
    resetCountry(state) {
      state.selectedCountry = defaultCountry;
    },
  },
});

export const { setSelectedCountry, setSelectedCountryByCode, resetCountry } =
  countrySlice.actions;
export default countrySlice.reducer;
