import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Page, SiteFooter, SiteHeader } from "@/components/site/Layout";
import { useI18n } from "@/content/i18n";
import { submitPartnershipRequest } from "@/lib/partnership.functions";
import previewAsset from "@/assets/rhaissa-preview-serif.png.asset.json";

const previewImage = `https://rhaissa.co${previewAsset.url}?v=20260904-1`;

const title = "Long-term consultancy — Rhaissa V.";
const description =
  "Hands-on consultancy for companies and founders, connecting business and product strategy, stronger decisions, and execution.";

export const Route = createFileRoute("/partnership")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://rhaissa.co/partnership" },
      { property: "og:image", content: previewImage },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: previewImage },
    ],
    links: [{ rel: "canonical", href: "https://rhaissa.co/partnership" }],
  }),
  component: Partnership,
});

function Partnership() {
  const { t, lang } = useI18n();
  const p = t.partnership;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submitFn = useServerFn(submitPartnershipRequest);
  const mutation = useMutation({
    mutationFn: () =>
      submitFn({
        data: {
          fullName: fullName.trim(),
          email: email.trim(),
          message: message.trim(),
          locale: lang,
        },
      }),
    onSuccess: () => {
      setFullName("");
      setEmail("");
      setMessage("");
      toast.success(p.successTitle, { description: p.successBody });
    },
    onError: () => toast.error(p.errorTitle, { description: p.errorBody }),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (
      fullName.trim().length < 2 ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) ||
      message.trim().length < 10
    ) {
      setError(p.formNote);
      return;
    }
    mutation.mutate();
  }

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Page eyebrow={p.pageEyebrow} title={p.pageTitle} lead={p.summary}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
          <div>
            <p className="eyebrow text-violet">{p.duration}</p>
            <h2 className="mt-3 text-xl font-semibold">{p.includesTitle}</h2>
            <ul className="mt-6 space-y-3">
              {p.includes.map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
                  <span className="text-muted-foreground">{i}</span>
                </li>
              ))}
            </ul>
            <div className="card-soft mt-8 p-6">
              <p className="font-display text-2xl font-semibold">{p.priceLabel}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.priceNote}</p>
              {p.equityNote ? (
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">{p.equityNote}</p>
              ) : null}
            </div>
          </div>

          <form onSubmit={submit} className="card-soft h-fit p-7">
            <p className="eyebrow text-primary">{p.formTitle}</p>
            <h2 className="mt-2 text-lg font-semibold">{p.priceLabel}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.formLead}</p>

            <div className="mt-6 space-y-3">
              <p className="eyebrow">{p.yourDetails}</p>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={p.fieldName}
                className={inputClass}
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={p.fieldEmail}
                className={inputClass}
              />
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={p.fieldMessage}
                className={inputClass}
              />
            </div>

            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {p.sending}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> {p.cta}
                </>
              )}
            </button>
            <p className="mt-3 text-xs text-muted-foreground">{p.formNote}</p>
          </form>
        </div>
      </Page>
      <SiteFooter />
    </div>
  );
}
