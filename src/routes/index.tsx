import { createFileRoute } from "@tanstack/react-router";
import { Announcement } from "@/components/site/Announcement";
import { Header } from "@/components/site/Header";
import { ProductGallery } from "@/components/site/ProductGallery";
import { ProductBuyBox } from "@/components/site/ProductBuyBox";
import { Sections } from "@/components/site/Sections";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Clareador Dérmico Cicatriderme — Manchas, Axilas e Virilha" },
      { name: "description", content: "Creme clareador Cicatriderme para melasma, axilas, virilha e rosto. Fórmula com Lumin White™, Niacinamida e Ácido Glicólico. Frete grátis." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Announcement />
      <Header />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery />
            <ProductBuyBox />
          </div>
        </section>
        <Sections />
      </main>
      <Footer />
    </div>
  );
}
