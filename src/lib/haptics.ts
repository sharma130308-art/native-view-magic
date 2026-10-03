/** A very short vibration on supported phones (Android Chrome). Silent no-op elsewhere. */
export function tapHaptic() {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
  } catch {
    // vibration unavailable
  }
}
