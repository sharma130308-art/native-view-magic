import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Copy, ReceiptText, XCircle } from "lucide-react";

import { Screen } from "@/components/zyra/TabBar";

export const Route = createFileRoute("/purchase-history")({
  head: () => ({
    meta: [
      { title: "Purchase History — ZyraFit" },
      { name: "description", content: "View your subscription and purchase history." },
      { property: "og:title", content: "Purchase History — ZyraFit" },
      { property: "og:description", content: "View your subscription and purchase history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PurchaseHistoryScreen,
});

const SUBSCRIPTIONS = [
  {
    id: "1",
    active: true,
    period: "ANNUAL",
    transactionId: "GPA.3399-1234-5678-90123",
    expires: "Expires 12/4/2026",
  },
  {
    id: "2",
    active: false,
    period: "MONTHLY",
    transactionId: "GPA.3399-9876-5432-10987",
    expires: "Expires 3/4/2025",
  },
];

function PurchaseHistoryScreen() {
  return (
    <Screen>
      <div className="flex min-h-svh flex-col">
        <header className="flex items-center gap-2 px-2 pt-4 pb-2">
          <Link
            to="/settings"
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="flex-1 -ml-9 text-center text-lg font-semibold text-foreground">
            Purchase History
          </h1>
        </header>

        {SUBSCRIPTIONS.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
            <ReceiptText className="mb-3 h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-semibold text-foreground">No Purchase History</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your purchase history will appear here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-4 pt-2 pb-8">
            {SUBSCRIPTIONS.map((s) => (
              <div key={s.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      s.active
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.active ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    {s.active ? "Active" : "Expired"}
                  </span>
                  <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {s.period}
                  </span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{s.expires}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <ReceiptText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <p className="flex-1 truncate text-[11px] tabular-nums text-muted-foreground">
                    {s.transactionId}
                  </p>
                  <button type="button" aria-label="Copy transaction ID">
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}
