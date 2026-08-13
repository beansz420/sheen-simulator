import { createFileRoute } from "@tanstack/react-router";
import { Announcement } from "@/components/site/Announcement";
import { Header } from "@/components/site/Header";
import { ProductGallery } from "@/components/site/ProductGallery";
import { ProductBuyBox } from "@/components/site/ProductBuyBox";
import { Sections } from "@/components/site/Sections";
import { Footer } from "@/components/site/Footer";
import { CheckoutProvider } from "@/components/checkout/CheckoutProvider";
import heroImg from "@/assets/gallery-clareador-tube.webp";
import { fpAttrs, fpClass } from "@/lib/daily-fingerprint";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Clareador Dérmico Cicatribem — Manchas, Axilas e Virilha" },
      { name: "description", content: "Creme clareador Cicatribem para melasma, axilas, virilha e rosto. Fórmula com Lumin White™, Niacinamida e Ácido Glicólico. Frete grátis." },
    ],
    links: [
      { rel: "preload", as: "image", href: heroImg, fetchPriority: "high" },
    ],
  }),
});

function Index() {
  return (
    <CheckoutProvider>
      <div className={`min-h-screen bg-background ${fpClass("page")}`} {...fpAttrs("page")}>
        <Announcement />
        <Header />
        <main className={fpClass("main")} {...fpAttrs("main")}>
          <section className={`mx-auto max-w-7xl px-4 py-8 ${fpClass("hero")}`} {...fpAttrs("hero")}>
            <div className={`grid gap-10 lg:grid-cols-2 lg:gap-16 ${fpClass("herogrid")}`}>
              <ProductGallery />
              <ProductBuyBox />
            </div>
          </section>
          <Sections />
        </main>
        <Footer />
      </div>
    </CheckoutProvider>
  );
}
