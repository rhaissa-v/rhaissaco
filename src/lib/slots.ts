import { availability } from "@/content/booking";

export type Slot = { startsAt: string; endsAt: string };

function isoWeekday(date: Date): number {
  const day = date.getUTCDay();
  return day === 0 ? 7 : day;
}

/** Candidate slots in the availability window, as UTC ISO strings. */
export function generateCandidateSlots(durationMinutes: number, now = new Date()): Slot[] {
  const { utcOffsetHours, weekdays, startTimes, startTimesByWeekday, daysAhead, minNoticeHours } =
    availability;
  const slots: Slot[] = [];
  const earliest = now.getTime() + minNoticeHours * 3600_000;

  for (let dayOffset = 0; dayOffset < daysAhead; dayOffset += 1) {
    // Local (São Paulo) calendar day derived from the fixed offset.
    const local = new Date(now.getTime() + utcOffsetHours * 3600_000 + dayOffset * 86_400_000);
    const weekday = isoWeekday(local);
    if (!weekdays.includes(weekday)) continue;

    for (const time of startTimesByWeekday[weekday] ?? startTimes) {
      const [h, m] = time.split(":").map(Number) as [number, number];
      const startUtcMs = Date.UTC(
        local.getUTCFullYear(),
        local.getUTCMonth(),
        local.getUTCDate(),
        h - utcOffsetHours,
        m,
      );
      if (startUtcMs < earliest) continue;
      slots.push({
        startsAt: new Date(startUtcMs).toISOString(),
        endsAt: new Date(startUtcMs + durationMinutes * 60_000).toISOString(),
      });
    }
  }
  return slots;
}

export function overlaps(a: Slot, b: { start: string; end: string }): boolean {
  return (
    new Date(a.startsAt).getTime() < new Date(b.end).getTime() &&
    new Date(b.start).getTime() < new Date(a.endsAt).getTime()
  );
}
