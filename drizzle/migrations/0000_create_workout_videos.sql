CREATE TABLE public.workout_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  storage_path TEXT NOT NULL UNIQUE,
  file_size BIGINT NOT NULL CHECK (file_size > 0),
  content_type TEXT NOT NULL CHECK (content_type LIKE 'video/%'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_videos TO authenticated;
GRANT ALL ON public.workout_videos TO service_role;

ALTER TABLE public.workout_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout videos"
ON public.workout_videos FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add own workout videos"
ON public.workout_videos FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout videos"
ON public.workout_videos FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout videos"
ON public.workout_videos FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX workout_videos_user_created_idx
ON public.workout_videos (user_id, created_at DESC);

CREATE POLICY "Users can view own workout video files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'workout-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can upload own workout video files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'workout-videos'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND lower(storage.extension(name)) IN ('mp4', 'mov', 'm4v', 'webm')
);

CREATE POLICY "Users can remove own workout video files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'workout-videos' AND (storage.foldername(name))[1] = auth.uid()::text);