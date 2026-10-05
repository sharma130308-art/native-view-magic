import { isNativeApp } from "@/lib/native";

/** Native iPhone tap feedback; short vibration in supported browsers. */
export function tapHaptic() {
  if (isNativeApp()) {
    void import("@capacitor/haptics")
      .then(({ Haptics, ImpactStyle }) => Haptics.impact({ style: ImpactStyle.Light }))
      .catch(() => undefined);
    return;
  }
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
  } catch {
    // vibration unavailable
  }
}
