import { useEffect, useState } from "react";
import { Truck, Clock } from "lucide-react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Announcement() {
  const [time, setTime] = useState({ h: 1, m: 59, s: 59 });

  useEffect(() => {
    const id = setInterval(() => {
      setTime((t) => {
        let { h, m, s } = t;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 1; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider sm:text-xs">
        <span className="flex items-center gap-2">
          <Truck className="h-4 w-4" /> Frete grátis · Oferta limitada
        </span>
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4" /> Acaba em:
          <span className="rounded bg-black/20 px-1.5 py-0.5 tabular-nums">{pad(time.h)}</span>
          <span>:</span>
          <span className="rounded bg-black/20 px-1.5 py-0.5 tabular-nums">{pad(time.m)}</span>
          <span>:</span>
          <span className="rounded bg-black/20 px-1.5 py-0.5 tabular-nums">{pad(time.s)}</span>
        </span>
      </div>
    </div>
  );
}
