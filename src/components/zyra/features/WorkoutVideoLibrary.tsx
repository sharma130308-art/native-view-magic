import { useEffect, useMemo, useState } from "react";
import {
  LoaderCircle,
  LogIn,
  Search,
  LayoutGrid,
  Star,
  Trash2,
  X,
} from "lucide-react";

import cardioIcon from "@/assets/muscles/cardio.png";
import chestIcon from "@/assets/muscles/chest.png";
import backIcon from "@/assets/muscles/back.png";
import bicepsIcon from "@/assets/muscles/biceps.png";
import tricepsIcon from "@/assets/muscles/triceps.png";
import quadricepsIcon from "@/assets/muscles/quadriceps.png";
import hamstringsIcon from "@/assets/muscles/hamstrings.png";
import shouldersIcon from "@/assets/muscles/shoulders.png";
import calvesIcon from "@/assets/muscles/calves.png";
import forearmsIcon from "@/assets/muscles/forearms.png";
import neckIcon from "@/assets/muscles/neck.png";
import absIcon from "@/assets/muscles/abs.png";
import hipsIcon from "@/assets/muscles/hips.png";
import trapeziusIcon from "@/assets/muscles/trapezius.png";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const PAGE_SIZE = 12;

export const CATEGORIES = [
  { id: "favorites", label: "Favorites", icon: null },
  { id: "cardio", label: "Cardio", icon: cardioIcon },
  { id: "chest", label: "Chest", icon: chestIcon },
  { id: "back", label: "Back", icon: backIcon },
  { id: "biceps", label: "Biceps", icon: bicepsIcon },
  { id: "triceps", label: "Triceps", icon: tricepsIcon },
  { id: "quadriceps", label: "Quadriceps", icon: quadricepsIcon },
  { id: "hamstrings", label: "Hamstrings", icon: hamstringsIcon },
  { id: "shoulders", label: "Shoulders", icon: shouldersIcon },
  { id: "calves", label: "Calves", icon: calvesIcon },
  { id: "forearms", label: "Forearms", icon: forearmsIcon },
  { id: "abs", label: "Abs", icon: absIcon },
  { id: "hips", label: "Hips", icon: hipsIcon },
  { id: "trapezius", label: "Trapezius", icon: trapeziusIcon },
  { id: "neck", label: "Neck", icon: neckIcon },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

function cleanTitle(filename: string) {
  return filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "Workout video";
}

export function WorkoutVideoLibrary() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [videos, setVideos] = useState<WorkoutVideo[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [upload, setUpload] = useState<UploadState | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{ video: WorkoutVideo; url: string } | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [uploadCategory, setUploadCategory] = useState<CategoryId>("chest");
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("zyrafit-video-favorites") ?? "[]") as string[]);
    } catch {
      return new Set();
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("zyrafit-video-favorites", JSON.stringify([...next]));
      return next;
    });
  };

  const loadVideos = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("workout_videos")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", id).eq("role", "admin").maybeSingle();
    setIsAdmin(Boolean(role));
    if (error) toast.error("Could not load videos");
    else setVideos(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const id = data.user?.id ?? null;
      setUserId(id);
      if (id) void loadVideos(id);
      else setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const id = session?.user.id ?? null;
      setUserId(id);
      setShowSignIn(false);
      if (id) void loadVideos(id);
      else {
        setVideos([]);
        setIsAdmin(false);
        setLoading(false);
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return videos.filter((video) => {
      if (category === "favorites" && !favorites.has(video.id)) return false;
      if (category !== "all" && category !== "favorites" && video.category !== category) return false;
      return term ? video.title.toLowerCase().includes(term) : true;
    });
  }, [query, videos, category, favorites]);
  const visible = filtered.slice(0, page * PAGE_SIZE);

  const chooseFolder = () => {
    if (!userId) {
      setShowSignIn(true);
      return;
    }
    inputRef.current?.click();
  };

  const uploadFiles = async (files: File[]) => {
    if (!userId || files.length === 0) return;
    const accepted = files.filter((file) => ALLOWED_TYPES.has(file.type));
    if (accepted.length === 0) {
      toast.error("Choose MP4, MOV, M4V, or WebM videos");
      return;
    }
    if (accepted.length > 1000) {
      toast.error("Choose no more than 1,000 videos at once");
      return;
    }
    setUpload({ done: 0, failed: 0, total: accepted.length });
    let nextIndex = 0;
    let done = 0;
    let failed = 0;

    const worker = async () => {
      while (nextIndex < accepted.length) {
        const file = accepted[nextIndex++];
        if (!file) continue;
        const path = `${userId}/${safeFilename(file.name)}`;
        const { error: storageError } = await supabase.storage.from("workout-videos").upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });
        if (storageError) {
          failed += 1;
        } else {
          const { error: rowError } = await supabase.from("workout_videos").insert({
            user_id: userId,
            title: cleanTitle(file.name),
            storage_path: path,
            file_size: file.size,
            content_type: file.type,
            category: uploadCategory,
          });
          if (rowError) {
            failed += 1;
            await supabase.storage.from("workout-videos").remove([path]);
          } else done += 1;
        }
        setUpload({ done, failed, total: accepted.length });
      }
    };

    await Promise.all(Array.from({ length: Math.min(3, accepted.length) }, worker));
    await loadVideos(userId);
    if (failed) toast.error(`${failed} video${failed === 1 ? "" : "s"} could not be uploaded`);
    else toast.success(`${done} video${done === 1 ? "" : "s"} uploaded`);
  };

  const playVideo = async (video: WorkoutVideo) => {
    const { data, error } = await supabase.storage.from("workout-videos").createSignedUrl(video.storage_path, 3600);
    if (error || !data.signedUrl) {
      toast.error("Could not open this video");
      return;
    }
    setSelected({ video, url: data.signedUrl });
  };

  const removeVideo = async (video: WorkoutVideo) => {
    const { error: storageError } = await supabase.storage.from("workout-videos").remove([video.storage_path]);
    if (storageError) {
      toast.error("Could not remove this video");
      return;
    }
    const { error } = await supabase.from("workout_videos").delete().eq("id", video.id);
    if (error) toast.error("Could not remove the video record");
    else setVideos((current) => current.filter((item) => item.id !== video.id));
  };

  const signIn = async () => {
    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthBusy(false);
    if (error) toast.error(error.message);
  };

  const signUp = async () => {
    setAuthBusy(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setAuthBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Check your email to finish signing up");
  };

  return (
    <section className="mt-6">
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/x-m4v,video/webm"
        multiple
        className="hidden"
        aria-label="Choose workout video folder"
        onChange={(event) => {
          void uploadFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
        {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{userId ? `${videos.length} workout videos` : "Sign in to watch workout videos"}</p>
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <select
              value={uploadCategory}
              onChange={(event) => setUploadCategory(event.target.value as CategoryId)}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
              aria-label="Category for uploaded videos"
            >
              {CATEGORIES.filter(({ id }) => id !== "favorites").map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
            <Button size="sm" className="gap-2" onClick={chooseFolder} disabled={upload !== null && upload.done + upload.failed < upload.total}>
              {upload && upload.done + upload.failed < upload.total ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FolderUp className="h-4 w-4" />}
              Add folder
            </Button>
          </div>
        ) : null}
      </div>

      {upload ? (
        <div className="mt-3 rounded-lg border border-border bg-card p-3">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>{upload.done + upload.failed} of {upload.total}</span>
            <span>{upload.failed ? `${upload.failed} failed` : "Uploading"}</span>
          </div>
          <Progress value={((upload.done + upload.failed) / upload.total) * 100} />
        </div>
      ) : null}

      {userId ? (
        <>
          <div className="-mx-4 mt-3 flex gap-1 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Workout categories">
            {CATEGORIES.map(({ id, label, icon }) => {
              const active = category === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => { setCategory(active ? "all" : id); setPage(1); }}
                  className="flex w-16 shrink-0 flex-col items-center gap-1.5 rounded-lg py-2"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}>
                    {icon ? (
                      <img src={icon} alt="" loading="lazy" className="h-9 w-9 object-contain" />
                    ) : (
                      <Star className="h-5 w-5" />
                    )}
                  </span>
                  <span className={`text-[10px] font-medium leading-tight ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
                </button>
              );
            })}
            <button
              type="button"
              role="tab"
              aria-selected={category === "all" && !query}
              onClick={() => { setCategory("all"); setQuery(""); setPage(1); }}
              className="flex w-16 shrink-0 flex-col items-center gap-1.5 rounded-lg py-2"
              aria-label="Show all videos"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${category === "all" && !query ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}>
                <LayoutGrid className="h-5 w-5" />
              </span>
              <span className={`text-[10px] font-medium leading-tight ${category === "all" && !query ? "text-primary" : "text-muted-foreground"}`}>All</span>
            </button>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search videos" className="pl-9" />
          </div>
        </>
      ) : null}

      {loading ? (
        <div className="flex h-28 items-center justify-center"><LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : userId && visible.length > 0 ? (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {visible.map((video) => (
              <article key={video.id} className="overflow-hidden rounded-lg border border-border bg-card">
                <button type="button" onClick={() => void playVideo(video)} className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-secondary" aria-label={`Play ${video.title}`}>
                  <VideoThumb path={video.storage_path} />
                </button>
                <div className="flex items-center justify-end gap-0.5 px-1 py-0.5">
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => toggleFavorite(video.id)} aria-label={favorites.has(video.id) ? `Remove ${video.title} from favorites` : `Add ${video.title} to favorites`}>
                    <Star className={`h-4 w-4 ${favorites.has(video.id) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </Button>
                  {isAdmin ? <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => void removeVideo(video)} aria-label={`Delete ${video.title}`} title="Delete video">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button> : null}
                </div>
              </article>
            ))}
          </div>
          {visible.length < filtered.length ? <Button variant="outline" className="mt-3 w-full" onClick={() => setPage((value) => value + 1)}>Load more</Button> : null}
        </>
      ) : userId && !isAdmin ? (
        <p className="mt-3 rounded-lg border border-border bg-card p-5 text-center text-sm text-muted-foreground">No workout videos yet</p>
      ) : userId ? (
        <button type="button" onClick={chooseFolder} className="mt-3 flex w-full flex-col items-center rounded-lg border border-dashed border-border bg-card px-5 py-8 text-center">
          <Film className="h-7 w-7 text-muted-foreground" />
          <span className="mt-2 text-sm font-semibold text-foreground">Add your workout folder</span>
          <span className="mt-1 text-xs text-muted-foreground">Select up to 1,000 videos</span>
        </button>
      ) : (
        <button type="button" onClick={() => setShowSignIn(true)} className="mt-3 flex w-full items-center gap-3 rounded-lg border border-border bg-card p-4 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><LogIn className="h-5 w-5 text-primary" /></span>
          <span><span className="block text-sm font-semibold text-foreground">Sign in to watch videos</span><span className="text-xs text-muted-foreground">Free account required</span></span>
        </button>
      )}

      {showSignIn ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="video-sign-in-title">
          <div className="relative w-full max-w-md rounded-t-2xl bg-background p-5 sm:rounded-lg">
            <Button variant="ghost" size="icon" className="absolute right-3 top-3" onClick={() => setShowSignIn(false)} aria-label="Close sign in"><X className="h-5 w-5" /></Button>
            <h3 id="video-sign-in-title" className="text-lg font-bold text-foreground">Workout videos</h3>
            <p className="mt-1 pr-8 text-sm text-muted-foreground">Sign in to watch the workout video library.</p>
            <div className="mt-5 space-y-3">
              <Input type="email" autoComplete="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <Input type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <Button className="w-full" onClick={() => void signIn()} disabled={authBusy || !email || !password}>Sign in</Button>
              <Button variant="outline" className="w-full" onClick={() => void signUp()} disabled={authBusy || !email || password.length < 6}>Create account</Button>
              <div className="flex items-center gap-3"><span className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">or</span><span className="h-px flex-1 bg-border" /></div>
              <Button variant="secondary" className="w-full" onClick={() => void lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })}>Continue with Google</Button>
            </div>
          </div>
        </div>
      ) : null}

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-3" role="dialog" aria-modal="true" aria-label={selected.video.title}>
          <div className="w-full max-w-3xl">
            <div className="mb-3 flex items-center justify-between gap-3 text-primary-foreground">
              <p className="truncate font-semibold">{selected.video.title}</p>
              <Button variant="secondary" size="icon" onClick={() => setSelected(null)} aria-label="Close video"><X className="h-5 w-5" /></Button>
            </div>
            <video src={selected.url} controls autoPlay playsInline className="aspect-video w-full rounded-lg bg-foreground" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
function VideoThumb({ path }: { path: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void supabase.storage.from("workout-videos").createSignedUrl(path, 3600).then(({ data }) => {
      if (active && data?.signedUrl) setUrl(`${data.signedUrl}#t=0.5`);
    });
    return () => { active = false; };
  }, [path]);
  if (!url) return null;
  return (
    <video
      src={url}
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
      onCanPlay={(event) => void event.currentTarget.play().catch(() => undefined)}
      className="absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
    />
  );
}
