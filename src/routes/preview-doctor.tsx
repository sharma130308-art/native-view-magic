import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { authedFetch } from "@/lib/auth-fetch";

export const Route = createFileRoute("/preview-doctor")({
  // Developer tool: available in the editor preview, hidden in the published app.
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Preview Doctor — ZyraFit" },
      {
        name: "description",
        content: "Upload a screenshot of the ZyraFit native preview and let AI explain why it isn't visible.",
      },
      { property: "og:title", content: "Preview Doctor — ZyraFit" },
      {
        property: "og:description",
        content: "AI-powered diagnosis for a blank or broken native preview screenshot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PreviewDoctor,
});

function PreviewDoctor() {
  const [image, setImage] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const diagnose = async () => {
    if (!image) return;
    setAnswer("");
    setError(null);
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await authedFetch("/api/preview-doctor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image, notes }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setAnswer(text);
      }
      if (!text.trim()) setError("The AI returned no answer. Please try again later.");
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-4 bg-background px-6 py-6 text-foreground">
      <header>
        <Link to="/" className="text-sm text-muted-foreground">← Back to app</Link>
        <h1 className="mt-2 text-2xl font-bold">Preview Doctor</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a screenshot of the native preview. AI explains why it isn't visible — nothing in the project is changed.
        </p>
      </header>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        {image ? <img src={image} alt="Uploaded screenshot" className="max-h-72 rounded-lg object-contain" /> : "Tap to choose a screenshot"}
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={onFile} />
      </label>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional: what did you expect to see?"
        maxLength={2000}
        className="min-h-20 rounded-xl border border-input bg-background p-3 text-sm"
      />

      {loading ? (
        <Button size="pill" variant="outline" onClick={() => abortRef.current?.abort()}>Stop</Button>
      ) : (
        <Button size="pill" onClick={diagnose} disabled={!image}>Diagnose</Button>
      )}

      {loading && !answer ? <p className="text-sm text-muted-foreground">Looking at your screenshot…</p> : null}
      {error ? <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      {answer ? <div className="whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm leading-6">{answer}</div> : null}
    </main>
  );
}
