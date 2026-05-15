import { Star, ShoppingCart, Truck, Zap, Gift } from "lucide-react";
import kit1 from "@/assets/kit-1un.jpg";
import kit2 from "@/assets/kit-2un.jpg";
import kit3 from "@/assets/kit-3un-serum.jpg";

type Kit = {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  oldPrice?: string;
  off?: string;
  perUnit?: string;
  badge?: { label: string; tone: "teal" | "green" };
  ribbon?: string;
  highlighted?: boolean;
  bonus?: string;
};

const kits: Kit[] = [
  {
    image: kit1,
    title: "1 Clareador Dérmico",
    subtitle: "Niacinamida + Ácido Glicólico + Lumin White",
    price: "R$ 89,90",
    oldPrice: "R$ 159,90",
    off: "-43% OFF",
    badge: { label: "MAIS VENDIDO", tone: "teal" },
  },
  {
    image: kit2,
    title: "Kit 2 Clareador Dérmico",
    subtitle: "Niacinamida + Ácido Glicólico + Lumin White",
    price: "R$ 149,90",
    oldPrice: "R$ 319,80",
    off: "-53% OFF",
    perUnit: "(R$ 74,95/un)",
    badge: { label: "MELHOR CUSTO-BENEFÍCIO", tone: "green" },
    ribbon: "RECOMENDADO — MAIOR ECONOMIA",
    highlighted: true,
  },
  {
    image: kit3,
    title: "Kit 3 Clareador Dérmico",
    subtitle: "Niacinamida + Ácido Glicólico + Lumin White",
    price: "R$ 219,90",
    oldPrice: "R$ 479,70",
    off: "-54% OFF",
    perUnit: "(R$ 73,30/un)",
    badge: { label: "BRINDE EXCLUSIVO", tone: "teal" },
    bonus: "+ Sérum Facial Hidratante de BRINDE",
  },
];

export function ProductBuyBox() {
  return (
    <div className="space-y-6">
      <span className="inline-block rounded-full bg-promo px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-promo-foreground">
        Para clarear manchas
      </span>
      <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
        Clareador Dérmico Cicatriderme — Melasma, Axilas, Virilha, Áreas Íntimas, Rosto e Corpo
      </h1>
      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-promo text-promo" />
        ))}
        <span className="text-sm text-muted-foreground">2.847 avaliações</span>
      </div>

      <div className="space-y-5 pt-2">
        <h2 className="text-center text-lg font-bold uppercase tracking-wide">
          Escolha o seu kit
        </h2>

        {kits.map((k, i) => (
          <KitCard key={i} kit={k} />
        ))}
      </div>

      <button className="sticky bottom-3 z-30 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(22,95%,55%)] py-5 text-base font-extrabold uppercase tracking-wide text-white shadow-xl transition-transform hover:scale-[1.01]">
        <ShoppingCart className="h-5 w-5" /> Quero o meu agora
      </button>
    </div>
  );
}

function KitCard({ kit }: { kit: Kit }) {
  const card = (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
      <div>
        <span
          className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${
            kit.badge?.tone === "green" ? "bg-success" : "bg-[hsl(178,60%,45%)]"
          }`}
        >
          {kit.badge?.label}
        </span>
      </div>

      <div className="mt-3 flex gap-4">
        <img
          src={kit.image}
          alt={kit.title}
          className="h-24 w-24 flex-shrink-0 rounded-lg object-contain"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug">{kit.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{kit.subtitle}</p>
          {kit.bonus && (
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-success">
              <Gift className="h-3.5 w-3.5" /> {kit.bonus}
            </p>
          )}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-extrabold">{kit.price}</span>
            {kit.off && (
              <span className="text-xs font-bold text-destructive">{kit.off}</span>
            )}
          </div>
          {kit.oldPrice && (
            <p className="text-xs text-muted-foreground">
              <span className="line-through">{kit.oldPrice}</span>{" "}
              {kit.perUnit && <span className="ml-1">{kit.perUnit}</span>}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Truck className="h-3.5 w-3.5 text-success" /> Frete Grátis
        </span>
        <span className="flex items-center gap-1">
          <Zap className="h-3.5 w-3.5 text-promo" /> Entrega rápida
        </span>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(22,95%,55%)] py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-md transition-transform hover:scale-[1.01]">
        <ShoppingCart className="h-4 w-4" /> Comprar agora
      </button>
    </div>
  );

  if (kit.highlighted) {
    return (
      <div className="rounded-2xl border-2 border-success p-1.5 pt-0">
        <div className="-mx-1.5 -mt-3 mb-1 flex justify-center">
          <span className="rounded-full bg-success px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-success-foreground shadow">
            {kit.ribbon}
          </span>
        </div>
        {card}
      </div>
    );
  }
  return card;
}
