import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTenantContextFromHeaders } from "@/lib/tenant";
import { approvalLimitResolver } from "@/modules/rules/approval-limit-resolver";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const tenant = await getTenantContextFromHeaders();
  if (tenant.tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: "Tenant mismatch." }, { status: 403 });
  }

  await approvalLimitResolver.ensureDefaults(tenant.tenantId);

  const levels = await prisma.authorityLevel.findMany({
    where: { tenantId: tenant.tenantId },
    orderBy: { rankOrder: "asc" },
  });

  return NextResponse.json({ levels });
}
