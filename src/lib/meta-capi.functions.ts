import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sendMetaCapiEvent } from "./meta-capi.server";

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
    return sendMetaCapiEvent(data);
  });
