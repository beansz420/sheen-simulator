// Meta Pixel helper (client-side)
export const META_PIXEL_ID = "3903982886564566";
const PURCHASE_STORAGE_PREFIX = "meta_purchase_fired_";

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
