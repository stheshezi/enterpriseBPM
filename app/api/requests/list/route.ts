import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTenantContextFromHeaders } from "@/lib/tenant";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const tenant = await getTenantContextFromHeaders();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const requestTypeId = searchParams.get("requestTypeId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const where: any = {
      tenantId: tenant.tenantId,
    };

    if (status) {
      where.status = status;
    }

    if (requestTypeId) {
      where.requestTypeId = requestTypeId;
    }

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        include: {
          requester: true,
          requestType: true,
          tasks: {
            where: { status: "PENDING" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.request.count({ where }),
    ]);

    return NextResponse.json(
      {
        requests,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests." }, { status: 500 });
  }
}
