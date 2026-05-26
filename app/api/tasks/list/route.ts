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

  if (!session.user.permissions.includes(PERMISSIONS.TASKS_VIEW_ASSIGNED)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const tenant = await getTenantContextFromHeaders();

  try {
    const tasks = await prisma.workflowTask.findMany({
      where: {
        tenantId: tenant.tenantId,
        assigneeId: session.user.id,
        status: { not: "COMPLETED" },
      },
      include: {
        request: {
          include: {
            requester: true,
          },
        },
        assignee: true,
      },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks." }, { status: 500 });
  }
}
