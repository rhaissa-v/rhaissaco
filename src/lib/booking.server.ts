/** Server-only helpers: Google Calendar (via connector gateway) + Stripe. */

const GOOGLE_GATEWAY = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";
const STRIPE_API = "https://api.stripe.com/v1";

function googleHeaders() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_CALENDAR_API_KEY"];
  if (!lovableKey || !connectionKey) throw new Error("Google Calendar connection is not configured");
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": connectionKey,
    "content-type": "application/json",
  };
}

async function readError(res: Response, label: string): Promise<never> {
  const body = await res.text();
  console.error(`${label} failed [${res.status}]: ${body}`);
  throw new Error(`${label} failed [${res.status}]: ${body}`);
}

export type BusyInterval = { start: string; end: string };

export async function fetchBusyIntervals(timeMin: string, timeMax: string): Promise<BusyInterval[]> {
  const res = await fetch(`${GOOGLE_GATEWAY}/freeBusy`, {
    method: "POST",
    headers: googleHeaders(),
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: "primary" }] }),
  });
  if (!res.ok) await readError(res, "Google freeBusy");
  const data = (await res.json()) as {
    calendars?: Record<string, { busy?: BusyInterval[]; errors?: unknown }>;
  };
  const calendars = data.calendars ?? {};
  const busy: BusyInterval[] = [];
  for (const entry of Object.values(calendars)) {
    for (const b of entry.busy ?? []) busy.push(b);
  }
  return busy;
}

export async function createCalendarEvent(input: {
  summary: string;
  description: string;
  startsAt: string;
  endsAt: string;
  guestEmail: string;
  timeZone: string;
}): Promise<{ id: string; meetUrl: string | null }> {
  const res = await fetch(
    `${GOOGLE_GATEWAY}/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: "POST",
      headers: googleHeaders(),
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: input.startsAt, timeZone: input.timeZone },
        end: { dateTime: input.endsAt, timeZone: input.timeZone },
        attendees: [{ email: input.guestEmail }],
        conferenceData: {
          createRequest: {
            requestId: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      }),
    },
  );
  if (!res.ok) await readError(res, "Google create event");
  const data = (await res.json()) as {
    id: string;
    hangoutLink?: string;
    conferenceData?: { entryPoints?: { uri?: string; entryPointType?: string }[] };
  };
  const meet =
    data.hangoutLink ??
    data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ??
    null;
  return { id: data.id, meetUrl: meet };
}

function stripeKey() {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return key;
}

async function stripeRequest(path: string, params: Record<string, string>) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey()}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params).toString(),
  });
  if (!res.ok) await readError(res, "Stripe request");
  return (await res.json()) as Record<string, unknown>;
}

export async function createCheckoutSession(input: {
  bookingId: string;
  offeringName: string;
  amountCents: number;
  currency: string;
  guestEmail: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ id: string; url: string }> {
  const data = await stripeRequest("/checkout/sessions", {
    mode: "payment",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": input.currency,
    "line_items[0][price_data][unit_amount]": String(input.amountCents),
    "line_items[0][price_data][product_data][name]": input.offeringName,
    "line_items[0][price_data][product_data][description]": input.description,
    customer_email: input.guestEmail,
    client_reference_id: input.bookingId,
    "metadata[booking_id]": input.bookingId,
    "payment_intent_data[metadata][booking_id]": input.bookingId,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    expires_at: String(Math.floor(Date.now() / 1000) + 30 * 60),
  });
  return { id: String(data["id"]), url: String(data["url"]) };
}

export async function retrieveCheckoutSession(sessionId: string) {
  const res = await fetch(`${STRIPE_API}/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${stripeKey()}` },
  });
  if (!res.ok) await readError(res, "Stripe session lookup");
  return (await res.json()) as {
    id: string;
    payment_status?: string;
    payment_intent?: string | null;
    metadata?: { booking_id?: string };
  };
}

/** Verifies a Stripe webhook signature (t=…,v1=…) over the raw body. */
export async function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): Promise<boolean> {
  if (!signatureHeader) return false;
  const parts = signatureHeader.split(",").map((p) => p.trim().split("="));
  const timestamp = parts.find((p) => p[0] === "t")?.[1];
  const signatures = parts.filter((p) => p[0] === "v1").map((p) => p[1]);
  if (!timestamp || signatures.length === 0) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${rawBody}`));
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");

  return signatures.some((sig) => {
    if (!sig || sig.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i += 1) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    return diff === 0;
  });
}
