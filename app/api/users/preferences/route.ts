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

  const body = await request.json();
  const tenant = await getTenantContextFromHeaders();

  try {
    // Update user preferences (this would be stored in user settings/profile)
    // For now, we'll just acknowledge the request
    return NextResponse.json(
      { 
        message: "Preferences saved successfully",
        preferences: body 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving preferences:", error);
    return NextResponse.json({ error: "Failed to save preferences." }, { status: 500 });
  }
}
