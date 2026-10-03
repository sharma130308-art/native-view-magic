import { Link } from "@tanstack/react-router";

export type LegalSection = [heading: string, body: string];

/** Plain readable page used for the public Privacy Policy, Terms and Delete Account pages. */
export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10 text-foreground">
      <Link to="/" className="text-sm text-muted-foreground">← ZyraFit</Link>
      <h1 className="mt-3 text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
      {sections.map(([heading, body]) => (
        <section key={heading} className="mt-6">
          <h2 className="text-lg font-semibold">{heading}</h2>
          <p className="mt-1 whitespace-pre-line text-muted-foreground">{body}</p>
        </section>
      ))}
      <nav className="mt-10 flex gap-4 text-sm text-primary">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Use</Link>
        <Link to="/delete-account">Delete your account</Link>
      </nav>
    </main>
  );
}
