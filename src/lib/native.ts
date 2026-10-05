import { Capacitor } from "@capacitor/core";

/** Call only from effects or user events. Native behavior never changes web rendering. */
export function isNativeApp() {
  return typeof window !== "undefined" && Capacitor.isNativePlatform();
}

export async function initializeNativeApp() {
  if (!isNativeApp()) return;
  document.documentElement.dataset.nativeApp = "true";
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();
  } catch {
    // Native auto-hide remains enabled as a failsafe.
  }
}