# ZyraFit iOS preparation

## What you’ll get
- A Capacitor iOS project named **ZyraFit**, retaining your current screens, logo, and navigation.
- iPhone-friendly safe areas, keyboard handling, native tap feedback, and camera permission descriptions.
- App icon and launch screen using your existing artwork.
- Clear instructions for opening the project in Xcode, choosing your Apple signing team, and testing on an iPhone.

## Scope and limits
- This environment can prepare the iOS source project, but cannot compile or sign an installable iOS app: that requires a Mac with Xcode and your Apple Developer account.
- Keep the working browser preview unchanged. The existing app requires its hosted services; do not present it as an offline native rewrite.
- Apple/Google sign-in must be tested on a real iPhone. Apple’s ZyraFit branding still requires your own Apple credentials; Capacitor does not change that.
- Capacitor alone does not guarantee App Store acceptance. Record any remaining sign-in, payment, and native-device blockers before submission.
- Defer App Store listing polish until you confirm Google Play is live.

## Technical approach
- Add Capacitor core, CLI, iOS, and narrowly scoped native plugins; generate the Xcode project using Swift Package Manager where supported.
- Keep TanStack Start and server-only AI intact. Since the app uses server rendering and authenticated server endpoints, use the published HTTPS app for an initial connected iOS shell, with a local connection-failure screen. This is a preparation build, not a production-ready offline bundle.
- Restrict in-app navigation to the ZyraFit host; avoid broad navigation allowances or insecure transport settings.
- Initialize native behavior only inside Capacitor, leaving web behavior untouched. Review external-browser OAuth requirements and flag unresolved callback handling rather than claim it works.
- Validate generated configuration, run relevant tests, and check the browser screens for regressions. Document Mac/iPhone checks that cannot run here.

## Later: App Store listing
After Google Play is live, prepare accurate App Store copy, screenshots, privacy disclosures, reviewer instructions, and support links using **zyrafitsupport@gmail.com**.