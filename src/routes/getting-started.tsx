import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Screen } from "@/components/zyra/TabBar";

export const Route = createFileRoute("/getting-started")({
  head: () => ({
    meta: [
      { title: "ZyraFit — Getting Started" },
      { name: "description", content: "Take your nutrition tracking to new heights with ZyraFit." },
      { property: "og:title", content: "ZyraFit — Getting Started" },
      { property: "og:description", content: "Take your nutrition tracking to new heights with ZyraFit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GettingStartedScreen,
});

function GettingStartedScreen() {
  return (
    <Screen>
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-white text-[#1A1A1A]">
      <div className="relative flex flex-[6] items-center justify-center">
        <span className="absolute left-[10%] top-[22%] text-xl font-light text-[#333]">×</span>
        <span className="absolute left-[6%] top-[28%] h-2 w-2 rounded-full border border-[#333]" />
        <span className="absolute right-[38%] top-[18%] text-base font-light text-[#333]">×</span>
        <span className="absolute right-[8%] top-[25%] h-0.5 w-3 rotate-45 bg-[#333]" />
        <span className="absolute right-[6%] top-[40%] h-0.5 w-2.5 -rotate-45 bg-[#333]" />
        <span className="absolute bottom-[48%] left-[42%] h-1.5 w-1.5 rounded-full border border-[#333]" />
        <span className="absolute bottom-[45%] right-[35%] text-sm font-light text-[#333]">×</span>

        <div className="relative h-[45vh] w-full">
          <div className="absolute left-[-6%] top-[8%] w-[34%] -rotate-[8deg] rounded bg-white p-1.5 shadow-xl">
            <div className="aspect-[0.86] w-full rounded-sm bg-gradient-to-b from-[#FFB5C2] to-[#FF8FA3]" />
          </div>
          <div className="absolute right-[-2%] top-[14%] w-[32%] rotate-[7deg] rounded bg-white p-1.5 shadow-xl">
            <div className="aspect-[0.86] w-full rounded-sm bg-gradient-to-b from-[#FFCDD2] to-[#FFABB8]" />
          </div>
        </div>
      </div>

      <div className="flex flex-[4] flex-col px-7 pb-8 pt-2">
        <h1 className="text-[2rem] font-bold leading-tight tracking-tight" style={{ fontFamily: "serif" }}>
          Take your nutrition to
          <br />
          new heights
        </h1>
        <div className="flex-1" />
        <Link to="/privacy-consent" className="block">
          <button
            type="button"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1A1A1A] text-base font-semibold text-white"
          >
            Get Started
            <ChevronRight className="h-5 w-5" />
          </button>
        </Link>
        <p className="mt-5 text-center text-xs leading-6 text-[#666]">
          By continuing, you accept our <Link to="/terms" className="font-medium text-[#1A1A1A] underline">Terms of Use</Link> and
          acknowledge
          <br />
          receipt of our <Link to="/privacy" className="font-medium text-[#1A1A1A] underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  </Screen>
  );
}
