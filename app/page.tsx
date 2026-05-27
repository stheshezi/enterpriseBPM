"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import type React from "react";
import { LoginModal } from "@/components/ui/LoginModal";
import { useCurrentUser } from "@/hooks/use-current-user";

const workQueues = [
  {
    title: "Pending Approvals",
    count: "0",
    tone: "warning",
    detail: "Requests waiting for your decision.",
    href: "/approvals",
  },
  {
    title: "Overdue Tasks",
    count: "0",
    tone: "danger",
    detail: "SLA-sensitive work needing immediate attention.",
    href: "/tasks",
  },
  {
    title: "Returned Requests",
    count: "0",
    tone: "info",
    detail: "Requests sent back for correction or more information.",
    href: "/requests",
  },
  {
    title: "Drafts",
    count: "0",
    tone: "neutral",
    detail: "Unfinished requests you can continue.",
    href: "/requests",
  },
];

const requestTypes = [
  { title: "Travel Request", detail: "Flights, accommodation, allowances, and trip approvals.", href: "/travel-requests/new" },
  { title: "Procurement Request", detail: "Goods, services, vendors, and purchase approvals.", href: "/requests/new" },
  { title: "HR Request", detail: "People, acting authority, and employment workflow requests.", href: "/requests/new" },
  { title: "Finance Request", detail: "Budget, reimbursement, and payment approval workflows.", href: "/requests/new" },
  { title: "Legal Request", detail: "Contract, policy, and legal review workflows.", href: "/requests/new" },
];

const statusStages = [
  { label: "Draft", value: "0" },
  { label: "Submitted", value: "0" },
  { label: "In Progress", value: "0" },
  { label: "Returned", value: "0" },
  { label: "Approved", value: "0" },
  { label: "Rejected", value: "0" },
];

const helpActions = [
  {
    title: "Request stuck?",
    detail: "Check current owner, next step, and SLA state.",
    href: "/requests",
  },
  {
    title: "Approval missing?",
    detail: "Review assignment and delegated authority routing.",
    href: "/tasks",
  },
  {
    title: "Delegate unavailable?",
    detail: "Manage acting authority and temporary handover.",
    href: "/profile/preferences",
  },
  {
    title: "Submit on behalf?",
    detail: "Start a request while preserving audit ownership.",
    href: "/travel-requests/new",
  },
];

const itUseCases = [
  {
    title: "User access support",
    value: "12",
    detail: "Role, tenant, and sign-in issues awaiting support review.",
    href: "/admin/users",
  },
  {
    title: "Authority routing checks",
    value: "5",
    detail: "Requests needing hierarchy, delegation, or approver resolution checks.",
    href: "/reports/requests",
  },
  {
    title: "Workflow health",
    value: "98%",
    detail: "Assignment, SLA, and notification jobs operating normally.",
    href: "/reports/sla",
  },
  {
    title: "Audit investigations",
    value: "3",
    detail: "Open traces for state transitions, delegated actions, and user changes.",
    href: "/reports/audit",
  },
];

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

export default function HomePage() {
  const { status } = useSession();
  const { user } = useCurrentUser();
  const [loginOpen, setLoginOpen] = useState(false);
  const isAuthenticated = status === "authenticated";

  if (isAuthenticated && user) {
    const isItUser = user.roles.some((role) => role === "IT_SUPPORT" || role === "SUPER_ADMIN" || role === "ADMIN");
    return isItUser ? <ItSupportDashboard /> : <WmsUserDashboard />;
  }

  return <PublicLanding onLogin={() => setLoginOpen(true)} loginOpen={loginOpen} onCloseLogin={() => setLoginOpen(false)} />;
}

