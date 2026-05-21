import { createContext, useContext, useState, type ReactNode } from "react";
import { CheckoutDialog } from "./CheckoutDialog";
import type { KitId } from "@/lib/kits";

type Ctx = { open: (kitId: KitId) => void };
const CheckoutCtx = createContext<Ctx | null>(null);

export function useCheckout() {
  const ctx = useContext(CheckoutCtx);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [openKit, setOpenKit] = useState<KitId | null>(null);

  return (
    <CheckoutCtx.Provider value={{ open: (k) => setOpenKit(k) }}>
      {children}
      <CheckoutDialog
        kitId={openKit}
        onOpenChange={(o) => {
          if (!o) setOpenKit(null);
        }}
      />
    </CheckoutCtx.Provider>
  );
}
