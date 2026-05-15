import { Check, Sparkles, Droplet, Clock, ShieldCheck, Leaf } from "lucide-react";
import model from "@/assets/product-model.jpg";
import blue from "@/assets/product-blue.jpg";

const problems = [
  "Manchas escuras difíceis de uniformizar",
  "Escurecimento em axilas e virilhas",
  "Pele com aspecto opaco e sem viço",
  "Tom de pele desigual em algumas regiões",
  "Marcas pós-acne ou pós-inflamatórias",
  "Desconforto com a aparência da pele",
];

const benefits = [
  { n: "1", t: "Auxilia na redução de manchas", d: "Contribui para suavizar áreas escurecidas, deixando a pele mais uniforme ao longo do uso." },
  { n: "2", t: "Uniformiza o tom da pele", d: "Ajuda a equilibrar a tonalidade em regiões com escurecimento ou diferenças de cor." },
  { n: "3", t: "Promove renovação celular", d: "Auxilia na regeneração das células, melhorando textura e aparência geral." },
  { n: "4", t: "Devolve luminosidade à pele", d: "Contribui para recuperar o viço natural e a saúde aparente da pele." },
];

const ingredients = [
  { name: "Lumin White™", desc: "Inibe a melanina e clareia de forma progressiva." },
  { name: "Ácido Glicólico", desc: "Renova a pele e acelera a absorção dos ativos." },
  { name: "Revinage™", desc: "Clareia, renova e reduz a oleosidade." },
  { name: "Ácido Fítico", desc: "Ilumina e bloqueia a formação de manchas." },
  { name: "Niacinamida", desc: "Uniformiza o tom e fortalece a barreira cutânea." },
  { name: "Nanotecnologia", desc: "Potencializa a penetração e a eficácia dos ativos." },
];

const phases = [
  { phase: "Fase 1", time: "Os primeiros 30 dias", points: ["Pele mais hidratada e início de uniformização", "Ação nas camadas mais profundas"] },
  { phase: "Fase 2", time: "De 30 a 60 dias", points: ["Manchas escuras começam a clarear", "Pele mais uniforme e equilibrada", "Textura mais lisa e refinada"] },
  { phase: "Fase 3", time: "90 dias e além", points: ["Manchas visivelmente reduzidas", "Tom de pele uniforme e iluminado", "Pele com aspecto saudável e renovado"] },
];

const stats = [
  { n: "94%", t: "perceberam redução visível das manchas escuras" },
  { n: "97%", t: "notaram a pele mais uniforme e iluminada" },
  { n: "92%", t: "relataram pele mais hidratada e refinada" },
];

export function Sections() {
  return (
    <div className="space-y-24 py-20">
      {/* Problems */}
      <section className="mx-auto max-w-6xl px-4">
        <p className="mb-3 text-center text-sm font-bold uppercase tracking-wider text-primary">Isso acontece com você?</p>
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Por que uniformizar a sua pele?</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
          Com o tempo e fatores como sol, atrito, depilação e alterações hormonais, a pele pode desenvolver manchas e irregularidades no tom.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <div key={p} className="flex items-start gap-3 rounded-2xl border bg-card p-5">
              <div className="rounded-full bg-primary/10 p-1.5">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <p className="font-medium">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits with image */}
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">O que o Clareador vai fazer por você</h2>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <img src={model} alt="Resultado de pele uniforme" className="rounded-3xl object-cover" width={1024} height={1024} loading="lazy" />
          <div className="space-y-6">
            {benefits.map((b) => (
              <div key={b.n} className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-lg font-bold text-primary-foreground">
                  {b.n}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold">{b.t}</h3>
                  <p className="text-sm text-muted-foreground">{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Eficácia comprovada</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((s) => (
              <div key={s.n} className="text-center">
                <p className="mb-2 text-6xl font-black">{s.n}</p>
                <p className="opacity-90">{s.t}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs opacity-70">*Resultados baseados em percepção de usuárias após uso contínuo do produto.</p>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Linha do tempo dos resultados</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {phases.map((p, i) => (
            <div key={i} className="relative rounded-3xl border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">{p.phase}</p>
              <h3 className="mb-4 text-xl font-bold">{p.time}</h3>
              <ul className="space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 flex-shrink-0 text-success" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Ingredients */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-3 text-center text-3xl font-bold md:text-4xl">Por que vale cada centavo?</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Uma combinação de ativos de alta performance trabalhando em sinergia pela sua pele.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ingredients.map((ing) => (
              <div key={ing.name} className="rounded-3xl bg-card p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-primary to-primary-glow p-3">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{ing.name}</h3>
                <p className="text-sm text-muted-foreground">{ing.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Como usar</h2>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <img src={blue} alt="Aplicação do creme" className="rounded-3xl object-cover" width={1024} height={1024} loading="lazy" />
          <div className="space-y-5">
            {[
              { i: Droplet, t: "Aplique na pele limpa", d: "Com a pele seca, espalhe o produto na região desejada." },
              { i: Sparkles, t: "Massageie até a absorção", d: "Movimentos circulares até o produto ser totalmente absorvido." },
              { i: ShieldCheck, t: "Use somente à noite", d: "Pela manhã, lave a área tratada. Filtro solar é obrigatório durante o dia." },
              { i: Leaf, t: "Constância é tudo", d: "Use diariamente após a segunda semana para potencializar os resultados." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="flex gap-4 rounded-2xl border bg-card p-5">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold">{t}</h3>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-glow p-10 text-center text-primary-foreground md:p-16">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">Sua pele uniforme começa hoje</h2>
          <p className="mx-auto mb-8 max-w-xl opacity-90">
            Mais de 300 mil pessoas já transformaram sua rotina de skincare. Garanta o seu agora e ganhe 3% off no PIX.
          </p>
          <button className="rounded-full bg-background px-10 py-5 text-base font-bold uppercase tracking-wide text-primary shadow-xl transition-transform hover:scale-105">
            Comprar agora
          </button>
        </div>
      </section>
    </div>
  );
}
