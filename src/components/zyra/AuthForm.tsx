import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export type AuthMode = "signin" | "signup";

type AuthFormProps = {
  defaultMode?: AuthMode;
  /** Path (e.g. "/auth") that email-confirmation links and Google sign-in return to. Defaults to the current page. */
  redirectPath?: string;
  onModeChange?: (mode: AuthMode) => void;
  onSuccess?: () => void;
};

function friendlyError(message: string) {
  if (/email not confirmed/i.test(message)) {
    return "Please confirm your email first — check your inbox for the link.";
  }
  if (/invalid login credentials/i.test(message)) {
    return "Wrong email or password. If you signed up with Google, use Continue with Google.";
  }
  return message;
}

/** One sign-in / sign-up form used everywhere in the app, so every entry point behaves the same. */
export function AuthForm({ defaultMode = "signin", redirectPath, onModeChange, onSuccess }: AuthFormProps) {
  const [mode, setModeState] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const setMode = (next: AuthMode) => {
    setModeState(next);
    onModeChange?.(next);
  };

  // Computed on demand: this component is server-rendered, where `window` does not exist.
  const redirectUrl = () => window.location.origin + (redirectPath ?? window.location.pathname);

  const minPassword = mode === "signup" ? 6 : 1;
  const canSubmit = !busy && email.trim().length > 0 && password.length >= minPassword;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    try {
      const cleanEmail = email.trim();
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { emailRedirectTo: redirectUrl() },
        });
        if (error) return void toast.error(friendlyError(error.message));
        if (data.session) return void onSuccess?.();
        if (data.user && data.user.identities?.length === 0) {
          setMode("signin");
          return void toast.info("You already have an account with this email — please sign in.");
        }
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) return void toast.error(friendlyError(error.message));
        onSuccess?.();
      }
    } finally {
      setBusy(false);
    }
  };

  const continueWithGoogle = async () => {
    setBusy(true);
    try {
      const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: redirectUrl() });
      if (r.error) toast.error(String(r.error.message ?? r.error));
      else if (!("redirected" in r && r.redirected)) onSuccess?.();
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-3">
        <p className="rounded-xl bg-muted p-4 text-sm text-foreground">
          Check your email and tap the link to confirm your account. After that you will be signed in.
        </p>
        <button
          type="button"
          className="text-sm text-primary"
          onClick={() => {
            setSent(false);
            setMode("signin");
          }}
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={(event) => void submit(event)}>
      <Input
        type="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        type="password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        placeholder={mode === "signup" ? "Password (6+ characters)" : "Password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button type="submit" size="pill" disabled={!canSubmit}>
        {mode === "signup" ? "Sign up" : "Sign in"}
      </Button>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button type="button" variant="secondary" disabled={busy} onClick={() => void continueWithGoogle()}>
        Continue with Google
      </Button>
      <button type="button" className="text-sm text-primary" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
        {mode === "signup" ? "Already have an account? Sign in" : "New here? Sign up"}
      </button>
    </form>
  );
}
