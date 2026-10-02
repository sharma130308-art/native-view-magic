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

export type Goals = { calories: number; protein: number; carbs: number; fat: number; water: number };
export const DEFAULT_GOALS: Goals = { calories: 2100, protein: 150, carbs: 220, fat: 70, water: 8 };
const GOALS_KEY = "zyrafit-goals";
const waterKey = () => `zyrafit-water-${new Date().toDateString()}`;

export function useGoals() {
  const [goals, setGoalsState] = useState<Goals>(DEFAULT_GOALS);
  useEffect(() => {
    try {
      setGoalsState({ ...DEFAULT_GOALS, ...JSON.parse(localStorage.getItem(GOALS_KEY) ?? "{}") });
    } catch {
      // keep defaults
    }
  }, []);
  const setGoals = (g: Goals) => {
    setGoalsState(g);
    localStorage.setItem(GOALS_KEY, JSON.stringify(g));
  };
  return { goals, setGoals };
}

export function useTodayWater() {
  const [glasses, setGlassesState] = useState(0);
  useEffect(() => {
    setGlassesState(Number(localStorage.getItem(waterKey())) || 0);
  }, []);
  const setGlasses = (n: number) => {
    const v = Math.max(0, Math.min(20, n));
    setGlassesState(v);
    localStorage.setItem(waterKey(), String(v));
  };
  return { glasses, setGlasses };
}
