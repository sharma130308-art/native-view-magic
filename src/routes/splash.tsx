import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Screen } from "@/components/zyra/TabBar";
import { ZyraFitLogo } from "@/components/zyra/ZyraFitLogo";

export const Route = createFileRoute("/splash")({
  head: () => ({
    meta: [
      { title: "ZyraFit — Loading" },
      { name: "description", content: "ZyraFit is starting up." },
      { property: "og:title", content: "ZyraFit — Loading" },
      { property: "og:description", content: "ZyraFit is starting up." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SplashScreen,
});

function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [0.1, 0.2, 0.25, 0.3, 0.4, 0.55, 0.75, 1.0];
    let i = 0;
    const interval = setInterval(() => {
      setProgress(steps[i] ?? 1);
      i += 1;
      if (i >= steps.length) clearInterval(interval);
    }, 170);

    const timeout = setTimeout(() => {
      navigate({ to: "/" });
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <Screen>
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-foreground">ZyraFit</span>
        <p className="text-sm tracking-wide text-muted-foreground">Track. Eat smart. Feel great.</p>
      </div>
      <div className="mb-16 w-3/5">
        <div className="h-1.5 w-full overflow-hidden rounded-full border border-border bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-all duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  </Screen>
  );
}
