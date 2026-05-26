import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTenantContextFromHeaders } from "@/lib/tenant";
import { PERMISSIONS } from "@/config/permissions";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!session.user.permissions.includes(PERMISSIONS.TENANT_MANAGE)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const body = await request.json();
  const tenant = await getTenantContextFromHeaders();

  try {
    // Update tenant settings
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.tenantId },
      data: {
        name: body.tenantName,
      },
    });

    // TODO: Store additional settings in a settings table

    return NextResponse.json(
      { 
        message: "Settings saved successfully.",
        tenant: updatedTenant 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Failed to save settings." }, { status: 500 });
  }
}
