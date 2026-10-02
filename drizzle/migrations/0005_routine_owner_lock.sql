CREATE OR REPLACE FUNCTION public.lock_routine_owner()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
begin
  if new.user_id <> old.user_id then raise exception 'Routine owner cannot change'; end if;
  return new;
end $$;
CREATE TRIGGER lock_routine_owner BEFORE UPDATE ON public.workout_routines
  FOR EACH ROW EXECUTE FUNCTION public.lock_routine_owner();