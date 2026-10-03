import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, type LegalSection } from "@/components/zyra/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ZyraFit" },
      { name: "description", content: "How ZyraFit collects, uses and protects your data." },
      { property: "og:title", content: "Privacy Policy — ZyraFit" },
      { property: "og:description", content: "How ZyraFit collects, uses and protects your data." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

const sections: LegalSection[] = [
  ["Who we are", "ZyraFit is a nutrition tracking and workout app. Questions or requests: zyrafitsupport@gmail.com"],
  ["Information we collect", "Account: your email address and password (stored securely by our sign-in provider). If you sign in with Google, the basic profile details Google shares with us, such as your name and email.\nSign-up quiz: your answers about your goal, activity level, dietary preferences and what has held you back before.\nFood recognition: photos or text descriptions you choose to submit.\nWorkouts: routines you create and the email addresses of people you invite to them.\nOn your device only: your food log, nutrition goals, water tracking and favorite videos are stored on your device and are not uploaded to our servers."],
  ["Camera", "ZyraFit uses your camera only when you choose to photograph food or scan a barcode. You can deny camera permission and still add food by searching or describing it."],
  ["How we use it", "To run your account, personalize your plan from your quiz answers, estimate nutrition from photos or descriptions, look up barcodes, and save and share your workout routines. We do not sell your personal data."],
  ["Food photos and AI", "Photos and descriptions you submit for food recognition are sent to our AI service provider and its model provider to produce a nutrition estimate. We do not store your photos on our servers after the estimate is returned. They are not used for advertising. Estimates can be wrong; see our Terms."],
  ["Barcode lookups", "When you scan a barcode, the barcode number is sent to Open Food Facts, a public food database, to find the product."],
  ["Advertising and tracking", "ZyraFit does not show ads and does not use advertising or third-party analytics trackers."],
  ["Sharing", "Routines are shared only with people you invite by email. We use service providers to host the app and database, to sign you in, and to process food recognition. They process data on our behalf. We do not share your data for their own marketing."],
  ["Storage and security", "Account and routine data is stored on secure cloud infrastructure with access controls. Workout videos are delivered through time-limited private links."],
  ["Your choices and deleting your account", "You can delete your account at any time in the app: Settings, then Delete account. This permanently removes your account, quiz answers, routines and invitations tied to your email, and clears ZyraFit data on that device. You can also use the form at /delete-account or email zyrafitsupport@gmail.com and we will delete your data within 30 days. Depending on where you live you may have rights to access, correct or erase your data and to complain to your local data protection authority."],
  ["Age", "ZyraFit is intended for adults aged 18 and over. We do not knowingly collect data from anyone under 18."],
  ["Changes", "We may update this policy. Material changes will be announced in the app."],
];

function PrivacyPage() {
  return <LegalPage title="Privacy Policy" updated="October 3, 2026" sections={sections} />;
}
