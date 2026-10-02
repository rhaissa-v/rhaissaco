import { Link } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useI18n } from "@/content/i18n";

export function PartnershipCard() {
  const { t } = useI18n();
  const p = t.partnership;

  return (
    <div className="editorial-offer-row">
      <div className="editorial-offer-copy">
        <p className="eyebrow text-violet">{p.duration}</p>
        <h3>{p.name}</h3>
        <p>{p.summary}</p>
      </div>
      <div className="editorial-offer-action">
        <p className="font-display text-2xl font-semibold">{p.priceLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">{p.priceNote}</p>

        <Link
          to="/partnership"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Send className="h-4 w-4" /> {p.cta}
        </Link>
      </div>
    </div>
  );
}
