create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users can view own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

insert into public.user_roles (user_id, role) values ('6f2d9115-838a-45e9-b2d7-f39697d241b9', 'admin');

drop policy "Users can view own workout videos" on public.workout_videos;
drop policy "Users can add own workout videos" on public.workout_videos;
drop policy "Users can update own workout videos" on public.workout_videos;
drop policy "Users can delete own workout videos" on public.workout_videos;
create policy "Signed-in users can view workout videos" on public.workout_videos for select to authenticated using (true);
create policy "Admins can add workout videos" on public.workout_videos for insert to authenticated with check (public.has_role(auth.uid(), 'admin') and auth.uid() = user_id);
create policy "Admins can update workout videos" on public.workout_videos for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete workout videos" on public.workout_videos for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

drop policy "Users can view own workout video files" on storage.objects;
drop policy "Users can upload own workout video files" on storage.objects;
drop policy "Users can remove own workout video files" on storage.objects;
create policy "Signed-in users can view workout video files" on storage.objects for select to authenticated using (bucket_id = 'workout-videos');
create policy "Admins can upload workout video files" on storage.objects for insert to authenticated with check (bucket_id = 'workout-videos' and public.has_role(auth.uid(), 'admin') and (storage.foldername(name))[1] = (auth.uid())::text and lower(storage.extension(name)) = any (array['mp4','mov','m4v','webm']));
create policy "Admins can remove workout video files" on storage.objects for delete to authenticated using (bucket_id = 'workout-videos' and public.has_role(auth.uid(), 'admin'));