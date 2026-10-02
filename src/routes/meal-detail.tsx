import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Flame, Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

import { Screen } from "@/components/zyra/TabBar";

export const Route = createFileRoute("/meal-detail")({
  head: () => ({
    meta: [
      { title: "Nutrition — Meal Detail — ZyraFit" },
      { name: "description", content: "Nutrition detail for a logged meal." },
      { property: "og:title", content: "Nutrition — Meal Detail — ZyraFit" },
      { property: "og:description", content: "Nutrition detail for a logged meal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MealDetailScreen,
});

const ENTRY = {
  foodName: "Grilled Chicken Salad",
  mealType: "Lunch",
  time: "12:30pm",
  calories: 420,
  protein: 38,
  carbs: 22,
  fat: 18,
  servingSize: "1 bowl",
};

function MealDetailScreen() {
  const [qty, setQty] = useState(1);
  const cal = Math.round(ENTRY.calories * qty);

  return (
    <Screen>
      <div className="flex min-h-svh flex-col">
        <div className="relative flex h-56 shrink-0 items-center justify-center bg-gradient-to-b from-primary/30 via-primary/10 to-transparent">
          <Link
            to="/history"
            aria-label="Back"
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-card/80"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <p className="absolute top-5 left-0 right-0 text-center text-base font-semibold text-foreground">
            Nutrition
          </p>
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/25 bg-primary/15">
            <UtensilsCrossed className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="flex-1 px-5 pb-8 pt-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-foreground">{ENTRY.foodName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {ENTRY.mealType} · {ENTRY.time}
              </p>
            </div>
            <div className="flex items-center rounded-full border border-border bg-card">
              <button
                type="button"
                aria-label="Decrease"
                onClick={() => setQty((q) => Math.max(0.5, q - 0.5))}
                className="p-2"
              >
                <Minus className="h-4 w-4 text-foreground" />
              </button>
              <span className="min-w-6 text-center text-sm font-bold text-foreground">{qty}</span>
              <button
                type="button"
                aria-label="Increase"
                onClick={() => setQty((q) => q + 0.5)}
                className="p-2"
              >
                <Plus className="h-4 w-4 text-foreground" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Calories</p>
              <p className="text-2xl font-extrabold text-foreground">{cal}</p>
            </div>
          </div>

          <div className="mt-3.5 flex gap-3">
            <MacroCard label="Protein" grams={ENTRY.protein * qty} color="bg-blue-500" />
            <MacroCard label="Carbs" grams={ENTRY.carbs * qty} color="bg-amber-500" />
            <MacroCard label="Fat" grams={ENTRY.fat * qty} color="bg-pink-500" />
          </div>

          <div className="mt-3.5 flex items-center rounded-2xl border border-border bg-card p-3.5">
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            <p className="ml-2.5 text-sm text-foreground">Serving</p>
            <p className="ml-auto text-sm font-semibold text-foreground">{ENTRY.servingSize}</p>
          </div>

          <div className="mt-7 flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-xl border border-destructive/40 py-3.5 text-sm font-semibold text-destructive"
            >
              <span className="inline-flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </span>
            </button>
            <Link
              to="/history"
              className="flex-1 rounded-xl bg-primary py-3.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Done
            </Link>
          </div>
        </div>
      </div>
    </Screen>
  );
}

function MacroCard({ label, grams, color }: { label: string; grams: number; color: string }) {
  return (
    <div className="flex-1 rounded-2xl border border-border bg-card px-2.5 py-3.5 text-center">
      <span className={`mx-auto mb-2 block h-3 w-3 rounded-full ${color}`} />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-extrabold text-foreground">{Math.round(grams)}g</p>
    </div>
  );
}
