import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, Check, Clock, Loader2 } from "lucide-react";
import { z } from "zod";
import { Page, SiteFooter, SiteHeader } from "@/components/site/Layout";
import { bookingOfferings } from "@/content/booking";
import { useI18n } from "@/content/i18n";
import { getAvailability, getFxRate, startBooking } from "@/lib/booking.functions";
import previewAsset from "@/assets/rhaissa-preview-serif.png.asset.json";

const title = "Book & pay for a session — Rhaissa V.";
const description =
  "Pick a real open slot in my calendar, pay in USD or BRL, and get your session confirmed with a Google Meet link right away.";
const previewImage = `https://rhaissa.co${previewAsset.url}?v=20260904-1`;

export const Route = createFileRoute("/book")({
  validateSearch: z.object({ offering: z.string().optional() }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: previewImage },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1376" },
      { property: "og:image:height", content: "768" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: previewImage },
    ],
  }),
  component: Book,
});

const copy = {
  en: {
    eyebrow: "Book & pay",
    title: "Pick a real open slot and secure it",
    lead: "These times come straight from my calendar. Choosing one holds it for 15 minutes while you pay — payment confirms the booking and the invite lands in both calendars.",
    session: "Session",
    pickTime: "Pick a time",
    yourDetails: "Your details",
    name: "Full name*",
    email: "Email*",
    notes: "What do you want to solve?*",
    submit: "Continue to payment",
    loading: "Loading real availability…",
    empty: "No open times in the next weeks — message me on LinkedIn and we'll find one.",
    localTime: "Times shown in your local timezone",
    holdNote: "The slot is held for 15 minutes while you complete payment.",
    brNote: (
      <>
        For Brazilians: reach out for alternative methods if needed.
      </>
    ),
    required: "Please add your name, a valid email, and what you want to solve.",
    currency: "Pay in",
    converted: "Converted from USD at today's rate",
  },
  pt: {
    eyebrow: "Agendar e pagar",
    title: "Escolha um horário real e reserve",
    lead: "Estes horários vêm direto da minha agenda. Ao escolher um, ele fica reservado por 15 minutos enquanto você paga — o pagamento confirma a reserva e o convite entra nas duas agendas.",
    session: "Sessão",
    pickTime: "Escolha um horário",
    yourDetails: "Seus dados",
    name: "Nome completo*",
    email: "E-mail*",
    notes: "O que você quer resolver?*",
    submit: "Continuar para o pagamento",
    loading: "Carregando disponibilidade real…",
    empty: "Sem horários livres nas próximas semanas — me chame no LinkedIn que a gente encontra um.",
    localTime: "Horários no seu fuso local",
    holdNote: "O horário fica reservado por 15 minutos enquanto você conclui o pagamento.",
    brNote: (
      <>
        Brasileiros: falem comigo sobre métodos alternativos, se precisarem.
      </>
    ),
    required: "Adicione seu nome, um e-mail válido e o que você quer resolver.",
    currency: "Pagar em",
    converted: "Convertido do valor em USD pela cotação de hoje",
  },
};

