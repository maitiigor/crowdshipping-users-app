import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Normalize a phone number into the API-required format: (+<country_code>)<nationalNumber>
 * Example: "+234 802 290 8484" -> "(+234)8022908484"
 */
export function formatPhoneForApi(
  raw: string,
  preferCallingCode?: string
): string {
  try {
    const parsed = parsePhoneNumberFromString(raw);
    if (parsed && parsed.isValid()) {
      return `(+${parsed.countryCallingCode})${parsed.nationalNumber}`;
    }
  } catch {
    // ignore parse errors and fallback below
  }
  const cleaned = (raw || "").replace(/[^\d+]/g, "");
  const m = cleaned.match(/^\+(\d{1,3})(\d{4,})$/);
  if (m) {
    // If the national number starts with a trunk prefix '0', drop a single leading zero
    const national = m[2].replace(/^0(\d)/, "$1");
    return `(+${m[1]})${national}`;
  }
  if (preferCallingCode) {
    const digits = cleaned.replace(/\+/g, "");
    // If digits already start with preferCallingCode, split it out; otherwise, just prefix
    if (digits.startsWith(preferCallingCode)) {
      const national = digits
        .slice(preferCallingCode.length)
        .replace(/^0(\d)/, "$1");
      return `(+${preferCallingCode})${national}`;
    }
    const national = digits.replace(/^0(\d)/, "$1");
    return `(+${preferCallingCode})${national}`;
  }
  const justDigits = cleaned.replace(/\+/g, "");
  if (justDigits.length >= 8) return justDigits;
  return cleaned;
}

/**
 * Basic validity check for a phone number. Uses libphonenumber-js when possible,
 * otherwise falls back to a minimal digit-length check (>= 8 digits).
 */
export function isValidPhone(raw: string): boolean {
  try {
    const parsed = parsePhoneNumberFromString(raw);
    if (parsed) return parsed.isValid();
  } catch {
    // fall through
  }
  return Boolean(raw && raw.replace(/[^\d+]/g, "").length >= 8);
}
