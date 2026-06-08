import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/config/permissions";
import { resolveResponsibility } from "@/services/governanceResolver";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!session.user.permissions.includes(PERMISSIONS.TENANT_MANAGE) && !session.user.roles.includes("SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const { taskId } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: "Missing task ID." }, { status: 400 });
    }

    const task = await prisma.workflowTask.findUnique({
      where: { id: taskId },
      include: { request: true }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    if (task.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending tasks can be rerun." }, { status: 400 });
    }

    if (!task.authorityLevelId) {
      return NextResponse.json({ error: "Task has no authority level associated. Cannot rerun logic." }, { status: 400 });
    }

    // Attempt to rerun logic
    const resolution = await resolveResponsibility({
      tenantId: task.tenantId,
      authorityLevelId: task.authorityLevelId,
    });

    const updatedTask = await prisma.workflowTask.update({
      where: { id: taskId },
      data: {
        assigneeId: resolution.assignedToUserId,
        authorityOwnerUserId: resolution.authorityOwnerUserId,
        delegatedFromUserId: resolution.delegated ? resolution.authorityOwnerUserId : null,
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        tenantId: task.tenantId,
        actorUserId: session.user.id,
        travelRequestId: task.requestId,
        workflowTaskId: task.id,
        entityType: "WorkflowTask",
        entityId: task.id,
        action: "TASK_ASSIGNED",
        previousState: task.assigneeId,
        nextState: resolution.assignedToUserId,
        newValue: "Support Rerun Logic"
      }
    });

    return NextResponse.json({ message: "Assignment logic rerun successfully.", task: updatedTask });
  } catch (error: any) {
    console.error("Error rerunning logic:", error);
    return NextResponse.json({ error: error.message || "Failed to rerun logic due to missing hierarchy." }, { status: 400 });
  }
}
