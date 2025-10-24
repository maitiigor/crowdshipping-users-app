import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
export const userTimezone = dayjs.tz.guess();
export const newUserTimeZoneFormatDate = (
  isoString: string | Date,
  format: string
) => {
  return dayjs(isoString).tz(userTimezone).format(format);
};
/**
 * Formats a number as a currency string using Intl.NumberFormat.
 * @param amount - The numeric amount to format.
 * @param currency - The currency code (e.g., 'USD', 'EUR'). Defaults to 'USD'.
 * @param locale - The locale for formatting (e.g., 'en-US', 'de-DE'). Defaults to 'en-US'.
 * @returns The formatted currency string, or 'N/A' if amount is invalid.
 */
export function formatCurrency(
  amount: number | string | undefined | null,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  // Handle invalid inputs
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "N/A";
  }

  const numericAmount = Number(amount);

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    // Fallback for unsupported currency/locale combinations
    console.warn(
      `Currency formatting failed for ${currency} in ${locale}:`,
      error
    );
    return `${currency.toUpperCase()} ${numericAmount.toFixed(2)}`;
  }
}

export const paramToString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;
