import { createClient } from "@supabase/supabase-js";

const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

/** Simple per-user sliding window. In-memory, so it is per server instance — a speed bump, not a hard quota. */
function isRateLimited(key: string, limit: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return false;
}

/**
 * Requires a valid signed-in user's bearer token and applies a per-user rate limit.
 * Returns the user id, or a ready-made error Response the handler should return as-is.
 */
export async function guardAiRequest(
  request: Request,
  options: { name: string; limit: number },
): Promise<{ userId: string } | Response> {
  const unauthorized = () =>
    Response.json({ error: "Please sign in to use this feature." }, { status: 401 });

  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return Response.json({ error: "Sign-in is not configured." }, { status: 500 });

  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return unauthorized();
  const token = header.slice("Bearer ".length).trim();
  if (token.split(".").length !== 3) return unauthorized();

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
  const { data, error } = await supabase.auth.getClaims(token);
  const userId = data?.claims?.sub;
  if (error || !userId) return unauthorized();

  if (isRateLimited(`${options.name}:${userId}`, options.limit)) {
    return Response.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(WINDOW_MS / 1000)) } },
    );
  }
  return { userId };
}

/** Same check for non-AI endpoints (e.g. account deletion). */
export const guardUserRequest = guardAiRequest;
