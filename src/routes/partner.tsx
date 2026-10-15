import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Check, ExternalLink } from "lucide-react";
import { Page, SiteFooter, SiteHeader } from "@/components/site/Layout";
import { PartnershipCard } from "@/components/site/PartnershipCard";

import { bookingOfferings } from "@/content/booking";
import { useI18n } from "@/content/i18n";
import previewAsset from "@/assets/rhaissa-preview-serif.png.asset.json";

const previewImage = `https://rhaissa.co${previewAsset.url}?v=20260904-1`;

const title = "Mentoring sessions & pricing — Rhaissa V.";
const description =
  "1:1 general mentoring, product strategy, and leadership sessions — formats, methods, and pricing, in English or Portuguese.";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://rhaissa.co/partner" },
      { property: "og:image", content: previewImage },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1376" },
      { property: "og:image:height", content: "768" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: previewImage },
    ],
    links: [{ rel: "canonical", href: "https://rhaissa.co/partner" }],
  }),
  component: Partner,
});

const accent: Record<string, string> = {
  primary: "text-primary",
  violet: "text-violet",
  teal: "text-teal",
};

function Partner() {
  const { t, c } = useI18n();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Page eyebrow={t.partner.eyebrow} title={t.partner.title} lead={t.partner.lead}>
        <div>
          {c.offerings
            .filter((o) => !o.hidden)
            .map((o, i) => (
              <div
                key={o.name}
                id={bookingOfferings[i]?.id ?? `offer-${i}`}
                className="editorial-offer-row scroll-mt-24"
              >
                <div className="editorial-offer-head">
                  <div className="editorial-offer-copy">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <p className={`eyebrow ${accent[o.accent]}`}>{o.duration}</p>
                      {o.featured ? (
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                          {t.partner.mostRequested}
                        </span>
                      ) : null}
                    </div>
                    <h2>{o.name}</h2>
                  </div>
                  <div
                    className={`editorial-offer-action${
                      bookingOfferings[i]?.paused ? " editorial-offer-action--stacked" : ""
                    }`}
                  >
                    <div className="editorial-offer-price">
                      {bookingOfferings[i]?.paused ? (
                        <p className="font-display text-3xl font-semibold whitespace-nowrap">
                          {o.price}
                          {o.compareAtPrice ? (
                            <span className="ml-3 text-base font-medium text-muted-foreground line-through">
                              {o.compareAtPrice}
                            </span>
                          ) : null}
                          {o.discountLabel ? (
                            <span className="ml-2 text-xs font-semibold text-primary">{o.discountLabel}</span>
                          ) : null}
                        </p>
                      ) : (
                        <>
                          <p className="font-display text-3xl font-semibold whitespace-nowrap">{o.price}</p>
                          {o.compareAtPrice || o.discountLabel ? (
                            <div className="editorial-offer-note mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                              {o.compareAtPrice ? (
                                <span className="text-sm font-medium text-muted-foreground line-through">
                                  {o.compareAtPrice}
                                </span>
                              ) : null}
                              {o.discountLabel ? (
                                <span className="text-xs font-semibold text-primary">{o.discountLabel}</span>
                              ) : null}
                            </div>
                          ) : null}
                        </>
                      )}
                      {bookingOfferings[i]?.paused ? (
                        <p className="mt-2 text-xs text-muted-foreground">{t.partnership.unavailableNote}</p>
                      ) : null}
                    </div>
                    {bookingOfferings[i]?.paused ? (
                      <div className="editorial-offer-cta">
                        <button type="button" disabled aria-disabled="true" className="inline-flex cursor-not-allowed select-none items-center justify-center gap-2 rounded-md border border-border bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
                          <CalendarDays className="h-4 w-4" /> {t.partnership.unavailable}
                        </button>
                      </div>
                    ) : (
                      <div className="editorial-offer-cta">
                        <Link
                          to="/book"
                          search={{ offering: bookingOfferings[i]?.id }}
                          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          <CalendarDays className="h-4 w-4" /> {t.partner.bookTime}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <p className="editorial-offer-summary">{o.summary}</p>
                <div className="editorial-offer-body">
                  {o.includes?.length ? (
                    <ul className="space-y-1.5">
                      {o.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {o.details?.length ? (
                    <dl className="space-y-3">
                      {o.details.map((d) => (
                        <div key={d.label}>
                          <dt className="eyebrow font-bold text-foreground">{d.label}</dt>
                          <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.body}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  {o.footnote ? (
                    <p className="text-xs italic leading-relaxed text-muted-foreground md:col-span-2">{o.footnote}</p>
                  ) : null}
                </div>
              </div>
            ))}
          <PartnershipCard />
        </div>



        <div className="mt-20">
          <p className="eyebrow">{t.partner.processEyebrow}</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{t.partner.processTitle}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {c.partnerSteps.map((s) => (
              <div key={s.step} className="card-soft p-7">
                <p className="font-display text-3xl font-semibold text-spectrum">{s.step}</p>
                <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground/70">
            {t.legal.notice}
          </p>
        </div>

        <div className="surface-ink mt-20 rounded-2xl px-8 py-12 sm:px-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">{t.partner.talkTitle}</h2>
          <p className="mt-3 max-w-xl text-base">{t.partner.talkBody}</p>
          <a
            href="https://www.linkedin.com/in/rhaissavitor/"
            target="_blank"
            rel="noreferrer"
            aria-label={`${t.partner.talkCta} — ${t.partner.newTab}`}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-background px-5 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-foreground/60"
          >
            {t.partner.talkCta} <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Page>
      <SiteFooter />
    </div>
  );
}
