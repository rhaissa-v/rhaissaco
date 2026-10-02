import { availability, bookingOfferingById } from "@/content/booking";


const GMAIL_GATEWAY = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

const b64 = (s: string) =>
  btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const header = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);

function createRawEmail(to: string, replyTo: string, subject: string, body: string) {
  const email = [
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${header(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    body,
  ].join("\r\n");
  return b64(email).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export type PaidBookingNotification = {
  id: string;
  offering_id: string;
  offering_name: string;
  starts_at: string;
  ends_at: string;
  guest_name: string;
  guest_email: string;
  guest_notes: string | null;
  locale: string;
  google_meet_url: string | null;
};

function formatAmount(offeringId: string) {
  const offering = bookingOfferingById(offeringId);
  if (!offering) return "—";
  const currency = (offering.currency ?? "usd").toUpperCase();
  return `${(offering.amountCents / 100).toFixed(2)} ${currency}`;
}

/**
 * Sends an email notification about a paid booking from the connected Gmail
 * account. Never throws — notification failures must not break the booking.
 */
export async function notifyPaidBooking(booking: PaidBookingNotification) {
  try {
    const to = process.env["BOOKING_NOTIFY_EMAIL"];
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const gmailKey = process.env["GOOGLE_MAIL_API_KEY"];

    if (!lovableKey || !gmailKey) {
      console.error("[booking] notification skipped: Gmail is not configured");
      return { emailed: false };
    }

    if (!to) {
      console.error("[booking] notification skipped: BOOKING_NOTIFY_EMAIL is not set");
      return { emailed: false };
    }

    const when = new Date(booking.starts_at).toLocaleString("pt-BR", {
      timeZone: availability.timeZone,
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const raw = createRawEmail(
      to,
      booking.guest_email,
      `New booking paid — ${booking.offering_name} · ${booking.guest_name}`,
      [
        `Offering: ${booking.offering_name} (${booking.offering_id})`,
        `Amount paid: ${formatAmount(booking.offering_id)}`,
        `When: ${when} (${availability.timeZone})`,
        `Guest: ${booking.guest_name} <${booking.guest_email}>`,
        `Language: ${booking.locale}`,
        booking.google_meet_url ? `Google Meet: ${booking.google_meet_url}` : "",
        "",
        booking.guest_notes ? `Notes:\n${booking.guest_notes}` : "No notes provided.",
        "",
        `Booking id: ${booking.id}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );

    const res = await fetch(`${GMAIL_GATEWAY}/users/me/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gmailKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });

    if (!res.ok) {
      console.error(`[booking] Gmail send failed [${res.status}]:`, await res.text());
      return { emailed: false };
    }

    return { emailed: true };
  } catch (error) {
    console.error("[booking] notification failed:", error);
    return { emailed: false };
  }
}
