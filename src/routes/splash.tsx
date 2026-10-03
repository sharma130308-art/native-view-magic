import { createFileRoute, redirect } from "@tanstack/react-router";

// The launch splash now lives in the app shell and disappears as soon as the app is ready.
// This old route used to add a fixed 1.5 second wait, so it simply forwards to the start.
export const Route = createFileRoute("/splash")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
