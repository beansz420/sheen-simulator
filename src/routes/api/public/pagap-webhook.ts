import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/api/public/pagap-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: WebhookPayload;
        try {
          payload = (await request.json()) as WebhookPayload;
        } catch {
          return new Response("invalid json", { status: 400 });
        }

        const txId = payload?.data?.transaction_id;
        const status = payload?.data?.status || payload?.event;
        if (!txId || !status || !ALLOWED.has(status)) {
          return new Response("ignored", { status: 200 });
        }

        // Read current status to fire Meta Purchase only on the paid transition
        const { data: current } = await supabaseAdmin
          .from("orders")
          .select("status")
          .eq("transaction_id", txId)
          .maybeSingle();

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

        // Fire Meta Purchase via CAPI server-side. Deterministic event_id
        // (purchase_<txId>) deduplicates with the browser Pixel event.
        if (status === "paid" && current?.status !== "paid") {
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
