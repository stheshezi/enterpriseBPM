import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantContextFromHeaders } from "@/lib/tenant";
import { PERMISSIONS } from "@/config/permissions";
import {
  createSubmittedRequest,
  createRequestSchema,
  genericRequestPayloadSchema,
  leaveRequestPayloadSchema,
  purchaseRequestPayloadSchema,
  travelRequestPayloadSchema,
} from "@/modules/requests/service";

const workflowByRequestType: Record<string, string> = {
  travel: "TRAVEL_APPROVAL",
  leave: "LEAVE_APPROVAL",
  purchase: "PROCUREMENT",
  asset: "ASSET_APPROVAL",
  training: "TRAINING_APPROVAL",
  access: "ACCESS_APPROVAL",
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!session.user.permissions.includes(PERMISSIONS.REQUESTS_CREATE)) {
    return NextResponse.json({ error: "You cannot create requests." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const tenant = await getTenantContextFromHeaders();
  if (tenant.tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: "Tenant mismatch." }, { status: 403 });
  }

  const requestType = String(parsed.data.payload.requestType ?? "").toLowerCase();
  const payloadValidation = (() => {
    if (requestType === "travel") return travelRequestPayloadSchema.safeParse(parsed.data.payload);
    if (requestType === "leave") return leaveRequestPayloadSchema.safeParse(parsed.data.payload);
    if (requestType === "purchase") return purchaseRequestPayloadSchema.safeParse(parsed.data.payload);
    return genericRequestPayloadSchema.safeParse(parsed.data.payload);
  })();

  if (!payloadValidation.success) {
    return NextResponse.json(
      { error: "Invalid request payload.", issues: payloadValidation.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const createdRequest = await createSubmittedRequest({
    input: {
      ...parsed.data,
      payload: {
        ...payloadValidation.data,
        workflowCode: workflowByRequestType[requestType] ?? "CONFIGURABLE_REQUEST_WORKFLOW",
      },
    },
    requesterId: session.user.id,
    tenantId: tenant.tenantId,
  });

  return NextResponse.json({ request: createdRequest }, { status: 201 });
}
