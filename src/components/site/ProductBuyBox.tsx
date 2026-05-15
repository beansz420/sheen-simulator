import { useState } from "react";
import { Star, Check, Zap } from "lucide-react";

const offers = [
  { qty: 4, label: "4 UNIDADES", each: 135.91, total: 543.66, was: 639.6, off: "15% OFF", best: true },
  { qty: 3, label: "3 UNIDADES", each: 143.91, total: 431.73, was: 479.7, off: "10% OFF" },
  { qty: 2, label: "2 UNIDADES", each: 151.91, total: 303.81, was: 319.8, off: "5% OFF" },
  { qty: 1, label: "1 UNIDADE", each: 159.9, total: 159.9, normal: true },
];

const fmt = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;

export function ProductBuyBox() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="space-y-6">
      <span className="inline-block rounded-full bg-promo px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-promo-foreground">
        Para clarear manchas
      </span>
      <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
        Creme Clareador de Manchas — Melasma, Axilas, Virilha, Áreas Íntimas, Rosto e Corpo
      </h1>
      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-promo text-promo" />
        ))}
        <span className="text-sm text-muted-foreground">83 avaliações</span>
      </div>
      <div>
        <p className="text-3xl font-bold text-primary">R$ 159,90</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Até <span className="font-semibold text-foreground">12x</span> de{" "}
          <span className="font-semibold text-foreground">R$ 14,89</span>
        </p>
      </div>

      <div className="rounded-2xl border-2 border-success/30 bg-success/5 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-success/10 p-2">
            <Zap className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="font-bold text-foreground">
              R$ 155,10 <span className="text-sm font-medium text-muted-foreground">no PIX</span>
              <span className="ml-2 rounded bg-success px-2 py-0.5 text-xs font-bold text-success-foreground">3% OFF</span>
            </p>
            <p className="text-xs text-muted-foreground">Pague com PIX e economize R$ 4,80</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Leve mais e pague menos!</h3>
        <div className="space-y-3">
          {offers.map((o, i) => {
            const active = i === selected;
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                  active ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"
                }`}
              >
                {o.off && (
                  <span className="absolute -top-2 right-4 rounded-md bg-promo px-2 py-0.5 text-[10px] font-bold text-promo-foreground">
                    {o.off}
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      active ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}
                  >
                    {active && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <div>
                    <p className="font-bold">{o.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.normal ? "Preço normal" : `${fmt(o.each)} cada unidade`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{fmt(o.total)}</p>
                  {o.was && <p className="text-xs text-muted-foreground line-through">{fmt(o.was)}</p>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button className="w-full rounded-full bg-success py-5 text-lg font-bold uppercase tracking-wide text-success-foreground shadow-lg transition-transform hover:scale-[1.02]">
        Adicionar ao carrinho
      </button>
    </div>
  );
}
