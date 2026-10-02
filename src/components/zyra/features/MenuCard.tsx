import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

/** Rounded settings card used to group related rows, mirrors SettingsMenuCard. */
export function MenuCard({
  header,
  children,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-4 overflow-hidden rounded-2xl border border-border bg-card">
      {header ? <div className="px-4 pt-3 pb-1">{header}</div> : null}
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

export function MenuRow({
  icon: Icon,
  title,
  trailing,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
    >
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      <span className="flex-1 text-sm text-foreground">{title}</span>
      {trailing ?? <ChevronRight className="h-5 w-5 text-muted-foreground" />}
    </button>
  );
}

export function MenuSwitchRow({
  icon: Icon,
  title,
  checked,
  onChange,
}: {
  icon: LucideIcon;
  title: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex w-full items-center gap-3 px-4 py-3.5">
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      <span className="flex-1 text-sm text-foreground">{title}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
