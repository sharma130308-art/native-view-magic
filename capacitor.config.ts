import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";
import manifest from "./public/manifest.webmanifest";

/** Connected device-preview configuration, NOT an App Store release bundle. */
const config: CapacitorConfig = {
  appId: "app.zyrafit",
  appName: "ZyraFit",
  webDir: "native-shell",
  backgroundColor: manifest.background_color,
  server: {
    url: "https://native-view-magic.lovable.app",
    cleartext: false,
    errorPath: "connection-error.html",
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    allowsLinkPreview: false,
    zoomEnabled: true,
    loggingBehavior: "debug",
  },
  plugins: {
    Keyboard: { resize: KeyboardResize.Native, autoBackdropColor: "dom" },
    SplashScreen: { launchShowDuration: 1200, launchAutoHide: true, showSpinner: false },
  },
};

export default config;