import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, History } from "lucide-react";
import { Screen } from "@/components/zyra/TabBar";
import { AppHeader } from "@/components/zyra/tabs/AppHeader";
import {
  AccountSection,
  ActivityLevelSelector,
  BiometricsSection,
  GoalSelector,
  MacroTargetsEditor,
  TdeeSummaryCard,
} from "@/components/zyra/tabs/ProfileWidgets";

export const Route = createFileRoute("/profile")({
  component: ProfileScreen,
  head: () => ({
    meta: [
      { title: "Profile & Goals — ZyraFit" },
      { name: "description", content: "Personalize your daily targets." },
      { property: "og:title", content: "Profile & Goals — ZyraFit" },
      { property: "og:description", content: "Personalize your daily targets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function ProfileScreen() {
  return (
    <Screen tab="profile">
      <AppHeader />
      <div className="space-y-5 px-4 pb-6 pt-1">
        <h1 className="text-2xl font-bold text-foreground">Profile & Goals</h1>
        <p className="-mt-3 text-sm text-muted-foreground">Personalize your daily targets</p>
        <Link
          to="/history"
          className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">History</p>
            <p className="text-xs text-muted-foreground">View your daily food logs</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        <TdeeSummaryCard />
        <BiometricsSection />
        <ActivityLevelSelector />
        <GoalSelector />
        <MacroTargetsEditor />
        <AccountSection />
      </div>
    </Screen>
  );
}
