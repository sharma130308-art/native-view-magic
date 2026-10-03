import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BarChart3, Sparkles, X } from "lucide-react";
import { Screen } from "@/components/zyra/TabBar";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "ZyraFit Pro — Coming soon" },
      { name: "description", content: "ZyraFit Pro is coming soon." },
      { property: "og:title", content: "ZyraFit Pro — Coming soon" },
      { property: "og:description", content: "ZyraFit Pro is coming soon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PricingScreen,
});

const features = [
  { icon: Sparkles, label: "More AI meal scans" },
  { icon: BarChart3, label: "Advanced nutrition insights" },
];

function PricingScreen() {
  const navigate = useNavigate();
  const close = () => navigate({ to: "/home" });

  return (
    <Screen>
      <div className="relative mx-auto flex min-h-svh w-full max-w-md flex-col bg-background text-foreground">
        <div className="flex items-center px-4 pt-4">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-6 pt-6">
          <div className="flex h-40 items-center justify-center overflow-hidden rounded-3xl bg-primary/5 px-6">
            <span className="text-3xl font-extrabold tracking-tight text-primary">ZyraFit Pro</span>
          </div>
          <h1 className="mt-6 text-center text-xl font-extrabold leading-snug">Premium is coming soon</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Everything in ZyraFit is free for now. We will show the price clearly before you pay for anything.
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">Planned:</p>
          <div className="mt-3 flex flex-col gap-3">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3 rounded-xl bg-card px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="flex-1 text-sm font-medium">{f.label}</span>
              </div>
            ))}
          </div>
          <div className="flex-1" />
          <button
            type="button"
            onClick={close}
            className="mt-6 h-14 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground"
          >
            Back to app
          </button>
        </div>
      </div>
    </Screen>
  );
}
