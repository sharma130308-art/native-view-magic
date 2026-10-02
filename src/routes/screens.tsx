import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { Screen } from "@/components/zyra/TabBar";

export const Route = createFileRoute("/screens")({
  head: () => ({
    meta: [
      { title: "All Screens — ZyraFit Preview" },
      { name: "description", content: "Jump to any screen of the ZyraFit app preview." },
      { property: "og:title", content: "All Screens — ZyraFit Preview" },
      { property: "og:description", content: "Every ZyraFit screen in one list." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Screens,
});

const groups = [
  {
    name: "Start",
    items: [
      ["/splash", "Splash"],
      ["/", "Onboarding"],
      ["/getting-started", "Getting Started"],
      ["/onboarding-survey", "Onboarding Survey"],
      ["/privacy-consent", "Privacy Consent"],
      ["/privacy-settings", "Privacy Settings"],
      ["/ready-to-start", "Ready to Start"],
    ],
  },
  {
    name: "Main tabs",
    items: [
      ["/home", "Home"],
      ["/history", "History"],
      ["/scan", "Scan"],
      ["/insights", "Insights"],
      ["/profile", "Profile"],
    ],
  },
  {
    name: "More",
    items: [
      ["/food-logging", "Food Logging"],
      ["/meal-detail", "Meal Detail"],
      ["/notifications", "Notifications"],
      ["/settings", "Settings"],
      ["/pricing", "Pricing"],
      ["/purchase-history", "Purchase History"],
      ["/preview-doctor", "Preview Doctor (dev tool)"],
    ],
  },
] as const;

function Screens() {
  return (
    <Screen>
      <div className="px-5 py-6">
        <h1 className="text-2xl font-bold">All screens</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tap any screen to open it.</p>
        {groups.map((g) => (
          <section key={g.name} className="mt-6">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.name}</h2>
            <div className="overflow-hidden rounded-2xl bg-card">
              {g.items.map(([to, label]) => (
                <Link key={to} to={to} className="flex items-center justify-between border-b border-border px-4 py-3.5 text-sm last:border-0">
                  {label}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Screen>
  );
}
