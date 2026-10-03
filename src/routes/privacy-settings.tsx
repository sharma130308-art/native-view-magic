import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Screen } from "@/components/zyra/TabBar";

export const Route = createFileRoute("/privacy-settings")({
  head: () => ({
    meta: [
      { title: "ZyraFit — Privacy" },
      { name: "description", content: "How ZyraFit handles tracking and your data." },
      { property: "og:title", content: "ZyraFit — Privacy" },
      { property: "og:description", content: "How ZyraFit handles tracking and your data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacySettingsScreen,
});

const rows: [string, string][] = [
  ["Technical", "Needed for the app to work (sign-in and saving your routines). Always on."],
  ["Analytics", "Not used. ZyraFit does not use third-party analytics."],
  ["Advertising and profiling", "Not used. ZyraFit shows no ads and does not build advertising profiles."],
];

function PrivacySettingsScreen() {
  const navigate = useNavigate();
  return (
    <Screen>
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-[#0A0A0A] text-white">
        <div className="flex items-center px-4 py-4">
          <button type="button" onClick={() => navigate({ to: "/settings" })} aria-label="Close">
            <X className="h-6 w-6 text-[#E0E0E0]" />
          </button>
          <h1 className="flex-1 pr-6 text-center text-[17px] font-semibold">Privacy</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {rows.map(([title, text]) => (
            <div key={title} className="mt-4 rounded-2xl bg-[#1A1A1A] p-4">
              <h2 className="text-base font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-[#909090]">{text}</p>
            </div>
          ))}
          <p className="mt-6 text-[15px] leading-7 text-[#B0B0B0]">
            Read the full <Link to="/privacy" className="font-semibold text-[#FF4D6D]">Privacy Policy</Link>. You can
            delete your account in Settings.
          </p>
        </div>
      </div>
    </Screen>
  );
}
