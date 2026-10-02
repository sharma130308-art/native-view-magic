import { createFileRoute, Link } from "@tanstack/react-router";
import { BellOff, X } from "lucide-react";
import { useState } from "react";

import { Screen } from "@/components/zyra/TabBar";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — ZyraFit" },
      { name: "description", content: "Your meal reminders, goals, and app updates." },
      { property: "og:title", content: "Notifications — ZyraFit" },
      { property: "og:description", content: "Your meal reminders, goals, and app updates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsScreen,
});

type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  section: "Today" | "This Week" | "Earlier";
  dotColor: string;
};

const INITIAL: Notification[] = [
  {
    id: "1",
    title: "Goal reached!",
    body: "You hit your protein target for today. Nice work.",
    time: "2h ago",
    unread: true,
    section: "Today",
    dotColor: "bg-emerald-500",
  },
  {
    id: "2",
    title: "Time to log lunch",
    body: "Don't forget to track your meal to stay on target.",
    time: "5h ago",
    unread: true,
    section: "Today",
    dotColor: "bg-violet-500",
  },
  {
    id: "3",
    title: "Welcome to ZyraFit",
    body: "Set up your profile to get personalized calorie goals.",
    time: "3d ago",
    unread: false,
    section: "This Week",
    dotColor: "bg-sky-500",
  },
  {
    id: "4",
    title: "Limited time offer",
    body: "Upgrade to Pro and unlock unlimited scans.",
    time: "2w ago",
    unread: false,
    section: "Earlier",
    dotColor: "bg-amber-500",
  },
];

function NotificationsScreen() {
  const [items, setItems] = useState(INITIAL);
  const hasUnread = items.some((n) => n.unread);

  const sections: Notification["section"][] = ["Today", "This Week", "Earlier"];

  return (
    <Screen>
      <div className="flex min-h-svh flex-col">
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <Link
            to="/home"
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          >
            <X className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
          {hasUnread ? (
            <button
              type="button"
              onClick={() => setItems((prev) => prev.map((n) => ({ ...n, unread: false })))}
              className="text-sm font-medium text-muted-foreground"
            >
              Mark all read
            </button>
          ) : (
            <div className="w-9" />
          )}
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
            <BellOff className="mb-3 h-11 w-11 text-muted-foreground/40" />
            <p className="text-base font-semibold text-foreground">No notifications yet</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              We'll let you know when something new happens.
            </p>
          </div>
        ) : (
          <div className="flex-1 pb-6">
            {sections.map((section) => {
              const rows = items.filter((n) => n.section === section);
              if (rows.length === 0) return null;
              return (
                <div key={section}>
                  <p className="px-4 pt-5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {section}
                  </p>
                  {rows.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() =>
                        setItems((prev) =>
                          prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)),
                        )
                      }
                      className={`flex w-full items-start gap-3 border-b border-border/60 px-4 py-3.5 text-left ${
                        n.unread ? "bg-muted/30" : ""
                      }`}
                    >
                      <span className="mt-1.5 w-1.5 shrink-0">
                        {n.unread && <span className={`block h-1.5 w-1.5 rounded-full ${n.dotColor}`} />}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p
                            className={`text-sm ${
                              n.unread ? "font-semibold text-foreground" : "text-foreground/65"
                            }`}
                          >
                            {n.title}
                          </p>
                          <span className="shrink-0 text-[11px] text-muted-foreground/60">
                            {n.time}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">
                          {n.body}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Screen>
  );
}
