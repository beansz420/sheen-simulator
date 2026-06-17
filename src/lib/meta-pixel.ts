// Meta Pixel helper (client-side)
export const META_PIXEL_ID = "3903982886564566";
const PURCHASE_STORAGE_PREFIX = "meta_purchase_fired_";
const ADVANCED_MATCHING_STORAGE_KEY = "meta_advanced_matching_v1";

type FbqFn = ((...args: unknown[]) => void) & { queue?: unknown[] };

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

export function generateEventId(): string {
  // RFC4122-ish random id; reused as eventID for browser + CAPI dedupe
  return "evt_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function purchaseEventId(transactionId: string) {
  return `purchase_${transactionId}`;
}

export function hasTrackedPurchase(transactionId: string) {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(`${PURCHASE_STORAGE_PREFIX}${transactionId}`) === "1";
  } catch {
    return false;
  }
}

export function markTrackedPurchase(transactionId: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${PURCHASE_STORAGE_PREFIX}${transactionId}`, "1");
  } catch {
    // ignore storage errors
  }
}

function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export function getMetaBrowserIds() {
  return {
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
  };
}

type MetaAdvancedMatchingInput = {
  customer_email?: string;
  customer_phone?: string;
  customer_name?: string;
  customer_document?: string;
  address_city?: string;
  address_state?: string;
  address_cep?: string;
};

type MetaAdvancedMatchingData = Record<string, string>;

function cleanDigits(value: string | undefined) {
  return (value || "").replace(/\D/g, "");
}

function normalizeName(value: string | undefined) {
  return (value || "").trim().toLowerCase();
}

async function sha256(value: string | undefined) {
  const normalized = (value || "").trim().toLowerCase();
  if (!normalized || typeof crypto === "undefined" || !crypto.subtle) return undefined;
  const data = new TextEncoder().encode(normalized);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function applyMetaAdvancedMatching(data: MetaAdvancedMatchingData) {
  if (typeof window === "undefined" || !window.fbq || Object.keys(data).length === 0) return false;
  window.fbq("init", META_PIXEL_ID, data);
  return true;
}

export function applyStoredMetaAdvancedMatching() {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(ADVANCED_MATCHING_STORAGE_KEY);
    if (!raw) return false;
    return applyMetaAdvancedMatching(JSON.parse(raw) as MetaAdvancedMatchingData);
  } catch {
    return false;
  }
}

export async function setMetaAdvancedMatching(input: MetaAdvancedMatchingInput) {
  const [firstName, ...lastNameParts] = normalizeName(input.customer_name).split(/\s+/).filter(Boolean);
  const phoneDigits = cleanDigits(input.customer_phone);
  const phone = phoneDigits.length === 10 || phoneDigits.length === 11 ? `55${phoneDigits}` : phoneDigits;
  const data: MetaAdvancedMatchingData = {};

  const entries: Array<[keyof MetaAdvancedMatchingData, Promise<string | undefined>]> = [
    ["em", sha256(input.customer_email)],
    ["ph", sha256(phone)],
    ["fn", sha256(firstName)],
    ["ln", sha256(lastNameParts.join(" "))],
    ["ct", sha256(input.address_city?.replace(/\s+/g, ""))],
    ["st", sha256(input.address_state)],
    ["zp", sha256(cleanDigits(input.address_cep))],
    ["country", sha256("br")],
    ["external_id", sha256(cleanDigits(input.customer_document))],
  ];

  for (const [key, promise] of entries) {
    const value = await promise;
    if (value) data[key] = value;
  }

  try {
    localStorage.setItem(ADVANCED_MATCHING_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
  return applyMetaAdvancedMatching(data);
}

export function fbqTrack(
  event: string,
  params?: Record<string, unknown>,
  eventID?: string,
) {
  if (typeof window === "undefined" || !window.fbq) return false;
  if (eventID) {
    window.fbq("track", event, params ?? {}, { eventID });
  } else {
    window.fbq("track", event, params ?? {});
  }
  return true;
}
