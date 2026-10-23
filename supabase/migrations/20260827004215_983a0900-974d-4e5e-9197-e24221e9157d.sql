CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offering_id TEXT NOT NULL,
  offering_name TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_notes TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'hold',
  hold_expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() + interval '15 minutes',
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  google_event_id TEXT,
  google_meet_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages bookings"
  ON public.bookings FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE UNIQUE INDEX bookings_active_slot_idx
  ON public.bookings (starts_at)
  WHERE status IN ('hold', 'paid');

CREATE INDEX bookings_status_idx ON public.bookings (status, hold_expires_at);
CREATE INDEX bookings_stripe_session_idx ON public.bookings (stripe_session_id);

CREATE OR REPLACE FUNCTION public.validate_booking_times()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.ends_at <= NEW.starts_at THEN
    RAISE EXCEPTION 'ends_at must be after starts_at';
  END IF;
  IF NEW.status NOT IN ('hold', 'paid', 'expired', 'cancelled') THEN
    RAISE EXCEPTION 'invalid status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_bookings_times
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.validate_booking_times();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();