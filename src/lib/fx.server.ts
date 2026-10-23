/** Server-only: live USD → BRL rate with in-memory cache and safe fallback. */

const FALLBACK_USD_BRL = 5.4;
const TTL_MS = 6 * 60 * 60 * 1000;

let cache: { rate: number; fetchedAt: number } | null = null;

export async function getUsdToBrlRate(): Promise<{ rate: number; live: boolean }> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) {
    return { rate: cache.rate, live: true };
  }
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (res.ok) {
      const data = (await res.json()) as { rates?: Record<string, number> };
      const rate = data.rates?.["BRL"];
      if (typeof rate === "number" && rate > 1 && rate < 50) {
        cache = { rate, fetchedAt: Date.now() };
        return { rate, live: true };
      }
    }
  } catch (err) {
    console.error("USD→BRL rate lookup failed", err);
  }
  return { rate: cache?.rate ?? FALLBACK_USD_BRL, live: false };
}

/** Converts USD cents to BRL cents, rounded up to a whole real. */
export function usdCentsToBrlCents(usdCents: number, rate: number): number {
  return Math.ceil((usdCents * rate) / 100) * 100;
}
