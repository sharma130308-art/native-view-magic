import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Camera, Check, Edit3, Flashlight, FlashlightOff, QrCode, Search, Send, X, Loader2, ImagePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Screen } from "@/components/zyra/TabBar";
import { authedFetch } from "@/lib/auth-fetch";
import { isValidProductCode, lookupVariants, startBarcodeScanner, type BarcodeScanner } from "@/lib/barcode";
import { addToFoodLog } from "@/lib/food-log";

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

type FoodItem = {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type FoodResult = { items: FoodItem[]; notes?: string };

async function recognizeFood(payload: { image?: string; description?: string }): Promise<FoodResult> {
  const res = await authedFetch("/api/food-recognition", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Recognition failed");
  return data as FoodResult;
}

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

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {mode === "photo" && <PhotoCaptureView />}
          {mode === "barcode" && <BarcodeView onDescribeInstead={() => setMode("describe")} />}
          {mode === "describe" && <DescribeFoodView />}
        </div>
      </div>
    </Screen>
  );
}

function ResultCard({ result }: { result: FoodResult }) {
  const totals = result.items.reduce(
    (acc, i) => ({
      calories: acc.calories + i.calories,
      protein: acc.protein + i.protein,
      carbs: acc.carbs + i.carbs,
      fat: acc.fat + i.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-2xl bg-primary/10 p-4 text-center">
        <p className="text-3xl font-bold text-foreground">{Math.round(totals.calories)}</p>
        <p className="text-xs font-medium text-muted-foreground">total kcal</p>
        <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
          <span>P {Math.round(totals.protein)}g</span>
          <span>C {Math.round(totals.carbs)}g</span>
          <span>F {Math.round(totals.fat)}g</span>
        </div>
      </div>
      {result.items.map((item, i) => (
        <div key={i} className="flex items-center justify-between rounded-2xl bg-card p-3">
          <div>
            <p className="text-sm font-semibold text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.serving}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">{Math.round(item.calories)} kcal</p>
            <p className="text-[11px] text-muted-foreground">
              P{Math.round(item.protein)} · C{Math.round(item.carbs)} · F{Math.round(item.fat)}
            </p>
          </div>
        </div>
      ))}
      {result.notes && <p className="px-1 text-xs text-muted-foreground">{result.notes}</p>}
      <p className="px-1 text-[11px] leading-4 text-muted-foreground">
        Estimates only and can be inaccurate. ZyraFit is not medical advice.
      </p>
    </div>
  );
}

function ErrorText({ message }: { message: string }) {
  return <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{message}</p>;
}

async function readAsDataUrl(file: File): Promise<string> {
  // Phone photos are huge; shrink to max 1024px JPEG so upload succeeds.
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  } catch {
    // fall back to raw file
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the photo"));
    reader.readAsDataURL(file);
  });
}

