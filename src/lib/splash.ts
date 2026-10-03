/** Fades out the launch splash (shown only in the installed app). Safe to call more than once. */
export function hideSplash() {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-app-ready", "");
}
