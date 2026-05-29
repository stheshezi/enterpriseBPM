import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getTenantContextFromHeaders } from "@/lib/tenant";
import { PERMISSIONS } from "@/config/permissions";
import { workflowEngine } from "@/modules/workflow/workflow-engine";

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
    if (
      !session.user.permissions.includes(PERMISSIONS.REQUESTS_APPROVE_MANAGER) &&
      !session.user.permissions.includes(PERMISSIONS.REQUESTS_APPROVE_FINANCE)
    ) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const result = await workflowEngine.executeTransition({
      taskId: parsed.data.taskId,
      actorUserId: session.user.id,
      tenantId: tenant.tenantId,
      decision: parsed.data.decision,
      comment: parsed.data.comment,
      bypassAssignment: session.user.roles.includes("SUPER_ADMIN"),
    });

    return NextResponse.json(
      { task: result.task, request: result.request },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing approval:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process approval." },
      { status: 400 },
    );
  }
}
