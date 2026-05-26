import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="page-shell">
      <section className="empty-state">
        <p className="eyebrow">Access control</p>
        <h1>Not available for your role</h1>
        <p>Your account is signed in, but this area needs a different permission set.</p>
        <Link href="/">Back to dashboard</Link>
      </section>
    </main>
  );
}
