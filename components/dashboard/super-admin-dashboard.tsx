"use client";

import { useMemo, useState } from "react";
import type React from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import type { SuperAdminDashboardData } from "@/lib/dashboard-data";

type Period = "7" | "30" | "180";

const periodLabels: Record<Period, string> = {
  "7": "7 days",
  "30": "30 days",
  "180": "6 months",
};

const iconByKpi: Record<string, React.ReactNode> = {
  tenants: <Shield aria-hidden="true" size={18} />,
  users: <Users aria-hidden="true" size={18} />,
  requests: <FileText aria-hidden="true" size={18} />,
  pending: <Clock3 aria-hidden="true" size={18} />,
  tasks: <AlertTriangle aria-hidden="true" size={18} />,
  completion: <CheckCircle2 aria-hidden="true" size={18} />,
};

function withinPeriod(createdAt: string, period: Period) {
  const date = new Date(createdAt);
  const start = new Date();
  start.setDate(start.getDate() - Number(period));
  start.setHours(0, 0, 0, 0);
  return date >= start;
}

function buildDailySeries(events: SuperAdminDashboardData["requestEvents"], period: Period) {
  const days = Number(period);
  const buckets = new Map<string, number>();

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const key = date.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  for (const event of events) {
    if (!withinPeriod(event.createdAt, period)) continue;
    const key = event.createdAt.slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return [...buckets.entries()].map(([date, count]) => ({ date, count }));
}

export function SuperAdminDashboard({ data }: { data: SuperAdminDashboardData }) {
  const [period, setPeriod] = useState<Period>("30");
  const visibleEvents = useMemo(
    () => data.requestEvents.filter((event) => withinPeriod(event.createdAt, period)),
    [data.requestEvents, period],
  );
  const dailySeries = useMemo(() => buildDailySeries(data.requestEvents, period), [data.requestEvents, period]);
  const maxDailyCount = Math.max(1, ...dailySeries.map((item) => item.count));
  const activeStatusSummary = useMemo(() => {
    const counts = new Map<string, number>();
    for (const event of visibleEvents) {
      counts.set(event.status, (counts.get(event.status) ?? 0) + 1);
    }
    return data.statusSummary.map((item) => ({ ...item, count: counts.get(item.status) ?? 0 }));
  }, [data.statusSummary, visibleEvents]);
  const maxStatusCount = Math.max(1, ...activeStatusSummary.map((item) => item.count));

  return (
    <div className="super-admin-dashboard">
      <section className="super-admin-hero">
        <div>
          <p className="eyebrow">{data.scope} control room</p>
          <h1>Super Admin Dashboard</h1>
          <p>Live operating view across tenants, requests, workflow tasks, approvals, reports, administration, and settings.</p>
        </div>
        <div className="super-admin-hero__meta">
          <span>Last refreshed</span>
          <strong>{data.generatedAt}</strong>
          <small>{data.totals.notifications} notifications in scope</small>
        </div>
      </section>

      <section className="super-admin-kpis" aria-label="Super Admin KPIs">
        {data.kpis.map((kpi) => (
          <Link className={`super-admin-kpi super-admin-kpi--${kpi.tone}`} href={kpi.href} key={kpi.id}>
            <span className="super-admin-kpi__icon">{iconByKpi[kpi.id]}</span>
            <span>{kpi.title}</span>
            <strong>{kpi.value}</strong>
            <small>{kpi.detail}</small>
          </Link>
        ))}
      </section>

      <section className="super-admin-actions" aria-label="Primary route actions">
        <Link href="/dashboard"><BarChart3 aria-hidden="true" size={18} />Dashboard</Link>
        <Link href="/requests"><FileText aria-hidden="true" size={18} />Requests</Link>
        <Link href="/tasks"><Clock3 aria-hidden="true" size={18} />My Tasks</Link>
        <Link href="/approvals"><CheckCircle2 aria-hidden="true" size={18} />Approvals</Link>
        <Link href="/reports"><Activity aria-hidden="true" size={18} />Reports</Link>
        <Link href="/admin"><Users aria-hidden="true" size={18} />Administration</Link>
        <Link href="/settings"><Settings aria-hidden="true" size={18} />Settings</Link>
      </section>

      <section className="super-admin-grid">
        <div className="super-admin-panel super-admin-panel--wide">
          <header>
            <div>
              <h2>Request volume</h2>
              <p>{visibleEvents.length} requests created in the selected window.</p>
            </div>
            <div className="segmented-control" aria-label="Chart period">
              {(Object.keys(periodLabels) as Period[]).map((key) => (
                <button className={period === key ? "is-active" : ""} key={key} onClick={() => setPeriod(key)} type="button">
                  {periodLabels[key]}
                </button>
              ))}
            </div>
          </header>
          <div className="volume-chart" aria-label="Requests by day">
            {dailySeries.map((item) => (
              <span key={item.date} title={`${item.date}: ${item.count}`}>
                <i style={{ height: `${Math.max(4, (item.count / maxDailyCount) * 100)}%` }} />
              </span>
            ))}
          </div>
        </div>

        <div className="super-admin-panel">
          <header>
            <div>
              <h2>Status mix</h2>
              <p>Created requests by current status for {periodLabels[period]}.</p>
            </div>
          </header>
          <div className="status-bars">
            {activeStatusSummary.filter((item) => item.count > 0).map((item) => (
              <Link href={`/requests?status=${item.status}`} key={item.status}>
                <span>{item.label}</span>
                <strong>{item.count}</strong>
                <i style={{ width: `${(item.count / maxStatusCount) * 100}%` }} />
              </Link>
            ))}
            {activeStatusSummary.every((item) => item.count === 0) ? <p className="component-state">No requests in this window.</p> : null}
          </div>
        </div>

        <div className="super-admin-panel">
          <header>
            <div>
              <h2>Task health</h2>
              <p>Workflow task status across the active scope.</p>
            </div>
          </header>
          <div className="task-health">
            {data.taskSummary.map((item) => (
              <Link href={`/tasks?status=${item.status}`} key={item.status}>
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </Link>
            ))}
          </div>
        </div>

        <div className="super-admin-panel">
          <header>
            <div>
              <h2>Pending tasks</h2>
              <p>Oldest due work that can stop the wheel.</p>
            </div>
            <Link href="/tasks">View all</Link>
          </header>
          <div className="live-list">
            {data.pendingTasks.map((task) => (
              <Link className={task.overdue ? "is-risk" : ""} href={task.href} key={task.id}>
                <strong>{task.title}</strong>
                <span>{task.requestNumber} - {task.assignee}</span>
                <small>{task.dueAt}</small>
              </Link>
            ))}
            {!data.pendingTasks.length ? <p className="component-state">No pending tasks.</p> : null}
          </div>
        </div>

        <div className="super-admin-panel">
          <header>
            <div>
              <h2>Recent requests</h2>
              <p>Latest workflow items from the database.</p>
            </div>
            <Link href="/requests">View all</Link>
          </header>
          <div className="live-list">
            {data.recentRequests.map((request) => (
              <Link href={request.href} key={request.id}>
                <strong>{request.requestNumber}</strong>
                <span>{request.requester} - {request.tenant}</span>
                <small>{request.statusLabel} - {request.createdAt}</small>
              </Link>
            ))}
            {!data.recentRequests.length ? <p className="component-state">No requests yet.</p> : null}
          </div>
        </div>

        <div className="super-admin-panel super-admin-panel--wide">
          <header>
            <div>
              <h2>Recent activity</h2>
              <p>Audit-backed operational history.</p>
            </div>
            <Link href="/admin/audit-logs">Open audit logs</Link>
          </header>
          <div className="activity-feed">
            {data.recentActivities.map((activity) => (
              <Link href={activity.href} key={activity.id}>
                <span>{activity.action}</span>
                <strong>{activity.actor}</strong>
                <small>{activity.entityType} - {activity.tenant} - {activity.createdAt}</small>
              </Link>
            ))}
            {!data.recentActivities.length ? <p className="component-state">No audit activity yet.</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
