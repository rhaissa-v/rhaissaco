import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useI18n, type Lang } from "@/content/i18n";
import logoR from "@/assets/logo-r-square-serif-ink.png";

function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const options: { value: Lang; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "pt", label: "PT" },
  ];

  return (
    <div
      className={`inline-flex items-center rounded-full border border-border bg-card p-0.5 ${className}`}
      role="group"
      aria-label="Language / Idioma"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLang(o.value)}
          aria-pressed={lang === o.value}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            lang === o.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const sectionNav = [
    { hash: "work", label: t.nav.work },
    { hash: "services", label: t.nav.services },
    { hash: "reviews", label: t.nav.reviews },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logoR}
            alt="Rhaissa V."
            className="h-8 w-8 rounded-md object-contain"
          />
          <span className="hidden font-display text-sm font-semibold tracking-tight sm:inline">
            Rhaissa V.
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {sectionNav.map((item) => (
            <Link
              key={item.hash}
              to="/"
              hash={item.hash}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.growthmentor.com/mentors/rhaissa-v"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {t.nav.partnership}
          </a>
          <a
            href="https://www.linkedin.com/in/rhaissavitor/"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            LinkedIn
          </a>
          <LangToggle className="ml-2" />
          <Link
            to="/partner"
            className="ml-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t.nav.book}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LangToggle />
          <button
            type="button"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-background px-5 pb-4 lg:hidden">
          {sectionNav.map((item) => (
            <Link
              key={item.hash}
              to="/"
              hash={item.hash}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-sm text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.growthmentor.com/mentors/rhaissa-v"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="block border-b border-border/60 py-3 text-sm text-muted-foreground"
          >
            {t.nav.partnership}
          </a>
          <a
            href="https://www.linkedin.com/in/rhaissavitor/"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="block border-b border-border/60 py-3 text-sm text-muted-foreground"
          >
            LinkedIn
          </a>
          <Link
            to="/partner"
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
          >
            {t.nav.book}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-muted-foreground">{t.footer.location}</p>
        <div className="flex flex-wrap items-center gap-5 text-sm">
          <a
            href="https://www.growthmentor.com/mentors/rhaissa-v"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.nav.partnership}
          </a>
          <a
            href="https://www.linkedin.com/in/rhaissavitor/"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <Link
            to="/book"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.nav.book}
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function Page({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-5xl">{title}</h1>
      {lead ? <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{lead}</p> : null}
      <div className="rule-spectrum mt-8 h-px w-full opacity-70" />
      <div className="mt-12">{children}</div>
    </main>
  );
}
