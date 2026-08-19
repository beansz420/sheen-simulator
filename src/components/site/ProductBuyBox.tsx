import { useEffect } from "react";
import { ShoppingCart, Truck, Users, ShieldCheck, Award } from "lucide-react";
import { fbqTrack } from "@/lib/meta-pixel";

export function ProductBuyBox() {
  // Meta Pixel: ViewContent ao visualizar a página do produto
  useEffect(() => {
    fbqTrack("ViewContent", {
      content_ids: ["clareador-dermico-cicatribem"],
      content_name: "Clareador Dérmico Cicatribem",
      content_type: "product",
      currency: "BRL",
      value: 59.9,
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Hero price */}
      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl font-extrabold text-foreground">R$ 59,90</span>
          <span className="text-sm font-medium text-muted-foreground line-through">R$ 99,90</span>
          <span className="rounded-md bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">-40%</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Cicatribem · Niacinamida + Ácido Glicólico + Lumin White
        </p>
      </div>

      {/* Low stock alert */}
      <div className="rounded-xl border border-promo/40 bg-promo/10 px-4 py-2.5 text-sm">
        <p className="font-medium">
          Restam apenas <span className="font-bold">14 unidades</span> em estoque!
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm">
        <Users className="h-4 w-4 text-primary" />
        <span>
          <span className="font-bold">+3.812 pessoas</span> já compraram
        </span>
      </div>

      <button
        onClick={() => document.getElementById("kit-2")?.scrollIntoView({ behavior: "smooth", block: "center" })}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(22,95%,55%)] py-5 text-base font-extrabold uppercase tracking-wide text-white shadow-xl transition-transform hover:scale-[1.01]"
      >
        <ShoppingCart className="h-5 w-5" /> Quero o meu agora
      </button>
      <p className="text-center text-xs text-muted-foreground">Frete Grátis + Bônus Exclusivos</p>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { i: Truck, t: "Frete Grátis", s: "Todo Brasil" },
          { i: ShieldCheck, t: "Compra Segura", s: "Criptografia SSL" },
          { i: Award, t: "Selo ANVISA", s: "Qualidade testada" },
        ].map(({ i: Icon, t, s }) => (
          <div key={t} className="rounded-xl border bg-card p-3 text-center">
            <Icon className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-[11px] font-bold leading-tight">{t}</p>
            <p className="text-[10px] text-muted-foreground">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
