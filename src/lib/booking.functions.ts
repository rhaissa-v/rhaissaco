import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const getAvailability = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ offeringId: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { availability, bookingOfferingById } = await import("@/content/booking");
    const { generateCandidateSlots, overlaps } = await import("@/lib/slots");
    const { fetchBusyIntervals } = await import("@/lib/booking.server");
    const { expireStaleHolds, reservedSlots } = await import("@/lib/bookings.server");

    const offering = bookingOfferingById(data.offeringId);
    if (!offering) throw new Error("Unknown offering");

    const candidates = generateCandidateSlots(offering.durationMinutes);
    if (candidates.length === 0) return { slots: [], timeZone: availability.timeZone };

    const timeMin = candidates[0]!.startsAt;
    const timeMax = candidates[candidates.length - 1]!.endsAt;

    await expireStaleHolds();
    const [busy, reserved] = await Promise.all([
      fetchBusyIntervals(timeMin, timeMax),
      reservedSlots(timeMin, timeMax),
    ]);
    const blocked = [...busy, ...reserved];

    const slots = candidates
      .filter((slot) => !blocked.some((b) => overlaps(slot, b)))
      .slice(0, 120);

    return { slots, timeZone: availability.timeZone };
  });

export const getFxRate = createServerFn({ method: "GET" }).handler(async () => {
  const { getUsdToBrlRate } = await import("@/lib/fx.server");
  return getUsdToBrlRate();
});

export const startBooking = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        offeringId: z.string().min(1),
        startsAt: z.string().min(10),
        name: z.string().min(2).max(120),
        email: z.string().email().max(200),
        notes: z.string().min(3).max(1000),
        locale: z.enum(["en", "pt"]).default("en"),
        currency: z.enum(["usd", "brl"]).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { bookingOfferingById, availability } = await import("@/content/booking");
    const { generateCandidateSlots, overlaps } = await import("@/lib/slots");
    const { fetchBusyIntervals, createCheckoutSession } = await import("@/lib/booking.server");
    const { expireStaleHolds, reservedSlots } = await import("@/lib/bookings.server");
    const { offerings } = await import("@/content/site");

    const offering = bookingOfferingById(data.offeringId);
    if (!offering) throw new Error("Unknown offering");
    const offeringName = offerings[offering.index]?.name ?? data.offeringId;

    // Prices are authored in USD; BRL is converted from the USD amount at the live rate.
    const baseCurrency = offering.currency ?? "usd";
    let currency: "usd" | "brl" = baseCurrency;
    let amountCents = offering.amountCents;
    if (baseCurrency === "usd" && data.currency === "brl") {
      const { getUsdToBrlRate, usdCentsToBrlCents } = await import("@/lib/fx.server");
      const { rate } = await getUsdToBrlRate();
      currency = "brl";
      amountCents = usdCentsToBrlCents(offering.amountCents, rate);
    }

    const candidates = generateCandidateSlots(offering.durationMinutes);
    const slot = candidates.find((s) => s.startsAt === data.startsAt);
    if (!slot) throw new Error("That time is no longer available");

    await expireStaleHolds();
    const [busy, reserved] = await Promise.all([
      fetchBusyIntervals(slot.startsAt, slot.endsAt),
      reservedSlots(slot.startsAt, slot.endsAt),
    ]);
    if ([...busy, ...reserved].some((b) => overlaps(slot, b))) {
      throw new Error("That time was just taken — please pick another slot");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const holdExpiresAt = new Date(Date.now() + availability.holdMinutes * 60_000).toISOString();
    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        offering_id: offering.id,
        offering_name: offeringName,
        amount_cents: amountCents,
        currency,
        starts_at: slot.startsAt,
        ends_at: slot.endsAt,
        guest_name: data.name,
        guest_email: data.email,
        guest_notes: data.notes ?? null,
        locale: data.locale,
        status: "hold",
        hold_expires_at: holdExpiresAt,
      })
      .select("id")
      .single();
    if (error || !booking) throw new Error("That time was just taken — please pick another slot");

    const origin = new URL(getRequest().url).origin;
    const checkout = await createCheckoutSession({
      bookingId: booking.id,
      offeringName,
      amountCents,
      currency,
      guestEmail: data.email,
      description: `${new Date(slot.startsAt).toISOString()} · ${availability.timeZone}`,
      successUrl: `${origin}/booked?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/book?offering=${offering.id}`,
    });

    await supabaseAdmin
      .from("bookings")
      .update({ stripe_session_id: checkout.id })
      .eq("id", booking.id);

    return { checkoutUrl: checkout.url, holdExpiresAt };
  });

export const confirmBooking = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ sessionId: z.string().min(5) }).parse(input))
  .handler(async ({ data }) => {
    const { finalizeFromCheckoutSession } = await import("@/lib/bookings.server");
    const booking = await finalizeFromCheckoutSession(data.sessionId);
    if (!booking) return { found: false as const };
    return {
      found: true as const,
      status: booking.status,
      offeringName: booking.offering_name,
      startsAt: booking.starts_at,
      guestName: booking.guest_name,
      meetUrl: booking.google_meet_url,
    };
  });
