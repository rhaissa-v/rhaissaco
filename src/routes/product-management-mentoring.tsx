import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Check } from "lucide-react";
import { Page, SiteFooter, SiteHeader } from "@/components/site/Layout";
import { useI18n } from "@/content/i18n";
import previewAsset from "@/assets/rhaissa-preview-serif.png.asset.json";

const previewImage = `https://rhaissa.co${previewAsset.url}?v=20260904-1`;

const title = "Product Management Mentoring — Rhaissa V.";
const description =
  "1:1 product management mentoring with a Staff PM (ex-iFood, Netflix, Google): discovery, metrics, growth loops, and interview prep.";

export const Route = createFileRoute("/product-management-mentoring")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://rhaissa.co/product-management-mentoring" },
      { property: "og:image", content: previewImage },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1376" },
      { property: "og:image:height", content: "768" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: previewImage },
    ],
    links: [{ rel: "canonical", href: "https://rhaissa.co/product-management-mentoring" }],
  }),
  component: Mentoring,
});

function Mentoring() {
  const { t, c } = useI18n();
  const tc = t.mentoring;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Page eyebrow={tc.eyebrow} title={tc.title} lead={tc.lead}>
        <div className="grid border-y border-border lg:grid-cols-2">
          <div className="py-8 lg:pr-10">
            <h2 className="text-lg font-semibold">{tc.audienceTitle}</h2>
            <ul className="mt-4 space-y-3">
              {tc.audience.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-border py-8 lg:border-t-0 lg:border-l lg:pl-10">
            <h2 className="text-lg font-semibold">{tc.topicsTitle}</h2>
            <ul className="mt-4 space-y-3">
              {tc.topics.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <p className="eyebrow">{t.home.menteesEyebrow}</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{tc.proofTitle}</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {c.testimonials.slice(0, 3).map((t) => (
              <blockquote key={t.name} className="grid gap-5 py-8 md:grid-cols-[1fr_auto] md:items-end">
                <p className="font-display text-xl leading-relaxed">“{t.quote}”</p>
                <footer className="text-sm font-medium">
                  {t.name} <span className="text-muted-foreground">· {t.context}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>

        <div className="surface-ink mt-16 rounded-2xl px-8 py-12 sm:px-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">{tc.ctaTitle}</h2>
          <p className="mt-3 max-w-xl text-base">{tc.ctaBody}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/book"
              search={{ offering: "general-mentorship" }}
              className="inline-flex items-center gap-2 rounded-md bg-background px-5 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-foreground/60"
            >
              <CalendarDays className="h-4 w-4" /> {tc.ctaTitle}
            </Link>
            <Link
              to="/partner"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-foreground/60"
            >
              {t.home.fullDetails} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Page>
      <SiteFooter />
    </div>
  );
}
