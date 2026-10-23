CREATE POLICY "No client access to partnership requests"
ON public.partnership_requests
FOR SELECT
TO authenticated, anon
USING (false);