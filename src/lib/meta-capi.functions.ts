import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { sendMetaCapiEvent } from "./meta-capi.server";

const Schema = z.object({
  event_name: z.enum(["Purchase", "InitiateCheckout"]),
  event_id: z.string().min(1).max(100),
  transaction_id: z.string().min(1).max(100),
  event_source_url: z.string().url().max(500).optional(),
  user_agent: z.string().max(500).optional(),
  fbp: z.string().max(255).optional(),
  fbc: z.string().max(255).optional(),
});

export const sendMetaEvent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Schema.parse(input))
  .handler(async ({ data }) => {
    // Captura IP/UA da requisição se o cliente não enviou.
    const ua = data.user_agent || getRequestHeader("user-agent") || undefined;
    const ip = getRequestIP({ xForwardedFor: true }) || undefined;
    return sendMetaCapiEvent({ ...data, user_agent: ua, client_ip_address: ip });
  });
