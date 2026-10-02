import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/privacy-settings")({
  head: () => ({
    meta: [
      { title: "ZyraFit — Privacy Settings" },
      { name: "description", content: "Manage your privacy and tracking preferences in ZyraFit." },
      { property: "og:title", content: "ZyraFit — Privacy Settings" },
      { property: "og:description", content: "Manage your privacy and tracking preferences in ZyraFit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacySettingsScreen,
});

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative h-7 w-12 rounded-full transition-colors ${
        checked ? "bg-[#4CAF50]" : "bg-[#3A3A3A]"
      } ${disabled ? "opacity-70" : ""}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function PrivacySettingsScreen() {
  const navigate = useNavigate();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [profilingEnabled, setProfilingEnabled] = useState(false);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  const [profilingExpanded, setProfilingExpanded] = useState(false);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-[#0A0A0A] text-white">
      <div className="flex items-center px-4 py-4">
        <button type="button" onClick={() => navigate({ to: "/privacy-consent" })} aria-label="Close">
          <X className="h-6 w-6 text-[#E0E0E0]" />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-semibold">Privacy Settings</h1>
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          aria-label="Confirm"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3A3A3A]"
        >
          ✓
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        <p className="text-[15px] leading-7 text-[#B0B0B0]">
          With your consent, we and our third-party partners will use the following in-app tracking technologies. You
          can choose which non-technical tracking technologies we use.
        </p>
        <p className="mt-4 text-[15px] leading-7 text-[#B0B0B0]">
          For more information about how we process your personal data through tracking technologies, take a look at
          our <span className="font-semibold text-[#FF4D6D]">Privacy Policy</span>.
        </p>

        <div className="mt-6 rounded-2xl bg-[#1A1A1A] p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h2 className="text-base font-semibold">Technical</h2>
              <p className="mt-1 text-sm leading-6 text-[#909090]">
                Essential for the app to function correctly or used only by us to perform aggregated statistical
                analysis.
              </p>
            </div>
            <Toggle checked disabled />
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[#1A1A1A] p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h2 className="text-base font-semibold">Analytics</h2>
              <p className="mt-1 text-sm leading-6 text-[#909090]">
                Used to track the app's traffic and performance, the most and least popular features, and how you
                navigate the app. These trackers may be set by us or our third-party partners.
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Toggle checked={analyticsEnabled} onChange={() => setAnalyticsEnabled((v) => !v)} />
              <button type="button" onClick={() => setAnalyticsExpanded((v) => !v)}>
                <ChevronDown
                  className={`h-5 w-5 text-[#909090] transition-transform ${analyticsExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
          {analyticsExpanded ? (
            <p className="mt-3 text-[13px] leading-6 text-[#707070]">
              Analytics trackers help us understand how users interact with our app, identify popular features, and
              improve the overall user experience.
            </p>
          ) : null}
        </div>

        <div className="mt-4 mb-6 rounded-2xl bg-[#1A1A1A] p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h2 className="text-base font-semibold">Profiling</h2>
              <p className="mt-1 text-sm leading-6 text-[#909090]">
                Used to provide customized services and advertising based on the data you share and your in-app
                behavior, and to measure the effectiveness of our ads. These trackers may be set by us or our
                third-party partners.
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Toggle checked={profilingEnabled} onChange={() => setProfilingEnabled((v) => !v)} />
              <button type="button" onClick={() => setProfilingExpanded((v) => !v)}>
                <ChevronDown
                  className={`h-5 w-5 text-[#909090] transition-transform ${profilingExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
          {profilingExpanded ? (
            <p className="mt-3 text-[13px] leading-6 text-[#707070]">
              Profiling trackers allow us to personalize your experience and show you relevant content and
              advertisements based on your interests and behavior.
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex gap-3 bg-[#0A0A0A] px-6 py-5">
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          className="h-12 flex-1 rounded-full bg-[#2A2A2A] text-sm font-semibold"
        >
          Deny Non-Essential
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          className="h-12 flex-1 rounded-full bg-[#3A3A3A] text-sm font-semibold"
        >
          Accept All
        </button>
      </div>
    </main>
  );
}
