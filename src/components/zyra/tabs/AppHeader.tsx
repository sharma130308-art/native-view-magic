import { Link } from "@tanstack/react-router";
import { Bell, Settings, Sparkles } from "lucide-react";
import { ZyraFitLogo } from "@/components/zyra/ZyraFitLogo";

/** Mirrors Flutter AppHeader: app logo/name, Pro chip, notifications, settings. */
export function AppHeader() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <ZyraFitLogo className="h-8 w-28" />
      <div className="flex-1" />
      <Link
        to="/pricing"
        className="flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1.5 text-xs font-semibold text-foreground"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Pro
      </Link>
      <Link
        to="/notifications"
        aria-label="Notifications"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-foreground"
      >
        <Bell className="h-4 w-4" />
      </Link>
      <Link
        to="/settings"
        aria-label="Settings"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-foreground"
      >
        <Settings className="h-4 w-4" />
      </Link>
    </div>
  );
}
