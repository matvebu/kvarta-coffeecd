export const attributionLimits = {
  utm: 200,
  yclid: 200,
  referrer: 500,
  landingPath: 500,
  landingPage: 1000,
} as const;

export const ATTRIBUTION_STORAGE_KEY = "kvarta-first-touch";

const SENSITIVE_QUERY_KEYS = new Set([
  "name",
  "phone",
  "tel",
  "email",
  "comment",
  "company",
  "message",
]);

export type Attribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  yclid: string;
  referrer: string;
  landingPage: string;
  landingPath: string;
};

type AttributionStorage = Pick<Storage, "getItem" | "setItem">;

const attributionKeys = [
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm",
  "yclid",
  "referrer",
  "landingPage",
  "landingPath",
] as const;

function clip(value: string, max: number) {
  return value.trim().slice(0, max);
}

export function stripSensitiveQuery(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const hasOrigin = /^https?:\/\//i.test(trimmed);
  let url: URL;
  try {
    url = new URL(trimmed, "https://attribution.invalid");
  } catch {
    return "";
  }

  if (hasOrigin) {
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
  } else if (!trimmed.startsWith("/")) {
    return "";
  }

  for (const key of [...url.searchParams.keys()]) {
    if (SENSITIVE_QUERY_KEYS.has(key.toLowerCase())) {
      url.searchParams.delete(key);
    }
  }

  url.hash = "";

  if (hasOrigin) return url.href;
  return `${url.pathname}${url.search}`;
}

export function captureAttribution(href: string, referrer: string): Attribution {
  let url: URL | null = null;
  try {
    url = new URL(href);
  } catch {
    url = null;
  }

  const landingPage = url
    ? clip(stripSensitiveQuery(url.href), attributionLimits.landingPage)
    : "";
  const landingPath = landingPage
    ? clip(stripSensitiveQuery(pathOf(landingPage)), attributionLimits.landingPath)
    : "";

  const pick = (key: string, max: number) =>
    url ? clip(url.searchParams.get(key) ?? "", max) : "";

  return {
    utmSource: pick("utm_source", attributionLimits.utm),
    utmMedium: pick("utm_medium", attributionLimits.utm),
    utmCampaign: pick("utm_campaign", attributionLimits.utm),
    utmContent: pick("utm_content", attributionLimits.utm),
    utmTerm: pick("utm_term", attributionLimits.utm),
    yclid: pick("yclid", attributionLimits.yclid),
    referrer: clip(stripSensitiveQuery(referrer), attributionLimits.referrer),
    landingPage,
    landingPath,
  };
}

function pathOf(href: string) {
  try {
    const url = new URL(href);
    return `${url.pathname}${url.search}`;
  } catch {
    return "";
  }
}

function parseStored(raw: string): Attribution | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const record = value as Record<string, unknown>;
    const attribution = {} as Attribution;
    for (const key of attributionKeys) {
      const item = record[key];
      if (typeof item !== "string") return null;
      attribution[key] = item;
    }
    return attribution;
  } catch {
    return null;
  }
}

export function readFirstTouch(
  storage: AttributionStorage,
  current: { href: string; referrer: string },
): Attribution {
  const existing = storage.getItem(ATTRIBUTION_STORAGE_KEY);
  if (existing) {
    const stored = parseStored(existing);
    if (stored) return stored;
  }

  const fresh = captureAttribution(current.href, current.referrer);
  try {
    storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // Storage can be unavailable. The current visit is still returned.
  }
  return fresh;
}
