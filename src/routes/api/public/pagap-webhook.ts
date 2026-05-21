import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

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
        return new Response("ok", { status: 200 });
      },
    },
  },
});
