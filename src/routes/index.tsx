import type { CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Star } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site/Layout";
import { PartnershipCard } from "@/components/site/PartnershipCard";
import { WorkCard } from "@/components/site/WorkCard";

import previewAsset from "@/assets/rhaissa-preview-serif.png.asset.json";
import lalaLogo from "@/assets/lala-logo-ink.svg";
import mdpLogo from "@/assets/logo-mdp-ink.png";
import { bookingOfferings } from "@/content/booking";
import { useI18n } from "@/content/i18n";

const previewImage = `https://rhaissa.co${previewAsset.url}?v=20260904-1`;

const title = "Rhaissa V. — Lead Product Manager | Fractional Advisor";
const description =
  "Working with product people, founders, and companies through mentoring, focused sessions, and hands-on consultancy.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://rhaissa.co/" },
      { property: "og:image", content: previewImage },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1376" },
      { property: "og:image:height", content: "768" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: previewImage },
    ],
    links: [{ rel: "canonical", href: "https://rhaissa.co/" }],
  }),
  component: Home,
});

/**
 * Scroll window (of the chapter's view timeline) in which each pinned panel is
 * on stage. Chapter runway = (count + 1) viewports, so the stage is pinned
 * while the timeline runs from 1/(count+2) to (count+1)/(count+2); slots are
 * cut evenly inside that window, with a small hand-off overlap.
 */
function pinStyle(index: number, count: number): CSSProperties {
  const start = index === 0 ? 0 : ((index + 1) / (count + 2)) * 100;
  let end = ((index + 2) / (count + 2)) * 100;
  return {
    "--pin-start": `${start}%`,
    "--pin-end": `${end}%`,
  } as CSSProperties;
}

function chapterStyle(count: number): CSSProperties {
  return { "--pin-n": count } as CSSProperties;
}

const accentRing: Record<string, string> = {
  primary: "text-primary",
  violet: "text-violet",
  teal: "text-teal",
};

