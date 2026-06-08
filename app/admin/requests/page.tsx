import { PageContainer, PageHeader } from "@/components/layout";
import { PERMISSIONS } from "@/config/permissions";
import { requireCurrentUser, userCanAny } from "@/lib/access-control";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminRequestsTable } from "@/components/admin";

export const dynamic = "force-dynamic";

type RequestPayload = {
  estimatedCost?: unknown;
};

function userDisplayName(user: { firstName: string | null; lastName: string | null; email: string }) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || user.email;
}

function estimatedCostFromPayload(payload: unknown) {
  const value = typeof payload === "object" && payload !== null ? (payload as RequestPayload).estimatedCost : null;
  return typeof value === "number" || typeof value === "string" ? String(value) : "-";
}

export default async function RequestsPage() {
  const user = await requireCurrentUser();
  if (!userCanAny(user, [PERMISSIONS.REQUESTS_VIEW_TENANT, PERMISSIONS.REQUESTS_VIEW_OWN])) {
    redirect("/unauthorized");
  }

  const requests = await prisma.request.findMany({
    include: {
      requester: true,
      tenant: true,
      departmentRef: true,
      requestType: true,
      requiredAuthorityLevel: true,
      tasks: {
        include: {
          assignee: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const today = Date.now();
  const rows = requests.map((r) => {
    const currentTask = r.tasks.find((task) => task.status === "PENDING") ?? r.tasks[0];
    const createdTime = r.createdAt.getTime();

    return {
      id: r.id,
      requestNumber: r.requestNumber,
      type: r.requestType?.name ?? "Travel Request",
      requester: userDisplayName(r.requester),
      department: r.departmentRef?.name ?? "-",
      assignee: currentTask?.assignee ? userDisplayName(currentTask.assignee) : "-",
      approvalLevel: r.requiredAuthorityLevel?.name ?? currentTask?.stepName ?? r.currentStep ?? "-",
      status: r.status,
      estimatedCost: estimatedCostFromPayload(r.payload),
      daysPending: Math.max(0, Math.floor((today - createdTime) / 86_400_000)).toString(),
      createdAt: r.createdAt.toISOString().split("T")[0],
      updatedAt: r.updatedAt.toISOString().split("T")[0],
      href: `/admin/requests/${r.id}`,
    };
  });

  return (
    <PageContainer>
      <PageHeader
        title="All Requests"
        description="Comprehensive view of every request type across the organisation."
      />
      <AdminRequestsTable rows={rows} />
    </PageContainer>
  );
}
