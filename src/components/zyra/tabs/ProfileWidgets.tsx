import { ChevronRight, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] bg-card p-4 shadow-sm">
      <p className="mb-3 text-sm font-bold text-foreground">{title}</p>
      {children}
    </div>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function TdeeSummaryCard() {
  return (
    <SectionCard title="Daily Target">
      <p className="text-3xl font-extrabold text-foreground">2,100 <span className="text-base font-medium text-muted-foreground">kcal</span></p>
      <p className="mt-1 text-xs text-muted-foreground">Based on your activity level and goal</p>
      <button className="mt-3 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground">
        Use recommended
      </button>
    </SectionCard>
  );
}

export function BiometricsSection() {
  return (
    <SectionCard title="Biometrics">
      <Row label="Height" value="175 cm" />
      <Row label="Weight" value="78.4 kg" />
      <Row label="Age" value="29" />
      <Row label="Sex" value="Male" />
    </SectionCard>
  );
}

export function ActivityLevelSelector() {
  const levels = ["Sedentary", "Light", "Moderate", "Active", "Very Active"];
  return (
    <SectionCard title="Activity Level">
      <div className="flex flex-wrap gap-2">
        {levels.map((l, i) => (
          <span
            key={l}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              i === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {l}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}

export function GoalSelector() {
  const goals = ["Lose", "Maintain", "Gain"];
  return (
    <SectionCard title="Goal">
      <div className="flex gap-2">
        {goals.map((g, i) => (
          <span
            key={g}
            className={`flex-1 rounded-full py-2 text-center text-xs font-semibold ${
              i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {g}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Weekly goal: 0.5 kg / week</p>
    </SectionCard>
  );
}

export function MacroTargetsEditor() {
  return (
    <SectionCard title="Macro Targets">
      <Row label="Protein" value="150 g" />
      <Row label="Carbs" value="220 g" />
      <Row label="Fat" value="70 g" />
    </SectionCard>
  );
}

export function AccountSection() {
  return (
    <div className="rounded-[20px] bg-card shadow-sm">
      <Link to="/settings" className="flex items-center gap-3 p-4">
        <Settings className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">App Settings</p>
          <p className="text-xs text-muted-foreground">Account, notifications, theme, language</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Link>
    </div>
  );
}
