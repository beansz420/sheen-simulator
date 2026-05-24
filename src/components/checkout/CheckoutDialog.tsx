import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  Home,
  Hash,
  Building2,
  MapPin,
  Map,
  Landmark,
  Lock,
  ShieldCheck,
  Clock,
  QrCode,
  ShieldAlert,
  Loader2,
  Copy,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { maskCPF, maskCEP, maskPhone, isValidCPF, lookupCepViaCep } from "@/lib/br-validators";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createPixOrder, getOrderStatus } from "@/lib/checkout.functions";
import { sendMetaEvent } from "@/lib/meta-capi.functions";
import { fbqTrack, generateEventId } from "@/lib/meta-pixel";
import { KITS, type KitId } from "@/lib/kits";
import kit1 from "@/assets/kit-1un.webp";
import kit2 from "@/assets/kit-2un.webp";
import kit3 from "@/assets/kit-3un-serum.webp";

const KIT_IMAGES: Record<KitId, string> = { "1": kit1, "2": kit2, "3": kit3 };

const ACCENT = "hsl(195, 80%, 50%)"; // cyan blue matching reference

type Step = "form" | "pix";

export function CheckoutDialog({
  kitId,
  onOpenChange,
}: {
  kitId: KitId | null;
  onOpenChange: (o: boolean) => void;
}) {
  const open = kitId !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="left-0 top-0 flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[92vh] sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border"
      >
        <DialogTitle className="sr-only">Checkout</DialogTitle>
        {kitId && (
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <CheckoutBody kitId={kitId} onClose={() => onOpenChange(false)} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CheckoutBody({ kitId, onClose }: { kitId: KitId; onClose: () => void }) {
  const kit = KITS[kitId];
  const [step, setStep] = useState<Step>("form");
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Reset on kit change
  useEffect(() => {
    setStep("form");
    setTransactionId(null);
  }, [kitId]);

  return (
    <div className="min-h-full bg-[#f4f6fa] pb-[env(safe-area-inset-bottom)]">
      {/* Você está comprando */}
      <div className="sticky top-0 z-10 border-b border-slate-200/70 bg-[#f4f6fa]/95 px-3 pb-3 pt-3 backdrop-blur sm:px-6 sm:pb-4 sm:pt-5">
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>
            Você está comprando:
          </p>
          <div className="mt-2 flex items-center gap-3">
            <img src={KIT_IMAGES[kit.id]} alt={kit.name} className="h-12 w-12 rounded-lg object-contain" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{kit.name}</p>
              <p className="text-base font-extrabold">
                R$ {kit.price.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {step === "form" && (
        <CheckoutForm
          kitId={kitId}
          onSuccess={(txId) => {
            setTransactionId(txId);
            setStep("pix");
          }}
        />
      )}

      {step === "pix" && transactionId && (
        <PixStep transactionId={transactionId} onClose={onClose} />
      )}
    </div>
  );
}

function StepBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div
        className="flex items-center gap-3 rounded-full bg-[#eaf6fb] py-1.5 pl-1.5 pr-4"
        style={{ color: "#0c3a55" }}
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: ACCENT }}
        >
          {n}
        </span>
        <span className="text-sm font-extrabold">{label}</span>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  error,
  rightSlot,
  ...props
}: {
  label: string;
  icon: typeof User;
  error?: string | null;
  rightSlot?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          {...props}
          className={`h-11 w-full rounded-lg border bg-white pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-200"
              : "border-slate-200 focus:border-[color:var(--ring)] focus:ring-[color:var(--ring)]/30"
          }`}
          style={{ ["--ring" as string]: ACCENT }}
        />
        {rightSlot && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function CheckoutForm({ kitId, onSuccess }: { kitId: KitId; onSuccess: (txId: string) => void }) {
  const createOrder = useServerFn(createPixOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const kit = KITS[kitId];
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_document: "",
    customer_phone: "",
    address_cep: "",
    address_state: "",
    address_city: "",
    address_neighborhood: "",
    address_street: "",
    address_number: "",
    address_complement: "",
  });
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCPF(e.target.value);
    setForm((f) => ({ ...f, customer_document: masked }));
    if (cpfError) setCpfError(null);
  };

  const onCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value);
    setForm((f) => ({ ...f, address_cep: masked }));
    const digits = masked.replace(/\D/g, "");
    if (digits.length === 8) {
      lookupCep(masked);
    } else {
      setCepStatus("idle");
    }
  };

  const lookupCep = async (cep: string) => {
    setCepStatus("loading");
    const result = await lookupCepViaCep(cep);
    if (!result) {
      setCepStatus("error");
      return;
    }
    setCepStatus("ok");
    setForm((f) => ({
      ...f,
      address_street: result.logradouro || f.address_street,
      address_neighborhood: result.bairro || f.address_neighborhood,
      address_city: result.localidade || f.address_city,
      address_state: result.uf || f.address_state,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidCPF(form.customer_document)) {
      setCpfError("CPF inválido. Verifique os números.");
      return;
    }
    setLoading(true);
    try {
      const res = await createOrder({ data: { kitId, ...form } });
      if (!res.ok) {
        setError(res.error);
        setLoading(false);
        return;
      }
      onSuccess(res.transaction_id);
    } catch (err) {
      console.error(err);
      setError("Erro ao processar. Verifique os dados e tente novamente.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 px-3 pb-6 pt-3 sm:space-y-4 sm:px-6 sm:pt-4">
      {/* Step 1 - Dados pessoais */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <StepBadge n={1} label="Dados pessoais" />
        <div className="space-y-4">
          <Field
            label="Nome completo"
            icon={User}
            value={form.customer_name}
            onChange={set("customer_name")}
            placeholder="Seu nome"
            required
            maxLength={120}
          />
          <EmailFieldWithSuggestions
            value={form.customer_email}
            onChange={(v) => setForm((f) => ({ ...f, customer_email: v }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="CPF"
              icon={ShieldAlert}
              value={form.customer_document}
              onChange={onCpfChange}
              placeholder="000.000.000-00"
              required
              inputMode="numeric"
              maxLength={14}
              error={cpfError}
              rightSlot={
                isValidCPF(form.customer_document) ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : null
              }
            />
            <Field
              label="Celular"
              icon={Phone}
              value={form.customer_phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, customer_phone: maskPhone(e.target.value) }))
              }
              placeholder="(00) 00000-0000"
              required
              inputMode="tel"
              maxLength={16}
            />
          </div>
        </div>
      </section>

      {/* Step 2 - Endereço */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <StepBadge n={2} label="Endereço" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="CEP"
            icon={MapPin}
            value={form.address_cep}
            onChange={onCepChange}
            placeholder="00000-000"
            required
            inputMode="numeric"
            maxLength={9}
            error={cepStatus === "error" ? "CEP não encontrado." : null}
            rightSlot={
              cepStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              ) : cepStatus === "ok" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : null
            }
          />
          <Field
            label="Estado"
            icon={Map}
            value={form.address_state}
            onChange={(e) =>
              setForm((f) => ({ ...f, address_state: e.target.value.toUpperCase().slice(0, 2) }))
            }
            placeholder="UF"
            required
            maxLength={2}
          />
          <Field
            label="Cidade"
            icon={Landmark}
            value={form.address_city}
            onChange={set("address_city")}
            placeholder="Sua cidade"
            required
            maxLength={120}
          />
          <Field
            label="Bairro"
            icon={Map}
            value={form.address_neighborhood}
            onChange={set("address_neighborhood")}
            placeholder="Seu bairro"
            required
            maxLength={120}
          />
          <div className="sm:col-span-2">
            <Field
              label="Rua"
              icon={Home}
              value={form.address_street}
              onChange={set("address_street")}
              placeholder="Sua rua"
              required
              maxLength={200}
            />
          </div>
          <Field
            label="Número"
            icon={Hash}
            value={form.address_number}
            onChange={set("address_number")}
            placeholder="123"
            required
            maxLength={20}
          />
          <Field
            label="Complemento"
            icon={Building2}
            value={form.address_complement}
            onChange={set("address_complement")}
            placeholder="Apto, Bloco, etc"
            maxLength={100}
          />
        </div>
      </section>

      {/* Step 3 - Pagamento */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <StepBadge n={3} label="Pagamento" />
          <span className="text-xs font-bold" style={{ color: ACCENT }}>
            Pix
          </span>
        </div>

        <div
          className="flex flex-col items-center justify-center rounded-lg border-2 py-4"
          style={{ borderColor: ACCENT, background: "#f3fbfe" }}
        >
          <PixIcon />
          <span className="mt-1 text-xs font-bold text-slate-700">Pix</span>
        </div>

        <h3 className="mt-5 text-base font-extrabold text-slate-900">Pague no Pix</h3>

        <div className="mt-3 space-y-3 text-sm">
          <InfoLine icon={Clock} title="IMEDIATO">
            Ao selecionar a opção Gerar Pix o código para pagamento estará disponível.
          </InfoLine>
          <InfoLine icon={QrCode} title="PAGAMENTO SIMPLES">
            Para pagar basta abrir o aplicativo do seu banco, procurar pelo Pix e escanear o QRcode.
          </InfoLine>
          <InfoLine icon={ShieldCheck} title="100% SEGURO">
            O Pix foi desenvolvido pelo Banco Central para facilitar suas compras e é 100% seguro.
          </InfoLine>
        </div>

        <p className="mt-5 text-sm">
          <span className="font-bold" style={{ color: ACCENT }}>Valor total:</span>{" "}
          <span className="font-extrabold" style={{ color: ACCENT }}>
            R$ {kit.price.toFixed(2).replace(".", ",")}
          </span>
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-lg text-base font-bold text-white shadow-sm transition-opacity disabled:opacity-60"
          style={{ background: ACCENT }}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Gerar Pix"}
        </button>
        <p className="mt-3 text-center text-xs text-slate-500">
          Ambiente criptografado e 100% seguro.
        </p>
      </section>

      <div className="flex items-center justify-center gap-6 pt-2 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" /> Compra segura
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Dados protegidos
        </span>
      </div>
    </form>
  );
}

const EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com.br",
  "icloud.com",
  "live.com",
  "bol.com.br",
  "uol.com.br",
];

function EmailFieldWithSuggestions({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const atIdx = value.indexOf("@");
  const localPart = atIdx >= 0 ? value.slice(0, atIdx) : value;
  const domainPart = atIdx >= 0 ? value.slice(atIdx + 1).toLowerCase() : "";

  const suggestions =
    focused && localPart.length > 0
      ? EMAIL_DOMAINS.filter(
          (d) => (domainPart === "" || d.startsWith(domainPart)) && d !== domainPart
        ).slice(0, 5)
      : [];

  return (
    <div className="relative">
      <Field
        label="E-mail"
        icon={Mail}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="seu@email.com"
        required
        autoComplete="email"
        maxLength={255}
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {suggestions.map((d) => (
            <li key={d}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(`${localPart}@${d}`);
                  setFocused(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
              >
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">
                  <span className="text-slate-500">{localPart}@</span>
                  <span className="font-semibold text-slate-900">{d}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InfoLine({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Clock;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-extrabold" style={{ color: ACCENT }}>
        <Icon className="h-4 w-4" /> {title}
      </p>
      <p className="mt-0.5 text-xs text-slate-600">{children}</p>
    </div>
  );
}

function PixIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path
        d="M22.7 9.3l-5.4-5.4a2 2 0 00-2.6 0L9.3 9.3a2 2 0 000 2.8l5.4 5.4a2 2 0 002.8 0l5.4-5.4a2 2 0 00-.2-2.8z"
        fill={ACCENT}
      />
      <path d="M9.3 22.7l5.4 5.4a2 2 0 002.6 0l5.4-5.4-2-2-4.7 4.7-4.7-4.7-2 2z" fill={ACCENT} />
      <path d="M5 16l4 4 2-2-2-2 2-2-2-2-4 4zM23 14l-2 2 2 2-2 2 2 2 4-4-4-4z" fill={ACCENT} />
    </svg>
  );
}

function PixStep({ transactionId, onClose }: { transactionId: string; onClose: () => void }) {
  const fetchStatus = useServerFn(getOrderStatus);
  const fireMetaEvent = useServerFn(sendMetaEvent);
  const [copied, setCopied] = useState(false);
  const [purchaseFired, setPurchaseFired] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["order", transactionId],
    queryFn: () => fetchStatus({ data: { transaction_id: transactionId } }),
    refetchInterval: (q) => {
      const r = q.state.data;
      if (r?.ok && (r.order.status === "paid" || r.order.status === "expired" || r.order.status === "refunded")) {
        return false;
      }
      return 4000;
    },
  });

  // Dispara Purchase (Pixel + CAPI) quando pagamento confirmado
  useEffect(() => {
    if (purchaseFired) return;
    if (!data?.ok) return;
    if (data.order.status !== "paid") return;
    const eventId = generateEventId();
    fbqTrack(
      "Purchase",
      {
        currency: "BRL",
        value: Number(data.order.amount),
        content_ids: [transactionId],
        content_type: "product",
      },
      eventId,
    );
    void fireMetaEvent({
      data: {
        event_name: "Purchase",
        event_id: eventId,
        transaction_id: transactionId,
        event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      },
    }).catch((e) => console.error("Meta CAPI failed", e));
    setPurchaseFired(true);
  }, [data, transactionId, purchaseFired, fireMetaEvent]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!data.ok) {
    return (
      <div className="px-6 pb-8 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <p className="mt-3 text-sm text-slate-700">Pedido não encontrado.</p>
      </div>
    );
  }

  const order = data.order;

  if (order.status === "paid") {
    return (
      <div className="rounded-2xl bg-white px-6 py-10 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Pagamento confirmado!</h2>
        <p className="mt-2 text-sm text-slate-600">
          Obrigado, {order.customer_name.split(" ")[0]}. Seu pedido já está em separação.
        </p>
        <div className="mx-auto mt-5 max-w-xs rounded-lg bg-slate-50 px-4 py-3 text-left text-sm">
          <p className="text-slate-500">Valor pago</p>
          <p className="text-lg font-bold">R$ {Number(order.amount).toFixed(2).replace(".", ",")}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 h-11 rounded-lg px-6 text-sm font-bold text-white"
          style={{ background: ACCENT }}
        >
          Fechar
        </button>
      </div>
    );
  }

  if (order.status === "expired" || order.status === "refunded") {
    return (
      <div className="rounded-2xl bg-white px-6 py-10 text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-extrabold">
          {order.status === "expired" ? "QR Code expirado" : "Pagamento estornado"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">Gere um novo pedido para concluir.</p>
        <button onClick={onClose} className="mt-6 h-11 rounded-lg px-6 text-sm font-bold text-white" style={{ background: ACCENT }}>
          Fechar
        </button>
      </div>
    );
  }

  const copy = async () => {
    if (!order.pix_copy_paste) return;
    await navigator.clipboard.writeText(order.pix_copy_paste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 pb-6 sm:px-6">
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          <Clock className="h-3.5 w-3.5" /> Aguardando pagamento
        </div>
        <p className="mt-4 text-sm text-slate-500">Total a pagar</p>
        <p className="text-3xl font-extrabold">R$ {Number(order.amount).toFixed(2).replace(".", ",")}</p>

        {order.pix_qrcode_image && (
          <div className="mt-5 flex justify-center">
            <img src={order.pix_qrcode_image} alt="QR Code Pix" className="h-56 w-56 rounded-lg border bg-white p-2" />
          </div>
        )}

        <div className="mt-5 text-left">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Pix copia e cola</p>
          <div className="mt-2 break-all rounded-lg border bg-slate-50 p-3 font-mono text-[11px]">
            {order.pix_copy_paste}
          </div>
          <button
            onClick={copy}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold text-white"
            style={{ background: ACCENT }}
          >
            <Copy className="h-4 w-4" /> {copied ? "Copiado!" : "Copiar código"}
          </button>
        </div>

        <ol className="mt-5 space-y-1.5 text-left text-xs text-slate-600">
          <li>1. Abra o app do seu banco e escolha <b>Pagar com Pix</b>.</li>
          <li>2. Escaneie o QR Code ou cole o código.</li>
          <li>3. Esta tela atualiza sozinha quando recebermos a confirmação.</li>
        </ol>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-3 w-3 animate-spin" /> Verificando pagamento...
        </div>
      </div>
    </div>
  );
}
