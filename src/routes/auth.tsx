import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AuthForm, type AuthMode } from "@/components/zyra/AuthForm";
import { supabase } from "@/integrations/supabase/client";

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
  const [mode, setMode] = useState<AuthMode>("signup");

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

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-4 bg-background px-6 py-10">
      <h1 className="text-3xl font-bold text-foreground">ZyraFit</h1>
      <p className="text-muted-foreground">{mode === "signup" ? "Create your account to get started." : "Welcome back."}</p>
      <AuthForm defaultMode="signup" redirectPath="/auth" onModeChange={setMode} />
    </main>
  );
}
