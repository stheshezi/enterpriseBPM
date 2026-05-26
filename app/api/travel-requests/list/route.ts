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

  if (!session.user.permissions.includes(PERMISSIONS.REQUESTS_VIEW_OWN)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const tenant = await getTenantContextFromHeaders();

  try {
    const requests = await prisma.travelRequest.findMany({
      where: {
        tenantId: tenant.tenantId,
        OR: [
          { requesterId: session.user.id },
          { status: { in: ["MANAGER_APPROVAL", "FINANCE_APPROVAL", "APPROVED", "REJECTED"] } },
        ],
      },
      include: {
        requester: true,
        tasks: {
          include: {
            assignee: true,
          },
        },
        auditLogs: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests." }, { status: 500 });
  }
}

