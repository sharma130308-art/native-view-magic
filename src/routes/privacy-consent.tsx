import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
          Customize your experience <span>🤗</span>
        </h1>
        <p className="mt-6 text-[15px] leading-7 text-[#B0B0B0]">
          We use tracking technologies that either are essential for the app to function correctly or are used to
          produce aggregated statistics. With your consent, we and our third-party partners will also use tracking
          technologies to improve the in-app experience, and to provide you with personalized services and targeted
          advertising. To give your consent, tap Accept All and Continue.
        </p>
        <p className="mt-5 text-[15px] leading-7 text-[#B0B0B0]">
          Alternatively, you can customize your privacy settings by tapping Customize Preferences, or by going to
          Privacy Settings at any time. If you don't want us to use non-technical tracking technologies, tap Refuse.
        </p>
        <p className="mt-5 text-[15px] leading-7 text-[#B0B0B0]">
          For more information about how we process your personal data through tracking technologies, take a look at
          our <span className="font-semibold text-[#FF4D6D]">Privacy Policy</span>.
        </p>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          type="button"
          onClick={() => navigate({ to: "/onboarding-survey" })}
          className="h-14 w-full rounded-full bg-[#FFF8E7] text-base font-semibold text-[#1A1A1A]"
        >
          Accept All and Continue
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          className="mt-3 h-14 w-full rounded-full bg-[#FFF8E7] text-base font-semibold text-[#1A1A1A]"
        >
          Refuse
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/privacy-settings" })}
          className="mt-3 w-full py-2 text-[15px] font-medium text-[#B0B0B0] underline"
        >
          Customize Preferences
        </button>
      </div>
    </div>
  </Screen>
  );
}
