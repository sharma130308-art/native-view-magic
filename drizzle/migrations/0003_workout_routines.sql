CREATE TABLE public.workout_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  video_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_routines TO authenticated;
GRANT ALL ON public.workout_routines TO service_role;
ALTER TABLE public.workout_routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own routines select" ON public.workout_routines FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own routines insert" ON public.workout_routines FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own routines update" ON public.workout_routines FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own routines delete" ON public.workout_routines FOR DELETE TO authenticated USING (auth.uid() = user_id);