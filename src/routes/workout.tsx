import { createFileRoute } from "@tanstack/react-router";
import { Bike, Dumbbell, Flame, Footprints, Play, Timer } from "lucide-react";

import { Screen } from "@/components/zyra/TabBar";
import { AppHeader } from "@/components/zyra/tabs/AppHeader";
import { Button } from "@/components/ui/button";
import { WorkoutVideoLibrary } from "@/components/zyra/features/WorkoutVideoLibrary";

export const Route = createFileRoute("/workout")({
  component: WorkoutScreen,
  head: () => ({
    meta: [
      { title: "Workout — ZyraFit" },
      { name: "description", content: "Track workouts and daily movement." },
      { property: "og:title", content: "Workout — ZyraFit" },
      { property: "og:description", content: "Track workouts and daily movement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const workouts = [
  { name: "Strength training", detail: "Full body · 30 min", Icon: Dumbbell },
  { name: "Outdoor walk", detail: "Easy pace · 20 min", Icon: Footprints },
  { name: "Cycling", detail: "Moderate · 25 min", Icon: Bike },
];

function WorkoutScreen() {
  return (
    <Screen tab="workout">
      <AppHeader />
      <div className="px-4 pb-6 pt-1">
        <h1 className="text-2xl font-bold text-foreground">Workout</h1>
        <p className="mt-1 text-sm text-muted-foreground">Move more, feel stronger</p>

        <section className="mt-5 rounded-2xl bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today’s activity</p>
              <p className="mt-1 text-3xl font-bold text-foreground">32 min</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Flame className="h-7 w-7 text-primary" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Calories burned</p>
              <p className="mt-1 font-semibold text-foreground">214 kcal</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active streak</p>
              <p className="mt-1 font-semibold text-foreground">4 days</p>
            </div>
          </div>
        </section>

        <Button size="pill" className="mt-4 gap-2">
          <Play className="h-5 w-5" fill="currentColor" />
          Start workout
        </Button>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Quick start</h2>
            <Timer className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-3 overflow-hidden rounded-2xl bg-card">
            {workouts.map(({ name, detail, Icon }) => (
              <div key={name} className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
                <Play className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </section>
        <WorkoutVideoLibrary />
      </div>
    </Screen>
  );
}