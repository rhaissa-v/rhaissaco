import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Send } from "lucide-react";
import { toast } from "sonner";
import { Page, SiteFooter, SiteHeader } from "@/components/site/Layout";
import { useI18n } from "@/content/i18n";
import { submitPartnershipRequest } from "@/lib/partnership.functions";
import { isEmail } from "@/lib/utils";
import previewAsset from "@/assets/rhaissa-preview-serif.png.asset.json";

const previewImage = `https://rhaissa.co${previewAsset.url}?v=20260904-1`;

const title = "Advisory — Rhaissa V.";
const description =
  "Advisory for companies and founders, connecting business and product strategy, stronger decisions, and execution.";

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
  const [company, setCompany] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submitFn = useServerFn(submitPartnershipRequest);
  const mutation = useMutation({
    mutationFn: () =>
      submitFn({
        data: {
          fullName: fullName.trim(),
          email: email.trim(),
          company: company.trim(),
          linkedin: linkedin.trim() || undefined,
          message: message.trim(),
          locale: lang,
        },
      }),
    onSuccess: () => {
      setFullName("");
      setEmail("");
      setCompany("");
      setLinkedin("");
      setMessage("");
      toast.success(p.successTitle, { description: p.successBody });
    },
    onError: () => toast.error(p.errorTitle, { description: p.errorBody }),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isEmail(email.trim())) {
      setError(p.invalidEmail);
      return;
    }
    if (
      fullName.trim().length < 2 ||
      company.trim().length < 2 ||
      message.trim().length < 10
    ) {
      setError(p.formNote);
      return;
    }
    return;
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
              {p.priceNote ? <p className="mt-1 text-sm text-muted-foreground">{p.priceNote}</p> : null}
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
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={p.fieldEmail}
                aria-invalid={email.length > 0 && !isEmail(email)}
                className={inputClass}
              />
              {email.length > 0 && !isEmail(email) ? (
                <p className="text-xs text-destructive">{p.invalidEmail}</p>
              ) : null}
              <input
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={p.fieldCompany}
                className={inputClass}
              />
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder={p.fieldLinkedin}
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
              disabled
              aria-disabled="true"
              className="mt-6 inline-flex w-full cursor-not-allowed select-none items-center justify-center gap-2 rounded-md border border-border bg-muted px-4 py-3 text-sm font-medium text-muted-foreground"
            >
              <Send className="h-4 w-4" /> {p.unavailable}
            </button>
            <p className="mt-3 text-xs text-muted-foreground">{p.unavailableNote}</p>
            <p className="mt-4 border-t border-border/60 pt-4 text-xs leading-relaxed text-muted-foreground/70">
              {t.legal.notice}
            </p>
          </form>
        </div>
      </Page>
      <SiteFooter />
    </div>
  );
}