function Book() {
  const { lang, c } = useI18n();
  const t = copy[lang];
  const search = Route.useSearch();
  const navigate = useNavigate();

  const offeringId = bookingOfferings.some((o) => o.id === search.offering)
    ? search.offering!
    : bookingOfferings[0]!.id;
  const offering = bookingOfferings.find((o) => o.id === offeringId)!;
  const card = c.offerings[offering.index];

  const availabilityFn = useServerFn(getAvailability);
  const fxFn = useServerFn(getFxRate);
  const startFn = useServerFn(startBooking);

  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const baseCurrency = offering.currency ?? "usd";
  const [currency, setCurrency] = useState<"usd" | "brl">(baseCurrency);

  const { data: fx } = useQuery({
    queryKey: ["fx-usd-brl"],
    queryFn: () => fxFn(),
    staleTime: 30 * 60_000,
    enabled: baseCurrency === "usd",
  });

  const priceLabel = useMemo(() => {
    if (baseCurrency !== "usd" || currency === "usd") return card?.price;
    if (!fx) return "…";
    const brl = Math.ceil((offering.amountCents * fx.rate) / 100);
    return brl.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  }, [baseCurrency, currency, fx, offering.amountCents, card?.price]);

  const { data, isLoading } = useQuery({
    queryKey: ["availability", offeringId],
    queryFn: () => availabilityFn({ data: { offeringId } }),
    staleTime: 60_000,
  });

  const grouped = useMemo(() => {
    const map = new Map<string, { startsAt: string }[]>();
    for (const slot of data?.slots ?? []) {
      const day = new Date(slot.startsAt).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
      map.set(day, [...(map.get(day) ?? []), slot]);
    }
    return [...map.entries()];
  }, [data, lang]);

  const mutation = useMutation({
    mutationFn: (input: { startsAt: string }) =>
      startFn({
        data: {
          offeringId,
          startsAt: input.startsAt,
          name: name.trim(),
          email: email.trim(),
          notes: notes.trim() || undefined,
          locale: lang,
          currency,
        },
      }),
    onSuccess: (result) => {
      window.location.href = result.checkoutUrl;
    },
    onError: (err: Error) => setError(err.message),
  });

  function submit() {
    setError(null);
    if (!selected) return setError(t.pickTime);
    if (
      name.trim().length < 2 ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) ||
      notes.trim().length < 3
    ) {
      return setError(t.required);
    }
    mutation.mutate({ startsAt: selected });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Page eyebrow={t.eyebrow} title={t.title} lead={t.lead}>
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="eyebrow">{t.pickTime}</p>
            <p className="mt-2 text-xs text-muted-foreground">{t.localTime}</p>

            {isLoading ? (
              <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> {t.loading}
              </p>
            ) : grouped.length === 0 ? (
              <p className="mt-8 text-sm text-muted-foreground">{t.empty}</p>
            ) : (
              <div className="mt-6 space-y-6">
                {grouped.map(([day, slots]) => (
                  <div key={day}>
                    <p className="text-sm font-medium">{day}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {slots.map((slot) => {
                        const active = selected === slot.startsAt;
                        return (
                          <button
                            key={slot.startsAt}
                            type="button"
                            onClick={() => setSelected(slot.startsAt)}
                            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card hover:bg-secondary"
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(slot.startsAt).toLocaleTimeString(
                              lang === "pt" ? "pt-BR" : "en-US",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-soft h-fit p-7">
            <p className="eyebrow text-primary">{t.session}</p>
            <h2 className="mt-2 text-lg font-semibold">{card?.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{card?.duration}</p>
            <p className="mt-3 font-display text-3xl font-[450]">{priceLabel}</p>
            {baseCurrency === "usd" ? (
              <div className="mt-4">
                <p className="eyebrow">{t.currency}</p>
                <div className="mt-2 inline-flex rounded-md border border-border p-1">
                  {(["usd", "brl"] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                        currency === code
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
                {currency === "brl" ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t.converted} · {card?.price}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              <p className="eyebrow">{t.yourDetails}</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.name}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder={t.email}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notes}
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            {selected ? (
              <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                {new Date(selected).toLocaleString(lang === "pt" ? "pt-BR" : "en-US", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            ) : null}

            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

            <button
              type="button"
              onClick={submit}
              disabled={mutation.isPending}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CalendarDays className="h-4 w-4" />
              )}
              {t.submit}
            </button>

            <p className="mt-4 text-xs text-muted-foreground">{t.holdNote}</p>
            <p className="mt-2 text-xs text-muted-foreground">{t.brNote}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {bookingOfferings
                .filter((o) => o.id !== offeringId && !o.hidden)
                .map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setSelected(null);
                      void navigate({ to: "/book", search: { offering: o.id } });
                    }}
                    className="rounded-md border border-border px-3 py-2 text-xs transition-colors hover:bg-secondary"
                  >
                    {c.offerings[o.index]?.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </Page>
      <SiteFooter />
    </div>
  );
}
