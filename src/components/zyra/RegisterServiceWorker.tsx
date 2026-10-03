import { useEffect } from "react";

/** Registers the offline service worker in the published app only (never in the editor preview). */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    if (window.self !== window.top) return;
    const host = window.location.hostname;
    if (host.startsWith("id-preview--") || host.endsWith("lovableproject.com")) return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
  return null;
}
