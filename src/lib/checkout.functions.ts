import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { KITS, type KitId } from "./kits";

const CheckoutSchema = z.object({
  kitId: z.enum(["1", "2", "3"]),
  customer_name: z.string().trim().min(2).max(120),
  customer_email: z.string().trim().email().max(255),
  customer_phone: z.string().trim().min(10).max(20),
  customer_document: z.string().trim().min(11).max(20),
  address_cep: z.string().trim().min(8).max(10),
  address_street: z.string().trim().min(2).max(200),
  address_number: z.string().trim().min(1).max(20),
  address_complement: z.string().trim().max(100).optional().or(z.literal("")),
  address_neighborhood: z.string().trim().min(2).max(120),
  address_city: z.string().trim().min(2).max(120),
  address_state: z.string().trim().length(2),
});

type PagapResponse = {
  success: boolean;
  transaction_id: string;
  pix_qrcode: string;
  pix_qrcode_image: string;
  pix_copy_paste: string;
  expires_at: string;
  amount: number;
  message?: string;
};

export const createPixOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CheckoutSchema.parse(input))
  .handler(async ({ data }) => {
    const kit = KITS[data.kitId as KitId];
    const amount = kit.price;

    const apiKey = process.env.PAGAP_SECRET_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Pagamento indisponível no momento." };
    }

    // 1. Cria registro pendente
    const { data: order, error: insertErr } = await supabaseAdmin
      .from("orders")
      .insert({
        status: "pending",
        amount,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        customer_document: data.customer_document,
        address_cep: data.address_cep,
        address_street: data.address_street,
        address_number: data.address_number,
        address_complement: data.address_complement || null,
        address_neighborhood: data.address_neighborhood,
        address_city: data.address_city,
        address_state: data.address_state.toUpperCase(),
        items: [{ id: kit.id, name: kit.name, quantity: kit.quantity, price: kit.price }],
      })
      .select()
      .single();

    if (insertErr || !order) {
      console.error("orders insert error:", insertErr);
      return { ok: false as const, error: "Erro ao registrar pedido." };
    }

    // 2. Cria Pix na Pagap
    try {
      const res = await fetch("https://api.pagap.com.br/functions/v1/create-pix-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          amount,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_document: data.customer_document,
          customer_phone: data.customer_phone,
          items: [{ name: kit.name, quantity: kit.quantity, price: kit.price }],
        }),
      });

      const body = (await res.json()) as PagapResponse;
      if (!res.ok || !body.success || !body.transaction_id) {
        console.error("Pagap error:", res.status, body);
        await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", order.id);
        return { ok: false as const, error: body.message || "Falha ao gerar Pix." };
      }

      await supabaseAdmin
        .from("orders")
        .update({
          transaction_id: body.transaction_id,
          pix_qrcode: body.pix_qrcode,
          pix_qrcode_image: body.pix_qrcode_image,
          pix_copy_paste: body.pix_copy_paste,
          expires_at: body.expires_at,
        })
        .eq("id", order.id);

      return { ok: true as const, transaction_id: body.transaction_id };
    } catch (err) {
      console.error("Pagap fetch error:", err);
      await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", order.id);
      return { ok: false as const, error: "Erro de conexão com o pagamento." };
    }
  });

export const getOrderStatus = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ transaction_id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "transaction_id, status, amount, customer_name, pix_qrcode, pix_qrcode_image, pix_copy_paste, expires_at, paid_at",
      )
      .eq("transaction_id", data.transaction_id)
      .maybeSingle();

    if (error || !order) return { ok: false as const, error: "Pedido não encontrado." };
    return { ok: true as const, order };
  });
