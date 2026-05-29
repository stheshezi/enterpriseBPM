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

  if (!session.user.permissions.includes(PERMISSIONS.REPORTS_VIEW)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const tenant = await getTenantContextFromHeaders();
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30days";

  try {
    // Calculate date range
    let startDate = new Date();
    switch (range) {
      case "7days":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case "all":
        startDate = new Date("2000-01-01");
        break;
    }

    // Fetch request statistics
    const requests = await prisma.request.findMany({
      where: {
        tenantId: tenant.tenantId,
        createdAt: { gte: startDate },
      },
    });

    const statusCounts = {
      draft: requests.filter((r) => r.status === "DRAFT").length,
      submitted: requests.filter((r) => r.status === "SUBMITTED").length,
      approved: requests.filter((r) => r.status === "APPROVED").length,
      rejected: requests.filter((r) => r.status === "REJECTED").length,
      completed: requests.filter((r) => r.status === "COMPLETED").length,
    };

    const tasks = await prisma.workflowTask.findMany({
      where: {
        tenantId: tenant.tenantId,
        createdAt: { gte: startDate },
      },
    });

    const onTimeCount = tasks.filter((t) => t.dueAt && t.dueAt > new Date()).length;
    const overdueCount = tasks.filter((t) => t.dueAt && t.dueAt < new Date()).length;

    const stats = {
      totalRequests: requests.length,
      pendingApprovals: tasks.filter((t) => t.status === "PENDING").length,
      approvedThisMonth: statusCounts.approved,
      rejectedThisMonth: statusCounts.rejected,
      overdueCount,
      ...statusCounts,
      onTimeCount,
      atRiskCount: Math.max(0, tasks.length - onTimeCount - overdueCount),
      averageCompletionTime: "24 hours",
      slaBreachRate: "5%",
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports." }, { status: 500 });
  }
}
