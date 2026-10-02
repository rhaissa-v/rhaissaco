import { availability, bookingOfferingById } from "@/content/booking";
import { createCalendarEvent, retrieveCheckoutSession } from "./booking.server";

export type BookingRow = {
  id: string;
  offering_id: string;
  offering_name: string;
  starts_at: string;
  ends_at: string;
  guest_name: string;
  guest_email: string;
  guest_notes: string | null;
  locale: string;
  status: string;
  stripe_session_id: string | null;
  google_event_id: string | null;
  google_meet_url: string | null;
};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function expireStaleHolds() {
  const db = await admin();
  await db
    .from("bookings")
    .update({ status: "expired" })
    .eq("status", "hold")
    .lt("hold_expires_at", new Date().toISOString());
}

export async function reservedSlots(timeMin: string, timeMax: string) {
  const db = await admin();
  const { data, error } = await db
    .from("bookings")
    .select("starts_at, ends_at")
    .in("status", ["hold", "paid"])
    .gte("starts_at", timeMin)
    .lte("starts_at", timeMax);
  if (error) throw error;
  return (data ?? []).map((row) => ({ start: row.starts_at, end: row.ends_at }));
}

/** Marks a booking paid and creates the Google Calendar event. Idempotent. */
export async function finalizeBooking(bookingId: string, paymentIntent?: string | null) {
  const db = await admin();
  const { data: booking, error } = await db
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .maybeSingle();
  if (error) throw error;
  if (!booking) return null;

  const row = booking as unknown as BookingRow;
  if (row.google_event_id) return row;

  const offering = bookingOfferingById(row.offering_id);
  const extra =
    offering && offering.sessions > 1
      ? `\n\nThis package includes ${offering.sessions} calls — we'll schedule the remaining ones together on this first call.` +
        `\nEste pacote inclui ${offering.sessions} encontros — combinamos os demais juntos nesta primeira sessão.`
      : "";

  const confirmation =
    "Payment confirmed — your session is booked. Please accept this invite to confirm your attendance. Google Meet link is in this event.\n" +
    "Pagamento confirmado — sua sessão está agendada. Por favor, confirme sua presença neste convite. O link do Google Meet está neste evento.";

  const notes = row.guest_notes ? `\n\n${row.guest_notes}` : "";

  const event = await createCalendarEvent({
    summary: `${row.offering_name} — Rhaissa & ${row.guest_name}`,
    description: `${confirmation}\n\nBooked on rhaissa.co / Agendado em rhaissa.co.${notes}${extra}`.trim(),

    startsAt: row.starts_at,
    endsAt: row.ends_at,
    guestEmail: row.guest_email,
    timeZone: availability.timeZone,
  });

  const { data: updated, error: updateError } = await db
    .from("bookings")
    .update({
      status: "paid",
      stripe_payment_intent: paymentIntent ?? null,
      google_event_id: event.id,
      google_meet_url: event.meetUrl,
    })
    .eq("id", bookingId)
    .select("*")
    .maybeSingle();
  if (updateError) throw updateError;
  const finalRow = (updated as unknown as BookingRow) ?? row;

  const { notifyPaidBooking } = await import("./booking-notify.server");
  await notifyPaidBooking({
    id: finalRow.id,
    offering_id: finalRow.offering_id,
    offering_name: finalRow.offering_name,
    starts_at: finalRow.starts_at,
    ends_at: finalRow.ends_at,
    guest_name: finalRow.guest_name,
    guest_email: finalRow.guest_email,
    guest_notes: finalRow.guest_notes,
    locale: finalRow.locale,
    google_meet_url: finalRow.google_meet_url ?? event.meetUrl ?? null,
  });

  return finalRow;
}

/** Fallback path used by the success page when the webhook hasn't landed yet. */
export async function finalizeFromCheckoutSession(sessionId: string) {
  const session = await retrieveCheckoutSession(sessionId);
  const bookingId = session.metadata?.booking_id;
  if (!bookingId) return null;
  if (session.payment_status !== "paid") {
    const db = await admin();
    const { data } = await db.from("bookings").select("*").eq("id", bookingId).maybeSingle();
    return (data as unknown as BookingRow) ?? null;
  }
  return finalizeBooking(
    bookingId,
    typeof session.payment_intent === "string" ? session.payment_intent : null,
  );
}
