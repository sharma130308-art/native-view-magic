import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Screen } from "@/components/zyra/TabBar";

export const Route = createFileRoute("/food-logging")({
  head: () => ({
    meta: [
      { title: "Add Food — Search — ZyraFit" },
      { name: "description", content: "Search foods, favorites, and recent items to log." },
      { property: "og:title", content: "Add Food — Search — ZyraFit" },
      { property: "og:description", content: "Search foods, favorites, and recent items to log." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FoodLoggingScreen,
});

type FoodItem = {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
};

const FAVORITES: FoodItem[] = [
  { id: "f1", name: "Greek Yogurt", servingSize: "1 cup", calories: 150 },
  { id: "f2", name: "Grilled Chicken", servingSize: "100g", calories: 165 },
  { id: "f3", name: "Banana", servingSize: "1 medium", calories: 105 },
];

const RECENT: FoodItem[] = [
  { id: "r1", name: "Oatmeal", servingSize: "1 bowl", calories: 150 },
  { id: "r2", name: "Protein Shake", servingSize: "1 scoop", calories: 120 },
  { id: "r3", name: "Scrambled Eggs", servingSize: "2 eggs", calories: 180 },
];

const CATALOG: FoodItem[] = [
  ...FAVORITES,
  ...RECENT,
  { id: "c1", name: "Avocado Toast", servingSize: "1 slice", calories: 220 },
  { id: "c2", name: "Brown Rice", servingSize: "1 cup", calories: 215 },
];

function FoodLoggingScreen() {
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [sessionCalories, setSessionCalories] = useState(0);

  const isSearching = query.length > 0;
  const results = useMemo(
    () =>
      isSearching
        ? CATALOG.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
        : [],
    [query, isSearching],
  );

  function addFood(food: FoodItem) {
    if (added.has(food.id)) return;
    setAdded((prev) => new Set(prev).add(food.id));
    setSessionCalories((c) => c + food.calories);
    setTimeout(() => {
      setAdded((prev) => {
        const next = new Set(prev);
        next.delete(food.id);
        return next;
      });
    }, 3000);
  }

  return (
    <Screen>
      <div className="flex h-svh flex-col">
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <Link
            to="/scan"
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          >
            <X className="h-5 w-5 text-foreground" />
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground">Add Food</h1>
            {sessionCalories > 0 && (
              <p className="text-xs font-medium text-primary">Total: {sessionCalories} kcal</p>
            )}
          </div>
          <div className="h-9 w-9" />
        </header>

        <div className="mx-4 my-2 flex items-center gap-2 rounded-xl bg-card px-4 py-3 shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for food..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          {!isSearching ? (
            <>
              <Section title="Favorites">
                <div className="flex gap-3 overflow-x-auto px-4">
                  {FAVORITES.map((food) => (
                    <FavoriteCard
                      key={food.id}
                      food={food}
                      isAdded={added.has(food.id)}
                      onAdd={() => addFood(food)}
                    />
                  ))}
                </div>
              </Section>
              <Section title="Recent Foods">
                <div className="flex flex-col">
                  {RECENT.map((food) => (
                    <FoodRow
                      key={food.id}
                      food={food}
                      isAdded={added.has(food.id)}
                      onAdd={() => addFood(food)}
                    />
                  ))}
                </div>
              </Section>
            </>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center px-8 py-16 text-center">
              <Search className="mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-base font-semibold text-foreground">No results found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try searching with different terms
              </p>
            </div>
          ) : (
            <Section title="Search Results">
              <div className="flex flex-col">
                {results.map((food) => (
                  <FoodRow
                    key={food.id}
                    food={food}
                    isAdded={added.has(food.id)}
                    onAdd={() => addFood(food)}
                  />
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="px-4 py-2 text-sm font-semibold text-foreground">{title}</p>
      {children}
    </div>
  );
}

function AddButton({ isAdded, onAdd }: { isAdded: boolean; onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={isAdded}
      aria-label="Add food"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        isAdded ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
      }`}
    >
      {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}

function FavoriteCard({
  food,
  isAdded,
  onAdd,
}: {
  food: FoodItem;
  isAdded: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex h-40 w-32 shrink-0 flex-col justify-between rounded-2xl bg-card p-3 shadow-sm">
      <div className="h-16 w-full rounded-lg bg-muted" />
      <div>
        <p className="line-clamp-1 text-xs font-semibold text-foreground">{food.name}</p>
        <p className="text-[11px] text-muted-foreground">{food.calories} kcal</p>
      </div>
      <AddButton isAdded={isAdded} onAdd={onAdd} />
    </div>
  );
}

function FoodRow({
  food,
  isAdded,
  onAdd,
}: {
  food: FoodItem;
  isAdded: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="mx-4 my-1 flex items-center gap-3 rounded-xl bg-card p-4">
      <div className="h-12 w-12 shrink-0 rounded-lg bg-muted" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{food.name}</p>
        <p className="text-xs text-muted-foreground">
          {food.servingSize} · {food.calories} kcal
        </p>
      </div>
      <AddButton isAdded={isAdded} onAdd={onAdd} />
    </div>
  );
}
