import { Link } from "@tanstack/react-router";
import { BarChart3, Dumbbell, Home, ScanLine, User } from "lucide-react";

import { tapHaptic } from "@/lib/haptics";

type Tab = "home" | "workout" | "insights" | "profile";

const tabs = [
  { key: "home", label: "Home", to: "/home", Icon: Home },
  { key: "workout", label: "Workout", to: "/workout", Icon: Dumbbell },
  { key: "insights", label: "Insights", to: "/insights", Icon: BarChart3 },
  { key: "profile", label: "Profile", to: "/profile", Icon: User },
] as const;

/** Main navigation: Home · Workout · [Scan] · Insights · Profile. */
export function TabBar({ active }: { active: Tab }) {
  const item = (t: (typeof tabs)[number]) => (
    <Link
      key={t.key}
      to={t.to}
      onClick={tapHaptic}
      className={`press flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] ${
        active === t.key ? "font-semibold text-primary" : "text-muted-foreground"
      }`}
    >
      <t.Icon className="h-[22px] w-[22px]" strokeWidth={active === t.key ? 2.4 : 1.8} />
      {t.label}
    </Link>
  );
  return (
    <nav className="sticky bottom-0 z-20 flex h-[calc(4rem+env(safe-area-inset-bottom))] shrink-0 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      {tabs.slice(0, 2).map(item)}
      <div className="flex flex-1 items-center justify-center">
        <Link
          to="/scan"
          aria-label="Scan"
          onClick={tapHaptic}
          className="press -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
        >
          <ScanLine className="h-6 w-6" />
        </Link>
      </div>
      {tabs.slice(2).map(item)}
    </nav>
  );
}

/** Phone-width page shell used by every recreated screen. */
export function Screen({ children, tab }: { children: React.ReactNode; tab?: Tab }) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-background text-foreground">
      <div className="flex-1">{children}</div>
      {tab ? <TabBar active={tab} /> : null}
    </div>
  );
}
