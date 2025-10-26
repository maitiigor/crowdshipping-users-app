import { useAppDispatch, useAppSelector } from "@/store";
import {
  Country,
  resetCountry,
  setSelectedCountry,
  setSelectedCountryByCode,
} from "@/store/slices/countrySlice";

/**
 * Custom hook for easy access to country selection functionality
 *
 * @example
 * ```tsx
 * const { country, selectCountry, selectByCode, reset } = useCountry();
 *
 * // Access country data
 * console.log(country?.name);
 * console.log(country?.flags.png);
 *
 * // Change country
 * selectByCode('US');
 * ```
 */
export const useCountry = () => {
  const dispatch = useAppDispatch();
  const selectedCountry = useAppSelector(
    (state) => state.country.selectedCountry
  );

  const selectCountry = (country: Country) => {
    dispatch(setSelectedCountry(country));
  };

  const selectByCode = (code: string) => {
    dispatch(setSelectedCountryByCode(code));
  };

  const reset = () => {
    dispatch(resetCountry());
  };

  return {
    country: selectedCountry,
    selectCountry,
    selectByCode,
    reset,
    // Convenience properties
    countryCode: selectedCountry?.alpha2Code,
    countryName: selectedCountry?.name,
    countryFlag: selectedCountry?.flags.png,
    callingCode: selectedCountry?.callingCodes?.[0],
    currency: selectedCountry?.currencies?.[0],
    language: selectedCountry?.languages?.[0],
  };
};
