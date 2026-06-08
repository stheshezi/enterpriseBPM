import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/config/permissions";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  // Ensure user has tenant management or user view permissions (typically Super Admin/Admin)
  if (!session.user.permissions.includes(PERMISSIONS.TENANT_MANAGE) && !session.user.roles.includes("SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const { taskId, newUserId } = await request.json();

    if (!taskId || !newUserId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const task = await prisma.workflowTask.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    if (task.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending tasks can be reassigned." }, { status: 400 });
    }

    // Perform Reassignment
    const updatedTask = await prisma.workflowTask.update({
      where: { id: taskId },
      data: {
        assigneeId: newUserId,
        // If we are forcefully reassigning, we should probably update the authority owner to match, or leave it.
        // For support, just changing the assignee is enough.
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
        nextState: newUserId,
        newValue: "Support Reassignment"
      }
    });

    return NextResponse.json({ message: "Task successfully reassigned.", task: updatedTask });
  } catch (error) {
    console.error("Error reassigning task:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
