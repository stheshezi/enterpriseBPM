import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTenantContextFromHeaders } from "@/lib/tenant";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const tenant = await getTenantContextFromHeaders();

  try {
    const task = await prisma.workflowTask.findUnique({
      where: { id: params.id },
      include: {
        request: {
          include: {
            requester: true,
            tasks: {
              include: { assignee: true },
            },
            auditLogs: { orderBy: { createdAt: "desc" } },
          },
        },
        assignee: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    if (task.assigneeId !== session.user.id && tenant.tenantId !== session.user.tenantId) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ error: "Failed to fetch task." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const tenant = await getTenantContextFromHeaders();
  const body = await request.json();

  try {
    const task = await prisma.workflowTask.findUnique({
      where: { id: params.id },
      include: { request: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    if (task.assigneeId !== session.user.id) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const updatedTask = await prisma.workflowTask.update({
      where: { id: params.id },
      data: {
        status: body.status,
        completedAt: body.status === "COMPLETED" ? new Date() : null,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        tenantId: tenant.tenantId,
        actorUserId: session.user.id,
        workflowTaskId: task.id,
        entityType: "WorkflowTask",
        action: "STATUS_CHANGED",
        oldValue: task.status,
        newValue: body.status,
      },
    });

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task." }, { status: 500 });
  }
}
