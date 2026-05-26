import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantContextFromHeaders } from "@/lib/tenant";
import { PERMISSIONS } from "@/config/permissions";
import { createSubmittedTravelRequest, travelRequestSchema } from "@/modules/requests/service";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!session.user.permissions.includes(PERMISSIONS.REQUESTS_CREATE)) {
    return NextResponse.json({ error: "You cannot create travel requests." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = travelRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid travel request.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const tenant = await getTenantContextFromHeaders();
  if (tenant.tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: "Tenant mismatch." }, { status: 403 });
  }

  const travelRequest = await createSubmittedTravelRequest({
    input: parsed.data,
    requesterId: session.user.id,
    tenantId: tenant.tenantId,
  });

  return NextResponse.json({ travelRequest }, { status: 201 });
}
