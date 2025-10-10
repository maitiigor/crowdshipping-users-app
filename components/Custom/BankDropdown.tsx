import { useAuthenticatedQuery } from "@/lib/api";
import { IWithdrawalRequestResponse } from "@/types/IWithdrawalRequest";
import React, { useMemo, useState } from "react";
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
  values: { bankCode: string; bankName: string };
  errors: { bankCode?: string; bankName?: string };
  touched: { bankCode?: boolean; bankName?: boolean };
  handleChange: (code: string, name: string) => void;
}

export interface IBank {
  code: string;
  name: string;
}

export default function BankDropdown({
  values,
  errors,
  touched,
  handleChange,
}: IProps) {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAuthenticatedQuery<
    IWithdrawalRequestResponse | undefined
  >(["wallet-request"], "/wallet/fetch-banks");

  const banks: IBank[] = useMemo(() => {
    if (!data?.data) return [];
    // Adjust this based on your actual API response structure
    // Assuming data.data is an array of banks with 'code' and 'name' properties
    return Array.isArray(data.data) ? data.data : [];
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return banks;
    return banks.filter(
      (bank) =>
        bank.name.toLowerCase().includes(q) ||
        bank.code.toLowerCase().includes(q)
    );
  }, [banks, search]);

  const handleValueChange = (value: string) => {
    const selectedBank = banks.find((bank) => bank.code === value);
    if (selectedBank) {
      handleChange(selectedBank.code, selectedBank.name);
    }
  };

  return (
    <ThemedView>
      <InputLabelText className="mt-2">Bank</InputLabelText>
      <Select selectedValue={values.bankCode} onValueChange={handleValueChange}>
        <SelectTrigger
          size="xl"
          className="h-[55px] rounded-lg mb-2 border-primary-100 bg-primary-inputShade px-2"
        >
          <SelectInput
            placeholder={
              isLoading ? "Loading banks..." : values.bankName || "Select bank"
            }
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
              <Input size="2xl" className="rounded-md bg-primary-inputShade">
                <InputField
                  placeholder="Search bank..."
                  value={search}
                  onChangeText={setSearch}
                  autoFocus={false}
                />
              </Input>
            </ThemedView>
            {/* Scrollable list */}
            {filtered.length > 0 ? (
              <SelectFlatList
                className="max-h-[500px]"
                data={filtered as unknown as any[]}
                keyExtractor={(item: any, index: number) => String(index)}
                renderItem={({ item }: any) => (
                  <SelectItem label={item.name} value={item.code} />
                )}
              />
            ) : (
              <ThemedText className="px-4 py-2 text-typography-500">
                {isLoading ? "Loading..." : "No banks found"}
              </ThemedText>
            )}
          </SelectContent>
        </SelectPortal>
      </Select>
      {errors.bankCode && touched.bankCode && (
        <ThemedText type="b4_body" className="text-error-500 mb-4">
          {errors.bankCode}
        </ThemedText>
      )}
    </ThemedView>
  );
}
