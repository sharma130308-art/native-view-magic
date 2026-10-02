import { Flame, Lightbulb, Lock, Scale, TrendingUp } from "lucide-react";

export function PeriodToggle({ period }: { period: "weekly" | "monthly" }) {
  return (
    <div className="flex rounded-full bg-muted p-1 text-xs font-semibold">
      {(["weekly", "monthly"] as const).map((p) => (
        <span
          key={p}
          className={`rounded-full px-3 py-1.5 capitalize ${
            p === period ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          {p}
        </span>
      ))}
    </div>
  );
}

export function WeightProgressCard() {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Weight Progress</span>
        </div>
        <span className="text-sm font-bold text-foreground">78.4 kg</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Down 1.2 kg this month</p>
    </div>
  );
}

export function StreakBanner({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-primary/10 p-4">
      <Flame className="h-6 w-6 text-[#FF7A1A]" />
      <div>
        <p className="text-sm font-bold text-foreground">{streak}-day logging streak</p>
        <p className="text-xs text-muted-foreground">Keep it going!</p>
      </div>
    </div>
  );
}

export function WeeklyTrendChart() {
  const values = [1800, 2100, 1950, 2200, 1750, 1900, 2050];
  const max = Math.max(...values);
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Weekly Trend</span>
      </div>
      <div className="flex h-24 items-end gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex-1 rounded-t bg-primary/70" style={{ height: `${(v / max) * 100}%` }} />
        ))}
      </div>
    </div>
  );
}

export function MacroBreakdownCard() {
  const macros = [
    { label: "Protein", pct: 30, color: "#FF6B6B" },
    { label: "Carbs", pct: 45, color: "#FFB84D" },
    { label: "Fat", pct: 25, color: "#4DA3FF" },
  ];
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-foreground">Macro Breakdown</p>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {macros.map((m) => (
          <div key={m.label} style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        {macros.map((m) => (
          <span key={m.label} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
            {m.label} {m.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

export function CoachCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-3 rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}

export function InsightsProTeaser({ lockedCount }: { lockedCount: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-muted p-4">
      <Lock className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="text-sm font-semibold text-foreground">
          {lockedCount} more insight{lockedCount === 1 ? "" : "s"} locked
        </p>
        <p className="text-xs text-muted-foreground">Upgrade to Pro to unlock your full coach feed.</p>
      </div>
    </div>
  );
}
