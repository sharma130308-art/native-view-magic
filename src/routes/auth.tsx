import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign up — ZyraFit" },
      { name: "description", content: "Create your ZyraFit account or sign in." },
      { property: "og:title", content: "Sign up — ZyraFit" },
      { property: "og:description", content: "Create your ZyraFit account or sign in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const go = async (userId: string) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", userId)
        .maybeSingle();
      void navigate({ to: profile?.onboarding_completed ? "/home" : "/privacy-consent", replace: true });
    };
    supabase.auth.getSession().then(({ data }) => data.session && void go(data.session.user.id));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => session && void go(session.user.id));
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  const submit = async () => {
    setBusy(true);
    const { data, error } =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/auth" } })
        : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return void toast.error(error.message);
    if (mode === "signup" && !data.session) {
      if (data.user && data.user.identities?.length === 0) {
        setMode("signin");
        return void toast.info("You already have an account with this email — please sign in.");
      }
      setSent(true);
    }
  };

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-4 bg-background px-6 py-10">
      <h1 className="text-3xl font-bold text-foreground">ZyraFit</h1>
      <p className="text-muted-foreground">{mode === "signup" ? "Create your account to get started." : "Welcome back."}</p>
      {sent ? (
        <p className="rounded-xl bg-muted p-4 text-sm text-foreground">Check your email and tap the link to confirm your account.</p>
      ) : (
        <>
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password (6+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button size="pill" disabled={busy || !email || password.length < 6} onClick={() => void submit()}>
            {mode === "signup" ? "Sign up" : "Sign in"}
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
              if (r.error) toast.error(String(r.error.message ?? r.error));
            }}
          >
            Continue with Google
          </Button>
          <button type="button" className="text-sm text-primary" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
            {mode === "signup" ? "Already have an account? Sign in" : "New here? Sign up"}
          </button>
        </>
      )}
    </main>
  );
}