function PhotoCaptureView() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [live, setLive] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLive(false);
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setLive(true);
    } catch {
      setLive(false);
    }
  };

  useEffect(() => {
    void startCamera();
    return stopCamera;
  }, []);

  const analyze = async (dataUrl: string) => {
    setError(null);
    setResult(null);
    setPhoto(dataUrl);
    setBusy(true);
    try {
      setResult(await recognizeFood({ image: dataUrl }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Recognition failed");
    } finally {
      setBusy(false);
    }
  };

  const snap = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const scale = Math.min(1, 1024 / Math.max(v.videoWidth, v.videoHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(v.videoWidth * scale);
    c.height = Math.round(v.videoHeight * scale);
    c.getContext("2d")?.drawImage(v, 0, 0, c.width, c.height);
    stopCamera();
    void analyze(c.toDataURL("image/jpeg", 0.8));
  };

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    stopCamera();
    void analyze(await readAsDataUrl(file));
  };

  const retake = () => {
    setPhoto(null);
    setResult(null);
    setError(null);
    void startCamera();
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void onPick(e.target.files?.[0])}
      />
      <div className={`relative flex items-center justify-center overflow-hidden rounded-3xl bg-black ${photo ? "h-48 shrink-0" : "min-h-56 flex-1"}`}>
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          className={live && !photo ? "absolute inset-0 h-full w-full object-cover" : "hidden"}
        />
        {photo && <img src={photo} alt="Your meal" className="absolute inset-0 h-full w-full object-cover" />}
        {!photo && !live && (
          <button
            type="button"
            onClick={() => ("mediaDevices" in navigator ? void startCamera() : inputRef.current?.click())}
            className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-white/40"
            aria-label="Open camera"
          >
            <Camera className="h-12 w-12 text-white/70" />
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="text-sm text-white">Identifying your food…</p>
          </div>
        )}
        {live && !photo && (
          <button
            type="button"
            onClick={snap}
            aria-label="Take photo"
            className="absolute bottom-5 h-16 w-16 rounded-full border-4 border-white bg-white/30"
          />
        )}
        {!photo && !live && (
          <p className="absolute bottom-6 px-8 text-center text-sm text-white/80">
            Tap the camera to start, or choose a photo below
          </p>
        )}
      </div>
      {error && <ErrorText message={error} />}
      {result && <ResultCard result={result} />}
      {result && <AddToLogButton result={result} />}
      {photo ? (
        <button
          type="button"
          onClick={retake}
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-2xl bg-muted py-3.5 text-sm font-semibold text-foreground disabled:opacity-40"
        >
          <Camera className="h-4 w-4" />
          Retake photo
        </button>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-2xl bg-muted py-3.5 text-sm font-semibold text-foreground disabled:opacity-40"
        >
          <ImagePlus className="h-4 w-4" />
          Choose from gallery
        </button>
      )}
    </div>
  );
}

async function fetchProduct(code: string) {
  const fields = "product_name,brands,serving_size,nutriments";
  const res = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=${fields}`,
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("server");
  const data = (await res.json().catch(() => ({}))) as { status?: number; product?: Record<string, unknown> };
  return data.status === 1 && data.product ? data.product : null;
}

async function lookupBarcode(code: string): Promise<FoodResult> {
  let p: Record<string, unknown> | null = null;
  try {
    for (const variant of lookupVariants(code)) {
      p = await fetchProduct(variant);
      if (p) break;
    }
  } catch {
    throw new Error("Couldn't reach the food database. Check your connection and try again.");
  }
  if (!p) {
    throw new Error(`We couldn't find barcode ${code}. Try "Describe it instead", or take a photo of the food.`);
  }
  const n = (p["nutriments"] ?? {}) as Record<string, unknown>;
  const num = (k: string) => {
    const v = Number(n[k]);
    return Number.isFinite(v) ? v : null;
  };
  // Prefer per-serving values when the label has them, otherwise per 100 g.
  const per = num("energy-kcal_serving") != null || num("energy-kj_serving") != null ? "serving" : "100g";
  const kcal = num(`energy-kcal_${per}`) ?? (num(`energy-kj_${per}`) != null ? (num(`energy-kj_${per}`) as number) / 4.184 : null);
  const pick = (k: string) => Math.round((num(`${k}_${per}`) ?? 0) * 10) / 10;
  const name = [p["product_name"], p["brands"]].filter((v) => typeof v === "string" && v.trim()).join(" · ");
  return {
    items: [
      {
        name: name || `Product ${code}`,
        serving: per === "serving" ? String(p["serving_size"] ?? "1 serving") : "100 g",
        calories: Math.round(kcal ?? 0),
        protein: pick("proteins"),
        carbs: pick("carbohydrates"),
        fat: pick("fat"),
      },
    ],
    notes:
      kcal == null
        ? `Barcode ${code}. This product has no calorie data in the database — please check the label.`
        : `Barcode ${code}. Values per ${per === "serving" ? "serving" : "100 g"} from Open Food Facts.`,
  };
}

