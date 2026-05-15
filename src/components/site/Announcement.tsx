export function Announcement() {
  const items = [
    "PARCELE EM ATÉ 12 VEZES",
    "GANHE 3% OFF NO PIX",
    "FRETE GRÁTIS ACIMA DE R$ 199",
    "ENVIO EM 24H",
  ];
  return (
    <div className="overflow-hidden bg-primary text-primary-foreground">
      <div className="flex animate-[scroll_30s_linear_infinite] gap-12 whitespace-nowrap py-2 text-xs font-semibold tracking-wider">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t} <span className="opacity-60">•</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
