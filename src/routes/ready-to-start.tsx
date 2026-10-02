import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Screen } from "@/components/zyra/TabBar";
import { ZyraFitLogo } from "@/components/zyra/ZyraFitLogo";

export const Route = createFileRoute("/ready-to-start")({
  head: () => ({
    meta: [
      { title: "ZyraFit — Ready to Start" },
      { name: "description", content: "You're all set to start tracking your nutrition with ZyraFit." },
      { property: "og:title", content: "ZyraFit — Ready to Start" },
      { property: "og:description", content: "You're all set to start tracking your nutrition with ZyraFit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReadyToStartScreen,
});

function ReadyToStartScreen() {
  return (
    <Screen>
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center bg-background px-8 text-center text-foreground">
      <ZyraFitLogo compact className="h-24 w-24 rounded-2xl" />
      <h1 className="mt-8 text-3xl font-bold leading-tight">You're all set!</h1>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
        Your personalized nutrition plan is ready. Let's start tracking your meals and reaching your goals.
      </p>
      <div className="mt-10 w-full">
        <Link to="/home" className="block">
          <Button size="pill">Get Started</Button>
        </Link>
      </div>
    </div>
  </Screen>
  );
}
