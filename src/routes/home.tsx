import { createFileRoute, Link } from "@tanstack/react-router";
import { Egg, Grape, Plus, Target, Wheat } from "lucide-react";
import { useState } from "react";
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
import { type Goals, useGoals, useTodayLog, useTodayWater, useWeekSummary } from "@/lib/food-log";

function GoalsSheet({ goals, onClose, onSave }: { goals: Goals; onClose: () => void; onSave: (g: Goals) => void }) {
  const [draft, setDraft] = useState(goals);
  const fields: { key: keyof Goals; label: string; unit: string }[] = [
    { key: "calories", label: "Calories", unit: "kcal" },
    { key: "protein", label: "Protein", unit: "g" },
    { key: "carbs", label: "Carbs", unit: "g" },
    { key: "fat", label: "Fat", unit: "g" },
    { key: "water", label: "Water", unit: "glasses" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl bg-background p-5 pb-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-bold text-foreground">Daily goals</h2>
        <div className="space-y-3">
          {fields.map((f) => (
            <label key={f.key} className="flex items-center gap-3">
              <span className="flex-1 text-sm font-medium text-foreground">{f.label}</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                aria-label={f.label}
                value={draft[f.key]}
                onChange={(e) => setDraft({ ...draft, [f.key]: Math.max(0, Number(e.target.value) || 0) })}
                className="w-24 rounded-xl bg-muted px-3 py-2 text-right text-sm text-foreground outline-none"
              />
              <span className="w-14 text-xs text-muted-foreground">{f.unit}</span>
            </label>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-2xl bg-muted py-3 text-sm font-semibold text-foreground">
            Cancel
          </button>
          <button type="button" onClick={() => onSave(draft)} className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            Save goals
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const { entries, totals } = useTodayLog();
  const { goals, setGoals } = useGoals();
  const { glasses, setGlasses } = useTodayWater();
  const [editing, setEditing] = useState(false);
  const currentCalories = Math.round(totals.calories);
  const week = useWeekSummary();
  const streak = week?.streak ?? 0;
  const meals = [...entries].reverse().map((e) => ({
    name: e.items.map((i) => i.name).join(", ") || "Meal",
    calories: Math.round(e.items.reduce((s, i) => s + (i.calories || 0), 0)),
    time: new Date(e.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  }));

  return (
    <Screen tab="home">
      <AppHeader />
      <div className="space-y-5 px-4 pb-24 pt-1">
        <div className="flex items-center gap-2">
          <h1 className="flex-1 text-2xl font-extrabold text-foreground">Today</h1>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm"
          >
            <Target className="h-4 w-4 text-primary" />
            Goals
          </button>
          {streak > 0 && <StreakChip streak={streak} />}
        </div>
        <WeekDaySelector days={week?.days ?? null} target={goals.calories} />
        <CalorieSummaryCard current={currentCalories} target={goals.calories} />
        <div className="flex gap-3">
          <MacroRingCard label="Protein" current={Math.round(totals.protein)} target={goals.protein} color="#FF6B6B" icon={Egg} />
          <MacroRingCard label="Carbs" current={Math.round(totals.carbs)} target={goals.carbs} color="#FFB84D" icon={Wheat} />
          <MacroRingCard label="Fat" current={Math.round(totals.fat)} target={goals.fat} color="#4DA3FF" icon={Grape} />
        </div>
        <WaterIntakeWidget waterIntake={glasses} goal={goals.water} onChange={setGlasses} />
        <RecentMealsSection meals={meals} />
      </div>
      {editing && <GoalsSheet goals={goals} onClose={() => setEditing(false)} onSave={(g) => { setGoals(g); setEditing(false); }} />}
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
