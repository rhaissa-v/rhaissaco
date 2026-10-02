import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck, Loader2, Video } from "lucide-react";
import { z } from "zod";
import { Page, SiteFooter, SiteHeader } from "@/components/site/Layout";
import { useI18n } from "@/content/i18n";
import { confirmBooking } from "@/lib/booking.functions";

const title = "Session confirmed — Rhaissa V.";
const description =
  "Your mentoring session is confirmed. Check your calendar invite and Google Meet link.";

export const Route = createFileRoute("/booked")({
  validateSearch: z.object({ session_id: z.string().optional() }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Booked,
});

const copy = {
  en: {
    eyebrow: "Booking",
    title: "Your session is confirmed",
    lead: "Payment went through and the invite is already in both calendars — with a Google Meet link.",
    pendingTitle: "Finishing your booking",
    pendingLead: "We are confirming the payment. This takes a few seconds.",
    noneTitle: "Nothing to confirm here",
    noneLead: "Start a booking to pick a real open slot and secure it with payment.",
    meet: "Open the meeting link",
    book: "Book another session",
    unpaid:
      "We could not confirm the payment yet. If you closed the checkout, the slot is released after 15 minutes — you can pick a time again.",
  },
  pt: {
    eyebrow: "Agendamento",
    title: "Sua sessão está confirmada",
    lead: "O pagamento foi aprovado e o convite já está nas duas agendas — com link do Google Meet. Por favor, confirme sua presença no convite.",
    pendingTitle: "Finalizando seu agendamento",
    pendingLead: "Estamos confirmando o pagamento. Isso leva alguns segundos.",
    noneTitle: "Nada para confirmar aqui",
    noneLead: "Inicie um agendamento para escolher um horário real e garantir com o pagamento.",
    meet: "Abrir o link da reunião",
    book: "Agendar outra sessão",
    unpaid:
      "Ainda não conseguimos confirmar o pagamento. Se você fechou o checkout, o horário é liberado após 15 minutos — pode escolher de novo.",
  },
};

function Booked() {
  const { lang } = useI18n();
  const t = copy[lang];
  const { session_id: sessionId } = Route.useSearch();
  const confirmFn = useServerFn(confirmBooking);

  const { data, isLoading } = useQuery({
    queryKey: ["booking-confirm", sessionId],
    queryFn: () => confirmFn({ data: { sessionId: sessionId! } }),
    enabled: Boolean(sessionId),
    refetchInterval: (query) =>
      query.state.data && "status" in query.state.data && query.state.data.status === "paid"
        ? false
        : 3000,
  });

  const paid = data?.found && data.status === "paid";
  const heading = !sessionId
    ? { title: t.noneTitle, lead: t.noneLead }
    : paid
      ? { title: t.title, lead: t.lead }
      : { title: t.pendingTitle, lead: t.pendingLead };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Page eyebrow={t.eyebrow} title={heading.title} lead={heading.lead}>
        <div className="card-soft max-w-xl p-8">
          {sessionId && isLoading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> {t.pendingLead}
            </p>
          ) : null}

          {paid && data.found ? (
            <>
              <p className="flex items-start gap-3 text-sm">
                <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                <span>
                  <strong>{data.offeringName}</strong>
                  <br />
                  {new Date(data.startsAt).toLocaleString(lang === "pt" ? "pt-BR" : "en-US", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
              {data.meetUrl ? (
                <a
                  href={data.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Video className="h-4 w-4" /> {t.meet}
                </a>
              ) : null}
            </>
          ) : null}

          {sessionId && !isLoading && !paid ? (
            <p className="text-sm text-muted-foreground">{t.unpaid}</p>
          ) : null}

          <div className="mt-8">
            <Link to="/book" className="text-sm font-medium text-primary hover:underline">
              {t.book} →
            </Link>
          </div>
        </div>
      </Page>
      <SiteFooter />
    </div>
  );
}
