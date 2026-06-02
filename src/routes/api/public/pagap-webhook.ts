import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendMetaCapiEvent, purchaseEventId } from "@/lib/meta-capi.server";

type WebhookPayload = {
  event: string;
  data?: {
    transaction_id?: string;
    status?: string;
    paid_at?: string;
  };
};

const ALLOWED = new Set(["pending", "paid", "expired", "refunded"]);
const MAX_AGE_SECONDS = 300; // 5 min, conforme recomendação Pagap

function verifySignature(rawBody: string, signature: string, timestamp: string, secret: string) {
  try {
    const expected =
      "sha256=" +
      createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/public/pagap-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const secret = process.env.PAGAP_SECRET_KEY;
        const signature = request.headers.get("x-pagap-signature");
        const timestamp = request.headers.get("x-pagap-timestamp");

        // Verifica HMAC se a Pagap enviou (ela envia em todos os webhooks).
        // Falta de header em produção = rejeita.
        if (secret) {
          if (!signature || !timestamp) {
            console.error("[pagap-webhook] missing signature/timestamp headers");
            return new Response("missing signature", { status: 401 });
          }
          if (!verifySignature(rawBody, signature, timestamp, secret)) {
            console.error("[pagap-webhook] invalid signature");
            return new Response("invalid signature", { status: 401 });
          }
          const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
          if (!Number.isFinite(age) || age > MAX_AGE_SECONDS) {
            console.error("[pagap-webhook] stale webhook age=", age);
            return new Response("stale webhook", { status: 401 });
          }
        }

        let payload: WebhookPayload;
        try {
          payload = JSON.parse(rawBody) as WebhookPayload;
        } catch {
          return new Response("invalid json", { status: 400 });
        }

        const txId = payload?.data?.transaction_id;
        const status = payload?.data?.status || payload?.event;
        if (!txId || !status || !ALLOWED.has(status)) {
          return new Response("ignored", { status: 200 });
        }

        const update: { status: string; paid_at?: string } = { status };
        if (status === "paid") update.paid_at = payload.data?.paid_at || new Date().toISOString();

        const { error } = await supabaseAdmin
          .from("orders")
          .update(update)
          .eq("transaction_id", txId);

        if (error) {
          console.error("webhook update error:", error);
          return new Response("db error", { status: 500 });
        }

        // Dispara Meta Purchase via CAPI. event_id determinístico
        // (purchase_<txId>) deduplica reenvios do webhook e o Pixel do browser.
        if (status === "paid") {
          await sendMetaCapiEvent({
            event_name: "Purchase",
            event_id: purchaseEventId(txId),
            transaction_id: txId,
          }).catch((e) => console.error("[meta-capi] webhook purchase failed", e));
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
