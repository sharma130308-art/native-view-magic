import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, type LegalSection } from "@/components/zyra/LegalPage";

export const Route = createFileRoute("/data-safety")({
  head: () => ({
    meta: [
      { title: "Data safety — ZyraFit" },
      { name: "description", content: "What data ZyraFit collects, why, and how it is protected." },
      { property: "og:title", content: "Data safety — ZyraFit" },
      { property: "og:description", content: "What data ZyraFit collects, why, and how it is protected." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DataSafetyPage,
});

const sections: LegalSection[] = [
  ["Data we collect", "Account: your email address and sign-in details.\nHealth and fitness: your sign-up quiz answers (goals, activity level), workout routines, and food log entries you choose to save.\nPhotos: meal photos you scan are sent to our AI provider once to estimate nutrition and are not stored by us."],
  ["Why we collect it", "To provide the app's core features: estimating nutrition from your meals, tracking your food, water and goals, and giving you workout videos and routines."],
  ["Data sharing", "We do not sell your data. We do not share it with advertisers. Meal photos are processed by our AI provider solely to return nutrition estimates."],
  ["Data security", "Data is encrypted in transit (HTTPS). Your food log, goals and water intake are stored only on your own device, not on our servers."],
  ["Data deletion", "You can delete your account and all server-side data at any time in the app (Settings, then Delete account) or via the form at /delete-account. Deletion is immediate and permanent."],
];

function DataSafetyPage() {
  return <LegalPage title="Data safety" updated="October 5, 2026" sections={sections} />;
}
