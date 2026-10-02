import { createFileRoute, Link } from "@tanstack/react-router";
import { Egg, Grape, Plus, Wheat } from "lucide-react";
import { Screen } from "@/components/zyra/TabBar";
import { AppHeader } from "@/components/zyra/tabs/AppHeader";
import {
  CalorieSummaryCard,
  MacroRingCard,
  RecentMealsSection,
  StreakChip,
  WaterIntakeWidget,
  WeekDaySelector,
} from "@/components/zyra/tabs/DashboardWidgets";

export const Route = createFileRoute("/home")({
  component: HomeScreen,
  head: () => ({
    meta: [
      { title: "Today — ZyraFit" },
      { name: "description", content: "Your daily calorie and macro summary at a glance." },
      { property: "og:title", content: "Today — ZyraFit" },
      { property: "og:description", content: "Your daily calorie and macro summary at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function HomeScreen() {
  const currentCalories = 1420;
  const targetCalories = 2100;
  const streak = 5;

  return (
    <Screen tab="home">
      <AppHeader />
      <div className="space-y-5 px-4 pb-6 pt-1">
        <div className="flex items-center">
          <h1 className="flex-1 text-2xl font-extrabold text-foreground">Today</h1>
          {streak > 0 && <StreakChip streak={streak} />}
        </div>
        <WeekDaySelector />
        <CalorieSummaryCard current={currentCalories} target={targetCalories} />
        <div className="flex gap-3">
          <MacroRingCard label="Protein" current={92} target={150} color="#FF6B6B" icon={Egg} />
          <MacroRingCard label="Carbs" current={140} target={220} color="#FFB84D" icon={Wheat} />
          <MacroRingCard label="Fat" current={48} target={70} color="#4DA3FF" icon={Grape} />
        </div>
        <RecentMealsSection />
        <WaterIntakeWidget waterIntake={4} />
      </div>
      <Link
        to="/food-logging"
        aria-label="Log food"
        className="fixed bottom-20 right-4 z-30 mx-auto flex h-14 w-14 max-w-md items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
        style={{ right: "calc(50% - 12rem + 1rem)" }}
      >
        <Plus className="h-7 w-7" />
      </Link>
    </Screen>
  );
}
