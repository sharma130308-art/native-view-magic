import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { AuthForm, type AuthMode } from "@/components/zyra/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { readPendingSurvey, resolvePostAuthRoute } from "@/lib/onboarding";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: "signin" } =>
    search["mode"] === "signin" ? { mode: "signin" } : {},
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
  const { mode: modeFromLink } = Route.useSearch();
  const initialMode: AuthMode = modeFromLink === "signin" ? "signin" : "signup";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [hasPlan, setHasPlan] = useState(false);
  const going = useRef(false);

  useEffect(() => {
    setHasPlan(readPendingSurvey() !== null);
    const go = async (userId: string) => {
      if (going.current) return;
      going.current = true;
      const next = await resolvePostAuthRoute(userId);
      void navigate({ to: next, replace: true });
    };
    supabase.auth.getSession().then(({ data }) => data.session && void go(data.session.user.id));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => session && void go(session.user.id));
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-4 bg-background px-6 py-10">
      <h1 className="text-3xl font-bold text-foreground">ZyraFit</h1>
      <p className="text-muted-foreground">
        {mode === "signin"
          ? "Welcome back."
          : hasPlan
            ? "Your plan is ready. Create your account to save it."
            : "Create your account to get started."}
      </p>
      <AuthForm key={initialMode} defaultMode={initialMode} redirectPath="/auth" onModeChange={setMode} />
      <p className="text-center text-xs leading-5 text-muted-foreground">
        By continuing you agree to our{" "}
        <Link to="/terms" className="font-medium underline">Terms of Use</Link> and acknowledge our{" "}
        <Link to="/privacy" className="font-medium underline">Privacy Policy</Link>.
      </p>
    </main>
  );
}
