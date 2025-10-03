import { COUNTRIES } from "@/constants/countries";
import React, { useEffect, useMemo, useState } from "react";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { ChevronDownIcon } from "../ui/icon";
import { Input, InputField } from "../ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectFlatList,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "../ui/select";
import InputLabelText from "./InputLabelText";

interface IProps {
  values: { country: string };
  errors: { country?: string };
  touched: { country?: boolean };
  handleChange: (value: string) => void;
}
export interface ICountryResponse {
  alpha2Code: string;
  name: string;
}

export default function CountryDropdown({
  values,
  errors,
  touched,
  handleChange,
}: IProps) {
  const [countries, setCountries] = useState<ICountryResponse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();
    const url = "https://www.apicountries.com/countries";

    const normalize = (raw: any): ICountryResponse[] => {
      if (!Array.isArray(raw)) return [];
      const arr: ICountryResponse[] = [];
      for (const r of raw) {
        if (typeof r === "string") {
          const name = r;
          const code = name.slice(0, 2).toUpperCase();
          arr.push({ alpha2Code: code, name });
        } else if (r && typeof r === "object") {
          const name =
            (r as any).name ||
            (r as any).commonName ||
            (r as any).country ||
            (r as any).label ||
            null;
          const code =
            (r as any).alpha2Code ||
            (r as any).code ||
            (r as any).alpha2 ||
            (r as any).iso2 ||
            (r as any).iso_2 ||
            (r as any).country_code ||
            (r as any).abbreviation ||
            null;
          if (name) {
            arr.push({
              name: String(name),
              alpha2Code: String(
                code || String(name).slice(0, 2)
              ).toUpperCase(),
            });
          }
        }
      }
      return arr;
    };

    async function load() {
      setLoading(true);
      setApiError(null);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (aborted) return;
        const list = normalize(data);
        if (list.length > 0) {
          setCountries(list);
        } else {
          // Fallback to local minimal list
          const mapped = COUNTRIES.map((c) => ({
            alpha2Code: c.alpha2Code,
            name: c.name,
          }));
          setCountries(mapped);
        }
      } catch (e: any) {
        if (aborted) return;
        setApiError(e?.message || "Failed to load countries");
        const mapped = COUNTRIES.map((c) => ({
          alpha2Code: c.alpha2Code,
          name: c.name,
        }));
        setCountries(mapped);
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    load();
    return () => {
      aborted = true;
      controller.abort();
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, search]);
  return (
    <ThemedView>
      <InputLabelText className="mt-2">Country</InputLabelText>
      <Select selectedValue={values.country} onValueChange={handleChange}>
        <SelectTrigger
          size="xl"
          className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
        >
          <SelectInput
            placeholder={loading ? "Loading countries..." : "Select country"}
            className="flex-1"
          />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {/* Search box inside the dropdown */}
            <ThemedView className="w-full px-3 pb-2">
              <Input size="lg" className="rounded-md bg-primary-inputShade">
                <InputField
                  placeholder="Search country..."
                  value={search}
                  onChangeText={setSearch}
                  autoFocus={false}
                />
              </Input>
            </ThemedView>
            {/* Scrollable list */}
            {filtered.length > 0 ? (
              <SelectFlatList
                className="max-h-80"
                data={filtered as unknown as any[]}
                keyExtractor={(item: any, index: number) =>
                  (item?.alpha2Code as string) ?? String(index)
                }
                renderItem={({ item }: any) => (
                  <SelectItem label={item.name} value={item.name} />
                )}
              />
            ) : (
              <ThemedText className="px-4 py-2 text-typography-500">
                {loading
                  ? "Loading..."
                  : apiError
                  ? "Failed to load. Showing local list."
                  : "No results found"}
              </ThemedText>
            )}
          </SelectContent>
        </SelectPortal>
      </Select>
      {errors.country && touched.country && (
        <ThemedText type="b4_body" className="text-error-500 mb-4">
          {errors.country}
        </ThemedText>
      )}
    </ThemedView>
  );
}
