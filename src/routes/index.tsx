import { createFileRoute } from "@tanstack/react-router";
import { useState, type TouchEvent } from "react";
import { Link } from "@tanstack/react-router";

import coachAsset from "@/assets/onboarding-coach.png.asset.json";
import logAsset from "@/assets/onboarding-log.png.asset.json";
import scanAsset from "@/assets/onboarding-scan.png.asset.json";
import welcomeAsset from "@/assets/onboarding-welcome.png.asset.json";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZyraFit — Track Your Nutrition Journey" },
      {
        name: "description",
        content: "Track calories, macros, meals, and nutrition goals with ZyraFit.",
      },
      { property: "og:title", content: "ZyraFit — Track Your Nutrition Journey" },
      {
        property: "og:description",
        content: "Track calories, macros, meals, and nutrition goals with ZyraFit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type OnboardingPage = {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
};

const pages: OnboardingPage[] = [
  {
    eyebrow: "Welcome to",
    title: "ZyraFit",
    description: "Track your calories, macros, and nutrition goals.",
    image: welcomeAsset.url,
  },
  {
    title: "Track Calories",
    description: "Log meals and see your daily progress in real time.",
    image: scanAsset.url,
  },
  {
    title: "Log Meals",
    description: "Search foods, scan barcodes, and build your food diary.",
    image: logAsset.url,
  },
  {
    title: "Reach Your Goals",
    description: "Monitor progress, set targets, and stay on track.",
    image: coachAsset.url,
  },
];

function Index() {
  const [page, setPage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const current = pages[page] ?? pages[0];
  if (!current) return null;

  const goForward = () => setPage((value) => Math.min(value + 1, pages.length - 1));
  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStart === null) return;
    const changedTouch = event.changedTouches.item(0);
    if (!changedTouch) return;
    const distance = touchStart - changedTouch.clientX;
    if (distance > 45) goForward();
    if (distance < -45) setPage((value) => Math.max(value - 1, 0));
    setTouchStart(null);
  };

  return (
    <main
      className="mx-auto flex min-h-svh w-full max-w-md select-none flex-col overflow-hidden bg-background text-foreground"
      onTouchStart={(event) => setTouchStart(event.touches.item(0)?.clientX ?? null)}
      onTouchEnd={handleTouchEnd}
    >
      <section className="flex min-h-0 flex-1 flex-col items-center px-6 pt-[max(1rem,env(safe-area-inset-top))] text-center">
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <img
            key={current.image}
            src={current.image}
            alt=""
            className="onboarding-hero h-full max-h-[42svh] w-[82%] object-contain"
          />
        </div>

        <div key={current.title} className="onboarding-copy pb-5">
          {current.eyebrow ? (
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              {current.eyebrow}
            </p>
          ) : null}
          {page === 0 ? (
            <h1 className="text-3xl font-bold leading-tight">ZyraFit</h1>
          ) : (
            <h1 className="text-3xl font-bold leading-tight">{current.title}</h1>
          )}
          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            {current.description}
          </p>
        </div>
      </section>

      <footer className="shrink-0 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mb-6 flex h-2 items-center justify-center gap-2" aria-label={`Page ${page + 1} of ${pages.length}`}>
          {pages.map((item, index) => (
            <span
              key={item.title}
              className={index === page ? "h-2 w-7 rounded-full bg-primary transition-all" : "h-2 w-2 rounded-full bg-muted transition-all"}
            />
          ))}
        </div>
        {page === pages.length - 1 ? (
          <Link to="/auth" className="block">
            <Button size="pill">Continue</Button>
          </Link>
        ) : (
          <Button size="pill" onClick={goForward}>Next</Button>
        )}
      </footer>
    </main>
  );
}
