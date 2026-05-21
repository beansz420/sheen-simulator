export type KitId = "1" | "2" | "3";

export const KITS: Record<KitId, { id: KitId; name: string; quantity: number; price: number }> = {
  "1": { id: "1", name: "Clareador Dérmico Cicatriderme - 1 unidade", quantity: 1, price: 49.9 },
  "2": { id: "2", name: "Clareador Dérmico Cicatriderme - Kit 2 unidades", quantity: 2, price: 79.9 },
  "3": { id: "3", name: "Clareador Dérmico Cicatriderme - Kit 3 unidades + Sérum Brinde", quantity: 3, price: 99.9 },
};

export function getKit(id: string | undefined | null) {
  if (!id || !(id in KITS)) return KITS["1"];
  return KITS[id as KitId];
}
