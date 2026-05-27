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
    const req = await prisma.request.findUnique({
      where: { id },
      include: {
        requester: true,
        tenant: true,
        requestType: true,
        tasks: {
          include: {
            assignee: true,
          },
          orderBy: { createdAt: "asc" },
        },
        auditLogs: {
          orderBy: { createdAt: "desc" },
        },
        approvalActions: {
          orderBy: { actionTimestamp: "desc" },
          include: {
            actionByUser: true,
          },
        },
      },
    });

    if (!req) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    // Check access: requester or approver
    const canView =
      req.requesterId === session.user.id ||
      req.tenantId === session.user.tenantId ||
      session.user.permissions.includes(PERMISSIONS.REQUESTS_APPROVE_MANAGER) ||
      session.user.permissions.includes(PERMISSIONS.REQUESTS_APPROVE_FINANCE);

    if (!canView) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    return NextResponse.json({ request: req }, { status: 200 });
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json({ error: "Failed to fetch request." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const tenant = await getTenantContextFromHeaders();
  const body = await request.json();

  try {
    const req = await prisma.request.findUnique({
      where: { id },
    });

    if (!req) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    if (req.tenantId !== tenant.tenantId) {
      return NextResponse.json({ error: "Tenant mismatch." }, { status: 403 });
    }

    // Only requester can update draft requests
    if (req.status !== "DRAFT" && req.requesterId !== session.user.id) {
      return NextResponse.json({ error: "Cannot modify submitted request." }, { status: 403 });
    }

    const updated = await prisma.request.update({
      where: { id },
      data: {
        payload: body.payload || req.payload,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ request: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json({ error: "Failed to update request." }, { status: 500 });
  }
}

export async function DELETE(
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
    const req = await prisma.request.findUnique({
      where: { id },
    });

    if (!req) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    if (req.tenantId !== tenant.tenantId) {
      return NextResponse.json({ error: "Tenant mismatch." }, { status: 403 });
    }

    // Only requester can delete draft requests
    if (req.status !== "DRAFT" || req.requesterId !== session.user.id) {
      return NextResponse.json({ error: "Cannot delete submitted request." }, { status: 403 });
    }

    await prisma.request.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json({ error: "Failed to delete request." }, { status: 500 });
  }
}
