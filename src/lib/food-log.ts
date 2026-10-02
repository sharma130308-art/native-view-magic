import { useEffect, useState } from "react";

export type LoggedItem = { name: string; serving: string; calories: number; protein: number; carbs: number; fat: number };
export type LogEntry = { at: string; items: LoggedItem[] };

const KEY = "zyrafit-food-log";

export function readFoodLog(): LogEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as LogEntry[];
  } catch {
    return [];
  }
}

export function addToFoodLog(items: LoggedItem[]) {
  const log = readFoodLog();
  log.push({ at: new Date().toISOString(), items });
  localStorage.setItem(KEY, JSON.stringify(log));
}

/** Today's logged entries (read after hydration). */
export function useTodayLog() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  useEffect(() => {
    const today = new Date().toDateString();
    setEntries(readFoodLog().filter((e) => new Date(e.at).toDateString() === today));
  }, []);
  const totals = entries
    .flatMap((e) => e.items)
    .reduce(
      (a, i) => ({
        calories: a.calories + (i.calories || 0),
        protein: a.protein + (i.protein || 0),
        carbs: a.carbs + (i.carbs || 0),
        fat: a.fat + (i.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  return { entries, totals };
}
