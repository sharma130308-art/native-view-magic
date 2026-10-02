import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Edit3, QrCode, Search, Send, Flashlight, X } from "lucide-react";
import { useState } from "react";

import { Screen } from "@/components/zyra/TabBar";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Add Food — Scan — ZyraFit" },
      { name: "description", content: "Add food by photo, barcode, or description." },
      { property: "og:title", content: "Add Food — Scan — ZyraFit" },
      { property: "og:description", content: "Add food by photo, barcode, or description." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScanScreen,
});

type ScanMode = "photo" | "barcode" | "describe";

function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>("photo");

  return (
    <Screen>
      <div className="flex h-svh flex-col">
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <Link
            to="/home"
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          >
            <X className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Add Food</h1>
          <Link
            to="/food-logging"
            className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-2 text-xs font-semibold text-foreground"
          >
            <Search className="h-3 w-3" />
            Search
          </Link>
        </header>

        <div className="px-4 pb-2 pt-1">
          <div className="flex rounded-xl bg-muted p-1">
            {(
              [
                { key: "photo", label: "Photo", Icon: Camera },
                { key: "barcode", label: "Barcode", Icon: QrCode },
                { key: "describe", label: "Describe", Icon: Edit3 },
              ] as const
            ).map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
                  mode === key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 px-4 pb-4">
          {mode === "photo" && <PhotoCaptureView />}
          {mode === "barcode" && <BarcodeView onDescribeInstead={() => setMode("describe")} />}
          {mode === "describe" && <DescribeFoodView />}
        </div>
      </div>
    </Screen>
  );
}

function PhotoCaptureView() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-black">
      <div className="relative flex flex-1 items-center justify-center">
        <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-white/40">
          <Camera className="h-12 w-12 text-white/70" />
        </div>
        <p className="absolute bottom-6 px-8 text-center text-sm text-white/80">
          Center your meal in the frame
        </p>
      </div>
      <div className="flex items-center justify-center gap-10 bg-black py-6">
        <div className="h-10 w-10 rounded-lg border border-white/30" />
        <button
          type="button"
          className="h-16 w-16 rounded-full border-4 border-white/80 bg-white/20"
          aria-label="Capture"
        />
        <div className="h-10 w-10 rounded-full border border-white/30" />
      </div>
    </div>
  );
}

function BarcodeView({ onDescribeInstead }: { onDescribeInstead: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden rounded-3xl bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-28 w-56 rounded-2xl border-[3px] border-white/90" />
        </div>
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/20"
          aria-label="Toggle flashlight"
        >
          <Flashlight className="h-5 w-5 text-white" />
        </button>
      </div>
      <p className="py-3 text-center text-sm text-muted-foreground">
        Point at a product barcode
      </p>
      <button
        type="button"
        onClick={onDescribeInstead}
        className="mx-auto text-sm font-medium text-primary underline-offset-2 hover:underline"
      >
        Describe it instead
      </button>
    </div>
  );
}

function DescribeFoodView() {
  const [text, setText] = useState("");
  return (
    <div className="flex h-full flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Describe what you ate, e.g. "2 eggs, toast, and a coffee with milk".
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your meal..."
        rows={6}
        className="w-full resize-none rounded-2xl border border-border bg-card p-4 text-sm text-foreground outline-none"
      />
      <button
        type="button"
        disabled={!text.trim()}
        className="mt-auto flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
      >
        <Send className="h-4 w-4" />
        Analyze
      </button>
    </div>
  );
}
