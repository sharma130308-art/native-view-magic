<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the browser preview faithful to the uploaded ZyraFit Flutter app; the browser implementation exists only to make its native screens reviewable in Lovable.
- AI calls live in server-only `src/lib/ai/*.server.ts` and are exposed via `src/routes/api/*` routes — keeps the AI key off the browser.
- Developer tools (e.g. `/preview-doctor`) live on separate routes — keeps the recreated Flutter screens faithful.
- Keep Workout in the second main navigation position and expose food History from Profile — matches the requested ZyraFit information architecture.
- Workout videos are a shared library: admins (user_roles) upload to the private `workout-videos` bucket + `workout_videos` table; all signed-in users can read — owner curates, members watch.
- Keep Capacitor iOS as an explicitly connected device-preview target with a local failure screen, not a release bundle — TanStack SSR and AI still require the hosted app; App Store release needs bundled UI and verified native auth.
- Gate all native plugin calls behind the client-side native-platform check in src/lib/native.ts — browser preview and SSR must remain functional without an iOS bridge.
