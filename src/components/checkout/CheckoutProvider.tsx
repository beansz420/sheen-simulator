import { createContext, useContext, useEffect, useState, lazy, Suspense, type ReactNode } from "react";
import type { KitId } from "@/lib/kits";

const CheckoutDialog = lazy(() =>
  import("./CheckoutDialog").then((m) => ({ default: m.CheckoutDialog })),
);

type Ctx = { open: (kitId: KitId) => void };
const CheckoutCtx = createContext<Ctx | null>(null);

export function useCheckout() {
  const ctx = useContext(CheckoutCtx);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [openKit, setOpenKit] = useState<KitId | null>(null);
  const [primed, setPrimed] = useState(false);

  // Preload the dialog chunk after the page is idle so the first click is instant.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const idle =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const id = idle(() => {
      void import("./CheckoutDialog");
      setPrimed(true);
    });
    return () => {
      const cancel = (window as unknown as { cancelIdleCallback?: (id: number) => void })
        .cancelIdleCallback;
      if (typeof id === "number") {
        if (cancel) cancel(id);
        else window.clearTimeout(id);
      }
    };
  }, []);

  const handleOpen = (k: KitId) => {
    // Ensure chunk is loaded before showing
    if (!primed) void import("./CheckoutDialog");
    setOpenKit(k);
  };

  return (
    <CheckoutCtx.Provider value={{ open: handleOpen }}>
      {children}
      {openKit !== null && (
        <Suspense fallback={null}>
          <CheckoutDialog
            kitId={openKit}
            onOpenChange={(o) => {
              if (!o) setOpenKit(null);
            }}
          />
        </Suspense>
      )}
    </CheckoutCtx.Provider>
  );
}