function WmsUserDashboard() {
  return (
    <main className="layout-page-container work-center">
      <section className="work-hero">
        <div>
          <p className="eyebrow">Work center</p>
          <h1>What needs your attention</h1>
          <p>
            A focused command center for submissions, approvals, request status, delegation, and workflow recovery.
          </p>
        </div>
        <div className="work-hero__actions">
          <Link className="ui-button ui-button--primary" href="/travel-requests/new">
            Create request
          </Link>
          <Link className="ui-button ui-button--outline" href="/tasks">
            Review my work
          </Link>
        </div>
      </section>

      <section className="work-queue-grid" aria-label="My Work">
        {workQueues.map((item) => (
          <Link className={`work-queue work-queue--${item.tone}`} href={item.href} key={item.title}>
            <span>{item.title}</span>
            <strong>{item.count}</strong>
            <p>{item.detail}</p>
          </Link>
        ))}
      </section>

      <section className="work-layout">
        <section className="work-panel">
          <header>
            <div>
              <p className="eyebrow">Create request</p>
              <h2>Start from intent</h2>
            </div>
            <Link className="ui-button ui-button--outline ui-button--sm" href="/requests/new">
              View all
            </Link>
          </header>
          <div className="request-type-list">
            {requestTypes.map((request) => (
              <Link href={request.href} key={request.title}>
                <strong>{request.title}</strong>
                <span>{request.detail}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="work-panel">
          <header>
            <div>
              <p className="eyebrow">My requests</p>
              <h2>Status visibility</h2>
            </div>
            <Link className="ui-button ui-button--outline ui-button--sm" href="/requests">
              Open requests
            </Link>
          </header>
          <div className="status-ladder">
            {statusStages.map((stage) => (
              <span key={stage.label}>
                <strong>{stage.value}</strong>
                {stage.label}
              </span>
            ))}
          </div>
        </section>

        <section className="work-panel delegation-panel">
          <header>
            <div>
              <p className="eyebrow">Delegation center</p>
              <h2>Authority coverage</h2>
            </div>
            <Link className="ui-button ui-button--outline ui-button--sm" href="/profile/preferences">
              Manage
            </Link>
          </header>
          <div className="delegation-state">
            <strong>No active delegation</strong>
            <span>Assign acting authority before leave, travel, or temporary role changes.</span>
          </div>
        </section>

        <section className="work-panel help-panel">
          <header>
            <div>
              <p className="eyebrow">Help & recovery</p>
              <h2>Resolve blocked work</h2>
            </div>
          </header>
          <div className="help-action-list">
            {helpActions.map((item) => (
              <Link href={item.href} key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function ItSupportDashboard() {
  return (
    <main className="layout-page-container it-home">
      <section className="it-hero">
        <div>
          <p className="eyebrow">IT operations</p>
          <h1>Workflow Support Console</h1>
          <p>
            Support users, validate authority routing, monitor workflow health, and investigate audit evidence across the company.
          </p>
        </div>
        <Link className="ui-button ui-button--primary" href="/admin/users">
          Open user support
        </Link>
      </section>

      <section className="it-grid">
        {itUseCases.map((item) => (
          <Link className="it-use-case" href={item.href} key={item.title}>
            <span>{item.title}</span>
            <strong>{item.value}</strong>
            <p>{item.detail}</p>
          </Link>
        ))}
      </section>

      <section className="it-ops-grid">
        <WorkPanel title="Support playbook">
          <ul className="wms-checklist">
            <li>Confirm identity, tenant, role, and permission assignment.</li>
            <li>Check manager hierarchy and current authority holder.</li>
            <li>Validate active delegations against date and authority level.</li>
            <li>Review audit events before changing workflow data.</li>
          </ul>
        </WorkPanel>
        <WorkPanel title="Workflow service map">
          <div className="service-map">
            {["Identity", "Authority", "Delegation", "Workflow", "Notification", "Audit"].map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>
        </WorkPanel>
      </section>
    </main>
  );
}

function WorkPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="wms-panel">
      <header>
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}

function PublicLanding({
  onLogin,
  loginOpen,
  onCloseLogin,
}: {
  onLogin: () => void;
  loginOpen: boolean;
  onCloseLogin: () => void;
}) {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <Link className="landing-brand" href="/">
          <span>EB</span>
          <strong>Enterprise BPM</strong>
        </Link>
        <button className="ui-button ui-button--outline" onClick={onLogin} type="button">
          Log in
        </button>
      </header>

      <section className="landing-hero">
        <div className="landing-hero__copy">
          <p className="eyebrow">Travel request workflow</p>
          <h1>Enterprise BPM Platform</h1>
          <p>
            A tenant-aware operating layer for creating travel requests, routing approvals, managing users,
            and keeping finance controls visible.
          </p>
          <div className="landing-actions">
            <button className="ui-button ui-button--primary ui-button--lg" onClick={onLogin} type="button">
              Sign in
            </button>
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

      <LoginModal open={loginOpen} onClose={onCloseLogin} />
    </main>
  );
}
