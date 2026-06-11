import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const OrderStatusQuerySchema = z.object({
  transaction_id: z.string().min(1).max(100),
});

export const Route = createFileRoute("/api/order-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const parsed = OrderStatusQuerySchema.safeParse({
          transaction_id: url.searchParams.get("transaction_id"),
        });

        if (!parsed.success) {
          return Response.json({ ok: false, error: "Pedido inválido." }, { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: order, error } = await supabaseAdmin
          .from("orders")
          .select(
            "transaction_id, status, amount, customer_name, pix_qrcode, pix_qrcode_image, pix_copy_paste, expires_at, paid_at",
          )
          .eq("transaction_id", parsed.data.transaction_id)
          .maybeSingle();

        if (error || !order) {
          return Response.json({ ok: false, error: "Pedido não encontrado." }, { status: 404 });
        }

        return Response.json(
          { ok: true, order },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});