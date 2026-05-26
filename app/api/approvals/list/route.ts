import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTenantContextFromHeaders } from "@/lib/tenant";
import { PERMISSIONS } from "@/config/permissions";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const canApproveManager = session.user.permissions.includes(PERMISSIONS.REQUESTS_APPROVE_MANAGER);
  const canApproveFinance = session.user.permissions.includes(PERMISSIONS.REQUESTS_APPROVE_FINANCE);

  if (!canApproveManager && !canApproveFinance) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const tenant = await getTenantContextFromHeaders();

  try {
    let approvalTasks;

    if (canApproveManager && canApproveFinance) {
      approvalTasks = await prisma.workflowTask.findMany({
        where: {
          tenantId: tenant.tenantId,
          stepName: { in: ["MANAGER_APPROVAL", "FINANCE_APPROVAL"] },
          status: "PENDING",
        },
        include: {
          request: {
            include: { requester: true },
          },
          assignee: true,
        },
        orderBy: { dueAt: "asc" },
      });
    } else if (canApproveManager) {
      approvalTasks = await prisma.workflowTask.findMany({
        where: {
          tenantId: tenant.tenantId,
          stepName: "MANAGER_APPROVAL",
          status: "PENDING",
        },
        include: {
          request: {
            include: { requester: true },
          },
          assignee: true,
        },
        orderBy: { dueAt: "asc" },
      });
    } else {
      approvalTasks = await prisma.workflowTask.findMany({
        where: {
          tenantId: tenant.tenantId,
          stepName: "FINANCE_APPROVAL",
          status: "PENDING",
        },
        include: {
          request: {
            include: { requester: true },
          },
          assignee: true,
        },
        orderBy: { dueAt: "asc" },
      });
    }

    return NextResponse.json({ approvalTasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching approval tasks:", error);
    return NextResponse.json({ error: "Failed to fetch approval tasks." }, { status: 500 });
  }
}
