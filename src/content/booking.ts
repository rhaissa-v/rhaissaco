/** Booking configuration shared by the site and the server. */

export type BookingOffering = {
  id: string;
  /** Index in the offerings array of src/content/site.ts (and site.pt.ts). */
  index: number;
  /** Minutes for the single call that gets scheduled now. */
  durationMinutes: number;
  amountCents: number;
  /** ISO currency code for Stripe Checkout (defaults to usd). */
  currency?: "usd" | "brl";
  /** Number of calls included (extra calls are scheduled after the first one). */
  sessions: number;
  /** Hidden from public menus; reachable only by direct URL. */
  hidden?: boolean;
};

export const bookingOfferings: BookingOffering[] = [
  { id: "general-mentorship", index: 0, durationMinutes: 60, amountCents: 3500, sessions: 1 },
  { id: "product-strategy", index: 1, durationMinutes: 60, amountCents: 3500, sessions: 1 },
  { id: "leadership-sessions", index: 2, durationMinutes: 60, amountCents: 9000, sessions: 3 },
  { id: "test-1usd", index: 3, durationMinutes: 60, amountCents: 500, currency: "brl", sessions: 1, hidden: true },
];

export function bookingOfferingById(id: string): BookingOffering | undefined {
  return bookingOfferings.find((o) => o.id === id);
}

/** Availability window, in São Paulo local time (UTC-3, no DST). */
export const availability = {
  timeZone: "America/Sao_Paulo",
  utcOffsetHours: -3,
  /** 1 = Monday … 7 = Sunday */
  weekdays: [1, 2, 4],
  /** Exact local start times offered (São Paulo). */
  startTimes: ["18:00"] as const,
  /** Per-weekday overrides of the local start times. */
  startTimesByWeekday: {
    1: ["18:00"],
    2: ["18:00"],
    4: ["18:00"],
  } as Record<number, string[]>,

  /** How many days ahead to offer. */
  daysAhead: 15,
  /** Minimum notice before a slot can be booked. */
  minNoticeHours: 24,
  holdMinutes: 15,
};
