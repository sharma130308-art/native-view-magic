import { Egg, Flame, Droplet, UtensilsCrossed, Wheat } from "lucide-react";
import { ProgressRing } from "./ProgressRing";

export function StreakChip({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-sm">
      <Flame className="h-4 w-4 text-[#FF7A1A]" />
      <span className="text-sm font-extrabold text-foreground">{streak}</span>
    </div>
  );
}

const WEEK_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekDaySelector({ todayIndex = 3 }: { todayIndex?: number }) {
  const calories = [1850, 2100, 1750, 1420, 0, 0, 0];
  const targets = [2000, 2000, 2000, 2000, 2000, 2000, 2000];
  return (
    <div className="flex">
      {WEEK_LABELS.map((label, i) => {
        const isToday = i === todayIndex;
        const isFuture = i > todayIndex;
        const ratio = calories[i] > 0 ? calories[i] / targets[i] : 0;
        let color = "rgb(148 163 184 / 0.35)";
        let progress = 0;
        if (isToday) {
          color = "hsl(var(--primary))";
          progress = ratio;
        } else if (isFuture || calories[i] === 0) {
          color = "rgb(148 163 184 / 0.35)";
          progress = 0;
        } else if (ratio > 1.08) {
          color = "#EF5350";
          progress = 1;
        } else {
          color = "#34C759";
          progress = ratio;
        }
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <span className={`text-xs ${isToday ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
              {label}
            </span>
            <ProgressRing progress={progress} size={30} strokeWidth={2.5} color={color} bgColor="transparent">
              <span className="text-[11px] font-semibold text-foreground">{i + 18}</span>
            </ProgressRing>
          </div>
        );
      })}
    </div>
  );
}

export function CalorieSummaryCard({ current, target }: { current: number; target: number }) {
  const progress = target > 0 ? current / target : 0;
  const remaining = Math.max(0, target - current);
  return (
    <div className="flex w-full items-center rounded-[26px] bg-card p-[22px] shadow-sm">
      <div className="flex-1">
        <p className="text-3xl font-extrabold tracking-tight text-foreground">
          {current}
          <span className="text-base font-semibold text-muted-foreground"> /{target}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Calories eaten</p>
        <p className="mt-1.5 text-xs font-medium text-muted-foreground/80">{remaining} kcal left</p>
      </div>
      <ProgressRing progress={progress} size={104} strokeWidth={11} color="hsl(var(--primary))" bgColor="rgb(148 163 184 / 0.18)">
        <Flame className="h-8 w-8 text-primary" />
      </ProgressRing>
    </div>
  );
}

export function MacroRingCard({
  label,
  current,
  target,
  color,
  icon: Icon,
}: {
  label: string;
  current: number;
  target: number;
  color: string;
  icon: typeof Egg;
}) {
  const progress = target > 0 ? current / target : 0;
  return (
    <div className="flex-1 rounded-[20px] bg-card px-3 py-3.5 shadow-sm">
      <p className="truncate text-lg font-extrabold text-foreground">
        {current}
        <span className="text-xs font-medium text-muted-foreground">/{target}g</span>
      </p>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">{label}</p>
      <div className="mt-3 flex justify-center">
        <ProgressRing progress={progress} size={54} strokeWidth={6} color={color} bgColor={`${color}26`}>
          <Icon className="h-[22px] w-[22px]" style={{ color }} />
        </ProgressRing>
      </div>
    </div>
  );
}

export function RecentMealsSection() {
  const meals = [
    { name: "Grilled Chicken Salad", calories: 420, time: "12:30 PM" },
    { name: "Greek Yogurt & Berries", calories: 210, time: "8:15 AM" },
    { name: "Protein Shake", calories: 180, time: "6:45 AM" },
  ];
  return (
    <div>
      <h3 className="mb-3 text-base font-bold text-foreground">Recent Meals</h3>
      <div className="space-y-2.5">
        {meals.map((m) => (
          <div key={m.name} className="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.time}</p>
            </div>
            <p className="text-sm font-bold text-foreground">{m.calories} kcal</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WaterIntakeWidget({ waterIntake = 4 }: { waterIntake?: number }) {
  const progress = waterIntake / 8;
  return (
    <div className="rounded-[20px] bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Water Intake</h3>
        <span className="text-sm font-medium text-muted-foreground">{waterIntake} / 8 glasses</span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => {
          const active = i < waterIntake;
          return (
            <div key={i} className="flex aspect-[0.74] items-center justify-center rounded-md border border-border">
              <Droplet className={`h-5 w-5 ${active ? "fill-sky-400 text-sky-400" : "text-muted-foreground/40"}`} />
            </div>
          );
        })}
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-sky-400" style={{ width: `${Math.min(1, progress) * 100}%` }} />
      </div>
    </div>
  );
}

export { Egg, Wheat };
