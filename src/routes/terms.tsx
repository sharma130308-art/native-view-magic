import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, type LegalSection } from "@/components/zyra/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — ZyraFit" },
      { name: "description", content: "The terms for using ZyraFit." },
      { property: "og:title", content: "Terms of Use — ZyraFit" },
      { property: "og:description", content: "The terms for using ZyraFit." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

const sections: LegalSection[] = [
  ["Using ZyraFit", "By using ZyraFit you agree to these terms. You must be 18 or older. Keep your sign-in details private and use the app lawfully."],
  ["Not medical advice", "ZyraFit provides general nutrition and fitness information only. It is not medical advice and is not a substitute for a doctor or dietitian. Talk to a health professional before changing your diet or starting an exercise program, especially if you have a medical condition, are pregnant, or have a history of disordered eating. Stop exercising and seek help if you feel unwell."],
  ["AI estimates", "Calorie and nutrient values from photos, descriptions and barcodes are estimates and can be inaccurate. Check them before relying on them."],
  ["Your content", "You keep ownership of what you submit. You allow us to process it to provide the app, as described in the Privacy Policy. Do not upload anything unlawful or that you do not have the right to use."],
  ["Workout videos", "The workout video library is provided for your personal use in the app. Do not copy, redistribute or resell it."],
  ["Premium features", "Paid plans are not available yet. If we introduce them, the price and terms will be shown clearly before you pay."],
  ["Availability", "We try to keep ZyraFit running but do not guarantee it will always be available or error free. We may change or stop features."],
  ["Liability", "To the extent the law allows, ZyraFit is provided as is, and we are not liable for indirect or consequential losses. Nothing here limits rights you have by law."],
  ["Ending your account", "You can delete your account at any time in Settings. We may suspend accounts that break these terms."],
  ["Changes and contact", "We may update these terms; continued use means you accept the update. Contact: zyrafitsupport@gmail.com"],
];

function TermsPage() {
  return <LegalPage title="Terms of Use" updated="October 3, 2026" sections={sections} />;
}
