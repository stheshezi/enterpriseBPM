import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTenantContextFromHeaders } from "@/lib/tenant";
import { PERMISSIONS } from "@/config/permissions";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!session.user.permissions.includes(PERMISSIONS.USERS_VIEW)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const tenant = await getTenantContextFromHeaders();

  try {
    const users = await prisma.user.findMany({
      where: { tenantId: tenant.tenantId },
      include: {
        roles: {
          include: { role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles.map((ur) => ur.role.name),
      department: null,
      status: user.email.includes("@") ? "Active" : "Invited",
      lastLogin: null,
    }));

    return NextResponse.json({ users: mappedUsers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}
