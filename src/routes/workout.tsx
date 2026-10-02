import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RoutineBuilder } from "@/components/zyra/features/RoutineBuilder";

import { Screen } from "@/components/zyra/TabBar";
import { AppHeader } from "@/components/zyra/tabs/AppHeader";
import { WorkoutVideoLibrary } from "@/components/zyra/features/WorkoutVideoLibrary";

export const Route = createFileRoute("/workout")({
  component: WorkoutScreen,
  head: () => ({
    meta: [
      { title: "Workout — ZyraFit" },
      { name: "description", content: "Browse workout videos by muscle group." },
      { property: "og:title", content: "Workout — ZyraFit" },
      { property: "og:description", content: "Browse workout videos by muscle group." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function WorkoutScreen() {
  const [tab, setTab] = useState<"library" | "plans">("library");
  return (
    <Screen tab="workout">
      <AppHeader />
      <div className="px-4 pb-6 pt-1">
        <h1 className="text-2xl font-bold text-foreground">Workout</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick a muscle group and train along</p>
        <div className="mt-3 grid grid-cols-2 rounded-xl bg-muted p-1 text-sm font-medium">
          {(["library", "plans"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-lg py-2 ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "library" ? "Library" : "My routines"}
            </button>
          ))}
        </div>
        {tab === "library" ? <WorkoutVideoLibrary /> : <RoutineBuilder />}
      </div>
    </Screen>
  );
}
