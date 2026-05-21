import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PIXEL_ID = "3903982886564566";
const API_VERSION = "v19.0";

function sha256(v: string | null | undefined) {
  if (!v) return undefined;
  return createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
}

const Schema = z.object({
  event_name: z.enum(["Purchase", "InitiateCheckout"]),
  event_id: z.string().min(1).max(100),
  transaction_id: z.string().min(1).max(100),
  event_source_url: z.string().url().max(500).optional(),
  user_agent: z.string().max(500).optional(),
});

export const sendMetaEvent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Schema.parse(input))
  .handler(async ({ data }) => {
    const token = process.env.META_CAPI_ACCESS_TOKEN;
    if (!token) return { ok: false as const, error: "CAPI token missing" };

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "amount, customer_email, customer_phone, customer_name, customer_document, address_city, address_state, address_cep",
      )
      .eq("transaction_id", data.transaction_id)
      .maybeSingle();

    if (!order) return { ok: false as const, error: "Order not found" };

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
          event_name: data.event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.event_id,
          action_source: "website",
          event_source_url: data.event_source_url,
          user_data: {
            ...userData,
            client_user_agent: data.user_agent,
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
      };
      if (!res.ok) {
        console.error("Meta CAPI error:", res.status, body);
        return { ok: false as const, error: body.error?.message || "CAPI error" };
      }
      return { ok: true as const };
    } catch (err) {
      console.error("Meta CAPI fetch error:", err);
      return { ok: false as const, error: "Network error" };
    }
  });
