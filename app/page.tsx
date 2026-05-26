"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LoginModal } from "@/components/ui/LoginModal";

const platformHighlights = [
  {
    title: "Tenant-aware workflow",
    body: "Separate tenant context, roles, and permissions for controlled travel operations.",
  },
  {
    title: "Approval routing",
    body: "Manager and finance steps keep each request moving with clear task ownership.",
  },
  {
    title: "Audit-ready controls",
    body: "User actions, request decisions, and administrative changes are captured for review.",
  },
];

export default function LandingPage() {
  const { status } = useSession();
  const [loginOpen, setLoginOpen] = useState(false);
  const isAuthenticated = status === "authenticated";

  return (
    <main className="landing-page">
      <header className="landing-nav">
        <Link className="landing-brand" href="/">
          <span>EB</span>
          <strong>Enterprise BPM</strong>
        </Link>
        {isAuthenticated ? (
          <Link className="ui-button ui-button--primary" href="/travel-requests/new">
            Open system
          </Link>
        ) : (
          <button className="ui-button ui-button--outline" onClick={() => setLoginOpen(true)} type="button">
            Log in
          </button>
        )}
      </header>

      <section className="landing-hero">
        <div className="landing-hero__copy">
          <p className="eyebrow">Travel request workflow</p>
          <h1>Enterprise BPM Platform</h1>
          <p>
            A tenant-aware operating layer for creating travel requests, routing approvals,
            managing users, and keeping finance controls visible.
          </p>
          <div className="landing-actions">
            {isAuthenticated ? (
              <Link className="ui-button ui-button--primary ui-button--lg" href="/travel-requests/new">
                Continue
              </Link>
            ) : (
              <button className="ui-button ui-button--primary ui-button--lg" onClick={() => setLoginOpen(true)} type="button">
                Sign in
              </button>
            )}
            <Link className="ui-button ui-button--secondary ui-button--lg" href="/login">
              Full login page
            </Link>
          </div>
        </div>

        <div className="landing-hero__panel" aria-label="Platform preview">
          <div>
            <span>Requests</span>
            <strong>42</strong>
          </div>
          <div>
            <span>Pending approval</span>
            <strong>8</strong>
          </div>
          <div>
            <span>Audit events</span>
            <strong>128</strong>
          </div>
        </div>
      </section>

      <section className="landing-grid">
        {platformHighlights.map((item) => (
          <article className="feature-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </main>
  );
}
