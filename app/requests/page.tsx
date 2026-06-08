import React from "react";
import Link from "next/link";
import { requirePermission } from "@/lib/requirePermission";
import { PERMISSIONS } from "@/config/permissions";
import { prisma } from "@/lib/prisma";
import { PageContainer, PageHeader } from "@/components/layout";
import { RequestTable, RequestTableRow } from "@/components/requests/request-table";
import { Button } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const user = await requirePermission([PERMISSIONS.REQUESTS_VIEW_OWN, PERMISSIONS.REQUESTS_VIEW_TENANT]);

  const requests = await prisma.request.findMany({
    where: user.roles.includes("SUPER_ADMIN") ? {} : { tenantId: user.tenantId },
    select: {
      id: true,
      requestNumber: true,
      requesterId: true,
      departmentId: true,
      requestType: { select: { name: true } },
      payload: true,
      status: true,
      currentStep: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  const [users, departments] = await Promise.all([
    prisma.user.findMany({ select: { id: true, firstName: true, lastName: true, email: true } }),
    prisma.department.findMany({ select: { id: true, name: true } }),
  ]);
  const userById = new Map(users.map((item) => [item.id, item]));
  const departmentById = new Map(departments.map((item) => [item.id, item]));

  const rows: RequestTableRow[] = requests.map((req) => {
    const payload = req.payload as any;
    return {
      id: req.id,
      requestNumber: req.requestNumber,
      requester: userById.get(req.requesterId)?.email || req.requesterId,
      department: (req.departmentId ? departmentById.get(req.departmentId)?.name : null) || payload?.department || "N/A",
      destination: payload?.destination || payload?.requestTypeName || req.requestType?.name || "General request",
      status: req.status as any,
      currentStep: req.currentStep || "N/A",
      estimatedCost: payload?.estimatedCost ? `R${payload.estimatedCost}` : "N/A",
      createdDate: req.createdAt.toISOString().split("T")[0],
    };
  });

  return (
    <PageContainer>
      <PageHeader
        title="Requests"
        description="View and manage workflow requests."
        primaryAction={<Link href="/requests/new"><Button>New Request</Button></Link>}
      />
      <div className="card p-0 overflow-hidden">
        <RequestTable rows={rows} />
      </div>
    </PageContainer>
  );
}
