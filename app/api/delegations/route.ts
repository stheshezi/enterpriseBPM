import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { PERMISSIONS } from "@/config/permissions";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTenantContextFromHeaders } from "@/lib/tenant";
import { actingAuthorityService } from "@/modules/delegation/acting-authority-service";

const delegationSchema = z.object({
  delegatedFromUserId: z.string().min(1),
  delegatedToUserId: z.string().min(1),
  authorityLevelId: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const tenant = await getTenantContextFromHeaders();
  if (tenant.tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: "Tenant mismatch." }, { status: 403 });
  }

  const delegations = await prisma.delegation.findMany({
    where: { tenantId: tenant.tenantId },
    include: {
      delegatedFrom: true,
      delegatedTo: true,
      authorityLevel: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ delegations });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!session.user.permissions.includes(PERMISSIONS.USERS_MANAGE)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const tenant = await getTenantContextFromHeaders();
  if (tenant.tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: "Tenant mismatch." }, { status: 403 });
  }

  const parsed = delegationSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid delegation.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const delegation = await actingAuthorityService.createActingAuthority({
      ...parsed.data,
      tenantId: tenant.tenantId,
      createdBy: session.user.id,
    });

    return NextResponse.json({ delegation }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create delegation." },
      { status: 400 },
    );
  }
}
