import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, type LegalSection } from "@/components/zyra/LegalPage";

export const Route = createFileRoute("/delete-account")({
  head: () => ({
    meta: [
      { title: "Delete your account — ZyraFit" },
      { name: "description", content: "How to delete your ZyraFit account and data." },
      { property: "og:title", content: "Delete your account — ZyraFit" },
      { property: "og:description", content: "How to delete your ZyraFit account and data." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DeleteAccountPage,
});

const sections: LegalSection[] = [
  ["Delete it yourself in the app", "1. Open ZyraFit and sign in.\n2. Go to Settings.\n3. Tap Delete account and confirm.\nYour account is deleted straight away."],
  ["Can't open the app?", "Email zyrafitsupport@gmail.com from the address you signed up with, with the subject \"Delete my ZyraFit account\". We will delete your account and data within 30 days."],
  ["What gets deleted", "Your account and sign-in, your sign-up quiz answers, your workout routines and the invitations tied to your email. Data stored only on your device (food log, goals, water, favorites) is cleared when you delete in the app, or when you uninstall."],
  ["What we keep", "We do not keep your food photos. Our hosting providers may keep short-term backups for a limited time before they are overwritten."],
];

function DeleteAccountPage() {
  return <LegalPage title="Delete your ZyraFit account" updated="October 3, 2026" sections={sections} />;
}
