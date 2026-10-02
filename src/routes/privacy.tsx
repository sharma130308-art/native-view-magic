import { createFileRoute } from "@tanstack/react-router";

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

const sections: [string, string][] = [
  ["Information we collect", "Your account email and name, the meals and photos you submit for food recognition, your workout routines, favorites, and basic usage data needed to run the app."],
  ["How we use it", "To provide your account, estimate nutrition from food photos or descriptions, save and share your workout routines, and improve the app. We do not sell your personal data."],
  ["Food photos and AI", "Photos and text you submit for food recognition are sent securely to our AI provider only to produce the nutrition estimate. They are not used for advertising."],
  ["Sharing", "Routines are shared only with members you invite by email. Service providers that host our app and database process data on our behalf under confidentiality obligations."],
  ["Storage and security", "Data is stored on secure cloud infrastructure with access controls. Workout videos are delivered through time-limited private links."],
  ["Your choices", "You can edit or delete your routines at any time. To delete your account and all associated data, contact us at the email below and we will do so within 30 days."],
  ["Children", "ZyraFit is not directed at children under 13 and we do not knowingly collect their data."],
  ["Changes", "We may update this policy. Material changes will be announced in the app."],
  ["Contact", "Questions or deletion requests: zyrafitsupport@gmail.com"],
];

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10 text-foreground">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: October 2, 2026</p>
      {sections.map(([h, p]) => (
        <section key={h} className="mt-6">
          <h2 className="text-lg font-semibold">{h}</h2>
          <p className="mt-1 text-muted-foreground">{p}</p>
        </section>
      ))}
    </main>
  );
}
