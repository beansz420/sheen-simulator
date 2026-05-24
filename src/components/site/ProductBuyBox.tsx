import { Star, ShoppingCart, Truck, Zap, Gift, Eye, Volume2, ThumbsUp, Users, ShieldCheck, Award } from "lucide-react";
import { useCheckout } from "@/components/checkout/CheckoutProvider";
import kit1 from "@/assets/kit-1un.webp";
import kit2 from "@/assets/kit-2un.webp";
import kit3 from "@/assets/kit-3un-serum.webp";

type Kit = {
  id: "1" | "2" | "3";
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
    id: "1",
    image: kit1,
    title: "1 Clareador Dérmico",
    subtitle: "Niacinamida + Ácido Glicólico + Lumin White",
    price: "R$ 49,90",
    oldPrice: "R$ 89,90",
    off: "-44% OFF",
    badge: { label: "MAIS VENDIDO", tone: "teal" },
  },
  {
    id: "2",
    image: kit2,
    title: "Kit 2 Clareadores Dérmicos",
    subtitle: "Niacinamida + Ácido Glicólico + Lumin White",
    price: "R$ 79,90",
    oldPrice: "R$ 179,80",
    off: "-56% OFF",
    perUnit: "(R$ 39,95/un)",
    badge: { label: "MELHOR CUSTO-BENEFÍCIO", tone: "green" },
    ribbon: "RECOMENDADO — MAIOR ECONOMIA",
    highlighted: true,
  },
  {
    id: "3",
    image: kit3,
    title: "Kit 3 Clareador Dérmico",
    subtitle: "Niacinamida + Ácido Glicólico + Lumin White",
    price: "R$ 99,90",
    oldPrice: "R$ 269,70",
    off: "-63% OFF",
    perUnit: "(R$ 33,30/un)",
    badge: { label: "BRINDE EXCLUSIVO", tone: "teal" },
    bonus: "+ Sérum Facial Hidratante de BRINDE",
  },
];

export function ProductBuyBox() {
  return (
    <div className="space-y-5">
      {/* Live viewers + sound */}
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-2 text-muted-foreground">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          <Eye className="h-3.5 w-3.5" /> 187 vendo agora
        </span>
        <button className="flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-muted-foreground">
          <Volume2 className="h-3.5 w-3.5" /> Toque para ouvir
        </button>
      </div>

      {/* Low stock alert */}
      <div className="rounded-xl border border-promo/40 bg-promo/10 px-4 py-3 text-sm">
        <p className="flex items-center gap-2 font-medium">
          <ThumbsUp className="h-4 w-4 text-promo" />
          Restam apenas <span className="font-bold">14 unidades</span> em estoque!
        </p>
      </div>

      <span className="inline-block rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
        60g · Uso facial e corporal
      </span>

      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-promo text-promo" />
        ))}
        <span className="text-sm font-semibold">4.9</span>
        <span className="text-sm text-muted-foreground">(2.847 avaliações)</span>
      </div>

      <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
        Clareador Dérmico Cicatribem
      </h1>

      {/* Hero price */}
      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl font-extrabold text-foreground">R$ 49,90</span>
          <span className="text-sm font-medium text-muted-foreground line-through">R$ 89,90</span>
          <span className="rounded-md bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">-44%</span>
          <span className="ml-auto rounded-full bg-success px-3 py-1 text-[11px] font-bold uppercase text-success-foreground">
            Economize 44%
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>💎 Menor preço do ano</span>
          <span>🔥 Últimas unidades!</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Cicatribem · Niacinamida + Ácido Glicólico + Lumin White
      </p>

      <div className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm">
        <Users className="h-4 w-4 text-primary" />
        <span>
          <span className="font-bold">+3.812 pessoas</span> já compraram
        </span>
      </div>

      <button
        onClick={() => document.getElementById("kit-3")?.scrollIntoView({ behavior: "smooth", block: "center" })}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(22,95%,55%)] py-5 text-base font-extrabold uppercase tracking-wide text-white shadow-xl transition-transform hover:scale-[1.01]"
      >
        <ShoppingCart className="h-5 w-5" /> Quero o meu agora
      </button>
      <p className="text-center text-xs text-muted-foreground">Frete Grátis + Bônus Exclusivos</p>
      <p className="text-center text-xs text-muted-foreground">
        <span className="font-bold text-foreground">7 pessoas</span> estão finalizando a compra agora
      </p>

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

      {/* Kits */}
      <div className="space-y-5 pt-6">
        <div className="text-center">
          <h2 className="text-lg font-bold uppercase tracking-wide">Escolha o seu kit</h2>
          <p className="mt-1 text-xs text-muted-foreground">Quanto mais unidades, <span className="font-bold text-foreground">maior a economia</span></p>
        </div>
        {kits.map((k, i) => (
          <KitCard key={i} kit={k} id={`kit-${i + 1}`} />
        ))}
        <p className="text-center text-xs text-muted-foreground">🔒 Pagamento 100% seguro · Seus dados protegidos</p>
      </div>
    </div>
  );
}

function KitCard({ kit, id }: { kit: Kit; id?: string }) {
  const card = (
    <div id={id} className="rounded-2xl border border-border bg-background p-4 shadow-sm scroll-mt-24">
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

      <BuyButton kitId={kit.id} />
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

function BuyButton({ kitId }: { kitId: "1" | "2" | "3" }) {
  const { open } = useCheckout();
  return (
    <button
      type="button"
      onClick={() => open(kitId)}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(22,95%,55%)] py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-md transition-transform hover:scale-[1.01]"
    >
      <ShoppingCart className="h-4 w-4" /> Comprar agora
    </button>
  );
}
