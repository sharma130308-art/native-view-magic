CREATE TABLE public.workout_routine_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id uuid NOT NULL REFERENCES public.workout_routines(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (routine_id, email)
);
GRANT SELECT, INSERT, DELETE ON public.workout_routine_invites TO authenticated;
GRANT ALL ON public.workout_routine_invites TO service_role;
ALTER TABLE public.workout_routine_invites ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_routine_owner(_rid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  select exists (select 1 from public.workout_routines where id = _rid and user_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.is_routine_invitee(_rid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  select exists (select 1 from public.workout_routine_invites
    where routine_id = _rid and lower(email) = lower(coalesce(auth.jwt()->>'email','')))
$$;

CREATE POLICY "Invites visible to owner, invitee, admin" ON public.workout_routine_invites
  FOR SELECT TO authenticated USING (
    public.is_routine_owner(routine_id)
    OR lower(email) = lower(coalesce(auth.jwt()->>'email',''))
    OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin can invite" ON public.workout_routine_invites
  FOR INSERT TO authenticated WITH CHECK (public.is_routine_owner(routine_id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin can remove invite" ON public.workout_routine_invites
  FOR DELETE TO authenticated USING (public.is_routine_owner(routine_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Shared routines select" ON public.workout_routines
  FOR SELECT TO authenticated USING (public.is_routine_invitee(id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Shared routines update" ON public.workout_routines
  FOR UPDATE TO authenticated
  USING (public.is_routine_invitee(id) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_routine_invitee(id) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete routines" ON public.workout_routines
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));