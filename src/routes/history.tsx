import { createFileRoute } from "@tanstack/react-router";
import { ListFilter, Search } from "lucide-react";
import { Screen } from "@/components/zyra/TabBar";
import { AppHeader } from "@/components/zyra/tabs/AppHeader";
import { HistoryDayCard, type DayLog } from "@/components/zyra/tabs/HistoryWidgets";

export const Route = createFileRoute("/history")({
  component: HistoryScreen,
  head: () => ({
    meta: [
      { title: "History — ZyraFit" },
      { name: "description", content: "Your daily logs, last 30 days." },
      { property: "og:title", content: "History — ZyraFit" },
      { property: "og:description", content: "Your daily logs, last 30 days." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const logs: DayLog[] = [
  { id: "1", date: "Today", calories: 1420, target: 2100, status: "Under", protein: 92, carbs: 140, fat: 48 },
  { id: "2", date: "Yesterday", calories: 2080, target: 2100, status: "Good", protein: 148, carbs: 210, fat: 68 },
  { id: "3", date: "Feb 12", calories: 2320, target: 2100, status: "Over", protein: 130, carbs: 260, fat: 80 },
  { id: "4", date: "Feb 11", calories: 1980, target: 2100, status: "Close", protein: 140, carbs: 200, fat: 65 },
  { id: "5", date: "Feb 10", calories: 2050, target: 2100, status: "Good", protein: 145, carbs: 205, fat: 66 },
];

function HistoryScreen() {
  return (
    <Screen tab="history">
      <AppHeader />
      <div className="px-4 pb-6 pt-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">History</h1>
          <ListFilter className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Your daily logs, last 30 days</p>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            disabled
            placeholder="Search by date or calories..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <div className="mt-4">
          {logs.map((log) => (
            <HistoryDayCard key={log.id} log={log} />
          ))}
        </div>
      </div>
    </Screen>
  );
}
