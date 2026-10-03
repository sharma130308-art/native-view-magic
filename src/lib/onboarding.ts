import { supabase } from "@/integrations/supabase/client";

const PENDING_KEY = "zyrafit-pending-survey";

export type SurveyAnswers = Record<string, string | string[]>;

/** Quiz answers given before the person has an account; saved to their profile right after sign-up. */
export function savePendingSurvey(answers: SurveyAnswers) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(answers));
  } catch {
    // storage unavailable: the quiz will simply be asked again after sign-up
  }
}

export function readPendingSurvey(): SurveyAnswers | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as SurveyAnswers) : null;
  } catch {
    return null;
  }
}

function clearPendingSurvey() {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
}

/**
 * Decide where a signed-in person goes next, saving any quiz answers they gave before signing up.
 * "/home" when their profile is complete, "/onboarding-survey" if we still need their answers.
 */
export async function resolvePostAuthRoute(userId: string): Promise<"/home" | "/onboarding-survey"> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .maybeSingle();
  if (profile?.onboarding_completed) {
    clearPendingSurvey();
    return "/home";
  }
  const pending = readPendingSurvey();
  if (!pending) return "/onboarding-survey";
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    onboarding_answers: pending,
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
  });
  // On failure keep the answers so the next sign-in retries; the person still gets into the app.
  if (!error) clearPendingSurvey();
  return "/home";
}
