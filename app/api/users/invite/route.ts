import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTenantContextFromHeaders } from "@/lib/tenant";
import { PERMISSIONS } from "@/config/permissions";

const inviteSchema = z.object({
  email: z.string().email(),
  roles: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!session.user.permissions.includes(PERMISSIONS.USERS_MANAGE)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const tenant = await getTenantContextFromHeaders();
  const body = await request.json();
  const parsed = inviteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid invite data.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        tenantId: tenant.tenantId,
        roles: {
          create: parsed.data.roles.map((roleId) => ({
            role: { connect: { name: roleId } },
          })),
        },
      },
    });

    // TODO: Send invite email

    return NextResponse.json(
      { user, message: "Invite sent successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inviting user:", error);
    return NextResponse.json({ error: "Failed to invite user." }, { status: 500 });
  }
}

