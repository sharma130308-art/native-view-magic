import { ChevronDown, Trash2, Share2 } from "lucide-react";

export type DayLog = {
  id: string;
  date: string;
  calories: number;
  target: number;
  status: "Good" | "Close" | "Over" | "Under";
  protein: number;
  carbs: number;
  fat: number;
};

const statusColor: Record<DayLog["status"], string> = {
  Good: "text-emerald-600 bg-emerald-600/10",
  Close: "text-amber-600 bg-amber-600/10",
  Over: "text-destructive bg-destructive/10",
  Under: "text-destructive bg-destructive/10",
};

export function HistoryDayCard({ log }: { log: DayLog }) {
  const progress = log.target > 0 ? Math.min(1, log.calories / log.target) : 0;
  return (
    <div className="mb-4 rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-start">
        <div className="flex-1">
          <p className="text-base font-semibold text-foreground">{log.date}</p>
          <p className="mt-1.5">
            <span className="text-xl font-bold text-primary">{log.calories}</span>
            <span className="text-sm text-muted-foreground"> / {log.target} kcal</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[log.status]}`}>
            {log.status}
          </span>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <span>P {log.protein}g</span>
        <span>C {log.carbs}g</span>
        <span>F {log.fat}g</span>
      </div>
      <div className="mt-3 flex gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Share2 className="h-3.5 w-3.5" /> Share
        </span>
        <span className="flex items-center gap-1">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </span>
      </div>
    </div>
  );
}