function Home() {
  const { t, c } = useI18n();
  const offerings = c.offerings.filter((o) => !o.hidden);
  const servicesCount = offerings.length + 2; // intro + offerings + partnership

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="pin-chapter editorial-hero" style={chapterStyle(2)}>
          <div className="pin-stage">
            <div className="editorial-hero-grid" aria-hidden="true" />
            <div className="pin-grid editorial-hero-pin-grid">
              <div className="pin-panel editorial-hero-panel" style={pinStyle(0, 2)}>
                <div className="editorial-hero-inner editorial-hero-inner--stage">
                  <div className="editorial-hero-stage">
                    <div className="editorial-hero-copy">
                      <h1>
                        <span>{t.home.h1a}</span>
                        <em>{t.home.h1b}</em>
                      </h1>
                    </div>
                  </div>
                  <div className="editorial-hero-signature">
                    <p className="eyebrow">{t.home.eyebrow}</p>
                  </div>
                </div>
              </div>

              <div className="pin-panel pin-panel--hold editorial-hero-panel" style={pinStyle(1, 2)}>
                <div className="editorial-hero-inner editorial-hero-inner--intro">
                  <div className="editorial-hero-footer">
                    <div className="editorial-hero-intro-copy">
                      <p className="eyebrow">{t.home.leadWith}</p>
                      <p className="editorial-hero-intro-lead">{c.bio}</p>
                      <p className="editorial-hero-intro-body">{t.home.intro}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a href="#work" className="editorial-action editorial-action-outline">
                        {t.home.ctaBook}
                      </a>
                      <a href="#services" className="editorial-action editorial-action-solid">
                        {t.home.ctaViewServices} <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Chapter: By the numbers ============ */}
        <section className="editorial-metrics py-16 md:py-24" aria-labelledby="metrics-title">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <p id="metrics-title" className="eyebrow">{t.home.metricsEyebrow}</p>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4">
              {c.metrics.map((m, i) => (
                <div key={m.label} className="editorial-metric">
                  <p className="metric-value font-display text-3xl font-normal whitespace-nowrap sm:text-4xl md:text-5xl">{m.value}</p>
                  <p className="editorial-metric-label mt-4 text-xs leading-snug sm:text-sm">{m.label}</p>
                  {i === 3 && <div className="mt-1.5 flex gap-0.5 text-teal">{Array.from({ length: 5 }).map((_, si) => <Star key={si} className={`h-3 w-3 ${si < 4 ? "fill-current" : "fill-current opacity-30"}`} />)}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ Chapter: Recognition & speaking ============ */}
        <section className="pin-chapter recognition-chapter" style={chapterStyle(2)}>
          <div className="pin-stage">
            <div className="pin-grid mx-auto w-full max-w-7xl px-5 sm:px-8">
              <div className="pin-panel" style={pinStyle(0, 2)}>
                <a
                  href={c.festival.url}
                  target="_blank"
                  rel="noreferrer"
                  className="recognition-editorial group mx-auto grid w-full max-w-7xl sm:grid-cols-[minmax(0,1fr)_15rem]"
                >
                  <div className="py-10 sm:py-16 sm:pr-12">
                    <p className="eyebrow">
                      {t.home.speakingEyebrow} · {c.festival.date}
                    </p>
                    <p className="mt-5 max-w-2xl font-display text-3xl font-normal sm:text-5xl">{c.festival.title}</p>
                    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{c.festival.body}</p>
                    <span className="mt-7 inline-block text-sm font-medium text-primary group-hover:underline">
                      {t.home.seeEvent}
                    </span>
                  </div>
                  <div className="flex min-h-40 items-center justify-center border-t border-border py-10 sm:min-h-full sm:border-t-0 sm:border-l sm:pl-10">
                    <img
                      src={mdpLogo}
                      alt={c.festival.org}
                      className="h-auto w-full max-w-40 object-contain"
                      loading="lazy"
                    />
                  </div>
                </a>
              </div>
              <div className="pin-panel pin-panel--hold" style={pinStyle(1, 2)}>
                <a
                  href={c.recognition.url}
                  target="_blank"
                  rel="noreferrer"
                  className="recognition-editorial group mx-auto grid w-full max-w-7xl border-t border-border sm:grid-cols-[minmax(0,1fr)_15rem]"
                >
                  <div className="py-10 sm:py-16 sm:pr-12">
                    <p className="eyebrow">
                      {t.home.recognitionEyebrow} · {c.recognition.date}
                    </p>
                    <p className="mt-5 max-w-2xl font-display text-3xl font-normal sm:text-5xl">{c.recognition.title}</p>
                    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{c.recognition.body}</p>
                    <span className="mt-7 inline-block text-sm font-medium text-primary group-hover:underline">
                      {t.home.seeLinkedIn}
                    </span>
                  </div>
                  <div className="flex min-h-40 items-center justify-center border-t border-border py-10 sm:min-h-full sm:border-t-0 sm:border-l sm:pl-10">
                    <img
                      src={lalaLogo}
                      alt={c.recognition.org}
                      className="h-auto w-full max-w-32 object-contain"
                      loading="lazy"
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Chapter: Selected work ============ */}
        <section id="work" className="pin-chapter work-chapter scroll-mt-24" style={chapterStyle(7)}>
          <div className="pin-stage">
            <div className="pin-grid mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-5 sm:px-8">
              <div className="pin-panel col-span-full" style={pinStyle(0, 7)}>
                <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center">
                  <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <p className="eyebrow">{t.home.workEyebrow}</p>
                      <h2 className="editorial-section-title mt-5">{t.home.workTitle}</h2>
                      <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">{t.home.workSubtitle}</p>
                    </div>
                    <a
                      href="https://www.linkedin.com/in/rhaissavitor/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t.home.workLinkedIn}
                    </a>
                  </div>
                </div>
              </div>
              {c.caseStudies.map((cs, index) => {
                const panel = index + 1;
                return (
                  <div
                    key={cs.title}
                    className={`pin-panel${panel === 6 ? " pin-panel--hold" : ""}`}
                    style={pinStyle(panel, 7)}
                  >
                     <div className="mx-auto flex h-full w-full max-w-7xl items-center">
                      <WorkCard
                        caseStudy={cs}
                        index={index}
                        revealLabel={t.home.workReveal}
                        returnLabel={t.home.workReturn}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ Chapter: Services ============ */}
        <section id="services" className="pin-chapter mt-24 scroll-mt-24" style={chapterStyle(servicesCount)}>
          <div className="pin-stage">
            <div className="pin-grid mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-5 sm:px-8">
              <div className="pin-panel col-span-full" style={pinStyle(0, servicesCount)}>
                <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center">
                  <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <p className="eyebrow">{t.home.offeringsEyebrow}</p>
                      <h2 className="editorial-section-title mt-5">{t.home.offeringsTitle}</h2>
                    </div>
                    <Link to="/partner" className="text-sm font-medium text-primary hover:underline">
                      {t.home.fullDetails}
                    </Link>
                  </div>
                </div>
              </div>
              {offerings.map((o, i) => {
                const panel = i + 1;
                return (
                  <div key={o.name} className="pin-panel" style={pinStyle(panel, servicesCount)}>
                    <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center">
                      <div className="editorial-offer-row">
                        <div className="editorial-offer-copy">
                          <p className={`eyebrow ${accentRing[o.accent]}`}>{o.duration}</p>
                          <h3>{o.name}</h3>
                          <p>{o.summary}</p>
                        </div>
                        <div className="editorial-offer-action">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <p className="font-display text-2xl font-semibold">{o.price}</p>
                          {o.compareAtPrice ? (
                            <span className="text-sm font-medium text-muted-foreground line-through">
                              {o.compareAtPrice}
                            </span>
                          ) : null}
                          {o.discountLabel ? (
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-primary">
                              {o.discountLabel}
                            </span>
                          ) : null}
                          </div>
                          <Link
                            to="/book"
                            search={{ offering: bookingOfferings[i]?.id }}
                            className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                          >
                            <CalendarDays className="h-4 w-4" /> {t.partner.bookTime}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="pin-panel pin-panel--hold" style={pinStyle(servicesCount - 1, servicesCount)}>
                <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center">
                  <PartnershipCard />
                  <p className="mt-6 text-center text-xs text-muted-foreground">{t.partner.confirmNote}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Chapter: Reviews ============ */}
        <section id="reviews" className="scroll-chapter mx-auto mt-24 max-w-7xl scroll-mt-24 px-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <p className="eyebrow">{t.home.menteesEyebrow}</p>
                      <h2 className="mt-3 text-2xl font-semibold sm:text-4xl">{t.home.menteesTitle}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href="https://www.growthmentor.com/mentors/rhaissa-v"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {t.home.growthmentorLink}
                      </a>
                      <span className="hidden text-muted-foreground sm:inline">·</span>
                      <a
                        href="https://adplist.org/mentors/rhaissa-v"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {t.home.adplistLink}
                      </a>
                    </div>
          </div>
          <div className="mt-10 divide-y divide-border border-y border-border">
              {c.testimonials.map((tm) => (
                    <figure key={tm.quote} className="pin-quote grid gap-5 py-8 md:grid-cols-[1fr_auto] md:items-end md:py-12">
                      <div>
                      <div className="flex gap-1 text-primary">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <blockquote className="mt-4 max-w-4xl font-display text-xl leading-relaxed text-foreground sm:text-2xl">
                        “{tm.quote}”
                      </blockquote>
                      </div>
                      <figcaption className="mt-5 text-xs">
                        <span className="font-semibold">{tm.name}</span>
                        <span className="text-muted-foreground"> · {tm.context}</span>
                      </figcaption>
                    </figure>
              ))}
          </div>
        </section>

        <section className="scroll-chapter mx-auto mt-24 max-w-7xl px-5 sm:px-8">
          <div className="surface-ink rounded-2xl px-8 py-12 sm:px-12">
            <h2 className="max-w-2xl text-2xl font-semibold sm:text-4xl">{t.home.ctaTitle}</h2>
            <p className="mt-4 max-w-xl text-base">{t.home.ctaBody}</p>
            <Link
              to="/partner"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-background px-5 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-foreground/60"
            >
              {t.home.ctaStart} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
