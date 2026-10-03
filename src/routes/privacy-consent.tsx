import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Screen } from "@/components/zyra/TabBar";

export const Route = createFileRoute("/privacy-consent")({
  head: () => ({
    meta: [
      { title: "ZyraFit — Privacy Consent" },
      { name: "description", content: "Customize your privacy experience in ZyraFit." },
      { property: "og:title", content: "ZyraFit — Privacy Consent" },
      { property: "og:description", content: "Customize your privacy experience in ZyraFit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyConsentScreen,
});

function PrivacyConsentScreen() {
  const navigate = useNavigate();

  return (
    <Screen>
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-[#0A0A0A] text-white">
      <div className="flex-1 overflow-y-auto px-6 pt-8">
        <p className="flex items-center gap-1.5 text-sm text-[#E0E0E0]">Welcome to ZyraFit <span>👋</span></p>
        <h1 className="mt-4 flex items-center gap-2 text-[1.75rem] font-bold leading-tight" style={{ fontFamily: "serif" }}>
          Your privacy <span>🔒</span>
        </h1>
        <p className="mt-6 text-[15px] leading-7 text-[#B0B0B0]">
          ZyraFit does not show ads and does not use advertising or third-party analytics trackers. We only use what the
          app needs to work: your account, your quiz answers, and the photos or descriptions you choose to send for food
          recognition.
        </p>
        <p className="mt-5 text-[15px] leading-7 text-[#B0B0B0]">
          Food photos are sent to an AI service only to estimate nutrition and are not stored on our servers. You can
          delete your account and data at any time in Settings.
        </p>
        <p className="mt-5 text-[15px] leading-7 text-[#B0B0B0]">
          Read the full <Link to="/privacy" className="font-semibold text-[#FF4D6D]">Privacy Policy</Link> and{" "}
          <Link to="/terms" className="font-semibold text-[#FF4D6D]">Terms of Use</Link>.
        </p>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          type="button"
          onClick={() => navigate({ to: "/onboarding-survey" })}
          className="h-14 w-full rounded-full bg-[#FFF8E7] text-base font-semibold text-[#1A1A1A]"
        >
          Continue
        </button>
      </div>
    </div>
  </Screen>
  );
}
