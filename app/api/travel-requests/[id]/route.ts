import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTenantContextFromHeaders } from "@/lib/tenant";
import { PERMISSIONS } from "@/config/permissions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const tenant = await getTenantContextFromHeaders();

  try {
    const travelRequest = await prisma.travelRequest.findUnique({
      where: { id },
      include: {
        requester: true,
        tenant: true,
        tasks: {
          include: {
            assignee: true,
          },
          orderBy: { createdAt: "asc" },
        },
        auditLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!travelRequest) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    // Check access: requester or approver
    const canView =
      travelRequest.requesterId === session.user.id ||
      travelRequest.tenantId === session.user.tenantId ||
      session.user.permissions.includes(PERMISSIONS.REQUESTS_APPROVE_MANAGER) ||
      session.user.permissions.includes(PERMISSIONS.REQUESTS_APPROVE_FINANCE);

    if (!canView) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    return NextResponse.json({ travelRequest }, { status: 200 });
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json({ error: "Failed to fetch request." }, { status: 500 });
  }
}
