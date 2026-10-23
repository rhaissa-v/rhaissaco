import { Send } from "lucide-react";
import { useI18n } from "@/content/i18n";

export function PartnershipCard() {
  const { t } = useI18n();
  const p = t.partnership;

  return (
    <div id="advisory" className="editorial-offer-row scroll-mt-24">
      <div className="editorial-offer-head">
        <div className="editorial-offer-copy">
          <p className="eyebrow text-violet">{p.duration}</p>
          <h3>{p.name}</h3>
        </div>
        <div className="editorial-offer-action editorial-offer-action--stacked">
          <div className="editorial-offer-price">
            <p className="font-display text-3xl font-semibold whitespace-nowrap">{p.priceLabel}</p>
            <p className="mt-2 text-xs text-muted-foreground">{p.unavailableNote}</p>
          </div>
          <div className="editorial-offer-cta">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex cursor-not-allowed select-none items-center justify-center gap-2 rounded-md border border-border bg-muted px-4 py-3 text-sm font-medium text-muted-foreground"
            >
              <Send className="h-4 w-4" /> {p.unavailable}
            </button>
          </div>
        </div>
      </div>
      <p className="editorial-offer-summary">{p.summary}</p>
    </div>
  );
}
