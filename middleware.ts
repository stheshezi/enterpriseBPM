import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getTenantDomainFromHost } from "@/lib/tenant";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const hostTenantDomain = getTenantDomainFromHost(request.headers.get("host"));

  const tenantId = typeof token?.tenantId === "string" ? token.tenantId : null;
  const tenantDomain =
    typeof token?.tenantDomain === "string" ? token.tenantDomain : hostTenantDomain;

  if (tenantId) {
    requestHeaders.set("x-tenant-id", tenantId);
  }

  if (tenantDomain) {
    requestHeaders.set("x-tenant-domain", tenantDomain);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
