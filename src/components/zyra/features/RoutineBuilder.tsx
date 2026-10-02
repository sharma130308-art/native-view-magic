import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, ListPlus, LoaderCircle, Play, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { CATEGORIES } from "./WorkoutVideoLibrary";

type Video = Pick<Tables<"workout_videos">, "id" | "title" | "category" | "storage_path">;
type Routine = Tables<"workout_routines">;

const PICK_CATS = CATEGORIES.filter((c) => c.id !== "favorites");

export function RoutineBuilder() {
  const [userId, setUserId] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [cat, setCat] = useState<string>("chest");
  const [picked, setPicked] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [player, setPlayer] = useState<{ routine: Routine; index: number; url: string | null } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const id = data.user?.id ?? null;
      if (!active) return;
      setUserId(id);
      if (!id) return setLoading(false);
      const [v, r] = await Promise.all([
        supabase.from("workout_videos").select("id,title,category,storage_path").order("title").limit(2000),
        supabase.from("workout_routines").select("*").order("created_at", { ascending: false }),
      ]);
      if (!active) return;
      setVideos(v.data ?? []);
      setRoutines(r.data ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const byId = useMemo(() => new Map(videos.map((v) => [v.id, v])), [videos]);
  const inCat = videos.filter((v) => v.category === cat);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  async function save() {
    if (!userId) return;
    if (!name.trim() || picked.length === 0) return toast.error("Add a name and at least one video");
    setSaving(true);
    const { data, error } = await supabase
      .from("workout_routines")
      .insert({ user_id: userId, name: name.trim(), video_ids: picked })
      .select()
      .single();
    setSaving(false);
    if (error || !data) return toast.error("Could not save routine");
    setRoutines((r) => [data, ...r]);
    setEditing(false);
    setName("");
    setPicked([]);
    toast.success("Routine saved");
  }

  async function remove(id: string) {
    const { error } = await supabase.from("workout_routines").delete().eq("id", id);
    if (error) return toast.error("Could not delete");
    setRoutines((r) => r.filter((x) => x.id !== id));
  }

  async function playAt(routine: Routine, index: number) {
    const v = byId.get(routine.video_ids[index]);
    setPlayer({ routine, index, url: null });
    if (!v) return;
    const { data } = await supabase.storage.from("workout-videos").createSignedUrl(v.storage_path, 3600);
    setPlayer({ routine, index, url: data?.signedUrl ?? null });
  }

  if (loading) return <div className="flex justify-center py-10"><LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!userId) return <p className="py-10 text-center text-sm text-muted-foreground">Sign in on the Library tab to build your own routines.</p>;

  if (editing) {
    return (
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setEditing(false)} aria-label="Back"><ChevronLeft /></Button>
          <Input placeholder="Routine name, e.g. Push day" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {PICK_CATS.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-xl border px-2 py-1.5 text-xs ${cat === c.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
              {c.icon && <img src={c.icon} alt="" className="h-8 w-8 object-contain" />}
              {c.label}
            </button>
          ))}
        </div>
        <div className="max-h-80 space-y-1 overflow-y-auto rounded-xl border border-border p-1">
          {inCat.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">No videos in this group yet.</p>}
          {inCat.map((v) => {
            const on = picked.includes(v.id);
            return (
              <button key={v.id} onClick={() => toggle(v.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${on ? "bg-primary/10 text-foreground" : "text-foreground hover:bg-muted"}`}>
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {on && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="truncate">{v.title}</span>
              </button>
            );
          })}
        </div>
        {picked.length > 0 && (
          <div className="rounded-xl bg-muted p-3">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">YOUR ROUTINE · {picked.length} exercises</p>
            <ol className="space-y-1 text-sm">
              {picked.map((id, i) => (
                <li key={id} className="flex items-center gap-2">
                  <span className="w-5 text-muted-foreground">{i + 1}.</span>
                  <span className="flex-1 truncate text-foreground">{byId.get(id)?.title}</span>
                  <button onClick={() => toggle(id)} aria-label="Remove"><X className="h-4 w-4 text-muted-foreground" /></button>
                </li>
              ))}
            </ol>
          </div>
        )}
        <Button className="w-full" onClick={save} disabled={saving}>
          {saving ? <LoaderCircle className="animate-spin" /> : <Check />} Save routine
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <Button className="w-full" onClick={() => setEditing(true)}><Plus /> New routine</Button>
      {routines.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
          <ListPlus className="h-8 w-8" /> No routines yet. Pick videos by muscle group to build one.
        </div>
      )}
      {routines.map((r) => (
        <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">{r.name}</p>
            <p className="text-xs text-muted-foreground">{r.video_ids.length} exercises</p>
          </div>
          <Button size="icon" onClick={() => playAt(r, 0)} aria-label="Start"><Play /></Button>
          <Button size="icon" variant="ghost" onClick={() => remove(r.id)} aria-label="Delete"><Trash2 /></Button>
        </div>
      ))}

      {player && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold text-foreground">{player.routine.name}</p>
              <p className="text-xs text-muted-foreground">
                {player.index + 1} / {player.routine.video_ids.length} · {byId.get(player.routine.video_ids[player.index])?.title}
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setPlayer(null)} aria-label="Close"><X /></Button>
          </div>
          <div className="flex flex-1 items-center justify-center bg-muted">
            {player.url ? (
              <video key={player.url} src={player.url} controls autoPlay playsInline className="max-h-full w-full"
                onEnded={() => player.index + 1 < player.routine.video_ids.length && playAt(player.routine, player.index + 1)} />
            ) : <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />}
          </div>
          <div className="flex gap-2 p-4">
            <Button variant="outline" className="flex-1" disabled={player.index === 0} onClick={() => playAt(player.routine, player.index - 1)}><ChevronLeft /> Previous</Button>
            <Button className="flex-1" disabled={player.index + 1 >= player.routine.video_ids.length} onClick={() => playAt(player.routine, player.index + 1)}>Next <ChevronRight /></Button>
          </div>
        </div>
      )}
    </div>
  );
}
