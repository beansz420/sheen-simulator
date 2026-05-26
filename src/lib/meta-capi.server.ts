import { createHash } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PIXEL_ID = "3903982886564566";
const API_VERSION = "v19.0";

function sha256(v: string | null | undefined) {
  if (!v) return undefined;
  return createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
}

export type CapiEventName = "Purchase" | "InitiateCheckout";

export async function sendMetaCapiEvent(opts: {
  event_name: CapiEventName;
  event_id: string;
  transaction_id: string;
  event_source_url?: string;
  user_agent?: string;
}) {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!token) {
    console.error("[meta-capi] missing META_CAPI_ACCESS_TOKEN");
    return { ok: false as const, error: "CAPI token missing" };
  }

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select(
      "amount, customer_email, customer_phone, customer_name, customer_document, address_city, address_state, address_cep",
    )
    .eq("transaction_id", opts.transaction_id)
    .maybeSingle();

  if (!order) {
    console.error("[meta-capi] order not found:", opts.transaction_id);
    return { ok: false as const, error: "Order not found" };
  }

  const [firstName, ...rest] = (order.customer_name || "").split(" ");
  const lastName = rest.join(" ");
  const phone = (order.customer_phone || "").replace(/\D/g, "");

  const userData: Record<string, string | undefined> = {
    em: sha256(order.customer_email),
    ph: sha256(phone),
    fn: sha256(firstName),
    ln: sha256(lastName),
    ct: sha256(order.address_city),
    st: sha256(order.address_state),
    zp: sha256((order.address_cep || "").replace(/\D/g, "")),
    country: sha256("br"),
    external_id: sha256(order.customer_document?.replace(/\D/g, "")),
  };

  const payload = {
    data: [
      {
        event_name: opts.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: opts.event_id,
        action_source: "website",
        event_source_url: opts.event_source_url,
        user_data: {
          ...userData,
          client_user_agent: opts.user_agent,
        },
        custom_data: {
          currency: "BRL",
          value: Number(order.amount),
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const body = (await res.json().catch(() => ({}))) as {
      error?: { message?: string };
      events_received?: number;
      fbtrace_id?: string;
    };
    if (!res.ok) {
      console.error("[meta-capi] error:", res.status, body);
      return { ok: false as const, error: body.error?.message || "CAPI error" };
    }
    console.log(
      `[meta-capi] ${opts.event_name} sent tx=${opts.transaction_id} event_id=${opts.event_id} received=${body.events_received} trace=${body.fbtrace_id}`,
    );
    return { ok: true as const };
  } catch (err) {
    console.error("[meta-capi] fetch error:", err);
    return { ok: false as const, error: "Network error" };
  }
}

export function purchaseEventId(transactionId: string) {
  return `purchase_${transactionId}`;
}
