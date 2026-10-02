import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BarChart3, Ban, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Screen } from "@/components/zyra/TabBar";
import { ZyraFitLogo } from "@/components/zyra/ZyraFitLogo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "ZyraFit Pro — Pricing" },
      { name: "description", content: "Unlock ZyraFit Pro for unlimited scans, insights, and more." },
      { property: "og:title", content: "ZyraFit Pro — Pricing" },
      { property: "og:description", content: "Unlock ZyraFit Pro for unlimited scans, insights, and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingScreen,
});

type PlanId = "annual" | "monthly" | "weekly";

const plans: Record<PlanId, { label: string; price: string; sub: string; badge?: string }> = {
  annual: { label: "Annual", price: "$39.99/yr", sub: "$0.77/week", badge: "Best Value" },
  monthly: { label: "Monthly", price: "$7.99/mo", sub: "$1.84/week" },
  weekly: { label: "Weekly", price: "$2.99/wk", sub: "billed weekly" },
};

const features = [
  { icon: Sparkles, label: "Unlimited AI meal scans" },
  { icon: BarChart3, label: "Advanced nutrition insights" },
  { icon: Ban, label: "No ads, ever" },
];

function PricingScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<PlanId>("annual");

  const close = () => navigate({ to: "/home" });

  return (
    <Screen>
    <div className="relative mx-auto flex min-h-svh w-full max-w-md flex-col bg-background text-foreground">
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="rounded-full bg-black/10 px-4 py-2 text-[11px] font-semibold">What do I get?</span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-6 pt-6">
        <div className="flex h-40 items-center justify-center overflow-hidden rounded-3xl bg-primary/5 px-6">
          <ZyraFitLogo className="h-auto w-full" />
        </div>

        <h1 className="mt-6 text-center text-xl font-extrabold leading-snug">
          Unlock ZyraFit Pro and reach your goals faster
        </h1>

        <div className="mt-6 flex flex-col gap-3">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-3 rounded-xl bg-card px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="flex-1 text-sm font-medium">{f.label}</span>
              <Check className="h-4 w-4 text-primary" />
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {(Object.keys(plans) as PlanId[]).map((id) => {
            const plan = plans[id];
            const active = selected === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition-colors ${
                  active ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{plan.label}</span>
                    {plan.badge ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-xs text-muted-foreground">{plan.sub}</span>
                </div>
                <span className="text-base font-bold">{plan.price}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        <button
          type="button"
          onClick={close}
          className="mt-6 h-14 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground"
        >
          Continue
        </button>
        <div className="mt-4 flex justify-center gap-5 text-xs text-muted-foreground">
          <button type="button" onClick={close}>Restore</button>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
      </div>
    </div>
  </Screen>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