function BarcodeView({ onDescribeInstead }: { onDescribeInstead: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [code, setCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const [scanKey, setScanKey] = useState(0);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const scannerRef = useRef<BarcodeScanner | null>(null);

  const lookup = async (c: string) => {
    setCode(c);
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await lookupBarcode(c));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (code) return;
    let cancelled = false;
    setTorchOn(false);
    (async () => {
      const video = videoRef.current;
      if (!video) return;
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("This device can't open the camera here — type the barcode number below.");
        return;
      }
      try {
        const scanner = await startBarcodeScanner(video, (c) => {
          if (!cancelled) void lookup(c);
        });
        if (cancelled) return scanner.stop();
        scannerRef.current = scanner;
        setHasTorch(scanner.hasTorch);
      } catch (e) {
        const name = e instanceof DOMException ? e.name : "";
        setError(
          name === "NotAllowedError" || name === "SecurityError"
            ? "Camera access is blocked. Allow the camera for ZyraFit in your phone's settings, or type the barcode below."
            : name === "NotReadableError"
              ? "Another app is using the camera. Close it and tap Scan again, or type the barcode below."
              : "Camera not available — type the barcode number below.",
        );
      }
    })();
    return () => {
      cancelled = true;
      scannerRef.current?.stop();
      scannerRef.current = null;
      setHasTorch(false);
    };
  }, [code, scanKey]);

  const toggleTorch = async () => {
    const next = !torchOn;
    if (await scannerRef.current?.setTorch(next)) setTorchOn(next);
  };

  const rescan = () => {
    setCode(null);
    setResult(null);
    setError(null);
    setScanKey((k) => k + 1);
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className={`relative overflow-hidden rounded-3xl bg-black ${code ? "h-40" : "min-h-56 flex-1"}`}>
        {!code && <video ref={videoRef} muted playsInline autoPlay className="absolute inset-0 h-full w-full object-cover" />}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-28 w-64 rounded-2xl border-[3px] border-white/90" />
        </div>
        {!code && hasTorch && (
          <button
            type="button"
            onClick={() => void toggleTorch()}
            aria-label={torchOn ? "Turn flashlight off" : "Turn flashlight on"}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white"
          >
            {torchOn ? <FlashlightOff className="h-5 w-5" /> : <Flashlight className="h-5 w-5" />}
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="text-sm text-white">Looking up product…</p>
          </div>
        )}
        {code && !busy && (
          <p className="absolute inset-x-0 bottom-3 text-center text-sm text-white/80">Scanned {code}</p>
        )}
      </div>
      {!code && (
        <p className="text-center text-sm text-muted-foreground">
          Hold the barcode flat inside the box, about 15 cm away
        </p>
      )}
      {error && <ErrorText message={error} />}
      {result && <ResultCard result={result} />}
      {result && <AddToLogButton result={result} />}
      {code ? (
        <button
          type="button"
          onClick={rescan}
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-2xl bg-muted py-3.5 text-sm font-semibold text-foreground disabled:opacity-40"
        >
          <QrCode className="h-4 w-4" />
          Scan another
        </button>
      ) : (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const typed = manual.trim();
            if (!typed) return;
            if ([8, 12, 13].includes(typed.length) && !isValidProductCode(typed)) {
              setError("That number doesn't look right — check the digits under the barcode.");
              return;
            }
            void lookup(typed);
          }}
        >
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            placeholder="Or type barcode number"
            className="flex-1 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground outline-none"
          />
          <button type="submit" className="rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
            Find
          </button>
        </form>
      )}
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

function AddToLogButton({ result }: { result: FoodResult }) {
  const navigate = useNavigate();
  const add = () => {
    try {
      addToFoodLog(result.items);
    } catch {
      // ignore storage errors
    }
    void navigate({ to: "/home" });
  };
  if (!result.items.length) return null;
  return (
    <button
      type="button"
      onClick={add}
      className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
    >
      <Check className="h-4 w-4" />
      OK — add to my log
    </button>
  );
}

function DescribeFoodView() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await recognizeFood({ description: text.trim() }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Describe what you ate, e.g. "2 eggs, toast, and a coffee with milk".
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your meal..."
        rows={4}
        className="w-full resize-none rounded-2xl border border-border bg-card p-4 text-sm text-foreground outline-none"
      />
      {error && <ErrorText message={error} />}
      {result && <ResultCard result={result} />}
      {result && <AddToLogButton result={result} />}
      <button
        type="button"
        onClick={() => void analyze()}
        disabled={!text.trim() || busy}
        className="mt-auto flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {busy ? "Analyzing…" : "Analyze"}
      </button>
    </div>
  );
}
