import { createFileRoute } from "@tanstack/react-router";
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
