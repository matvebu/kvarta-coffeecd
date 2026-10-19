const BELARUS_NATIONAL_PREFIXES = new Set([
  "15",
  "16",
  "17",
  "21",
  "22",
  "23",
  "25",
  "29",
  "33",
  "44",
]);

export function normalizeBelarusPhone(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > 40) return null;
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return null;

  const digits = trimmed.replace(/\D/g, "");
  let national: string | null = null;

  if (/^375\d{9}$/.test(digits)) {
    national = digits.slice(3);
  } else if (/^80\d{9}$/.test(digits)) {
    national = digits.slice(2);
  } else if (/^\d{9}$/.test(digits)) {
    national = digits;
  }

  if (!national || !BELARUS_NATIONAL_PREFIXES.has(national.slice(0, 2))) {
    return null;
  }

  return `+375${national}`;
}
