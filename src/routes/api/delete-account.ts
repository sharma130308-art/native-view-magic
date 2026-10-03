import { createFileRoute } from "@tanstack/react-router";

import { guardUserRequest } from "@/lib/ai/require-user.server";

async function handleDeleteAccount(request: Request) {
  const guard = await guardUserRequest(request, { name: "delete-account", limit: 5 });
  if (guard instanceof Response) return guard;
  const { userId } = guard;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // The shared workout library belongs to the admin; removing that account must be handled by hand.
  const { data: adminRole } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (adminRole) {
    return Response.json(
      { error: "This is the library owner account. Contact support to remove it." },
      { status: 403 },
    );
  }

  const { data: found } = await supabaseAdmin.auth.admin.getUserById(userId);
  const email = found?.user?.email;

  // Routines have no foreign key to the user, so remove them explicitly (their invites cascade).
  const { error: routinesError } = await supabaseAdmin.from("workout_routines").delete().eq("user_id", userId);
  if (routinesError) return Response.json({ error: "Could not delete your data. Please try again." }, { status: 500 });

  // Invitations other people sent to this person's email.
  if (email) await supabaseAdmin.from("workout_routine_invites").delete().ilike("email", email);

  // Deleting the auth user also removes the profile (cascade).
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return Response.json({ error: "Could not delete your account. Please try again." }, { status: 500 });

  return Response.json({ ok: true });
}

export const Route = createFileRoute("/api/delete-account")({
  server: {
    handlers: {
      POST: ({ request }) => handleDeleteAccount(request),
    },
  },
});
