import { sendMetaCapiEvent, purchaseEventId } from "./src/lib/meta-capi.server";
import { supabaseAdmin } from "./src/integrations/supabase/client.server";
const { data } = await supabaseAdmin.from("orders")
  .select("transaction_id, paid_at")
  .eq("status","paid").is("capi_purchase_sent_at", null)
  .gte("paid_at", new Date(Date.now()-24*3600*1000).toISOString());
for (const o of data ?? []) {
  const r = await sendMetaCapiEvent({ event_name:"Purchase", event_id: purchaseEventId(o.transaction_id!), transaction_id: o.transaction_id! });
  console.log(o.transaction_id, JSON.stringify(r));
}
