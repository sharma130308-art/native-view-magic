import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/zyra/TabBar";
import { AppHeader } from "@/components/zyra/tabs/AppHeader";
import {
  CoachCard,
  InsightsProTeaser,
  MacroBreakdownCard,
  PeriodToggle,
  StreakBanner,
  WeeklyTrendChart,
  WeightProgressCard,
} from "@/components/zyra/tabs/InsightsWidgets";

export const Route = createFileRoute("/insights")({
  component: InsightsScreen,
  head: () => ({
    meta: [
      { title: "Insights — ZyraFit" },
      { name: "description", content: "Your AI nutrition coach." },
      { property: "og:title", content: "Insights — ZyraFit" },
      { property: "og:description", content: "Your AI nutrition coach." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const coachCards = [
  { title: "Protein intake is trending low", body: "You've averaged 110g protein this week, below your 150g target. Try adding a protein shake." },
  { title: "Great consistency this week", body: "You logged every meal for 5 days straight. Keep the streak alive!" },
  { title: "Weekend calories spike", body: "Your weekend intake runs ~18% higher than weekdays. Plan a lighter Saturday dinner." },
];

function InsightsScreen() {
  return (
    <Screen tab="insights">
      <AppHeader />
      <div className="space-y-5 px-4 pb-6 pt-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Insights</h1>
          <PeriodToggle period="weekly" />
        </div>
        <p className="-mt-3 text-sm text-muted-foreground">Your AI nutrition coach</p>
        <WeightProgressCard />
        <StreakBanner streak={5} />
        <WeeklyTrendChart />
        <MacroBreakdownCard />
        <div>
          <p className="mb-2 text-xs font-bold tracking-wide text-muted-foreground">COACH</p>
          {coachCards.map((c) => (
            <CoachCard key={c.title} title={c.title} body={c.body} />
          ))}
          <InsightsProTeaser lockedCount={2} />
        </div>
      </div>
    </Screen>
  );
}
