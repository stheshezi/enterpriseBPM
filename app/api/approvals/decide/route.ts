import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTenantContextFromHeaders } from "@/lib/tenant";
import { PERMISSIONS } from "@/config/permissions";

const approvalSchema = z.object({
  taskId: z.string(),
  decision: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const tenant = await getTenantContextFromHeaders();
  const body = await request.json();
  const parsed = approvalSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid approval data.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const task = await prisma.workflowTask.findUnique({
      where: { id: parsed.data.taskId },
      include: { request: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    // Verify user can approve
    if (task.stepName === "MANAGER_APPROVAL") {
      if (!session.user.permissions.includes(PERMISSIONS.REQUESTS_APPROVE_MANAGER)) {
        return NextResponse.json({ error: "Access denied." }, { status: 403 });
      }
    } else if (task.stepName === "FINANCE_APPROVAL") {
      if (!session.user.permissions.includes(PERMISSIONS.REQUESTS_APPROVE_FINANCE)) {
        return NextResponse.json({ error: "Access denied." }, { status: 403 });
      }
    }

    // Update task
    const updatedTask = await prisma.workflowTask.update({
      where: { id: task.id },
      data: {
        status: parsed.data.decision === "APPROVED" ? "COMPLETED" : "REJECTED",
        completedAt: new Date(),
        assigneeId: session.user.id,
      },
    });

    // Update request based on decision
    let newStatus = task.request.status;
    let nextStep = task.request.currentStep;

    if (parsed.data.decision === "APPROVED") {
      if (task.stepName === "MANAGER_APPROVAL") {
        newStatus = "FINANCE_APPROVAL";
        nextStep = "FINANCE_APPROVAL";
        // Create finance approval task
        await prisma.workflowTask.create({
          data: {
            tenantId: tenant.tenantId,
            requestId: task.requestId,
            stepName: "FINANCE_APPROVAL",
            status: "PENDING",
          },
        });
      } else if (task.stepName === "FINANCE_APPROVAL") {
        newStatus = "APPROVED";
        nextStep = "COMPLETED";
      }
    } else {
      newStatus = "REJECTED";
      nextStep = "COMPLETED";
    }

    const updatedRequest = await prisma.travelRequest.update({
      where: { id: task.requestId },
      data: {
        status: newStatus as any,
        currentStep: nextStep,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        tenantId: tenant.tenantId,
        actorUserId: session.user.id,
        travelRequestId: task.requestId,
        workflowTaskId: task.id,
        entityType: "TravelRequest",
        action: parsed.data.decision === "APPROVED" ? "REQUEST_APPROVED" : "REQUEST_REJECTED",
        newValue: JSON.stringify({
          decision: parsed.data.decision,
          comment: parsed.data.comment,
          step: task.stepName,
        }),
      },
    });

    return NextResponse.json(
      { task: updatedTask, request: updatedRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing approval:", error);
    return NextResponse.json({ error: "Failed to process approval." }, { status: 500 });
  }
}
