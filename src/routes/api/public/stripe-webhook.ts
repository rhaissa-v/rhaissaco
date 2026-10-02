import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secret) return new Response("Webhook not configured", { status: 503 });

        const rawBody = await request.text();
        const { verifyStripeSignature } = await import("@/lib/booking.server");
        const valid = await verifyStripeSignature(
          rawBody,
          request.headers.get("stripe-signature"),
          secret,
        );
        if (!valid) return new Response("Invalid signature", { status: 401 });

        let event: { type?: string; data?: { object?: Record<string, unknown> } };
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const object = event.data?.object ?? {};
        const metadata = (object["metadata"] ?? {}) as Record<string, string | undefined>;
        const bookingId = metadata["booking_id"];

        const { finalizeBooking } = await import("@/lib/bookings.server");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        try {
          if (event.type === "checkout.session.completed" && bookingId) {
            if (object["payment_status"] === "paid") {
              const pi = typeof object["payment_intent"] === "string" ? object["payment_intent"] : null;
              await finalizeBooking(bookingId, pi);
            }
          } else if (
            (event.type === "checkout.session.expired" || event.type === "payment_intent.canceled") &&
            bookingId
          ) {
            await supabaseAdmin
              .from("bookings")
              .update({ status: "expired" })
              .eq("id", bookingId)
              .eq("status", "hold");
          }
        } catch (error) {
          console.error("Stripe webhook handling failed", error);
          return new Response("Handler error", { status: 500 });
        }

        return new Response("ok");
      },
    },
  },
});
